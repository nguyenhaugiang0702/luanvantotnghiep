const Cart = require("../models/cart.model");
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const ApiError = require("../api-error");
// Services
const bookService = require("./book.service");

const createCartByUserID = async (cartData) => {
  const newCart = new Cart(cartData);
  return await newCart.save();
};

const getCartByUserID = async (userID) => {
  return await Cart.findOne({ userID: userID });
};

const getFullInfoCartByUserID = async (query) => {
  return await Cart.findOne(query).populate("books.bookID");
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

// Hàm kiểm tra và cập nhật số lượng sách và tồn kho
const checkBookStock = async (book, userID, next) => {
  let cart = await getCartByUserID(userID);
  // Kiểm tra số lượng sách không hợp lệ
  if (typeof book.quantity !== "number" || book.quantity <= 0) {
    next(new ApiError(400, "Số lượng sách không hợp lệ"));
    return null;
  }

  // Lấy sách từ cơ sở dữ liệu để kiểm tra số lượng tồn kho
  const dbBook = await bookService.getBookByID(book.bookID);
  if (!dbBook) {
    next(new ApiError(404, `Sách với ID ${book.bookID} không tồn tại!`));
    return null;
  }

  const quantityAvailable = dbBook.quantityImported - dbBook.quantitySold;

  // Kiểm tra nếu số lượng vượt quá tồn kho
  if (book.quantity > quantityAvailable) {
    next(
      new ApiError(
        400,
        `Số lượng sách vượt quá tồn kho! Hiện tại chỉ còn ${quantityAvailable} cuốn.`
      )
    );
    return null;
  }
  if ((book.method && book.method === "INCREASE") || !book.method) {
    const existingBookInCart = cart?.books?.find(
      (b) => b.bookID.toString() === book.bookID.toString()
    );

    const totalQuantityInCart = existingBookInCart
      ? existingBookInCart.quantity + book.quantity
      : book.quantity;

    if (totalQuantityInCart > quantityAvailable) {
      next(
        new ApiError(
          400,
          `Số lượng sách vượt quá tồn kho! Hiện tại chỉ còn ${quantityAvailable} cuốn.`
        )
      );
      return null;
    }
  }

  return { dbBook, quantityAvailable };
};

// Hàm tính tổng giá và kiểm tra tồn kho
const calculateTotalPriceAndCheckStock = async (books, userID, next) => {
  let totalPrice = 0;

  for (const book of books) {
    // Gọi hàm checkBookStock để kiểm tra tồn kho
    const stockCheck = await checkBookStock(book, userID, next);
    if (!stockCheck) return null; // Dừng lại nếu kiểm tra thất bại

    // Cộng giá tiền sách vào tổng giá
    totalPrice += book.price * book.quantity;
  }

  return totalPrice;
};

// Hàm cập nhật giỏ hàng
const updateCartItems = async (books, userID, next) => {
  let cart = await getCartByUserID(userID);
  if (!cart) {
    next(new ApiError(404, "Giỏ hàng không tồn tại"));
    return null;
  }

  // Cập nhật thông tin sách trong giỏ hàng
  for (const book of books) {
    const stockCheck = await checkBookStock(book, userID, next);
    if (!stockCheck) return null; // Nếu có lỗi khi kiểm tra tồn kho

    const existingBookInCart = cart.books.find(
      (b) => b.bookID.toString() === book.bookID.toString()
    );

    if (existingBookInCart) {
      if (book.method === "DECREASE") {
        existingBookInCart.quantity -= book.quantity;
      } else if (book.method === "UPDATE") {
        existingBookInCart.quantity = book.quantity;
      } else {
        existingBookInCart.quantity += book.quantity;
      }

      // Nếu số lượng sau khi trừ bằng 0, xóa sách khỏi giỏ hàng
      if (existingBookInCart.quantity <= 0) {
        cart.books = cart.books.filter(
          (b) => b.bookID.toString() !== book.bookID.toString()
        );
      }
    } else {
      cart.books.push(book);
    }
  }

  // Cập nhật tổng giá trị giỏ hàng
  cart.totalPrice = cart.books.reduce(
    (acc, book) => acc + book.price * book.quantity,
    0
  );

  // Lưu giỏ hàng đã được cập nhật
  await cart.save();
  return cart;
};

const updateCart = async (userID, cartData) => {
  return await Cart.findOneAndUpdate({ userID: userID }, cartData, {
    new: true,
  });
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
  calculateTotalPrice,
  calculateTotalPriceAndCheckStock,
  updateCartItems,
  updateCart,
};
