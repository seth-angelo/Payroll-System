const mongoose = require("mongoose");

const passwordResetSchema = new mongoose.Schema({
    userId: String,
    resetString: String,
    createAt: Date,
    expiresAt: Date,
});

module.exports = mongoose.model("passwordReset", passwordResetSchema);