const Order = require("../models/order.model");
const { ObjectId } = require("mongodb");
const axios = require("axios"); // npm install axios
const CryptoJS = require("crypto-js"); // npm install crypto-js
const moment = require("moment"); // npm install moment
const config = require("../config/index");

const createOrder = async (orderData) => {
  const newOrder = new Order(orderData);
  return newOrder.save();
};

const getOrderByID = async (orderID) => {
  return await Order.findById(orderID)
    .populate({
      path: "detail.bookID",
      populate: [
        { path: "categoryID", select: "name" },
        { path: "formalityID", select: "name" },
        { path: "publisherID", select: "name" },
      ],
    })
    .populate("userID")
    .populate("addressID");
};

const getAllOrdersByAdmin = async () => {
  return await Order.find({})
    .populate({
      path: "detail.bookID",
      populate: [
        { path: "categoryID", select: "name" },
        { path: "formalityID", select: "name" },
        { path: "publisherID", select: "name" },
      ],
    })
    .populate("userID")
    .populate("addressID");
};

const getOrderByIDAndUserID = async (orderID, userID) => {
  return await Order.findOne({ _id: orderID, userID: userID })
    .populate({
      path: "detail.bookID",
      populate: [
        { path: "categoryID", select: "name" },
        { path: "formalityID", select: "name" },
        { path: "publisherID", select: "name" },
      ],
    })
    .populate("userID")
    .populate("addressID");
};

const getOrdersByUserID = async (userID) => {
  const orders = await Order.find({ userID: userID })
    .populate({
      path: "detail.bookID",
      populate: [
        { path: "categoryID", select: "name" },
        { path: "formalityID", select: "name" },
        { path: "publisherID", select: "name" },
      ],
    })
    .populate("userID", "name") // Nếu muốn lấy thêm thông tin user
    .populate("addressID") // Populate address nếu cần
    .sort({ createdAt: -1 });
  return orders;
};

const deleteOrderByID = async (orderID) => {
  return await Order.findByIdAndDelete(orderID);
};

const updateWasPaidedOrderByID = async (orderID) => {
  return await Order.findByIdAndUpdate(
    orderID,
    { $set: { wasPaided: true } },
    { new: true }
  );
};

const updateOrderById = async (orderId, updateData) => {
  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    { $set: updateData },
    { new: true }
  );
  return updatedOrder;
};

const updateStatus = async (orderID, status) => {
  const order = await Order.findById(orderID);
  order.status = status;
  order.updatedAt = moment.tz("Asia/Ho_Chi_Minh").toDate();
  await order.save();
  return order;
};

const generateMRefundId = () => {
  const date = new Date();
  const yymmdd =
    date.getFullYear().toString().substr(-2) +
    (date.getMonth() + 1).toString().padStart(2, "0") +
    date.getDate().toString().padStart(2, "0");
  const randomPart = Math.random().toString(36).substr(2, 9);
  return `${yymmdd}_${config.zalopay.app_id}_${randomPart}`;
};

const refundOrder = async (zp_trans_id, amount, description) => {
  try {
    const params = {
      app_id: config.zalopay.app_id,
      m_refund_id: generateMRefundId(),
      zp_trans_id,
      amount,
      timestamp: Date.now(),
      description,
    };

    // Tạo chuỗi mac
    const hmac_input = `${params.app_id}|${params.zp_trans_id}|${params.amount}|${params.description}|${params.timestamp}`;

    params.mac = CryptoJS.HmacSHA256(
      hmac_input,
      config.zalopay.key1
    ).toString();

    console.log("Refund params:", params);

    const response = await axios.post(
      "https://sb-openapi.zalopay.vn/v2/refund",
      null,
      { params }
    );

    console.log("Refund response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Refund error:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Lỗi khi hoàn tiền qua ZaloPay");
  }
};

module.exports = {
  createOrder,
  deleteOrderByID,
  updateWasPaidedOrderByID,
  getOrderByID,
  getOrdersByUserID,
  updateStatus,
  getOrderByIDAndUserID,
  getAllOrdersByAdmin,
  refundOrder,
  updateOrderById,
};
