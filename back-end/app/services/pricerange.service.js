const PriceRange = require("../models/pricerange.model");
const { ObjectId } = require("mongodb");
const moment = require("moment");

const createPriceRange = async (priceRangeData) => {
  const newPriceRange = new PriceRange(priceRangeData);
  return await newPriceRange.save();
};

const getAllPriceRange = async () => {
  return await PriceRange.find({}).sort({ createdAt: -1 });
};

const updatePriceRange = async (priceRangeId, priceRangeData) => {
  if (ObjectId.isValid(priceRangeId)) {
    return await PriceRange.findByIdAndUpdate(priceRangeId, priceRangeData, {
      new: true,
    });
  }
};

const deletePriceRange = async (priceRangeId) => {
  if (ObjectId.isValid(priceRangeId)) {
    return await PriceRange.findByIdAndDelete(priceRangeId);
  }
};

module.exports = {
  createPriceRange,
  updatePriceRange,
  deletePriceRange,
  getAllPriceRange,
};
