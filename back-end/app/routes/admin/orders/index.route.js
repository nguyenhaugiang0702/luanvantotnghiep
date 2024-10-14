// orders/admin/order.route.js
const express = require("express");
const order = require("../../../controllers/admin/order.controller");
const jwtAdmin = require("../../../middlewares/jwtAdmin.middleware");

const router = express.Router();

router
  .route("/")
  .get(jwtAdmin.authenticateTokenFromHeader, order.findAll); // Lấy tất cả đơn hàng

router
  .route("/:orderID")
  .get(jwtAdmin.authenticateTokenFromHeader, order.findOne) // Chi tiết đơn hàng
  .put(jwtAdmin.authenticateTokenFromHeader, order.updateStatus); // Cập nhật trạng thái

module.exports = router;
