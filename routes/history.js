const express = require("express");
const router = express.Router();

const User = require("../models/userModel.js");
const History = require("../models/historyModel");

router.post("/getUserOrders", async (req, res, next) => {
    const userId = req.body.userId;

    const user = User.findById(userId);

    if (!user) {
        return res.status(400).json({ msg: "user not found" });
    }

    History.findOne({ userId })
        .then((orderHistory) =>
            res.status(200).json({ orders: orderHistory.orders })
        )
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

module.exports = router;
