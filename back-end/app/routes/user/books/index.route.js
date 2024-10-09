const express = require("express");
const router = express.Router();
const books = require("../../../controllers/book.controller");
const validateSupplier = require("../../../middlewares/validateBook.middleware");
const upload = require("../../../utils/multer.util");

router.route("/").get(books.findAll);
router.route("/topViewedBooks").get(books.findTopViewedBooks);
router.route("/filters").get(books.filterBooks);
router.route("/view/:bookID").put(books.updateView);
router.route("/:bookID").get(books.findOne);

module.exports = router;
