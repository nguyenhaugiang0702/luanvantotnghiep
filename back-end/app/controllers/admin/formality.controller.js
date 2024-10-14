const moment = require("moment-timezone");
const ApiError = require("../../api-error");
const formalityService = require("../../services/formality.service");

exports.create = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return next(new ApiError(404, "Tên hình thức là bắt buộc"));
    }
    const checkNameExist = await formalityService.checkNameExist(name.trim());
    if (checkNameExist) {
      return next(new ApiError(400, "Đã tồn tại tên hình thức"));
    }
    req.body.createdAt = moment.tz("Asia/Ho_Chi_Minh");
    req.body.updatedAt = moment.tz("Asia/Ho_Chi_Minh");
    req.body.name = name.trim();
    const newFormality = await formalityService.createFormality(req.body);
    return res.send({
      message: "Thêm mới hình thức thành công",
      newFormality,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi thêm mới hình thức"));
  }
};

exports.findAll = async (req, res, next) => {
  let formalities = [];
  try {
    formalities = await formalityService.getAllFormality();
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy tất cả hình thức"));
  }
  return res.send(formalities);
};

exports.update = async (req, res, next) => {
  try {
    const { name } = req.body;
    const { formalityID } = req.params;

    if (!name) {
      return next(new ApiError(404, "Tên hình thức là bắt buộc"));
    }
    const checkNameExist = await formalityService.checkNameExist(name.trim());
    if (checkNameExist) {
      return next(new ApiError(400, "Đã tồn tại tên hình thức"));
    }
    req.body.name = name.trim();
    req.body.updatedAt = moment.tz("Asia/Ho_Chi_Minh");
    const formality = await formalityService.updateFormality(
      formalityID,
      req.body
    );
    return res.send({
      message: "Cập nhật thành công hình thức",
      formality,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi cập nhật hình thức"));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const formalityID = req.params.formalityID;
    const formality = await formalityService.deleteFormality(formalityID);
    return res.send({
      message: "Xóa thành công hình thức",
      formality,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi xóa hình thức"));
  }
};
