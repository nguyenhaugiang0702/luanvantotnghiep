const express = require("express");
const order = require("../controllers/order.controller");
const jwt = require("../middlewares/jwt.middleware");
const validateSupplier = require("../middlewares/validateSupplier.middleware");

const router = express.Router();

router
  .route("/")
//   .get(suppliers.findAll)
  .post(jwt.authenticateTokenFromHeader, order.create);

// router
//   .route("/:supplierID")
//   .get(suppliers.findOne)
//   .put(validateSupplier.createSupplierValidation, suppliers.update)
//   .delete(suppliers.delete);
module.exports = router;
