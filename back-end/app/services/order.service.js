const Order = require("../models/order.model");
const { ObjectId } = require("mongodb");

const createOrder = async (orderData) => {
  const newOrder = new Order(orderData);
  return newOrder.save();
};

module.exports = {
  createOrder,
};
