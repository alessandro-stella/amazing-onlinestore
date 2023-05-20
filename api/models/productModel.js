const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
    },

    price: {
        type: String,
        required: true,
    },

    category: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    image: {
        type: String,
        required: true,
    },

    sellerUsername: {
        type: String,
        required: true,
    },

    inStock: {
        type: String,
        required: true,
    },
});

productSchema.index(
    {
        name: 1,
        price: 1,
        category: 1,
        description: 1,
        image: 1,
        sellerUsername: 1,
    },
    { unique: true }
);

module.exports = mongoose.model("product", productSchema);
