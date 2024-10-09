const express = require("express");
const router = express.Router();
const voucher = require("../../../controllers/voucher.controller");
const jwt = require("../../../middlewares/jwt.middleware");
const jwtAdmin = require("../../../middlewares/jwtAdmin.middleware");
const validation = require("../../../middlewares/validateVoucher.middleware");

// Voucher
router.route("/").get(voucher.findAllVouchers);
router.route("/vouhersWithLogin").get(jwt.authenticateTokenFromHeader, voucher.findAllVouchersWithLogin);

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
