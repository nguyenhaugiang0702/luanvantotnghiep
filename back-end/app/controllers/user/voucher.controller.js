const moment = require("moment-timezone");
const ApiError = require("../../api-error");
const voucherService = require("../../services/vouchers/voucher.service");
const voucherCategoryService = require("../../services/vouchers/voucherCategory.service");
const voucherUsedsService = require("../../services/vouchers/voucherUseds.service");

exports.findAllVouchers = async (req, res, next) => {
  const userID = req.user ? req.user.id : null;
  let vouchersWithLogin = [];
  let isCollected = false;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;
  const skip = (page - 1) * limit;
  try {
    // Lấy tổng số mã giảm giá
    const totalVouchers = await voucherService.countAllVouchers();
    const totalPages = Math.ceil(totalVouchers / limit);
    let vouchers = await voucherService.getAllVouchers({}, skip, limit);

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
          // Tính phần trăm số lượng đã được sử dụng
          const usedPercentage =
            voucherService.calculateUsedPercentage(voucher);
          const vouhcerData = {
            ...voucher._doc,
            isCollected, // Đặt là true nếu người dùng đã lấy voucher này rồi
            isUsed: isUsedVoucher, // Nếu đã sử dụng rồi thì đặt là true
            usedPercentage: parseFloat(usedPercentage.toFixed(1)),
          };
          vouchersWithLogin.push(vouhcerData);
        })
      );
      console.log(vouchers);
      return res.send({
        currentPage: page,
        totalPages: totalPages,
        totalVouchers: totalVouchers,
        vouchers: vouchersWithLogin,
      });
    }
    // Tính phần trăm sử dụng cho mỗi voucher
    vouchers = vouchers.map((voucher) => {
      // Tính phần trăm số lượng đã được sử dụng
      const usedPercentage = voucherService.calculateUsedPercentage(voucher);
      return {
        ...voucher._doc,
        usedPercentage: parseFloat(usedPercentage.toFixed(1)),
      };
    });

    return res.send({
      currentPage: page,
      totalPages: totalPages,
      totalVouchers: totalVouchers,
      vouchers: vouchers,
    });
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    if (!userID) {
      return next(new ApiError(400, "Vui lòng đăng nhập"));
    }
    const totalVouchersUsed = await voucherUsedsService.countAllVouchersUsed({
      userID: userID,
      isUsed: false,
    });
    const totalPages = Math.ceil(totalVouchersUsed / limit);
    let voucherUseds = await voucherUsedsService.getAllVoucherUseds(
      {
        userID: userID,
        isUsed: false,
      },
      skip,
      limit
    );
    voucherUseds = voucherUseds.map((voucherUsed) => {
      let voucher = voucherUsed.voucherID;
      const usedPercentage = voucherService.calculateUsedPercentage(voucher);
      return {
        ...voucherUsed._doc,
        voucherID: {
          ...voucher._doc,
          usedPercentage: parseFloat(usedPercentage.toFixed(1)), // Thêm usedPercentage vào voucherID
        },
      };
    });
    return res.send({
      currentPage: page,
      totalPages: totalPages,
      totalVouchersUsed: totalVouchersUsed,
      vouchers: voucherUseds,
    });
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
    if (
      currentVoucher &&
      currentVoucher.quantityUsed === currentVoucher.quantity
    ) {
      return next(
        new ApiError(400, "Rất tiếc, số lượng mã giảm giá này đã hết")
      );
    }

    if (method === "SELECT") {
      // Check Date
      const currentDateString = moment()
        .tz("Asia/Ho_Chi_Minh")
        .format("DD/MM/YYYY");
      const currentDate = moment(currentDateString, "DD/MM/YYYY").tz(
        "Asia/Ho_Chi_Minh"
      );
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
