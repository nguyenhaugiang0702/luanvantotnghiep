const Cart = require("../models/cart.model");
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

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

const deleteBookFromCartWhenCheckOut = async (userID) => {
  const updatedCart = await Cart.findOneAndUpdate(
    { userID: userID },
    { $pull: { books: { isCheckOut: true } } },
    { new: true }
  );
  return updatedCart;
};

const calculateTotalPriceWhenCheckOut = async (userID) => {
  const cart = await Cart.findOne({ userID: userID });
  const remainingBooks = cart.books.filter((book) => !book.isCheckOut);
  const newTotalPrice = remainingBooks.reduce((total, book) => {
    return total + book.quantity * book.price;
  }, 0);
  cart.totalPrice = newTotalPrice;
  await cart.save();
};

const calculateTotalPrice = async (userID) => {
  const cart = await Cart.findOne({ userID: userID });
  const newTotalPrice = cart.books.reduce((total, book) => {
    return total + book.quantity * book.price;
  }, 0);
  cart.totalPrice = newTotalPrice;
  await cart.save();
};

const clearCart = async (userID) => {
  const updatedCart = await Cart.findOneAndUpdate(
    { userID: userID },
    { $set: { books: [], totalPrice: 0 } },
    { new: true }
  );
  return updatedCart;
};

const updateCheckOutStatus = async (userID, bookID, isCheckOut) => {
  const updatedCart = await Cart.findOneAndUpdate(
    { userID: userID, "books.bookID": bookID },
    { $set: { "books.$.isCheckOut": isCheckOut } },
    { new: true }
  );
  return updatedCart;
};

const updateCheckOutAllStatus = async (userID, isCheckOut) => {
  try {
    const updatedCart = await Cart.findOneAndUpdate(
      { userID: userID },
      { $set: { "books.$[].isCheckOut": isCheckOut } },
      { new: true }
    );
    return updatedCart;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createCartByUserID,
  deleteBookFromCart,
  getCartByUserID,
  getFullInfoCartByUserID,
  clearCart,
  updateCheckOutStatus,
  updateCheckOutAllStatus,
  deleteBookFromCartWhenCheckOut,
  calculateTotalPriceWhenCheckOut,
  calculateTotalPrice
};
