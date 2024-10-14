const ApiError = require("../../../api-error");
const formalityService = require("../../../services/formality.service");
const priceRangeService = require("../../../services/pricerange.service");
const publisherService = require("../../../services/publisher.service");
const categoryService = require("../../../services/category.service");
const auhorService = require("../../../services/author.service");

exports.findAllAuthors = async (req, res, next) => {
  let authors = [];
  try {
    authors = await auhorService.getAllAuthors();
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy tất cả tác giả"));
  }
  return res.send(authors);
};

exports.findAllCategories = async (req, res, next) => {
  let categories = [];
  try {
    categories = await categoryService.getAllCategory();
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy tất cả thể loại"));
  }
  return res.send(categories);
};

exports.findAllFormalities = async (req, res, next) => {
  let formalities = [];
  try {
    formalities = await formalityService.getAllFormality();
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy tất cả hình thức"));
  }
  return res.send(formalities);
};

exports.findAllPriceRanges = async (req, res, next) => {
  let priceRanges = [];
  try {
    priceRanges = await priceRangeService.getAllPriceRange();
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy tất cả khoản giá"));
  }
  return res.send(priceRanges);
};

exports.findAllPublishers = async (req, res, next) => {
  let publishers = [];
  try {
    publishers = await publisherService.getAllPublishers();
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy tất cả nhà xuất bản"));
  }
  return res.send(publishers);
};
