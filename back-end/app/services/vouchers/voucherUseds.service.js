const VouhcherUseds = require("../../models/VouhcherUseds.model");

const createVoucherUseds = async (voucherUsedsData) => {
  const newVoucherUseds = new VouhcherUseds(voucherUsedsData);
  return await newVoucherUseds.save();
};

const getVoucherUsedsByID = async (voucherUsedsID) => {
  return await VouhcherUseds.findById(voucherUsedsID);
};

const getVouchers = async (query) => {
  return await VouhcherUseds.find(query).populate({
    path: "voucherID",
    populate: [{ path: "voucherCategoryID" }],
  });
};

const getAllVoucherUseds = async (filter, skip = 0, limit = 0) => {
  let vouchersUsedData = VouhcherUseds.find(filter).populate({
    path: "voucherID",
    populate: [{ path: "voucherCategoryID" }],
  });
  if (skip || limit) {
    vouchersUsedData = vouchersUsedData.skip(skip).limit(limit);
  }
  return await vouchersUsedData;
};

const getOneVoucherUsed = async (filter) => {
  return await VouhcherUseds.findOne(filter).populate({
    path: "voucherID",
    populate: [{ path: "voucherCategoryID" }],
  });
};

const updateVoucherUseds = async (voucherUsedsID, voucherUsedsData) => {
  return await VouhcherUseds.findByIdAndUpdate(
    voucherUsedsID,
    voucherUsedsData,
    { new: true }
  );
};

const updateVoucherUsedsByQuery = async (query, voucherUsedsData) => {
  return await VouhcherUseds.findOneAndUpdate(
    query,
    voucherUsedsData,
    { new: true }
  );
};

const updateMany = async (filter, update) => {
  return await VouhcherUseds.updateMany(filter, update);
};

const deleteVoucherUsedWhenCheckOut = async (filter) => {
  return await VouhcherUseds.findOneAndDelete(filter);
};

const countAllVouchersUsed = async (query) => {
  return await VouhcherUseds.countDocuments(query);
};

module.exports = {
  createVoucherUseds,
  getVoucherUsedsByID,
  getAllVoucherUseds,
  updateVoucherUseds,
  updateMany,
  deleteVoucherUsedWhenCheckOut,
  getOneVoucherUsed,
  countAllVouchersUsed,
  getVouchers,
  updateVoucherUsedsByQuery,
};
