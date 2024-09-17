const orderService = require("../services/order.service");
const cartService = require("../services/cart.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/index");
const moment = require("moment-timezone");
const ApiError = require("../api-error");
const axios = require("axios");

exports.create = async (req, res, next) => {
  try {
    const userID = req.user.id;
    req.body.userID = userID;
    req.body.createdAt = moment.tz("Asia/Ho_Chi_Minh").toDate();
    req.body.updatedAt = moment.tz("Asia/Ho_Chi_Minh").toDate();
    const newOrder = await orderService.createOrder(req.body);
    if (!newOrder) {
      return next(new ApiError(400, "Lỗi khi đặt hàng!"));
    }
    const updatedCart = await cartService.deleteBookFromCartWhenCheckOut(
      userID
    );
    if (!updatedCart) {
      return next(new ApiError(400, "Lỗi khi cập nhật giỏ hàng!"));
    }
    await cartService.calculateTotalPriceWhenCheckOut(userID);
    return res.send({
      message: "Đặt hàng thành công",
      newOrder,
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi đặt hàng!"));
  }
};

exports.findAllOrdersByUserID = async (req, res, next) => {
  let orders = [];
  try {
    const userID = req.user.id;
    orders = await orderService.getOrdersByUserID(userID);
    return res.send({
      message: "Đặt hàng thành công",
      orders,
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi đặt hàng!"));
  }
};

exports.updateStatusByCustomer = async (req, res, next) => {
  // const userID = req.user.id;
  const orderID = req.params.orderID;
  const { status } = req.body;
  try {
    const orderUpdateStatus = await orderService.updateStatus(orderID, status);
    if (!orderUpdateStatus) {
      return next(new ApiError(400, "Lỗi khi hủy đơn hàng!"));
    }
    return res.send({
      message: "Đã yêu cầu hủy thành công",
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi đặt hàng!"));
  }
};

exports.findOne = async (req, res, next) => {
  const userID = req.user.id;
  const orderID = req.params.orderID;
  try {
    const orderDetail = await orderService.getOrderByIDAndUserID(
      orderID,
      userID
    );
    if (!orderDetail) {
      return next(new ApiError(400, "Lỗi khi lấy chi tiết đơn hàng!"));
    }
    return res.send(orderDetail);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi đặt hàng!"));
  }
};

// Admin

exports.findAllByAdmin = async (req, res, next) => {
  try {
    const orders = await orderService.getAllOrdersByAdmin();
    if (!orders) {
      return next(new ApiError(400, "Lỗi khi lấy tất cả đơn hàng!"));
    }
    return res.send(orders);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi đặt hàng!"));
  }
};

exports.findOneByAdmin = async (req, res, next) => {
  const orderID = req.params.orderID;
  try {
    const orderDetail = await orderService.getOrderByID(orderID);
    if (!orderDetail) {
      return next(new ApiError(400, "Lỗi khi lấy chi tiết đơn hàng!"));
    }
    return res.send(orderDetail);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi đặt hàng!"));
  }
};

exports.updateStatusByAd = async (req, res, next) => {
  // const userID = req.user.id;
  const orderID = req.params.orderID;
  const { status } = req.body;
  try {
    const order = await orderService.getOrderByID(orderID);
    if (!order) {
      return next(new ApiError(404, "Đơn hàng không tồn tại!"));
    }
    // Kiểm tra nếu đơn hàng đã thanh toán và trạng thái mới là "Yêu cầu hủy" hoặc "Đã hủy"
    if (order.wasPaided && (order.status === 3 || order.status === 4)) {
      console.log("hoan tien");
      const refundSuccessful = await orderService.refundOrder(
        order.refundTransactionId,
        order.totalPrice,
        "Hoàn tiền cho đơn hàng bị hủy"
      );
      if (!refundSuccessful) {
        return next(new ApiError(500, "Lỗi khi hoàn tiền!"));
      }
    }
    const orderUpdateStatus = await orderService.updateStatus(orderID, status);
    if (!orderUpdateStatus) {
      return next(new ApiError(400, "Lỗi khi cập nhật trạng thái đơn hàng!"));
    }
    return res.send({
      message: "Đã cập nhật thành công trạng thái đơn hàng",
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi đặt hàng!"));
  }
};
