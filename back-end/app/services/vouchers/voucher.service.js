const { Voucher } = require("../../models/voucher.model");

const createVoucher = async (voucherData) => {
  const newVoucher = new Voucher(voucherData);
  return await newVoucher.save();
};

const getVoucherByID = async (voucherID) => {
  return await Voucher.findById(voucherID).populate("voucherCategoryID");
};

const getAllVouchers = async (query, skip = 0, limit = 0) => {
  let vouchersQuery = Voucher.find(query)
    .populate("voucherCategoryID")
    .sort({ createdAt: 1 });
  if (skip || limit) {
    vouchersQuery = vouchersQuery.skip(skip).limit(limit);
  }
  return await vouchersQuery;
};

const updateVoucher = async (voucherID, voucherData) => {
  return await Voucher.findByIdAndUpdate(voucherID, voucherData, { new: true });
};

const updateManyVoucher = async (filter, voucherData) => {
  return await Voucher.updateMany(filter, voucherData);
};

const countAllVouchers = async (query) => {
  return await Voucher.countDocuments(query);
};

const calculateUsedPercentage = (voucher) => {
  const quantityAvailable = voucher.quantity - voucher.quantityUsed; // Số lượng còn lại
  const quantityUsed = voucher.quantityUsed || 0; // Đảm bảo có giá trị
  return quantityAvailable >= 0 ? (quantityUsed / voucher.quantity) * 100 : 0;
};

module.exports = {
  createVoucher,
  getVoucherByID,
  getAllVouchers,
  updateVoucher,
  countAllVouchers,
  calculateUsedPercentage,
  updateManyVoucher,
};
