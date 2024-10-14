const moment = require("moment-timezone");
const ApiError = require("../../api-error");
const bookService = require("../../services/book.service");
const upload = require("../../utils/multer.util");
const fs = require("fs").promises;
const path = require("path");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

exports.create = async (req, res, next) => {
  try {
    req.body.createdAt = moment.tz("Asia/Ho_Chi_Minh");
    req.body.updatedAt = moment.tz("Asia/Ho_Chi_Minh");

    if (!req.files || req.files.length === 0) {
      return next(new ApiError(500, "Không có file nào được tải lên."));
    }
    req.body.images = req.files.map((file) => ({
      path: file.path,
      _id: new mongoose.Types.ObjectId(),
    }));

    const newBook = await bookService.createBook(req.body);

    return res.send({
      message: "Thêm tác sách thành công",
      newBook,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi thêm mới sách"));
  }
};

exports.createImages = async (req, res, next) => {
  try {
    const bookID = req.params.bookID;
    const book = await bookService.getBookImagesByID(bookID);
    if (!req.files || req.files.length === 0) {
      return next(new ApiError(404, "Không có file nào được tải lên."));
    }
    // Tạo mảng các đối tượng ảnh với path và _id
    const imagePaths = req.files.map((file) => ({
      path: file.path,
      _id: new mongoose.Types.ObjectId(),
    }));
    book.images.push(...imagePaths);
    await book.save();

    return res.send({
      message: "Thêm ảnh thành công",
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi thêm mới ảnh"));
  }
};

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

exports.findAllBookToReceipt = async (req, res, next) => {
  try {
    const books = await bookService.getTopViewedBooks();
    return res.send(books);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy sách có lượt xem nhiều nhất"));
  }
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

exports.findImages = async (req, res, next) => {
  try {
    const bookID = req.params.bookID;
    const book = await bookService.getBookImagesByID(bookID);
    return res.send({ images: book.images, bookName: book.name });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy ảnh sách"));
  }
};

exports.update = async (req, res, next) => {
  try {
    const bookID = req.params.bookID;
    req.body.updatedAt = moment.tz("Asia/Ho_Chi_Minh").toDate();
    const book = await bookService.updateBook(bookID, req.body);
    return res.send({
      message: "Cập nhật thành công sách",
      book,
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi cập nhật sách"));
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

exports.updateImage = async (req, res, next) => {
  try {
    const { bookID, imageID } = req.params;
    const { book, imageIndex, oldImagePath } =
      await bookService.findImageByBookIDAndImageID(bookID, imageID);
    if (oldImagePath) {
      await fs.unlink(oldImagePath);
    }
    const file = req.files[0];
    if (!file) {
      return next(new ApiError(404, "Ảnh chưa được tải lên"));
    }

    // Cập nhật ảnh mới
    const newImagePath = file.path;
    book.images[imageIndex].path = newImagePath;

    book.save();

    return res.send({
      message: "Cập nhật thành công sách",
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi cập nhật sách"));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const bookID = req.params.bookID;
    const book = await bookService.deleteBook(bookID);
    return res.send({
      message: "Xóa thành công sách",
      book,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi xóa tất cả sách"));
  }
};

exports.deleteImage = async (req, res, next) => {
  try {
    const { bookID, imageID } = req.params;
    const { book, imageIndex, oldImagePath } =
      await bookService.findImageByBookIDAndImageID(bookID, imageID);
    // xóa ảnh khỏi nơi lưu trữ
    await fs.unlink(oldImagePath);
    // xóa ảnh khỏi database
    book.images.splice(imageIndex, 1);
    await book.save();

    return res.send({
      message: "Xóa thành công ảnh sách",
      book,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi xóa tất cả sách"));
  }
};
