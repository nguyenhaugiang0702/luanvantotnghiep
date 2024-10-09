const moment = require("moment-timezone");
const ApiError = require("../api-error");
const categoryService = require("../services/category.service");

exports.create = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return next(new ApiError(404, "Tên danh là bắt buộc"));
    }
    const checkNameExist = await categoryService.checkNameExist(name.trim());
    if (checkNameExist) {
      return next(new ApiError(400, "Đã tồn tại tên thể loại"));
    }
    req.body.createdAt = moment.tz("Asia/Ho_Chi_Minh").toDate();
    req.body.updatedAt = moment.tz("Asia/Ho_Chi_Minh").toDate();
    req.body.name = name.trim();
    const newCategory = await categoryService.createCategory(req.body);
    return res.send({
      message: "Thêm thể loại thành công",
      newCategory,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi thêm mới thể loại"));
  }
};

exports.findAll = async (req, res, next) => {
  let categories = [];
  try {
    categories = await categoryService.getAllCategory();
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy tất cả thể loại"));
  }
  return res.send(categories);
};

exports.update = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return next(new ApiError(404, "Tên thể loại là bắt buộc"));
    }
    const checkNameExist = await categoryService.checkNameExist(name.trim());
    if (checkNameExist) {
      return next(new ApiError(400, "Đã tồn tại tên thể loại"));
    }
    const categoryID = req.params.categoryID;
    req.body.updatedAt = moment.tz("Asia/Ho_Chi_Minh").toDate();
    req.body.name = name.trim();
    const category = await categoryService.updateCategory(categoryID, req.body);
    return res.send({
      message: "Cập nhật thành công thể loại",
      category,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi cập nhật thể loại"));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const categoryID = req.params.categoryID;
    const category = await categoryService.deleteCategory(categoryID);
    return res.send({
      message: "Xóa thành công thể loại",
      category,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi xóa thể loại"));
  }
};
