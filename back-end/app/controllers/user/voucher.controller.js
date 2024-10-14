const moment = require("moment-timezone");
const ApiError = require("../../api-error");
const voucherService = require("../../services/vouchers/voucher.service");
const voucherCategoryService = require("../../services/vouchers/voucherCategory.service");
const voucherUsedsService = require("../../services/vouchers/voucherUseds.service");

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
      return next(
        new ApiError(400, "Rất tiếc, số lượng mã giảm giá này đã hết")
      );
    }

    if (method === "SELECT") {
      // Check Date
      const currentDateString = moment().tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY");
      const currentDate = moment(currentDateString, "DD/MM/YYYY").tz("Asia/Ho_Chi_Minh");
      const parsedStartDate = moment(currentVoucher.startDate, "DD/MM/YYYY").tz(
        "Asia/Ho_Chi_Minh"
      );
      const parsedEndDate = moment(currentVoucher.endDate, "DD/MM/YYYY").tz(
        "Asia/Ho_Chi_Minh"
      );
      // Kiểm tra nếu currentDate trước parsedStartDate
      if (currentDate.isBefore(parsedStartDate)) {
        return next(new ApiError(400, "Mã giảm giá này chưa có hiệu lực"));
      }

      // Kiểm tra nếu currentDate sau parsedEndDate
      if (currentDate.isAfter(parsedEndDate)) {
        return next(new ApiError(400, "Mã giảm giá đã hết hạn"));
      }
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
