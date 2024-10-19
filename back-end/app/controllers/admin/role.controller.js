const moment = require("moment-timezone");
const ApiError = require("../../api-error");
const roleService = require("../../services/role.service");

exports.create = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return next(new ApiError(400, "Vui lòng nhập tên quyền"));
    }
    const nameFormat = name.trim().toLowerCase();
    const roleExist = await roleService.checkRoleExist({ name: nameFormat });
    if (roleExist) {
      return next(new ApiError(409, "Quyền này đã tồn tại")); // 409 là lỗi Conflict
    }
    req.body.createdAt = moment.tz("Asia/Ho_Chi_Minh");
    req.body.updatedAt = moment.tz("Asia/Ho_Chi_Minh");
    const newRole = await roleService.createRole(req.body);
    return res.send({
      message: "Thêm quyền mới thành công",
      newRole,
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi thêm quyền mới"));
  }
};

exports.findAll = async (req, res, next) => {
  let roles = [];
  try {
    roles = await roleService.getAllRoles({});
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy tất cả quyền"));
  }
  return res.send(roles);
};

exports.update = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return next(new ApiError(400, "Vui lòng nhập tên quyền"));
    }
    const nameFormat = name.trim().toLowerCase();
    const roleExist = await roleService.checkRoleExist({ name: nameFormat });
    if (roleExist) {
      return next(new ApiError(409, "Quyền này đã tồn tại")); // 409 là lỗi Conflict
    }
    const { roleID } = req.params;
    req.body.updatedAt = moment.tz("Asia/Ho_Chi_Minh");
    const role = await roleService.updateRole(roleID, req.body);
    return res.send({
      message: "Cập nhật thành công quyền",
      role,
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi cập nhật quyền"));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { roleID } = req.params;
    const role = await roleService.deleteRole(roleID);
    return res.send({
      message: "Xóa thành công quyền",
      role,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi xóa tác giả"));
  }
};
