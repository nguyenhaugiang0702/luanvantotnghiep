const { VoucherCategory } = require("../../models/voucher.model");

const createVoucherCategory = async (voucherCategoryData) => {
  const newVoucherCategory = new VoucherCategory(voucherCategoryData);
  return await newVoucherCategory.save();
};

const getVoucherCategoryByID = async (voucherCategoryID) => {
  return await VoucherCategory.findById(voucherCategoryID);
};

const getAllVouchersCategory = async (query) => {
  return await VoucherCategory.find(query);
};

const updateVouchersCategory = async (
  voucherCategoryID,
  voucherCategoryData
) => {
  return await VoucherCategory.findByIdAndUpdate(
    voucherCategoryID,
    voucherCategoryData,
    { new: true }
  );
};

const deleteVoucherCategory = async (voucherCategoryID) => {
  return await VoucherCategory.findByIdAndDelete(voucherCategoryID);
};

module.exports = {
  createVoucherCategory,
  getVoucherCategoryByID,
  getAllVouchersCategory,
  updateVouchersCategory,
  deleteVoucherCategory,
};
