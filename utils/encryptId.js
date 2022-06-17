const CryptoJS = require("crypto-js");

function encryptWithAES(text) {
    const passphrase = process.env.SECRET_KEY;
    return CryptoJS.AES.encrypt(text, passphrase).toString();
}

module.exports = encryptWithAES;
