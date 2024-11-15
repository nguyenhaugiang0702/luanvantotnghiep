const express = require("express");
const router = express.Router();
const voucher = require("../../../controllers/admin/voucher.controller");
const validation = require("../../../middlewares/validateVoucher.middleware");

// Voucher category
router
  .route("/voucherCategory")
  .post(
    validation.createVoucherCategoryValidation,
    voucher.createVoucherCategory
  ) // Validated
  .get(voucher.findAllVouchersCategory);

router
  .route("/voucherCategory/:voucherCategoryID")
  .put(
    validation.createVoucherCategoryValidation,
    voucher.updateVoucherCategory
  ) // Validated
  .delete(voucher.deleteVoucherCategory);

// Voucher
router
  .route("/voucher")
  .post(validation.createVoucherValidation, voucher.createVoucher) // Validated
  .get(voucher.findAllVouchers);

router
  .route("/voucher/:voucherID")
  .put(validation.createVoucherValidation, voucher.updateVoucher) // Validated
  .delete(voucher.deleteVoucher);

module.exports = router;
