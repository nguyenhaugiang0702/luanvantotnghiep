const mongoose = require("mongoose");

// Schema cho từng voucher cụ thể
const voucherUsedsSchema = new mongoose.Schema({
  voucherID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Voucher",
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  isApplied: {
    type: Boolean,
    default: false,
  },
  isUsed: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
});

const VoucherUseds = mongoose.model("VoucherUseds", voucherUsedsSchema);

module.exports = VoucherUseds;
