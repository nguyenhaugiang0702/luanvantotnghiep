const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  totalQuantity: Number,
  totalPrice: Number,
  detail: [
    {
      bookID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
      },
      quantity: Number,
      realPrice: Number,
    },
  ],
  addressID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
  },
  payment: String,
  notes: String,
  status: {
    type: Number,
    enum: [1, 2, 3, 4, 5, 6, 7, 8, 9], // 1 là đang chờ xác nhận, 2 là đã xác nhận, 3 là đã hủy, 4 là yêu cầu hủy (client)
    default: 1, // Đặt giá trị mặc định là 1 (Đang chờ xác nhận)
  },
  wasPaided: {
    type: Boolean,
    default: false,
  },
  shippingFee: {
    type: Number,
    default: 0,
  },
  image: {
    type: String,
    default: "",
  },
  voucherID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Voucher",
    default: null,
  },
  paymentDetail: {
    saleId: { type: String, default: null },
    state: { type: String, default: null },
    amount: { type: Number, default: null },
  },
  createdAt: Date,
  updatedAt: Date,
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
