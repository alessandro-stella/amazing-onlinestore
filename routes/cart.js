const express = require("express");
const router = express.Router();

const User = require("../models/userModel.js");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel.js");

router.post("/getUserCart", async (req, res, next) => {
    const userId = req.body.userId;

    const user = User.findById(userId);

    if (!user) {
        return res.status(400).json({ msg: "user not found" });
    }

    Cart.findOne({ userId })
        .then((cart) => {
            return res.status(200).json({ items: cart.items });
        })
        .catch((err) => {
            try {
                const newCart = new Cart({ userId });
                newCart.save();
                res.status(200).json({ items: newCart.items });
            } catch (err) {
                return res.status(500).json({ err });
            }
        });
});

router.post("/updateCartProducts", async (req, res, next) => {
    const { userId, updatedItems } = req.body;

    Cart.findOneAndUpdate({ userId }, { items: updatedItems }, (err, cart) => {
        if (err) {
            res.status(400).json({ msg: "cart not found or not updated" });
        }

        return res.status(200).json({ msg: "cart updated", items: cart.items });
    });
});

router.post("/updateItemQuantity", (req, res, next) => {
    const { userId, productId, quantityToBuy } = req.body;

    const user = User.findById(userId);

    if (!user) {
        return res.status(400).json({ msg: "user not found" });
    }

    Cart.findOne({ userId })
        .then((cart) => {
            if (
                !cart.items.find(
                    (singleItem) => singleItem.productId === productId
                )
            ) {
                return res.status(400).json({ msg: "item not found in cart" });
            }

            let updatedItems = cart.items.map((singleItem) => {
                if (singleItem.productId === productId) {
                    singleItem.quantityToBuy = quantityToBuy;
                }

                return singleItem;
            });

            Cart.findOneAndUpdate(
                { userId },
                { items: updatedItems },
                (err, user) => {
                    if (err) {
                        res.status(400).json({
                            msg: "cart not found or not updated",
                        });
                    }

                    return res.status(200).json({ msg: "quantity updated" });
                }
            );
        })
        .catch((err) => res.status(400).json({ msg: "cart not found" }));
});

router.post("/removeItemFromCart", async (req, res, next) => {
    const { userId, productId } = req.body;

    const userCart = await Cart.findOne({ userId });

    if (!userCart) {
        return res.status(400).json({ msg: "cart not found" });
    }

    let newItems = userCart.items.filter(
        (singleItem) => singleItem.productId !== productId
    );

    userCart.items = newItems;
    userCart.markModified("items");

    await userCart.save(function (err) {
        if (err) {
            return res.status(400).json({ msg: "error during item remotion" });
        }

        return res.status(200).json({
            msg: "product removed successfully",
            updatedItems: userCart.items,
        });
    });
});

router.post("/removeSinglePurchases", (req, res, next) => {
    const { userId } = req.body;

    const user = User.findById(userId);

    if (!user) {
        return res.status(400).json({ msg: "user not found" });
    }

    Cart.findOne({ userId })
        .then(async (cart) => {
            let updatedItems = cart.items.filter(
                (singleItem) => singleItem.singlePurchase !== true
            );

            cart.items = updatedItems;
            cart.markModified("items");
                    
            await cart.save(function (err) {
                if (err) {
                    return res.status(400).json({
                        msg: "cart not updated",
                    });
                }

                return res
                    .status(200)
                    .json({ msg: "item removed", updatedItems });
            });
        })
        .catch((err) => res.status(400).json({ msg: "cart not found" }));
});

router.post("/getCartTotal", (req, res, next) => {
    const { userId } = req.body;

    const user = User.findById(userId);

    if (!user) {
        return res.status(400).json({ msg: "user not found" });
    }

    Cart.findOne({ userId })
        .then((cart) => {
            let cartItems = cart.items;

            let itemsId = cartItems
                .sort((a, b) => (a.productId > b.productId ? 1 : -1))
                .map((singleItem) => singleItem.productId);

            Product.find(
                {
                    _id: {
                        $in: itemsId,
                    },
                },
                (err, items) => {
                    if (err) {
                        res.status(400).json({ msg: "product not found" });
                    }

                    let itemPrices = items
                        .sort((a, b) => (a._id > b._id ? 1 : -1))
                        .map((singleItem) => singleItem.price);

                    let totalPrice = 0;

                    for (let i = 0; i < itemPrices.length; i++) {
                        totalPrice +=
                            itemPrices[i] * cartItems[i].quantityToBuy;
                    }

                    res.status(200).json({ totalPrice });
                }
            );
        })
        .catch((err) => res.status(400).json({ msg: "cart not found" }));
});

module.exports = router;
