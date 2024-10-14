const express = require("express");
const router = express.Router();
const voucher = require("../../../controllers/user/voucher.controller");
const jwt = require("../../../middlewares/jwt.middleware");
const jwtAdmin = require("../../../middlewares/jwtAdmin.middleware");
const validation = require("../../../middlewares/validateVoucher.middleware");

// Voucher
router.route("/").get(jwt.authenticateTokenFromHeader, voucher.findAllVouchers);

// Voucher Useds
router
  .route("/voucherUseds")
  .get(jwt.authenticateTokenFromHeader, voucher.findAllVoucherUseds)
  .post(
    jwt.authenticateTokenFromHeader,
    validation.collectVoucherValidation,
    voucher.createVoucherUseds
  );
router
  .route("/voucherUseds/:voucherUsedID")
  .put(jwt.authenticateTokenFromHeader, voucher.updateVoucherUseds);

module.exports = router;
