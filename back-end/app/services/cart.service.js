const Cart = require("../models/cart.model");
const { ObjectId } = require("mongodb");

const createCartByUserID = async (cartData) => {
  const newCart = new Cart(cartData);
  return await newCart.save();
};

const getCartByUserID = async (userID) => {
  return await Cart.findOne({ userID: userID });
};

const getFullInfoCartByUserID = async (userID) => {
  return await Cart.findOne({ userID: userID }).populate("books.bookID");
};

const deleteBookFromCart = async (userID, bookID) => {
  const updatedCart = await Cart.findOneAndUpdate(
    { userID: userID },
    { $pull: { books: { bookID: bookID } } },
    { new: true }
  );
  return updatedCart;
};

const clearCart = async (userID) => {
  const updatedCart = await Cart.findOneAndUpdate(
    { userID: userID },
    { $set: { books: [], totalPrice: 0 } },
    { new: true }
  );
  return updatedCart;
};

module.exports = {
  createCartByUserID,
  deleteBookFromCart,
  getCartByUserID,
  getFullInfoCartByUserID,
  clearCart,
};
