const moment = require("moment-timezone");
const ApiError = require("../../api-error");
const addressService = require("../../services/address.service");

exports.create = async (req, res, next) => {
  try {
    req.body.createdAt = moment.tz("Asia/Ho_Chi_Minh").toDate();
    req.body.updatedAt = moment.tz("Asia/Ho_Chi_Minh").toDate();
    const userID = req.user ? req.user.id : null;
    if (!userID) {
      return next(new ApiError(400, "Vui lòng đăng nhập"));
    }
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
  try {
    const userID = req.user ? req.user.id : null;
    if (!userID) {
      return next(new ApiError(400, "Vui lòng đăng nhập"));
    }
    if (Object.keys(req.query).length > 0) { // có phân trang
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 3;
      const skip = (page - 1) * limit;
      const totalAddresses = await addressService.countAddressesByUserID(
        userID
      );
      const totalPages = Math.ceil(totalAddresses / limit);
      const addresses = await addressService.getAllAddressByUserID(
        userID,
        limit,
        skip
      );
      return res.send({
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalAddresses,
        addresses: addresses,
      });
    } else {
      const addresses = await addressService.getAllAddressByUserID(userID);
      return res.send({
        addresses
      });
    }
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy tất cả địa chỉ"));
  }
};

exports.findOne = async (req, res, next) => {
  let address = [];
  try {
    const userID = req.user ? req.user.id : null;
    if (!userID) {
      return next(new ApiError(400, "Vui lòng đăng nhập"));
    }
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
    const userID = req.user ? req.user.id : null;
    if (!userID) {
      return next(new ApiError(400, "Vui lòng đăng nhập"));
    }
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
    const userID = req.user ? req.user.id : null;
    if (!userID) {
      return next(new ApiError(400, "Vui lòng đăng nhập"));
    }
    const address = await addressService.deleteAddress(addressID, userID);
    return res.send({
      message: "Xóa thành công địa chỉ",
      address,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi xóa địa chỉ"));
  }
};
