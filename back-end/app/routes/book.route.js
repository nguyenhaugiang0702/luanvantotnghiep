const express = require("express");
const router = express.Router();
const books = require("../controllers/book.controller");
const validateSupplier = require("../middlewares/validateBook.middleware");

router
  .route("/")
  .get(books.findAll)
  .post(validateSupplier.createBookValidation, books.create);

router
  .route("/:bookID")
  .get(books.findOne)
  .put(validateSupplier.createBookValidation, books.update)
  .delete(books.delete);

module.exports = router;
