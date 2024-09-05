const Address = require("../models/address.model");
const { ObjectId } = require("mongodb");

const createAddress = async (addressData) => {
  const newAddress = new Address(addressData);
  return await newAddress.save();
};

const getAllAddressByUserID = async (userID) => {
  return await Address.find({ userID: userID });
};

const getAddressByIDAndUserID = async (userID, addressId) => {
  return await Address.findOne({ userID: userID, _id: addressId });
};

const updateAddress = async (addressId, userID, addressData) => {
  return await Address.findOneAndUpdate(
    { _id: addressId, userID: userID },
    addressData,
    {
      new: true,
    }
  );
};

const updateMany = async (filter, update) => {
  return await Address.updateMany(filter, update);
};

const deleteAddress = async (addressId, userID) => {
  return await Address.findOneAndDelete({ _id: addressId, userID: userID });
};

module.exports = {
  createAddress,
  updateAddress,
  deleteAddress,
  getAllAddressByUserID,
  getAddressByIDAndUserID,
  updateMany,
};
