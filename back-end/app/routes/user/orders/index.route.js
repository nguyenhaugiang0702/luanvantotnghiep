const express = require("express");
const order = require("../../../controllers/user/order.controller");
const jwt = require("../../../middlewares/jwt.middleware");
const validation = require("../../../middlewares/validateOrder.middelware");
const router = express.Router();

router
  .route("/")
  .get(jwt.authenticateTokenFromHeader, order.findAll) // Lấy tất cả đơn hàng của user
  .post(
    jwt.authenticateTokenFromHeader,
    validation.ordersValidation,
    order.create
  ); // Tạo đơn hàng cho user

router
  .route("/detail/:orderID")
  .get(jwt.authenticateTokenFromHeader, order.findOne); // Chi tiết đơn hàng của user

router
  .route("/updateStatus/:orderID")
  .put(jwt.authenticateTokenFromHeader, order.updateStatus); // Cập nhật trạng thái cho user

router
  .route("/shipping-fee")
  .post(jwt.authenticateTokenFromHeader, order.getShippingFee); // Tính tiền ship qua API của GHTK

module.exports = router;
