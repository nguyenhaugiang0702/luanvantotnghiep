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
      realPrice: Number
    },
  ],
  addressID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
  },
  payment: String,
  createAt: Date,
  updatedAt: Date,
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
