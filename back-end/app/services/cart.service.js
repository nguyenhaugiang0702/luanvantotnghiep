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
};
