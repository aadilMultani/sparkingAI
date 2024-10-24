const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const otpSchema = new mongoose.Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true
    },
    otpExpiration: {
        type: Date,
        default: Date.now,
        get: (otpExpiration) => otpExpiration.getTime(),
        set: (otpExpiration) => new Date(otpExpiration)
    },
});

module.exports = mongoose.model("Otp", otpSchema)

