const moment = require("moment-timezone");
const ApiError = require("../../api-error");
const voucherService = require("../../services/vouchers/voucher.service");
const voucherCategoryService = require("../../services/vouchers/voucherCategory.service");
const voucherUsedsService = require("../../services/vouchers/voucherUseds.service");
const validation = require("../../middlewares/validateVoucher.middleware");

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
    req.body.createdAt = moment.tz("Asia/Ho_Chi_Minh");
    req.body.updatedAt = moment.tz("Asia/Ho_Chi_Minh");
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
    let voucherUseds = [];
    let page = 1;
    let limit = 0;
    let skip = 0;
    if (Object.keys(req.query).length !== 0) {
      page = parseInt(req.query.page) || 1;
      limit = parseInt(req.query.limit) || 4;
      skip = (page - 1) * limit;
    }

    if (!userID) {
      return next(new ApiError(400, "Vui lòng đăng nhập"));
    }

    // Lấy ngày hiện tại
    const currentDate = moment().tz("Asia/Ho_Chi_Minh").toDate();

    voucherUseds = await voucherUsedsService.getAllVoucherUseds({
      userID: userID,
      isUsed: false,
    });
    // Thêm % sử dụng voucher
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
    // Lọc voucher hết hạn
    const validVouchers = voucherUseds.filter((voucherUsed) => {
      const endDate = moment(voucherUsed.voucherID.endDate)
        .tz("Asia/Ho_Chi_Minh")
        .toDate(); // Chuyển đổi endDate sang đối tượng Date
      return endDate >= currentDate; // Kiểm tra xem endDate có lớn hơn hoặc bằng currentDate không
    });
    // Phân trang
    let paginatedVouchers = [];
    if (Object.keys(req.query).length !== 0) {
      // Phân trang trên validVouchers
      paginatedVouchers = validVouchers.slice(skip, skip + limit);
    } else {
      paginatedVouchers = validVouchers;
    }
    const totalVouchersUsed = validVouchers.length;
    const totalPages = Math.ceil(totalVouchersUsed / limit);

    return res.send({
      currentPage: page,
      totalPages: totalPages,
      totalVouchersUsed: totalVouchersUsed,
      vouchers: paginatedVouchers,
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
      try {
        validation.voucherDateValidation(currentVoucher);
      } catch (error) {
        return next(new ApiError(400, error.message));
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
