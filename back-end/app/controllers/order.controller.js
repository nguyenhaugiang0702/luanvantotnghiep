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

exports.cancelOrder = async (req, res, next) => {
  // 4 là yêu cầu hủy đơn
  const userID = req.user.id;
  const orderID = req.params.orderID;
  try {
    const orderUpdateStatus = await orderService.requestCancelOrder(userID, orderID);
    if(!orderUpdateStatus){
      return next(new ApiError(400, "Lỗi khi hủy đơn hàng!"));
    }
    return res.send({
      message: "Đã yêu cầu hủy thành công"
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi đặt hàng!"));
  }
};
