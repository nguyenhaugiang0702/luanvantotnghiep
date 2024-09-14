const Order = require("../models/order.model");
const { ObjectId } = require("mongodb");
const moment = require("moment-timezone");

const createOrder = async (orderData) => {
  const newOrder = new Order(orderData);
  return newOrder.save();
};

const getOrderByID = async (orderID) => {
  return await Order.findById(orderID);
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

const requestCancelOrder = async (userID, orderID) => {
  const order = await Order.findOne({ _id: orderID, userID: userID });
  order.status = 4; // Yêu cầu hủy đơn
  order.updatedAt = moment.tz("Asia/Ho_Chi_Minh").toDate();
  await order.save();
  return order;
};

module.exports = {
  createOrder,
  deleteOrderByID,
  updateWasPaidedOrderByID,
  getOrderByID,
  getOrdersByUserID,
  requestCancelOrder,
};
