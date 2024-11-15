const moment = require("moment-timezone");
const ApiError = require("../../api-error");
const bookService = require("../../services/book.service");
const Order = require("../../models/order.model");
const Receipt = require("../../models/receipt.model");
const orderService = require("../../services/order.service");
const mongoose = require("mongoose");

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
    if (!startDate || !endDate) {
      return next(
        new ApiError(400, "Thiếu thông tin ngày bắt đầu hoặc kết thúc")
      );
    }

    const start = moment
      .tz(startDate, "DD/MM/YYYY", "Asia/Ho_Chi_Minh")
      .startOf("day")
      .toDate();
    const end = moment
      .tz(endDate, "DD/MM/YYYY", "Asia/Ho_Chi_Minh")
      .endOf("day")
      .toDate();

    // Lấy ra các đơn hàng đã giao (status : 8)
    const matchCondition = {
      $and: [
        { status: { $gte: 2 } }, // Lấy các status > 2
        { status: { $nin: [3, 4, 7] } }, // Loại bỏ status 3, 4, và 7
      ],
      createdAt: {
        $gte: start,
        $lte: end,
      },
    };

    let groupBy;
    switch (type) {
      case "day":
        groupBy = { $dateToString: { format: "%d/%m/%Y", date: "$createdAt" } };
        break;
      case "month":
        groupBy = { $dateToString: { format: "%m/%Y", date: "$createdAt" } };
        break;
      default:
        return next(new ApiError(400, "Loại thống kê không hợp lệ"));
    }

    const stats = await orderService.getOrderStats(matchCondition, groupBy);
    
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

    const avgRevenue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
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

exports.calculateProductProfit = async (req, res, next) => {
  try {
    const { bookID, type, startDate, endDate } = req.body;

    const start = moment.tz(startDate, "DD/MM/YYYY", "Asia/Ho_Chi_Minh").startOf("day").toDate();
    const end = moment.tz(endDate, "DD/MM/YYYY", "Asia/Ho_Chi_Minh").endOf("day").toDate();

    if (!start || !end) {
      return next(new ApiError(400, "Thiếu thông tin ngày bắt đầu hoặc kết thúc."));
    }

    const matchCondition = {
      createdAt: { $gte: start, $lte: end },
      status: 8,
    };

    if (bookID) {
      if (!mongoose.Types.ObjectId.isValid(bookID)) {
        return next(new ApiError(400, "bookID không hợp lệ."));
      }
      matchCondition["detail.bookID"] = new mongoose.Types.ObjectId(bookID);
    }

    const groupBy = { $dateToString: { format: "%m/%Y", date: "$createdAt" } };

    const orders = await Order.aggregate([
      { $unwind: "$detail" },
      { $match: matchCondition },
      {
        $group: {
          _id: {
            group: groupBy,
            bookID: "$detail.bookID",
          },
          totalQuantitySold: { $sum: "$detail.quantity" },
          totalRevenue: { $sum: { $multiply: ["$detail.quantity", "$detail.realPrice"] } },
        },
      },
    ]);

    if (orders.length === 0) {
      return res.send({
        success: true,
        data: [],
        totalRevenue: 0,
        avgRevenue: 0,
        maxRevenue: 0,
        totalProfit: 0,
        avgProfit: 0,
        maxProfit: 0,
      });
    }

    const resultByMonth = {};
    let totalRevenue = 0;
    let totalProfit = 0;
    let maxRevenue = 0;
    let maxProfit = 0;
    let totalMonths = 0;

    for (const order of orders) {
      const bookID = order._id.bookID;
      const timeGroup = order._id.group;

      const receipts = await Receipt.aggregate([
        { $unwind: "$detail" },
        { $match: { "detail.bookID": new mongoose.Types.ObjectId(bookID) } },
        { $sort: { createdAt: 1 } },
        {
          $group: {
            _id: "$detail.bookID",
            stocks: {
              $push: { quantity: "$detail.quantity", price: "$detail.price" },
            },
          },
        },
      ]);

      if (receipts.length === 0) continue;

      const stocks = receipts[0].stocks;
      let remainingQuantity = order.totalQuantitySold;
      let cost = 0;

      for (const stock of stocks) {
        if (remainingQuantity <= 0) break;
        const usedQuantity = Math.min(stock.quantity, remainingQuantity);
        cost += usedQuantity * stock.price;
        remainingQuantity -= usedQuantity;
      }

      if (remainingQuantity > 0) {
        continue;
      }

      const profit = order.totalRevenue - cost;

      if (!resultByMonth[timeGroup]) {
        resultByMonth[timeGroup] = {
          time: timeGroup,
          books: [],
          totalRevenue: 0,
          totalCost: 0,
          totalProfit: 0,
        };
      }

      resultByMonth[timeGroup].books.push({
        bookID,
        totalQuantitySold: order.totalQuantitySold,
        totalRevenue: order.totalRevenue,
        totalCost: cost,
        profit,
      });

      resultByMonth[timeGroup].totalRevenue += order.totalRevenue;
      resultByMonth[timeGroup].totalCost += cost;
      resultByMonth[timeGroup].totalProfit += profit;

      totalRevenue += order.totalRevenue;
      totalProfit += profit;
      maxRevenue = Math.max(maxRevenue, resultByMonth[timeGroup].totalRevenue);
      maxProfit = Math.max(maxProfit, resultByMonth[timeGroup].totalProfit);
    }

    totalMonths = Object.keys(resultByMonth).length;
    const avgRevenue = totalMonths > 0 ? totalRevenue / totalMonths : 0;
    const avgProfit = totalMonths > 0 ? totalProfit / totalMonths : 0;

    const result = Object.values(resultByMonth);

    return res.send({
      success: true,
      data: result,
      totalRevenue,
      avgRevenue,
      maxRevenue,
      totalProfit,
      avgProfit,
      maxProfit,
    });
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, "Lỗi khi tính toán lợi nhuận."));
  }
};


