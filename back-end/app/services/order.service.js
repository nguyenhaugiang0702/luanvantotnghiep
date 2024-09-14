const Order = require("../models/order.model");
const { ObjectId } = require("mongodb");

const createOrder = async (orderData) => {
  const newOrder = new Order(orderData);
  return newOrder.save();
};

const getOrderByID = async (orderID) => {
  return await Order.findById(orderID);
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

module.exports = {
  createOrder,
  deleteOrderByID,
  updateWasPaidedOrderByID,
  getOrderByID
};
