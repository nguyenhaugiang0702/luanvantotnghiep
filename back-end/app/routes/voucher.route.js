const express = require("express");
const router = express.Router();
const voucher = require("../controllers/voucher.controller");
const jwt = require("../middlewares/jwt.middleware");
const jwtAdmin = require("../middlewares/jwtAdmin.middleware");
const validation = require("../middlewares/validateVoucher.middleware");

// Voucher category
router
  .route("/voucherCategory")
  .post(
    jwtAdmin.authenticateTokenFromHeader,
    validation.createVoucherCategoryValidation,
    voucher.createVoucherCategory
  ) // Create Voucher Category (validated)
  .get(jwtAdmin.authenticateTokenFromHeader, voucher.findAllVouchersCategory);

router
  .route("/voucherCategory/:voucherCategoryID")
  .put(
    jwtAdmin.authenticateTokenFromHeader,
    validation.createVoucherCategoryValidation,
    voucher.updateVoucherCategory
  );

// Voucher
router
  .route("/voucher")
  .post(jwtAdmin.authenticateTokenFromHeader, voucher.createVoucher)
  .get(jwtAdmin.authenticateTokenFromHeader, voucher.findAllVouchers);

router
  .route("/voucher/:voucherID")
  .put(jwtAdmin.authenticateTokenFromHeader, voucher.updateVoucher);

// Voucher Useds
router
  .route("/voucherUseds")
  .post(jwt.authenticateTokenFromHeader, voucher.createVoucherUseds)
  .get(jwt.authenticateTokenFromHeader, voucher.findAllVoucherUseds);
router
  .route("/voucherUseds/:voucherUsedID")
  .put(jwt.authenticateTokenFromHeader, voucher.updateVoucherUseds);

module.exports = router;
