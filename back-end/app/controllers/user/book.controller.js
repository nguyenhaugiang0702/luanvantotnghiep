const moment = require("moment-timezone");
const ApiError = require("../../api-error");
const bookService = require("../../services/book.service");
const upload = require("../../utils/multer.util");
const fs = require("fs").promises;
const path = require("path");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

exports.findAll = async (req, res, next) => {
  let books = [];
  const { searchKey } = req.query;
  try {
    if (searchKey) {
      // Tìm kiếm
      books = await bookService.searchBooks(searchKey);
    } else {
      books = await bookService.getFullInfoAllBooks();
    }
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy tất cả sách"));
  }
  return res.send(books);
};

exports.findTopViewedBooks  = async (req, res, next) => {
  let books = [];
  try {
    books = await bookService.getFullInfoAllBooks();
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy tất cả sách"));
  }
  return res.send(books);
};

exports.filterBooks = async (req, res, next) => {
  let books = [];
  let totalBooks = 0;
  let totalPages = 0;
  try {
    const { filters, page, limit, sortBy, searchQuery } = req.query;
    const filtersString = JSON.parse(filters || {});

    totalBooks = await bookService.getTotalBooks(filtersString, searchQuery);

    totalPages = Math.ceil(totalBooks / parseInt(limit));

    // Xác định số bản ghi để bỏ qua và số bản ghi trên mỗi trang
    const skip = (parseInt(page) - 1) * parseInt(limit);
    books = await bookService.getFilteredBooks(
      filtersString,
      skip,
      parseInt(limit),
      sortBy,
      searchQuery
    );
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy tất cả sách"));
  }
  return res.send({
    books,
    totalPages,
    currentPage: parseInt(req.query.page),
  });
};

exports.findOne = async (req, res, next) => {
  try {
    const bookID = req.params.bookID;
    const book = await bookService.getFullInfoBookByID(bookID);
    const discountPercent = Math.ceil(
      (book.detail.discountPrice / book.detail.originalPrice) * 100
    );

    const bookDetail = {
      ...book._doc,
      discountPercent,
    };

    return res.send(bookDetail);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy sách"));
  }
};

exports.updateView = async (req, res, next) => {
  try {
    const bookID = req.params.bookID;
    const { view } = req.body;
    const book = await bookService.getBookByID(bookID);
    book.view += parseInt(view);
    await book.save();
    return res.send({
      message: "Cập nhật thành công sách",
      book,
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi cập nhật sách"));
  }
};