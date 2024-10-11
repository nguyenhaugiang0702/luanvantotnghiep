const moment = require("moment-timezone");
const ApiError = require("../api-error");
const voucherService = require("../services/vouchers/voucher.service");
const voucherCategoryService = require("../services/vouchers/voucherCategory.service");
const voucherUsedsService = require("../services/vouchers/voucherUseds.service");
const { v4: uuidv4 } = require("uuid");

// Voucher Category
exports.createVoucherCategory = async (req, res, next) => {
  try {
    const { discountType, value, minValue, maxValue } = req.body;
    req.body.createdAt = moment.tz("Asia/Ho_Chi_Minh").toDate();
    req.body.updatedAt = moment.tz("Asia/Ho_Chi_Minh").toDate();
    if (discountType === "percent") {
      req.body.name = `Giảm ${value} %`;
    } else {
      req.body.name = `Giảm ${value} VND`;
    }
    const newVoucherCategory =
      await voucherCategoryService.createVoucherCategory(req.body);
    return res.send({
      message: "Thêm thể loại mã giảm giá thành công",
      newVoucherCategory,
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi thêm mới thể loại mã giảm giá"));
  }
};

exports.findAllVouchersCategory = async (req, res, next) => {
  try {
    const vouchersCategory =
      await voucherCategoryService.getAllVouchersCategory();
    return res.send(vouchersCategory);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi lấy tất cả thể loại mã giảm giá"));
  }
};

exports.updateVoucherCategory = async (req, res, next) => {
  const { voucherCategoryID } = req.params;
  try {
    const updateVouchersCategory =
      await voucherCategoryService.updateVouchersCategory(
        voucherCategoryID,
        req.body
      );
    return res.send({
      message: "Cập nhật thành công thể loại mã giảm giá",
      updateVouchersCategory,
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi cập nhật thể loại mã giảm giá"));
  }
};

// Voucher
exports.createVoucher = async (req, res, next) => {
  try {
    const { startDate, endDate, quantity, voucherCategoryID } = req.body;

    // Chuyển đổi startDate và endDate từ định dạng DD/MM/YYYY sang YYYY-MM-DD
    const parsedStartDate = moment(startDate, "DD/MM/YYYY")
      .tz("Asia/Ho_Chi_Minh")
      .toDate();
    const parsedEndDate = moment(endDate, "DD/MM/YYYY")
      .tz("Asia/Ho_Chi_Minh")
      .toDate();
    const voucherCode = `NHG-${uuidv4().slice(0, 8)}`;

    const voucherData = {
      createdAt: moment.tz("Asia/Ho_Chi_Minh").toDate(),
      updatedAt: moment.tz("Asia/Ho_Chi_Minh").toDate(),
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      quantity: quantity,
      voucherCategoryID: voucherCategoryID,
      code: voucherCode,
    };
    const newVoucher = await voucherService.createVoucher(voucherData);
    return res.send({
      message: "Thêm thể loại mã giảm giá thành công",
      newVoucher,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi thêm mới mã giảm giá"));
  }
};

exports.findAllVouchers = async (req, res, next) => {
  const userID = req.user ? req.user.id : null;
  let vouchersWithLogin = [];
  let isCollected = false;
  try {
    let vouchers = await voucherService.getAllVouchers();
    if (userID) {
      await Promise.all(
        vouchers.map(async (voucher) => {
          const voucherUsedExist = await voucherUsedsService.getOneVoucherUsed({
            userID: userID,
            voucherID: voucher._id,
          });
          const isUsedVoucher = voucherUsedExist
            ? voucherUsedExist.isUsed
            : false;
          isCollected = voucherUsedExist ? true : false;
          const vouhcerData = {
            ...voucher._doc,
            isCollected,
            isUsed: isUsedVoucher,
          };
          vouchersWithLogin.push(vouhcerData);
        })
      );
      return res.send(vouchersWithLogin);
    }

    return res.send(vouchers);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi lấy tất cả thể loại mã giảm giá"));
  }
};

exports.findAllVouchersWithLogin = async (req, res, next) => {
  try {
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi lấy tất cả thể loại mã giảm giá"));
  }
};

exports.updateVoucher = async (req, res, next) => {
  const { voucherID } = req.params;
  const { startDate, endDate, quantity, voucherCategoryID } = req.body;
  try {
    const parsedStartDate = moment(startDate, "DD/MM/YYYY")
      .tz("Asia/Ho_Chi_Minh")
      .toDate();
    const parsedEndDate = moment(endDate, "DD/MM/YYYY")
      .tz("Asia/Ho_Chi_Minh")
      .toDate();
    const voucherUpdateData = {
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      updatedAt: moment.tz("Asia/Ho_Chi_Minh").toDate(),
      quantity: quantity,
      voucherCategoryID: voucherCategoryID,
    };
    const updateVoucher = await voucherService.updateVoucher(
      voucherID,
      voucherUpdateData
    );
    return res.send({
      message: "Cập nhật thành công mã giảm giá",
      updateVoucher,
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi cập nhật mã giảm giá"));
  }
};

// VoucherUseds
exports.createVoucherUseds = async (req, res, next) => {
  try {
    const { voucherID } = req.body;
    const userID = req.user ? req.user.id : null;
    if (!userID) {
      return next(new ApiError(400, "Vui lòng đăng nhập"));
    }
    req.body.userID = userID;
    req.body.voucherID = voucherID;
    req.body.createdAt = moment.tz("Asia/Ho_Chi_Minh").toDate();
    req.body.updatedAt = moment.tz("Asia/Ho_Chi_Minh").toDate();
    const newVoucherUseds = await voucherUsedsService.createVoucherUseds(
      req.body
    );
    // Trừ số lượng mã giảm giá
    const voucher = await voucherService.getVoucherByID(voucherID);
    await voucherService.updateVoucher(voucherID, {
      quantity: voucher.quantity - 1,
    });

    return res.send({
      message: "Lấy thành công mã giảm giá",
      newVoucherUseds,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy mã giảm giá"));
  }
};

exports.findAllVoucherUseds = async (req, res, next) => {
  try {
    const userID = req.user ? req.user.id : null;
    if (!userID) {
      return next(new ApiError(400, "Vui lòng đăng nhập"));
    }
    const vouchers = await voucherUsedsService.getAllVoucherUseds({
      userID: userID,
      isUsed: false,
    });
    return res.send(vouchers);
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, "Lỗi khi lấy tất cả mã giảm giá của người dùng")
    );
  }
};

exports.updateVoucherUseds = async (req, res, next) => {
  try {
    let updateVoucherUsed;
    const { voucherUsedID } = req.params;
    const { method, voucherID, isApplied } = req.body;
    const userID = req.user ? req.user.id : null;
    if (!userID) {
      return next(new ApiError(400, "Vui lòng đăng nhập"));
    }

    const currentVoucher = await voucherService.getVoucherByID(voucherID);
    if (currentVoucher && currentVoucher.quantity <= 0) {
      return next(new ApiError(400, "Vui lòng sử dụng mã giảm giá khác"));
    }

    if (method === "SELECT") {
      // Chọn mã giảm giá
      await voucherUsedsService.updateMany(
        // Set các mã khác là false nếu có mã được chọn
        { userID: userID, _id: { $ne: voucherUsedID } },
        { isApplied: false }
      );
      updateVoucherUsed = await voucherUsedsService.updateVoucherUseds(
        // Cập nhật là mã đã chọn thành true
        voucherUsedID,
        { isApplied: isApplied }
      );
    } else {
      // method = UNSELECT : Bỏ chọn mã giảm giá
      updateVoucherUsed = await voucherUsedsService.updateVoucherUseds(
        voucherUsedID,
        { isApplied: isApplied }
      );
    }

    return res.send({
      message: "Đã cập nhật chọn mã giảm giá",
      updateVoucherUsed,
    });
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, "Lỗi khi lấy tất cả mã giảm giá của người dùng")
    );
  }
};
