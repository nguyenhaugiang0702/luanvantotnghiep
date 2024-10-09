const { Voucher } = require("../../models/voucher.model");

const createVoucher = async (voucherData) => {
  const newVoucher = new Voucher(voucherData);
  return await newVoucher.save();
};

const getVoucherByID = async (voucherID) => {
  return await Voucher.findById(voucherID);
};

const getAllVouchers = async () => {
  return await Voucher.find()
    .populate("voucherCategoryID")
    .sort({ createdAt: 1 });
};

const updateVoucher = async (voucherID, voucherData) => {
  return await Voucher.findByIdAndUpdate(voucherID, voucherData, { new: true });
};

module.exports = {
  createVoucher,
  getVoucherByID,
  getAllVouchers,
  updateVoucher,
};
