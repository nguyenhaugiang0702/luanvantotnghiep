const moment = require("moment-timezone");
const ApiError = require("../api-error");
const categoryService = require("../services/category.service");

exports.create = async (req, res, next) => {
  try {
    if (!req.body?.name) {
      return next(new ApiError(404, "Tên danh là bắt buộc"));
    }
    const checkNameExist = await categoryService.checkNameExist(req.body.name);
    if (checkNameExist) {
      return next(new ApiError(400, "Đã tồn tại tên danh mục"));
    }
    req.body.createAt = moment.tz("Asia/Ho_Chi_Minh").toDate();
    req.body.updatedAt = moment.tz("Asia/Ho_Chi_Minh").toDate();
    const newCategory = await categoryService.createCategory(req.body);
    return res.send({
      message: "Thêm danh mục thành công",
      newCategory,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi thêm mới danh mục"));
  }
};

exports.findAll = async (req, res, next) => {
  let categories = [];
  try {
    categories = await categoryService.getAllCategory();
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy tất cả danh mục"));
  }
  return res.send(categories);
};

exports.update = async (req, res, next) => {
  try {
    if (!req.body?.name) {
      return next(new ApiError(404, "Tên danh mục là bắt buộc"));
    }
    const checkNameExist = await categoryService.checkNameExist(req.body.name);
    if (checkNameExist) {
      return next(new ApiError(400, "Đã tồn tại tên danh mục"));
    }
    const categoryID = req.params.categoryID;
    const category = await categoryService.updateCategory(categoryID, req.body);
    return res.send({
      message: "Cập nhật thành công danh mục",
      category,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi cập nhật danh mục"));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const categoryID = req.params.categoryID;
    const category = await categoryService.deleteCategory(categoryID);
    return res.send({
      message: "Xóa thành công danh mục",
      category,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi xóa danh mục"));
  }
};
