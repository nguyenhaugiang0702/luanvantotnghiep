const express = require("express");
const router = express.Router();
const voucher = require("../../../controllers/admin/voucher.controller");
const jwt = require("../../../middlewares/jwt.middleware");
const jwtAdmin = require("../../../middlewares/jwtAdmin.middleware");
const validation = require("../../../middlewares/validateVoucher.middleware");

// Voucher category
router
  .route("/voucherCategory")
  .post(
    jwtAdmin.authenticateTokenFromHeader,
    validation.createVoucherCategoryValidation,
    voucher.createVoucherCategory
  ) // Validated
  .get(jwtAdmin.authenticateTokenFromHeader, voucher.findAllVouchersCategory);

router
  .route("/voucherCategory/:voucherCategoryID")
  .put(
    jwtAdmin.authenticateTokenFromHeader,
    validation.createVoucherCategoryValidation,
    voucher.updateVoucherCategory
  ); // Validated

// Voucher
router
  .route("/voucher")
  .post(
    jwtAdmin.authenticateTokenFromHeader,
    validation.createVoucherValidation,
    voucher.createVoucher
  ) // Validated
  .get(jwtAdmin.authenticateTokenFromHeader, voucher.findAllVouchers);

router
  .route("/voucher/:voucherID")
  .put(
    jwtAdmin.authenticateTokenFromHeader,
    validation.createVoucherValidation,
    voucher.updateVoucher
  ); // Validated

module.exports = router;
