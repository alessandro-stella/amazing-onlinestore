const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

const User = require("../models/userModel.js");
const Cart = require("../models/cartModel");
const History = require("../models/historyModel");

const sendEmail = require("../utils/sendMail");

router.post("/register", async (req, res, next) => {
    let userData = req.body;
    userData.registeredOn = formatDate();

    let user = new User(userData);

    User.findOne({ email: user.email }).then(async (foundUserByEmail) => {
        if (foundUserByEmail)
            return res.status(409).send({ msg: "User already registered" });

        User.findOne({ username: user.username }).then(
            async (foundUserByUsername) => {
                if (foundUserByUsername)
                    return res
                        .status(409)
                        .send({ msg: "Username already used" });

                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);

                const deleteAccountToken = user.getDeleteAccountToken();

                await user.save();

                user.save()
                    .then((user) => {
                        try {
                            const newCart = new Cart({ userId: user._id });
                            newCart.save();

                            const newHistory = new History({
                                userId: user._id,
                            });
                            newHistory.save();
                        } catch (err) {
                            return res.status(500).json({ err });
                        }

                        return res.status(201).send(user);
                    })
                    .catch((err) => {
                        return res.status(400).send({
                            msg: "Error during the registration process",
                        });
                    });
            }
        );
    });
});

router.post("/login", (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email }).then((user) => {
        if (!user) return res.status(400).json({ msg: "User not registered" });

        bcrypt.compare(password, user.password, (err, data) => {
            if (err) throw err;

            if (data) {
                return res.status(200).json({ msg: "login successful", user });
            } else {
                return res.status(401).json({ msg: "Wrong password" });
            }
        });
    });
});

router.post("/sendWelcomeEmail", async (req, res, next) => {
    const username = req.body.username;
    const userEmail = req.body.userEmail;
    const deleteAccountToken = req.body.deleteAccountToken;

    const emailSubject = `Amazing - ${username}, we're glad you're joining us!`;

    try {
        sendEmail({
            to: userEmail,
            subject: emailSubject,
            username: username,
            deleteAccountToken,
        });

        res.status(200).json({ success: true, msg: "Email sent" });
    } catch (error) {
        err.status(500).json({
            success: false,
            msg: "Error during email sending",
        });
    }
});

module.exports = router;
