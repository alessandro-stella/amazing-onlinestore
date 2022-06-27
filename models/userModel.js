const mongoose = require("mongoose");
const crypto = require("crypto");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        minLength: 5,
    },

    password: {
        type: String,
        required: true,
    },

    registeredOn: {
        type: String,
        required: true,
    },

    isSeller: {
        type: Boolean,
        required: true,
    },

    shipmentInfo: {
        type: Schema.Types.Mixed,
        default: {
            intercom: "",
            address: "",
            city: "",
            country: "",
            postalCode: "",
        },
    },

    resetPasswordToken: String,
    resetPasswordTokenExpire: String,

    deleteAccountToken: String,
});

userSchema.index({ username: 1, email: 1 }, { unique: true });

userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.resetPasswordTokenExpire = Date.now() + 10 * (60 * 1000);

    return this.resetPasswordToken;
};

userSchema.methods.getDeleteAccountToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.deleteAccountToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    return this.deleteAccountToken;
};

module.exports = mongoose.model("user", userSchema);
