const express = require("express");
const router = express.Router();
const cart = require("../../../controllers/user/cart.controller");

router
  .route("/")
  .get(cart.findAll)
  .post(cart.create)
  .delete(cart.deleteAllBookFromCart);

router.route("/booksCheckBox").get(cart.findAllBooksCheckBox);

router.route("/checkAll").put(cart.updateCheckAll);

router.route("/:bookID").put(cart.update).delete(cart.deleteBookFromCart);

module.exports = router;
