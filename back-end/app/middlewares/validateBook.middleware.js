const ApiError = require("../api-error");
const bookService = require("../services/book.service");
const schema = require("../utils/schema.util");

exports.createBookValidation = async (req, res, next) => {
  try {
    await schema.bookSchema.validate(req.body);
    const checkNameBook = await bookService.checkNameExist(req.body.name);
    if (checkNameBook) {
      return next(new ApiError(400, "Đã tồn tại tên sách"));
    }
    next();
  } catch (err) {
    return next(new ApiError(400, err.message));
  }
};
