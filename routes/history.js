const express = require("express");
const router = express.Router();

const User = require("../models/userModel.js");
const History = require("../models/historyModel");

class Order {
    constructor(singleOrder) {
        this.productId = singleOrder.productId;
        this.productQuantity = singleOrder.quantityToBuy;
        this.orderDate = new Date();
    }
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
    const { userId, productsToAdd } = req.body;

    const user = User.findById(userId);

    if (!user) {
        return res.status(400).json({ msg: "user not found" });
    }

    History.findOne({ userId })
        .then((orderHistory) => {
            let orders = orderHistory.orders;

            productsToAdd.forEach((singleProduct) => {
                orders.push(new Order(singleProduct));
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

                    return res.status(200).json({
                        msg: "user's order history updated successfully",
                    });
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
