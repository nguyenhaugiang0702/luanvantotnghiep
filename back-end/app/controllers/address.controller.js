const moment = require("moment-timezone");
const ApiError = require("../api-error");
const addressService = require("../services/address.service");

exports.create = async (req, res, next) => {
  try {
    req.body.createdAt = moment.tz("Asia/Ho_Chi_Minh").toDate();
    req.body.updatedAt = moment.tz("Asia/Ho_Chi_Minh").toDate();
    const userID = req.user.id;
    req.body.userID = userID;
    // Nếu chưa có địa chỉ nào, mặc định địa chỉ mới là địa chỉ giao hàng
    const currentAddress = await addressService.getAllAddressByUserID(userID);
    if (currentAddress.length <= 0) {
      req.body.isDefault = true;
    }
    const newAddress = await addressService.createAddress(req.body);
    return res.send({
      message: "Thêm địa chỉ thành công",
      newAddress,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi thêm mới địa chỉ"));
  }
};

exports.findAll = async (req, res, next) => {
  let address = [];
  try {
    const userID = req.user.id;
    address = await addressService.getAllAddressByUserID(userID);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy tất cả địa chỉ"));
  }
  return res.send(address);
};

exports.findAddressDefault = async (req, res, next) => {
  try {
    const userID = req.user.id;
    const address = await addressService.getAllAddressByUserID(userID);
    return res.send(address);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy tất cả địa chỉ"));
  }
  r
};

exports.findOne = async (req, res, next) => {
  let address = [];
  try {
    const userID = req.user.id;
    const addressID = req.params.addressID;
    address = await addressService.getAddressByIDAndUserID(userID, addressID);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy địa chỉ"));
  }
  return res.send(address);
};

exports.update = async (req, res, next) => {
  try {
    const addressID = req.params.addressID;
    const userID = req.user.id;
    const { isDefault, ...restBody } = req.body;
    if (isDefault !== undefined && Object.keys(restBody).length === 0) {
      await addressService.updateMany(
        { userID: userID, _id: { $ne: addressID } },
        { isDefault: false }
      );
    }
    const address = await addressService.updateAddress(
      addressID,
      userID,
      req.body
    );

    return res.send({
      message: "Cập nhật thành công địa chỉ",
      address,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi cập nhật địa chỉ"));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const addressID = req.params.addressID;
    const userID = req.user.id;
    const address = await addressService.deleteAddress(addressID, userID);
    return res.send({
      message: "Xóa thành công địa chỉ",
      address,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi xóa địa chỉ"));
  }
};
