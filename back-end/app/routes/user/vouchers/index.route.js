const express = require("express");
const router = express.Router();
const voucher = require("../../../controllers/user/voucher.controller");
const validation = require("../../../middlewares/validateVoucher.middleware");
// Voucher
router.route("/").get(voucher.findAllVouchers);

// Voucher Useds
router
  .route("/voucherUseds")
  .get(voucher.findAllVoucherUseds)
  .post(validation.collectVoucherValidation, voucher.createVoucherUseds);
router.route("/voucherUseds/:voucherUsedID").put(voucher.updateVoucherUseds);
router.route("/voucherUseds/checkExpire").get(voucher.checkExpiredVouchers); // Notification

module.exports = router;
