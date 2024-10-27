const Order = require("../models/order.model");
const { ObjectId } = require("mongodb");
const axios = require("axios"); // npm install axios
const CryptoJS = require("crypto-js"); // npm install crypto-js
const moment = require("moment"); // npm install moment
const config = require("../config/index");
const voucherUsedsService = require("../services/vouchers/voucherUseds.service");
const voucherService = require("../services/vouchers/voucher.service");

const create = async (orderData) => {
  const newOrder = new Order(orderData);
  return newOrder.save();
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

const getAllOrdersByAdmin = async () => {
  return await Order.find({})
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

const updateStatus = async (orderID, status) => {
  const order = await Order.findById(orderID);
  order.status = status;
  order.updatedAt = moment.tz("Asia/Ho_Chi_Minh").toDate();
  await order.save();
  return order;
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
  }

  return { statusOptions, statusFormat, statusFullOptions };
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
};
