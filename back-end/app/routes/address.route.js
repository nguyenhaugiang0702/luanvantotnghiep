const express = require("express");
const router = express.Router();
const address = require("../controllers/address.controller");
const validation = require("../middlewares/validateAddress.middleware");
const jwt = require("../middlewares/jwt.middleware");

router
  .route("/")
  .get(jwt.authenticateTokenFromHeader, address.findAll) // Lấy tất cả địa chỉ
  .post(
    validation.createAddressValidation,
    jwt.authenticateTokenFromHeader,
    address.create
  ); // Thêm địa chỉ mới (validated)

router
  .route("/:addressID")
  .get(jwt.authenticateTokenFromHeader, address.findOne) // Chi tiết địa chỉ
  .put(
    validation.createAddressValidation,
    jwt.authenticateTokenFromHeader,
    address.update
  ) // Cập nhật địa chỉ (validated)
  .delete(jwt.authenticateTokenFromHeader, address.delete); // Xóa địa chỉ

module.exports = router;
