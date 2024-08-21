const Supplier = require("../models/supplier.model");
const { ObjectId } = require("mongodb");
const moment = require("moment");

const createSupplier = async (userData) => {
  const supplier = new Supplier(userData);
  return await supplier.save();
};

const getSupplierById = async (supplierId) => {
  const supplierID = {
    _id: ObjectId.isValid(supplierId) ? new ObjectId(supplierId) : null,
  };
  return await Supplier.findById(supplierID);
};

const getAllSuppliers = async () => {
  return await Supplier.find({});
};

const getAllSuppliersByName = async (name) => {
  return await Supplier.find({
    name: new RegExp(name, "i"),
  });
};

const updateSupplier = async (supplierId, data) => {
  const supplierID = {
    _id: ObjectId.isValid(supplierId) ? new ObjectId(supplierId) : null,
  };
  return await Supplier.findByIdAndUpdate(supplierID, data, { new: true });
};

const deleteSupplier = async (supplierId) => {
  const supplierID = {
    _id: ObjectId.isValid(supplierId) ? new ObjectId(supplierId) : null,
  };
  return await Supplier.findByIdAndDelete(supplierID);
};

const checkNameExist = async (name) => {
  return await Supplier.findOne({ name: name });
};

const checkPhoneNumberExist = async (phoneNumber) => {
  return await Supplier.findOne({ phoneNumber: phoneNumber });
};

const checkEmailExist = async (email) => {
  return await Supplier.findOne({ email: email });
};

module.exports = {
  createSupplier,
  getSupplierById,
  getAllSuppliers,
  updateSupplier,
  deleteSupplier,
  getAllSuppliersByName,
  checkNameExist,
  checkPhoneNumberExist,
  checkEmailExist,
};
