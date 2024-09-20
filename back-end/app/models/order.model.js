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
    enum: [1, 2, 3, 4], // 1 là đang chờ xác nhận, 2 là đã xác nhận, 3 là đã hủy, 4 là yêu cầu hủy (client)
    default: 1, // Đặt giá trị mặc định là 1 (Đang chờ xác nhận)
  },
  wasPaided: {
    type: Boolean,
    default: false,
  },
  createdAt: Date,
  updatedAt: Date,
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
