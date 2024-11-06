const moment = require("moment-timezone");
const ApiError = require("../api-error");
const voucherService = require("../services/vouchers/voucher.service");
const voucherCategoryService = require("../services/vouchers/voucherCategory.service");
const voucherUsedsService = require("../services/vouchers/voucherUseds.service");
const validation = require("../middlewares/validateVoucher.middleware");
const cartService = require("../services/cart.service");
const format = require("../utils/formatPrice.utils");
const cron = require("node-cron");

const checkExpiredVouchers = async (req, res, next) => {
  try {
    const userID = req.user ? req.user.id : null;
    let voucherUseds = [];

    if (!userID) {
      return next(new ApiError(400, "Vui lòng đăng nhập"));
    }

    // Lấy ngày hiện tại
    const currentDate = moment().tz("Asia/Ho_Chi_Minh").startOf("day");

    voucherUseds = await voucherUsedsService.getAllVoucherUseds({
      userID: userID,
      isUsed: false,
    });

    // Lọc voucher hết hạn trong cùng ngày
    const expiredVouchers = voucherUseds.filter((voucherUsed) => {
      const endDate = moment(voucherUsed.voucherID.endDate)
        .tz("Asia/Ho_Chi_Minh")
        .startOf("day"); // Ngày hết hạn voucher
      return endDate.isSame(currentDate, "day"); // Kiểm tra xem ngày hết hạn có cùng ngày với ngày hiện tại
    });

    if (expiredVouchers.length > 0) {
      // Lấy io từ app và phát thông báo đến admin
      const io = require("../../../app").get("socketIo");
      io.emit("voucherExpire", {
        message: "Có voucher đã hết hạn trong hôm nay.",
        expiredVouchers: expiredVouchers,
      });
      return res.send({
        message: "Có voucher đã hết hạn trong hôm nay.",
        expiredVouchers: expiredVouchers, // Gửi danh sách voucher đã hết hạn cho người dùng
      });
    }
    return res.send({
      message: "Tất cả các voucher còn hiệu lực.",
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi check thời gian hết hạn"));
  }
};

// Thiết lập cron job để kiểm tra mỗi giờ (có thể thay đổi tần suất theo nhu cầu)
cron.schedule("0 * * * *", () => {
  console.log("Đang kiểm tra voucher hết hạn...");
  checkExpiredVouchers();
});
