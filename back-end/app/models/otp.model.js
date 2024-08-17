const mongoose = require("mongoose");
const moment = require("moment-timezone");

const otpSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: false,
    ref: "User",
  },
  email: {
    type: String,
    required: false,
    ref: "User",
  },
  otpSMS: {
    type: Number,
    required: false,
  },
  otpEmail: {
    type: Number,
    required: false,
  },
  expiresAt: {
    type: Date,
    required: false,
  },
  createdAt: {
    type: Date,
    default: moment().tz("Asia/Ho_Chi_Minh").toDate(),
  },
});

const OTP = mongoose.model("OTP", otpSchema);
module.exports = OTP;
