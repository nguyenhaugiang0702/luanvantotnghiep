const express = require("express");
const router = express.Router();
const books = require("../../../controllers/user/book.controller");

router.route("/").get(books.findAll);
router.route("/topViewedBooks").get(books.findTopViewedBooks);
router.route("/filters").get(books.filterBooks);
router.route("/view/:bookID").put(books.updateView);
router.route("/:bookID").get(books.findOne);

module.exports = router;
