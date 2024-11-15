const moment = require("moment-timezone");
const ApiError = require("../../api-error");
const voucherService = require("../../services/vouchers/voucher.service");
const voucherCategoryService = require("../../services/vouchers/voucherCategory.service");
const voucherUsedsService = require("../../services/vouchers/voucherUseds.service");
const validation = require("../../middlewares/validateVoucher.middleware");
const cartService = require("../../services/cart.service");
const format = require("../../utils/formatPrice.utils");

exports.findAllVouchers = async (req, res, next) => {
  const userID = req.user ? req.user.id : null;
  let vouchersWithLogin = [];
  let isCollected = false;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;
  const skip = (page - 1) * limit;
  const currentDate = moment().tz("Asia/Ho_Chi_Minh").toDate();

  try {
    // Lấy tổng số mã giảm giá
    const totalVouchers = await voucherService.countAllVouchers({
      isDeleted: false,
    });
    const totalPages = Math.ceil(totalVouchers / limit);
    let vouchers = await voucherService.getAllVouchers(
      { isDeleted: false },
      skip,
      limit
    );

    if (userID) {
      await Promise.all(
        vouchers.map(async (voucher) => {
          const voucherUsedExist = await voucherUsedsService.getOneVoucherUsed({
            userID: userID,
            voucherID: voucher._id,
            isDeleted: false
          });
          // Check đã sử dụng voucher chưa
          const isUsedVoucher = voucherUsedExist
            ? voucherUsedExist.isUsed
            : false;
          // Đã thu thập voucher chưa
          isCollected = voucherUsedExist ? true : false;
          // Tính phần trăm số lượng đã được sử dụng
          const usedPercentage =
            voucherService.calculateUsedPercentage(voucher);
          // Kiểm tra nếu voucher đã hết hạn
          const endDate = moment(voucher.endDate)
            .tz("Asia/Ho_Chi_Minh")
            .toDate();
          const isExpired = endDate < currentDate;

          const vouhcerData = {
            ...voucher._doc,
            isCollected, // Đặt là true nếu người dùng đã lấy voucher này rồi
            isUsed: isUsedVoucher, // Nếu đã sử dụng rồi thì đặt là true
            usedPercentage: parseFloat(usedPercentage.toFixed(1)),
            isExpired, // Đặt là true nếu voucher đã hết hạn
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
      // Kiểm tra nếu voucher đã hết hạn
      const endDate = moment(voucher.endDate).tz("Asia/Ho_Chi_Minh").toDate();
      const isExpired = endDate < currentDate;
      return {
        ...voucher._doc,
        usedPercentage: parseFloat(usedPercentage.toFixed(1)),
        isExpired, // Đặt là true nếu voucher đã hết hạn
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
    let paginatedVouchers = [];
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
      isDeleted: false,
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
        .endOf("day")
        .toDate(); // Chuyển đổi endDate sang đối tượng Date
      return endDate >= currentDate; // Kiểm tra xem endDate có lớn hơn hoặc bằng currentDate không
    });
    // Phân trang
    if (Object.keys(req.query).length !== 0) {
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
    let totalPriceOrder = 0;
    if (!userID) {
      return next(new ApiError(400, "Vui lòng đăng nhập"));
    }
    // Check giỏ hàng có sản phẩm đã check chưa
    const cart = await cartService.getCartByUserID(userID);
    if (!cart) {
      return next(new ApiError(404, "Không tìm thấy giỏ hàng"));
    }
    const isExistBookIsCheckOut = cart.books.some((book) => book.isCheckOut);

    // Check số lượng voucher
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
      // Check đã chọn sản phẩm nào chưa
      if (!isExistBookIsCheckOut) {
        return next(
          new ApiError(400, "Vui lòng chọn sản phẩm để sử dụng mã giảm giá")
        );
      }

      // Check Date hết hạn mã giảm giá
      try {
        validation.voucherDateValidation(currentVoucher);
      } catch (error) {
        return next(new ApiError(400, error.message));
      }
      // Check Min Price
      const cart = await cartService.getCartByUserID(userID);
      const cartBooksIscheckOut = cart.books.filter((book) => book.isCheckOut);
      totalPriceOrder = cartBooksIscheckOut.reduce(
        (total, book) => total + book.quantity * book.price,
        0
      );
      const addNeedPrice =
        totalPriceOrder - currentVoucher.voucherCategoryID.minValue;
      if (addNeedPrice < 0) {
        return next(
          new ApiError(
            400,
            `Vui lòng mua thêm ${format.formatPrice(
              -addNeedPrice
            )} để sử dụng mã giảm giá`
          )
        );
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

exports.checkExpiredVouchers = async (req, res, next) => {
  try {
    const userID = req.user ? req.user.id : null;
    let voucherUseds = [];
    let sameDayExpiredVouchers = []; // Voucher hết hạn trong ngày
    let upcomingExpiredVouchers = []; // Vouchẻ hết hạn 2 ngày sắp tới
    if (!userID) {
      return next(new ApiError(400, "Vui lòng đăng nhập"));
    }

    // Lấy ngày hiện tại
    const currentDate = moment().tz("Asia/Ho_Chi_Minh").startOf("day");
    const twoDaysLater = moment()
      .tz("Asia/Ho_Chi_Minh")
      .add(2, "days")
      .endOf("day");

    voucherUseds = await voucherUsedsService.getAllVoucherUseds({
      userID: userID,
      isUsed: false,
    });
    // Lọc voucher hết hạn trong cùng ngày
    voucherUseds.forEach((voucherUsed) => {
      const endDate = moment(voucherUsed.voucherID.endDate)
        .tz("Asia/Ho_Chi_Minh")
        .endOf("day");

      // Kiểm tra nếu voucher hết hạn trong ngày hiện tại
      if (endDate.isSame(currentDate, "day")) {
        sameDayExpiredVouchers.push(voucherUsed);
      }
      // Kiểm tra nếu voucher hết hạn trong khoảng từ ngày mai đến hai ngày sau
      else if (endDate.isBetween(currentDate, twoDaysLater, "day", "[]")) {
        // [] giới hạn phạm vi bao gồm ngày hiện tại currentDate
        upcomingExpiredVouchers.push(voucherUsed);
      }
    });
    if (
      sameDayExpiredVouchers.length > 0 ||
      upcomingExpiredVouchers.length > 0
    ) {
      return res.send({
        message: "Danh sách các voucher đã hết hạn hoặc sắp hết hạn.",
        sameDayExpiredVouchers: sameDayExpiredVouchers,
        upcomingExpiredVouchers: upcomingExpiredVouchers,
      });
    }
    return res.send({
      message: "Tất cả các voucher còn hiệu lực.",
      sameDayExpiredVouchers: [],
      upcomingExpiredVouchers: [],
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi check thời gian hết hạn"));
  }
};
