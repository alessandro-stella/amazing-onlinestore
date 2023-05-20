const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },

    items: { type: Array, default: [] },
});

module.exports = mongoose.model("cart", cartSchema);
