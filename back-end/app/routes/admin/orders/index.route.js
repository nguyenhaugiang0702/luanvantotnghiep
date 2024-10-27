const express = require("express");
const order = require("../../../controllers/admin/order.controller");
const router = express.Router();

router.route("/").get(order.findAll); // Lấy tất cả đơn hàng

router
  .route("/:orderID")
  .get(order.findOne) // Chi tiết đơn hàng
  .put(order.updateStatus) // Cập nhật trạng thái
  .delete(order.deleteOrder); // Xóa đơn hàng

module.exports = router;
