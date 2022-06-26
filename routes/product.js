const express = require("express");
const router = express.Router();

const User = require("../models/userModel.js");
const Cart = require("../models/cartModel");
const History = require("../models/historyModel");
const Product = require("../models/productModel.js");

router.post("/uploadProduct", (req, res, next) => {
    const newProduct = new Product(req.body);

    newProduct
        .save()
        .then((product) => res.status(200).json({ product }))
        .catch((err) =>
            res.status(400).json({ msg: "error during product upload" })
        );
});

router.post("/deleteProduct", (req, res, next) => {
    const { userId, productId } = req.body;

    const user = User.findById(userId);

    if (!user) {
        return res.status(400).json({ msg: "user not found" });
    }

    Product.findById(productId)
        .then((product) => {
            Product.deleteOne({ _id: productId }, (err) => {
                if (err) {
                    return res
                        .status(400)
                        .json({ msg: "error while deleting a product" });
                }

                Cart.find({})
                    .then((carts) => {
                        carts.forEach((singleCart) => {
                            if (singleCart.items.length === 0) {
                                return;
                            }

                            let newItems = [];

                            singleCart.items.forEach((singleOrder) => {
                                if (singleOrder.productId !== productId) {
                                    newItems.push(singleOrder);
                                }
                            });

                            if (newItems.length !== singleCart.items.length) {
                                singleCart.items = newItems;
                                singleCart.save();
                            }
                        });

                        History.find({})
                            .then((histories) => {
                                histories.forEach((singleHistory) => {
                                    if (singleHistory.orders.length === 0) {
                                        return;
                                    }

                                    let newOrders = singleHistory.orders.map(
                                        (singleOrder) =>
                                            singleOrder.productId !== productId
                                                ? singleOrder
                                                : "deleted-item"
                                    );

                                    singleHistory.orders = newOrders;
                                    singleHistory.save();
                                });

                                return res
                                    .status(200)
                                    .json({ msg: "item deleted successfully" });
                            })
                            .catch((err) =>
                                res
                                    .status(200)
                                    .json({ msg: "error during history fetch" })
                            );
                    })
                    .catch((err) =>
                        res.status(200).json({ msg: "error during cart fetch" })
                    );
            });
        })
        .catch((err) => res.status(400).json({ msg: "product not found" }));
});

router.post("/updateItemStock", (req, res, next) => {
    const productId = req.body.productId;

    let newQuantity = +req.body.newQuantity !== -1 ? +req.body.newQuantity : 0;

    Product.findById(productId)
        .then((foundItem) => {
            Product.findOneAndUpdate(
                { _id: foundItem._id },
                { inStock: newQuantity },
                (err, item) => {
                    if (err) {
                        res.status(400).json({
                            msg: "product not found or not updated",
                        });
                    }

                    res.status(200).json({ newQuantity });
                }
            );
        })
        .catch((err) => res.status(400).json({ msg: "product not found" }));
});

router.post("/getAllProducts", (req, res, next) => {
    Product.find({})
        .then((products) => res.status(200).json({ products }))
        .catch((err) =>
            res.status(400).json({ msg: "error during all product fetching" })
        );
});

router.post("/getProductById", async (req, res, next) => {
    const productId = req.body.productId;

    Product.findById(productId)
        .then((product) => res.status(200).json({ productId, product }))
        .catch((err) => res.status(400).json({ msg: "product not found" }));
});

router.post("/getProductsByCategory", (req, res, next) => {
    Product.find({ category: req.body.category })
        .then((products) => res.status(200).json({ products }))
        .catch((err) => res.status(400).json({ msg: "products not found" }));
});

router.post("/getCorrelatedProducts", async (req, res, next) => {
    const cartItems = req.body.items;
    let itemCategories = [];
    let correlatedProducts = [];

    for (const singleItemId of cartItems) {
        const itemCategory = await Product.findById(singleItemId);

        if (!itemCategory) {
            res.status(400).json({ msg: "products not found" });
        }

        if (itemCategories.indexOf(itemCategory.category) === -1) {
            itemCategories.push(itemCategory.category);
        }
    }

    for (const singleCategory of itemCategories) {
        const allItems = await Product.find({ category: singleCategory });

        if (!allItems) {
            res.status(400).json({ msg: "products not found" });
        }

        if (!allItems || allItems.length === 0) {
            return;
        }

        let possibleCorrelated = [];

        allItems.forEach((item) => {
            if (cartItems.indexOf(item._id.toString()) === -1) {
                possibleCorrelated.push(item);
            }
        });

        correlatedProducts.push(
            possibleCorrelated[
                Math.floor(Math.random() * possibleCorrelated.length)
            ]
        );
    }

    res.status(200).json({ correlatedProducts });
});

router.post("/getProductsByName", (req, res, next) => {
    let words = req.body.keyword.split(" ");

    Product.find({
        name: { $regex: new RegExp(words[0], "gi") },
    })
        .then((products) => {
            let filteredProducts = products
                .map((singleProduct) =>
                    testKeywords(singleProduct.name, words)
                        ? singleProduct
                        : "not-valid"
                )
                .filter((singleProduct) => singleProduct !== "not-valid");

            return res.status(200).json({ products: filteredProducts });
        })
        .catch((err) => res.status(400).json({ msg: "product not found" }));
});

router.post("/getSellerProducts", (req, res, next) => {
    User.findOne({ username: req.body.sellerUsername })
        .then((seller) => {
            if (!seller.isSeller) {
                res.status(400).json({ isSeller: false });
            }

            Product.find({ sellerUsername: req.body.sellerUsername })
                .then((products) =>
                    res.status(200).json({ sellerId: seller._id, products })
                )
                .catch((err) =>
                    res.status(400).json({ msg: "product not found" })
                );
        })
        .catch((err) => res.status(400).json({ msg: "user not found" }));
});

function testKeywords(productName, words) {
    productName = productName.toLowerCase();

    for (let i = 1; i < words.length; i++) {
        if (productName.indexOf(words[i].toLowerCase()) === -1) {
            return false;
        }
    }

    return true;
}

module.exports = router;
