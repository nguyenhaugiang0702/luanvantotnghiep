const Receipt = require("../models/receipt.model");
const { ObjectId } = require("mongodb");
const moment = require("moment");

const createReceipt = async (receiptData) => {
  const receipt = new Receipt(receiptData);
  return await receipt.save();
};

module.exports = {
  createReceipt,
};
