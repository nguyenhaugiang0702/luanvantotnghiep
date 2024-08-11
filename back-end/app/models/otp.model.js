const mongoose = require("mongoose");
const moment = require("moment-timezone");

const otpSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    ref: "User", // Liên kết đến mô hình User qua phoneNumber
  },
  otp: {
    type: Number,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: moment().tz("Asia/Ho_Chi_Minh").toDate(),
  },
});

const OTP = mongoose.model("OTP", otpSchema);
module.exports = OTP;
