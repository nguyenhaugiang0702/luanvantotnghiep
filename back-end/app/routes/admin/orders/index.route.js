// orders/admin/order.route.js
const express = require("express");
const order = require("../../../controllers/order.controller");
const jwtAdmin = require("../../../middlewares/jwtAdmin.middleware");

const router = express.Router();

router
  .route("/")
  .get(jwtAdmin.authenticateTokenFromHeader, order.findAllByAdmin) // Lấy tất cả đơn hàng
  .post(jwtAdmin.authenticateTokenFromHeader, order.create); // Tạo đơn hàng

router
  .route("/:orderID")
  .get(jwtAdmin.authenticateTokenFromHeader, order.findOneByAdmin) // Chi tiết đơn hàng
  .put(jwtAdmin.authenticateTokenFromHeader, order.updateStatusByAd); // Cập nhật trạng thái

module.exports = router;
