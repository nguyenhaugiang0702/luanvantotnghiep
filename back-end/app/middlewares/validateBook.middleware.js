const ApiError = require("../api-error");
const bookService = require("../services/book.service");
const schema = require("../utils/schema.util");
const fs = require("fs").promises;
const path = require("path");

exports.createBookValidation = async (req, res, next) => {
  try {
    await schema.bookSchema.validate(req.body);
    const checkNameBook = await bookService.checkNameExist(req.body.name);
    if (checkNameBook) {
      if (req.files) {
        req.files.forEach((file) => {
          fs.unlink(path.join("app/images/uploads/books/" + file.filename));
        });
      }
      return next(new ApiError(400, "Đã tồn tại tên sách"));
    }
    next();
  } catch (err) {
    if (req.files) {
      console.log(1);
      req.files.forEach((file) => {
        fs.unlink(path.join("app/images/uploads/books/" + file.filename));
      });
    }
    return next(new ApiError(400, err.message));
  }
};
