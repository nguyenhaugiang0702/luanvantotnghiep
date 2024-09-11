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
      isCheckOut: {
        type: Boolean,
        default: false,
      },
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
