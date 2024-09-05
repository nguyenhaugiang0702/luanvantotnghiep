const express = require("express");
const router = express.Router();
const address = require("../controllers/address.controller");
const validation = require("../middlewares/validateAddress.middleware");
const jwt = require("../middlewares/jwt.middleware");

router
  .route("/")
  .get(jwt.authenticateTokenFromHeader, address.findAll)
  .post(
    validation.createAddressValidation,
    jwt.authenticateTokenFromHeader,
    address.create
  );

router
  .route("/:addressID")
  .get(jwt.authenticateTokenFromHeader, address.findOne)
  .put(
    validation.createAddressValidation,
    jwt.authenticateTokenFromHeader,
    address.update
  )
  .delete(jwt.authenticateTokenFromHeader, address.delete);

module.exports = router;
