const VouhcherUseds = require("../../models/VouhcherUseds.model");

const createVoucherUseds = async (voucherUsedsData) => {
  const newVoucherUseds = new VouhcherUseds(voucherUsedsData);
  return await newVoucherUseds.save();
};

const getVoucherUsedsByID = async (voucherUsedsID) => {
  return await VouhcherUseds.findById(voucherUsedsID);
};

const getAllVoucherUseds = async (filter) => {
  return await VouhcherUseds.find(filter).populate({
    path: "voucherID",
    populate: [{ path: "voucherCategoryID" }],
  });
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

const updateMany = async (filter, update) => {
  return await VouhcherUseds.updateMany(filter, update);
};

const deleteVoucherUsedWhenCheckOut = async (filter) => {
  return await VouhcherUseds.findOneAndDelete(filter);
};

module.exports = {
  createVoucherUseds,
  getVoucherUsedsByID,
  getAllVoucherUseds,
  updateVoucherUseds,
  updateMany,
  deleteVoucherUsedWhenCheckOut,
  getOneVoucherUsed,
};