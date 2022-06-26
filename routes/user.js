const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

const User = require("../models/userModel.js");
const Cart = require("../models/cartModel");
const History = require("../models/historyModel");
const Product = require("../models/productModel.js");

const sendEmail = require("../utils/sendMail");
const encryptWithAES = require("../utils/encryptId");
const decryptWithAES = require("../utils/decryptId");

router.post("/getUserData", (req, res, next) => {
    User.findById(decryptWithAES(req.body.userId))
        .then((user) => res.status(200).json({ msg: "Login successful", user }))
        .catch((err) => res.status(400).json({ msg: "User not found" }));
});

router.post("/getUserSince", (req, res, next) => {
    User.findById(req.body.userId)
        .then((user) => {
            res.status(200).json({ userSince: user.registeredOn });
        })
        .catch((err) => res.status(400).json({ msg: "user not found" }));
});

router.post("/encryptUserId", async (req, res, next) => {
    return res
        .status(200)
        .json({ encryptedId: encryptWithAES(req.body.userId) });
});

router.post("/decryptUserId", async (req, res, next) => {
    return res
        .status(200)
        .json({ decryptedId: decryptWithAES(req.body.userId) });
});

router.post("/privateResetPassword", async (req, res, next) => {
    try {
        const userId = req.body.userId;
        const currentPassword = req.body.currentPassword;
        const newPassword = req.body.newPassword;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                msg: "user not found",
            });
        }

        bcrypt.compare(currentPassword, user.password, async (err, data) => {
            if (err) {
                return res
                    .status(401)
                    .json({ msg: "error during bcrypt compare" });
            }

            if (!data) {
                return res.status(401).json({ msg: "wrong password" });
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);

            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save();

            return res.status(201).json({
                msg: "password changed",
                success: true,
            });
        });
    } catch (error) {
        next(error);
    }
});

router.post("/sendResetEmail", async (req, res, next) => {
    const userEmail = req.body.userEmail;

    const user = await User.findOne({ email: userEmail });

    if (!user) {
        res.status(400).json({
            msg: "user not found",
        });
    }

    const resetPasswordToken = user.getResetPasswordToken();

    await user.save();

    const emailSubject = "Amazing - Request for password reset";

    try {
        sendEmail({
            to: userEmail,
            subject: emailSubject,
            resetPasswordToken,
        });

        res.status(200).json({ success: true, msg: "Email sent" });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error during email sending",
        });
    }
});

router.post("/resetPassword/:resetToken", async (req, res, next) => {
    const resetPasswordToken = req.params.resetToken;

    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                msg: "user not found",
            });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        return res.status(201).json({
            msg: "password changed",
            success: true,
        });
    } catch (error) {
        next(error);
    }
});

router.post("/privateChangeUsername", async (req, res, next) => {
    const { userId, newUsername } = req.body;

    User.findOne({ username: newUsername }).then((user) => {
        if (user) {
            return res.status(400).json({ msg: "existing username" });
        }

        User.findByIdAndUpdate(
            userId,
            { username: newUsername },
            (err, user) => {
                if (err) {
                    res.status(400).json({
                        msg: "user not found or not updated",
                    });
                }

                Product.updateMany(
                    { sellerId: userId },
                    { $set: { sellerUsername: newUsername } }
                )
                    .then(() =>
                        res.status(200).json({ msg: "username changed" })
                    )
                    .catch((err) =>
                        res
                            .status(400)
                            .json({ msg: "error during seller update" })
                    );
            }
        );
    });
});

router.post("/getDeleteAccountToken", async (req, res, next) => {
    const { userId } = req.body;

    User.findById(userId)
        .then((user) =>
            res
                .status(200)
                .json({ deleteAccountToken: user.deleteAccountToken })
        )
        .catch((err) => res.status(400).json({ msg: "user not found" }));
});

router.post("/deleteAccount/:deleteAccountToken", async (req, res, next) => {
    const deleteAccountToken = req.params.deleteAccountToken;

    const userToDelete = await User.findOne({
        deleteAccountToken: deleteAccountToken,
    });

    if (!userToDelete) {
        return res.status(400).json({ msg: "no user found" });
    }

    try {
        await User.findOneAndDelete({ deleteAccountToken });

        await Cart.findOneAndDelete({ userId: userToDelete._id });

        await History.findOneAndDelete({
            userId: userToDelete._id,
        });

        if (userToDelete.isSeller) {
            let sellerProducts = await Product.find({
                sellerUsername: userToDelete.username,
            });

            sellerProducts = sellerProducts.map((singleProducts) =>
                singleProducts._id.toString()
            );

            let allCarts = await Cart.find({});
            allCarts = allCarts.filter(
                (singleCart) => singleCart.items.length !== 0
            );

            allCarts.forEach((singleCart) => {
                let newItems = [];

                singleCart.items.forEach((singleItem) => {
                    if (!sellerProducts.includes(singleItem.productId)) {
                        newItems.push(singleItem);
                    }
                });

                if (singleCart.items.length !== newItems.length) {
                    singleCart.items = newItems;
                    singleCart.save();
                }
            });

            let allHistories = await History.find({});
            allHistories = allHistories.filter(
                (singleHistory) => singleHistory.orders.length !== 0
            );

            allHistories.forEach((singleHistory) => {
                let newItems = [];

                singleHistory.orders.forEach((singleOrder) => {
                    if (sellerProducts.includes(singleOrder.productId)) {
                        singleOrder.productId = "deleted-item";
                    }

                    newItems.push(singleOrder);
                });

                singleHistory.orders = newItems;
                singleHistory.save();
            });

            await Product.deleteMany({
                sellerUsername: userToDelete.username,
            });
        }

        return res.status(200).json({ msg: "account deleted" });
    } catch (err) {
        return res.status(400).json({ msg: "we couldn't delete the account" });
    }
});

module.exports = router;
