const express = require("express");
const suppliers = require("../controllers/supplier.controller");
const authenticateToken = require("../middlewares/jwt.middleware");
const validateSupplier = require("../middlewares/validateSupplier.middleware");

const router = express.Router();

router
  .route("/")
  .get(suppliers.findAll)
  .post(validateSupplier.createSupplierValidation, suppliers.create);

router
  .route("/:supplierID")
  .get(suppliers.findOne)
  .put(validateSupplier.createSupplierValidation, suppliers.update)
  .delete(suppliers.delete);
module.exports = router;
