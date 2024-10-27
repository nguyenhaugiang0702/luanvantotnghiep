const express = require("express");
const order = require("../../../controllers/user/order.controller");
const validation = require("../../../middlewares/validateOrder.middelware");
const router = express.Router();

router
  .route("/")
  .get(order.findAll) // Lấy tất cả đơn hàng của user
  .post(validation.ordersValidation, order.create); // Tạo đơn hàng cho user

router.route("/detail/:orderID").get(order.findOne); // Chi tiết đơn hàng của user

router.route("/updateStatus/:orderID").put(order.updateStatus); // Cập nhật trạng thái cho user

router.route("/shipping-fee").post(order.getShippingFee); // Tính tiền ship qua API của GHTK

module.exports = router;
