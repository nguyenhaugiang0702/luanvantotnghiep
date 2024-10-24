const moment = require("moment-timezone");
const ApiError = require("../../api-error");
const bookService = require("../../services/book.service");
const Order = require("../../models/order.model");
exports.findAllStockBooks = async (req, res, next) => {
  let books = [];
  try {
    books = await bookService.getFullInfoAllBooks();
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy danh sách tồn kho"));
  }
  return res.send(books);
};

exports.findRevenueWithDate = async (req, res, next) => {
  const { type, startDate, endDate } = req.body;

  try {
    // Kiểm tra thông tin ngày bắt đầu và kết thúc
    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "Thiếu thông tin ngày bắt đầu hoặc kết thúc" });
    }

    // Chuyển đổi ngày từ string sang Date object
    const start = moment
      .tz(startDate, "DD/MM/YYYY", "Asia/Ho_Chi_Minh")
      .startOf("day")
      .toDate();
    const end = moment
      .tz(endDate, "DD/MM/YYYY", "Asia/Ho_Chi_Minh")
      .endOf("day")
      .toDate();

    // Điều kiện lọc theo ngày tạo đơn hàng
    const matchCondition = {
      createdAt: {
        $gte: start,
        $lte: end,
      },
    };

    // Group by theo loại thống kê (ngày, tháng)
    let groupBy;
    switch (type) {
      case "day":
        groupBy = { $dateToString: { format: "%d/%m/%Y", date: "$createdAt" } };
        break;
      case "month":
        groupBy = { $dateToString: { format: "%m/%Y", date: "$createdAt" } };
        break;
      default:
        return res.status(400).json({ message: "Loại thống kê không hợp lệ" });
    }

    // Sử dụng Aggregation để tính toán
    const stats = await Order.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: groupBy,
          totalOrders: { $sum: 1 }, // Tổng số đơn hàng
          totalRevenue: { $sum: "$totalPrice" }, // Tổng tiền
          avgRevenue: { $avg: "$totalPrice" }, // Doanh thu trung bình
          maxRevenue: { $max: "$totalPrice" }, // Doanh thu lớn nhất
          totalBooksSold: { $sum: "$totalQuantity" }, // Tổng số sách bán ra
        },
      },
      { $sort: { _id: 1 } }, // Sắp xếp theo ngày hoặc tháng
    ]);

    // Tính toán tổng doanh thu, doanh thu trung bình và doanh thu lớn nhất
    const totalRevenue = stats.reduce(
      (acc, item) => acc + item.totalRevenue,
      0
    );
    const totalOrders = stats.reduce((acc, item) => acc + item.totalOrders, 0);
    const totalBooksSold = stats.reduce(
      (acc, item) => acc + item.totalBooksSold,
      0
    );

    const avgRevenue = totalOrders > 0 ? totalRevenue / totalOrders : 0; // Đảm bảo tránh chia cho 0
    const maxRevenue =
      stats.length > 0 ? Math.max(...stats.map((item) => item.maxRevenue)) : 0;

    return res.send({
      totalRevenue,
      avgRevenue,
      maxRevenue,
      stats,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy thống kê daonh thu"));
  }
};
