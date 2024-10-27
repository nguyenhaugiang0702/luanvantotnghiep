const express = require("express");
const router = express.Router();
const address = require("../../../controllers/user/address.controller");
const validation = require("../../../middlewares/validateAddress.middleware");

router
  .route("/")
  .get(address.findAll) // Lấy tất cả địa chỉ
  .post(validation.createAddressValidation, address.create); // Thêm địa chỉ mới (validated)

router
  .route("/:addressID")
  .get(address.findOne) // Chi tiết địa chỉ
  .put(validation.createAddressValidation, address.update) // Cập nhật địa chỉ (validated)
  .delete(address.delete); // Xóa địa chỉ

module.exports = router;
