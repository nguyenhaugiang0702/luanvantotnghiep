const PriceRange = require("../models/pricerange.model");
const { ObjectId } = require("mongodb");
const moment = require("moment");

const createPriceRange = async (priceRangeData) => {
  const newPriceRange = new PriceRange(priceRangeData);
  return await newPriceRange.save();
};

const getAllPriceRange = async () => {
  return await PriceRange.find({});
};

const updatePriceRange = async (priceRangeId, priceRangeData) => {
  const priceRangeID = {
    _id: ObjectId.isValid(priceRangeId) ? new ObjectId(priceRangeId) : null,
  };
  return await PriceRange.findByIdAndUpdate(priceRangeID, priceRangeData, {
    new: true,
  });
};

const deletePriceRange = async (priceRangeId) => {
  const priceRangeID = {
    _id: ObjectId.isValid(priceRangeId) ? new ObjectId(priceRangeId) : null,
  };
  return await PriceRange.findByIdAndDelete(priceRangeID);
};

module.exports = {
  createPriceRange,
  updatePriceRange,
  deletePriceRange,
  getAllPriceRange,
};
