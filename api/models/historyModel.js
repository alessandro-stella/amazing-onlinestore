const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const historySchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },

    orders: { type: Array, default: [] },
});

module.exports = mongoose.model("history", historySchema);
