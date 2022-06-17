const CryptoJS = require("crypto-js");

function decryptWithAES(cipherText) {
    const passphrase = process.env.SECRET_KEY;
    const bytes = CryptoJS.AES.decrypt(cipherText, passphrase);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
}

module.exports = decryptWithAES;
