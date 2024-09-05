const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  books: [
    {
      bookID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
      },
      quantity: Number,
      price: Number,
    },
  ],
  totalPrice: {
    type: Number,
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
