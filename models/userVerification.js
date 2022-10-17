const mongoose = require("mongoose");

const userVerificationSchema = new mongoose.Schema({
    userId: String,
    uniqueString: String,
    createAt: Date,
    expiresAt: Date,
});

module.exports = mongoose.model("userVerification", userVerificationSchema);