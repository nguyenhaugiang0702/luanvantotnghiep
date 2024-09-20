const ApiError = require("../api-error");
const bookService = require("../services/book.service");
const schema = require("../utils/schema.util");
const fs = require("fs").promises;
const path = require("path");

exports.createBookValidation = async (req, res, next) => {
  try {
    await schema.updateBookSchema.validate(req.body);
    next();
  } catch (err) {
    console.log(err.message);
    return next(new ApiError(400, err.message));
  }
};
