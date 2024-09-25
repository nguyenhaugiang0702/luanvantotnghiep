const Voucher = require("../models/voucher.model");

const createVoucher = async (voucherData) => {
  const newVoucher = new Voucher(voucherData);
  return await newVoucher.save();
};

const getVoucherByID = async (voucherID) => {
  return await Voucher.findById(voucherID);
};

module.exports = {
  createVoucher,
  getVoucherByID,
};
