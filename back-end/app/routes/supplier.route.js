const express = require("express");
const suppliers = require("../controllers/supplier.controller");
const jwt = require("../middlewares/jwt.middleware");
const jwtAdmin = require("../middlewares/jwtAdmin.middleware");
const validateSupplier = require("../middlewares/validateSupplier.middleware");

const router = express.Router();
router.use(jwtAdmin.authenticateTokenFromHeader);

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
