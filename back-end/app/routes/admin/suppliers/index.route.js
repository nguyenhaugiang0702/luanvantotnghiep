const express = require("express");
const suppliers = require("../../../controllers/admin/supplier.controller");
const validateSupplier = require("../../../middlewares/validateSupplier.middleware");

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
