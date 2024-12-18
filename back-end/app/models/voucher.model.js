const mongoose = require("mongoose");

// Schema cho từng voucher cụ thể
const voucherSchema = new mongoose.Schema({
  code: {
    type: String,
  },
  voucherCategoryID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "VoucherCategory",
  },
  quantity: {
    type: Number,
  },
  quantityUsed: {
    type: Number,
    default: 0,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
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

const voucherCategorySchema = new mongoose.Schema({
  discountType: {
    type: String,
  },
  name: {
    type: String,
  },
  value: {
    type: Number,
  },
  minValue: {
    type: Number,
    default: 0,
  },
  maxValue: {
    type: Number,
    default: null,
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

const Voucher = mongoose.model("Voucher", voucherSchema);
const VoucherCategory = mongoose.model(
  "VoucherCategory",
  voucherCategorySchema
);

module.exports = { Voucher, VoucherCategory };
