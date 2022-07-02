const express = require("express");
const router = express.Router();

const User = require("../models/userModel.js");
const History = require("../models/historyModel");
const Cart = require("../models/cartModel");

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

    History.findOne({ userId })
        .then((orderHistory) => {
            let orders = orderHistory.orders;

            productsToAdd.forEach((singleOrder) => {
                let newOrder = {
                    productId: singleOrder.productId,
                    productQuantity: singleOrder.quantityToBuy,
                    shipmentInfo: shipmentInfo,
                    orderDate: new Date(),
                    deliveryDate: getDeliveryDate(fastShipping),
                };

                orders.push(newOrder);
            });

            History.findOneAndUpdate(
                { userId },
                { orders },
                { new: true },
                (err, newHistory) => {
                    if (err) {
                        return res
                            .status(400)
                            .json({ msg: "error during history update" });
                    }

                    Cart.findOneAndUpdate(
                        { userId },
                        { items: [] },
                        { new: true },
                        (err, newCart) => {
                            if (err) {
                                return res.status(400).json({
                                    msg: "error during cart emptying",
                                });
                            }

                            return res.status(200).json({
                                msg: "operation completed successfully",
                                newCart,
                            });
                        }
                    );
                }
            );
        })
        .catch((err) => {
            return res
                .status(400)
                .json({ msg: "user's order history not found" });
        });
});

module.exports = router;
