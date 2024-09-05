const express = require("express");
const router = express.Router();
const cart = require("../controllers/cart.controller");
const jwt = require("../middlewares/jwt.middleware");

router
  .route("/")
  .get(jwt.authenticateTokenFromHeader, cart.findAll)
  .post(jwt.authenticateTokenFromHeader, cart.create)
  .delete(jwt.authenticateTokenFromHeader, cart.deleteAllBookFromCart);


  router
  .route("/:bookID")
  .put(cart.update)
  .delete(jwt.authenticateTokenFromHeader, cart.deleteBookFromCart);

module.exports = router;
