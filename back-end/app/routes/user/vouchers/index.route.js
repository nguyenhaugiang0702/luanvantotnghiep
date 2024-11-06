const express = require("express");
const router = express.Router();
const voucher = require("../../../controllers/user/voucher.controller");
const validation = require("../../../middlewares/validateVoucher.middleware");
// Voucher
router.route("/").get(voucher.findAllVouchers);
router.route("/checkExpire").get(voucher.checkExpiredVouchers);

// Voucher Useds
router
  .route("/voucherUseds")
  .get(voucher.findAllVoucherUseds)
  .post(validation.collectVoucherValidation, voucher.createVoucherUseds);
router.route("/voucherUseds/:voucherUsedID").put(voucher.updateVoucherUseds);

module.exports = router;
