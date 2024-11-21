const Order = require("../models/order.model");
const { ObjectId } = require("mongodb");
const axios = require("axios"); // npm install axios
const CryptoJS = require("crypto-js"); // npm install crypto-js
const moment = require("moment"); // npm install moment
const config = require("../config/index");
const voucherUsedsService = require("../services/vouchers/voucherUseds.service");
const voucherService = require("../services/vouchers/voucher.service");
const { ordersValidation } = require("../middlewares/validateOrder.middelware");

const create = async (orderData) => {
  console.log("Order data before saving:", orderData);
  const newOrder = new Order(orderData);
  const savedOrder = await newOrder.save();
  console.log("Order saved:", savedOrder);
  return savedOrder;
};
const createOrder = async (orderData) => {
  const newOrder = await create(orderData);
  // Kiểm tra và cập nhật mã giảm giá nếu có
  if (newOrder.voucherID) {
    const voucherUsed = await voucherUsedsService.getOneVoucherUsed({
      userID: orderData.userID, // Truyền userID từ orderData
      voucherID: newOrder.voucherID,
    });

    if (!voucherUsed) {
      throw new ApiError(400, "Lỗi khi áp dụng mã giảm giá");
    }

    // Cập nhật isUsed: true nếu đã sử dụng mã giảm giá
    await voucherUsedsService.updateVoucherUseds(voucherUsed._id, {
      isUsed: true,
    });

    // Tăng số lương sử dụng mã giảm giá của mã phía trên
    const voucher = await voucherService.getVoucherByID(newOrder.voucherID);
    let quantityUsedUpdate = voucher.quantityUsed;
    quantityUsedUpdate += 1;

    await voucherService.updateVoucher(newOrder.voucherID, {
      quantityUsed: quantityUsedUpdate,
    });
  }
  // Lấy io từ app và phát thông báo đến admin
  const io = require("../../app").get("socketIo");
  io.emit("hasNewMessage", {
    order: {
      message: "Có đơn hàng mới",
      newOrder: newOrder,
    },
  });

  return newOrder;
};

const getOrderByID = async (orderID) => {
  return await Order.findById(orderID)
    .populate({
      path: "detail.bookID",
      populate: [
        { path: "categoryID", select: "name" },
        { path: "formalityID", select: "name" },
        { path: "publisherID", select: "name" },
      ],
    })
    .populate("userID")
    .populate("addressID")
    .populate({
      path: "voucherID",
      populate: {
        path: "voucherCategoryID",
      },
    });
};

const getAllOrdersByAdmin = async (query) => {
  return await Order.find(query)
    .populate({
      path: "detail.bookID",
      populate: [
        { path: "categoryID", select: "name" },
        { path: "formalityID", select: "name" },
        { path: "publisherID", select: "name" },
      ],
    })
    .populate("userID")
    .populate("voucherID")
    .populate("addressID")
    .sort({ createdAt: -1 });
};

const getOrderByIDAndUserID = async (orderID, userID) => {
  return await Order.findOne({ _id: orderID, userID: userID })
    .populate({
      path: "detail.bookID",
      populate: [
        { path: "categoryID", select: "name" },
        { path: "formalityID", select: "name" },
        { path: "publisherID", select: "name" },
      ],
    })
    .populate("userID")
    .populate("addressID")
    .populate({
      path: "voucherID",
      populate: {
        path: "voucherCategoryID",
      },
    });
};

const getOrdersByUserID = async (query, skip, limit) => {
  const orders = await Order.find(query)
    .populate({
      path: "detail.bookID",
      populate: [
        { path: "categoryID", select: "name" },
        { path: "formalityID", select: "name" },
        { path: "publisherID", select: "name" },
      ],
    })
    .populate("userID", "name") // Nếu muốn lấy thêm thông tin user
    .populate("addressID") // Populate address nếu cần
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate({
      path: "voucherID",
      populate: {
        path: "voucherCategoryID",
      },
    });
  return orders;
};

const deleteOrderByID = async (orderID) => {
  return await Order.findByIdAndDelete(orderID);
};

const updateWasPaidedOrderByID = async (orderID) => {
  return await Order.findByIdAndUpdate(
    orderID,
    { $set: { wasPaided: true } },
    { new: true }
  );
};

const updateOrderById = async (orderId, updateData) => {
  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    { $set: updateData },
    { new: true }
  );
  return updatedOrder;
};

const updateStatus = async (orderID, updateData) => {
  return await Order.findByIdAndUpdate(orderID, updateData, { new: true });
};

const hasUserPurchasedBook = async (userID, bookID) => {
  const order = await Order.findOne({
    userID: userID,
    "detail.bookID": bookID,
  });
  return order ? true : false;
};

const countDocumentsOrders = async (query) => {
  return await Order.countDocuments(query);
};

const countOrdersByMonth = async (year) => {
  const monthlyOrders = [];

  // Lặp qua từng tháng (1 đến 12)
  for (let month = 0; month < 12; month++) {
    // Tính ngày bắt đầu và ngày kết thúc của tháng
    const startOfMonth = new Date(year, month, 1); // Ngày 1 của tháng
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59); // Ngày cuối cùng của tháng

    // Đếm số lượng đơn hàng trong tháng
    const totalOrders = await Order.countDocuments({
      createdAt: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
    });

    // Thêm kết quả vào mảng monthlyOrders
    monthlyOrders.push(totalOrders);
  }

  return monthlyOrders; // Trả về mảng chứa số lượng đơn hàng của từng tháng
};

const getStatusOptionsAndFormat = (status) => {
  let statusOptions = [];
  let statusFormat = {};
  // Danh sách đầy đủ các trạng thái
  const statusFullOptions = [
    { value: 1, label: "Đang nhờ xác nhận" },
    { value: 2, label: "Đã xác nhận" },
    { value: 3, label: "Đã hủy" },
    { value: 4, label: "Yêu cầu hủy" },
    { value: 5, label: "Đã lấy hàng" },
    { value: 6, label: "Đang giao" },
    { value: 7, label: "Giao hàng không thành công" },
    { value: 8, label: "Đã giao" },
    { value: 9, label: "Hoàn tất" },
  ];
  switch (status) {
    case 1:
      statusOptions.push(
        { value: 1, label: "Đang nhờ xác nhận" },
        { value: 2, label: "Đã xác nhận" }
      );
      statusFormat = {
        value: 1,
        label: "Đang nhờ xác nhận",
      };
      break;
    case 2:
      statusOptions.push({
        value: 2,
        label: "Đã xác nhận",
      });
      statusFormat = {
        value: 2,
        label: "Đã xác nhận",
      };
      break;
    case 3:
      statusOptions.push({
        value: 3,
        label: "Đã hủy",
      });
      statusFormat = {
        value: 3,
        label: "Đã hủy",
      };
      break;
    case 4:
      statusOptions.push(
        { value: 4, label: "Yêu cầu hủy" },
        { value: 3, label: "Đã hủy" }
      );
      statusFormat = {
        value: 4,
        label: "Yêu cầu hủy",
      };
      break;
    case 5:
      statusOptions.push({ value: 5, label: "Đã lấy hàng" });
      statusFormat = {
        value: 5,
        label: "Đã lấy hàng",
      };
      break;
    case 6:
      statusOptions.push({ value: 6, label: "Đang giao" });
      statusFormat = {
        value: 6,
        label: "Đang giao",
      };
      break;
    case 7:
      statusOptions.push({ value: 7, label: "Giao hàng không thành công" });
      statusFormat = {
        value: 7,
        label: "Giao hàng không thành công",
      };
      break;
    case 8:
      statusOptions.push({ value: 8, label: "Đã giao" });
      statusFormat = {
        value: 8,
        label: "Đã giao",
      };
      break;
    case 9:
      statusOptions.push({ value: 9, label: "Hoàn tất" });
      statusFormat = {
        value: 9,
        label: "Hoàn tất",
      };
      break;
  }

  return { statusOptions, statusFormat, statusFullOptions };
};

const getOrderStats = async (matchCondition, groupBy) => {
  try {
    const stats = await Order.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: groupBy,
          totalOrders: { $sum: 1 }, // Tổng số đơn hàng
          totalRevenue: { $sum: "$totalPrice" }, // Tổng doanh thu
          avgRevenue: { $avg: "$totalPrice" }, // Doanh thu trung bình
          maxRevenue: { $max: "$totalPrice" }, // Doanh thu cao nhất
          totalBooksSold: { $sum: "$totalQuantity" }, // Tổng sách đã bán
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return stats;
  } catch (error) {
    throw new Error(`Lỗi khi tính toán thống kê: ${error.message}`);
  }
};

module.exports = {
  createOrder,
  deleteOrderByID,
  updateWasPaidedOrderByID,
  getOrderByID,
  getOrdersByUserID,
  updateStatus,
  getOrderByIDAndUserID,
  getAllOrdersByAdmin,
  updateOrderById,
  hasUserPurchasedBook,
  countDocumentsOrders,
  countOrdersByMonth,
  getStatusOptionsAndFormat,
  getOrderStats,
};
