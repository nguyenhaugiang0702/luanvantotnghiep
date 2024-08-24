const moment = require("moment-timezone");
const ApiError = require("../api-error");
const bookService = require("../services/book.service");

exports.create = async (req, res, next) => {
  try {
    req.body.createAt = moment.tz("Asia/Ho_Chi_Minh").toDate();
    req.body.updatedAt = moment.tz("Asia/Ho_Chi_Minh").toDate();
    const newBook = await bookService.createBook(req.body);
    return res.send({
      message: "Thêm tác sách thành công",
      newBook,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi thêm mới sách"));
  }
};

exports.findAll = async (req, res, next) => {
  let books = [];
  try {
    books = await bookService.getAllBooks();
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy tất cả sách"));
  }
  return res.send(books);
};

exports.findOne = async (req, res, next) => {
  try {
    const bookID = req.params.bookID;
    const book = await bookService.getBookByID(bookID);
    return res.send(book);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy sách"));
  }
};

exports.update = async (req, res, next) => {
  try {
    const bookID = req.params.bookID;
    const book = await bookService.updateBook(bookID, req.body);
    return res.send({
      message: "Cập nhật thành công sách",
      book,
    });
  } catch (error) {
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
