const express = require("express");
const router = express.Router();
const books = require("../controllers/book.controller");
const validateSupplier = require("../middlewares/validateBook.middleware");
const upload = require("../utils/multer.util");

router
  .route("/")
  .get(books.findAll)
  .post(validateSupplier.createBookValidation, books.create);
router.route("/receipts").get(books.findAllBookToReceipt);
router.route("/filters").get(books.filterBooks);
router.route("/images/:bookID").post(books.createImages).get(books.findImages);

router
  .route("/images/:bookID/:imageID")
  .put(books.updateImage)
  .delete(books.deleteImage);

router
  .route("/:bookID")
  .get(books.findOne)
  .put(validateSupplier.createBookValidation, books.update)
  .delete(books.delete);

module.exports = router;
