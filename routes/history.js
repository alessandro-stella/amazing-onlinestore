const express = require("express");
const router = express.Router();

const User = require("../models/userModel.js");
const History = require("../models/historyModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");

const sendEmail = require("../utils/sendMail");

const fastShippingDays = 1;
const normalShippingDays = 3;

function getDeliveryDate(fastShipping) {
    let now = new Date();
    let shippingDate = new Date();

    if (fastShipping) {
        shippingDate.setDate(now.getDate() + fastShippingDays);
    } else {
        shippingDate.setDate(now.getDate() + normalShippingDays);
    }

    return new Date(shippingDate);
}

router.post("/getUserOrders", async (req, res, next) => {
    const userId = req.body.userId;

    const user = User.findById(userId);

    if (!user) {
        return res.status(400).json({ msg: "user not found" });
    }

    History.findOne({ userId })
        .then((orderHistory) => {
            let orders = orderHistory.orders.sort(
                (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
            );

            return res.status(200).json({ orders });
        })
        .catch((err) => {
            try {
                const newHistory = new History({ userId });
                newHistory.save();

                res.status(200).json({ orders: newHistory.orders });
            } catch (err) {
                return res.status(500).json({ err });
            }
        });
});

router.post("/addNewOrders", async (req, res, next) => {
    const { userId, productsToAdd, shipmentInfo, fastShipping } = req.body;

    const user = User.findById(userId);

    if (!user) {
        return res.status(400).json({ msg: "user not found" });
    }

    await History.findOne({ userId })
        .then(async (orderHistory) => {
            let orders = orderHistory.orders;

            function addOrder(singleOrder) {
                let newOrder = {
                    productId: singleOrder.productId,
                    productQuantity: singleOrder.quantityToBuy,
                    shipmentInfo: shipmentInfo,
                    orderDate: new Date(),
                    deliveryDate: getDeliveryDate(fastShipping),
                };

                orders.push(newOrder);
            }

            if (productsToAdd.length) {
                productsToAdd.forEach((singleOrder) => {
                    addOrder(singleOrder);
                });
            } else {
                addOrder(productsToAdd);
            }

            let ids;

            if (productsToAdd.length) {
                ids = productsToAdd.map(
                    (singleProduct) => singleProduct.productId
                );
            } else {
                ids = productsToAdd.productId;
            }

            await Product.find({
                _id: { $in: ids },
            })
                .then(async (productsToUpdate) => {
                    productsToUpdate.sort((a, b) =>
                        ("" + b._id).localeCompare(a._id)
                    );

                    if (productsToAdd.length) {
                        productsToAdd.sort((a, b) =>
                            ("" + b.productId).localeCompare(a.productId)
                        );
                    }

                    let quantityError = false;

                    for (let i = 0; i < productsToUpdate.length; i++) {
                        let condition;

                        if (productsToAdd.length) {
                            condition =
                                productsToAdd[i].quantityToBuy >
                                productsToUpdate[i].inStock;
                        } else {
                            condition =
                                productsToAdd.quantityToBuy >
                                productsToUpdate[i].inStock;
                        }

                        if (condition) {
                            quantityError = true;
                        } else {
                            if (productsToAdd.length) {
                                productsToUpdate[i].inStock -=
                                    productsToAdd[i].quantityToBuy;
                            } else {
                                productsToUpdate[i].inStock -=
                                    productsToAdd.quantityToBuy;
                            }

                            productsToUpdate[i].markModified("inStock");
                        }
                    }

                    if (quantityError) {
                        return res.status(400).json({
                            msg: "not enough items in stock",
                        });
                    }

                    productsToUpdate.forEach((singleProductToUpdate) =>
                        singleProductToUpdate.save(function (err) {
                            if (err !== null) {
                                return res.status(400).json({
                                    msg: "error during item stock update",
                                });
                            }
                        })
                    );

                    await History.findOneAndUpdate(
                        { userId },
                        { orders }
                    ).catch((err) =>
                        res.status(400).json({
                            msg: "error during history update",
                        })
                    );

                    let shipmentInfo;

                    await User.findById(userId)
                        .then((user) => {
                            shipmentInfo = user.shipmentInfo;
                        })
                        .catch((err) =>
                            res.status(400).json({ msg: "user not found" })
                        );

                    await Cart.findOneAndUpdate({ userId }, { items: [] })
                        .then(() =>
                            res.status(200).json({
                                msg: "operation completed successfully",
                                shipmentInfo,
                            })
                        )
                        .catch((err) =>
                            res.status(400).json({
                                msg: "error during cart emptying",
                            })
                        );
                })
                .catch((err) =>
                    res.status(400).json({ msg: "one or more items not found" })
                );
        })
        .catch((err) => {
            return res
                .status(400)
                .json({ msg: "user's order history not found" });
        });
});

router.post("/sendSummaryEmail", async (req, res, next) => {
    const { userId, shipmentInfo, totalPayment } = req.body;

    const user = await User.findById(userId);

    if (!user) {
        return res.status(400).json({ msg: "user not found" });
    }

    const emailSubject = "Amazing - Thanks for your purchase!";

    try {
        sendEmail(
            {
                to: user.email,
                subject: emailSubject,
                shipmentInfo,
                totalPayment,
            },
            "orderSummary"
        );

        return res.status(200).json({ success: true, msg: "email sent" });
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "error during email sending",
        });
    }
});

module.exports = router;
