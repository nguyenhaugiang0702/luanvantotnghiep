const express = require("express");
const router = express.Router();
const cart = require("../controllers/cart.controller");
const jwt = require("../middlewares/jwt.middleware");

router
  .route("/")
  .get(jwt.authenticateTokenFromHeader, cart.findAll)
  .post(jwt.authenticateTokenFromHeader, cart.create)
  .delete(jwt.authenticateTokenFromHeader, cart.deleteAllBookFromCart);

router.route("/booksCheckBox").get(jwt.authenticateTokenFromHeader, cart.findAllBooksCheckBox);

router
  .route("/checkAll")
  .put(jwt.authenticateTokenFromHeader, cart.updateCheckAll);

router
  .route("/:bookID")
  .put(jwt.authenticateTokenFromHeader, cart.update)
  .delete(jwt.authenticateTokenFromHeader, cart.deleteBookFromCart);

module.exports = router;
