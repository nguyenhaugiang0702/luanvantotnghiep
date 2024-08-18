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

const getAllSuplliers = async () => {
    return await Supplier.find({});
  };

module.exports = {
  createSupplier,
  getSupplierById,
  getAllSuplliers,
};
