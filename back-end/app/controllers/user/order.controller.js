const orderService = require("../../services/order.service");
const cartService = require("../../services/cart.service");
const bookService = require("../../services/book.service");
const voucherUsedsService = require("../../services/vouchers/voucherUseds.service");
const voucherService = require("../../services/vouchers/voucher.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../../config/index");
const moment = require("moment-timezone");
const ApiError = require("../../api-error");
const axios = require("axios");

exports.create = async (req, res, next) => {
  try {
    const userID = req.user ? req.user.id : null;
    if (!userID) {
      return next(new ApiError(400, "Vui lòng đăng nhập"));
    }
    req.body.userID = userID;
    req.body.createdAt = moment.tz("Asia/Ho_Chi_Minh");
    req.body.updatedAt = moment.tz("Asia/Ho_Chi_Minh");
    const newOrder = await orderService.createOrder(req.body);
    if (!newOrder) {
      return next(new ApiError(400, "Lỗi khi đặt hàng!"));
    }
    // Xóa sách khỏi giỏ hàng
    const updatedCart = await cartService.deleteBookFromCartWhenCheckOut(
      userID
    );
    if (!updatedCart) {
      return next(new ApiError(400, "Lỗi khi cập nhật giỏ hàng!"));
    }
    // Tính lại tổng giá của giỏ hàng
    await cartService.calculateTotalPriceWhenCheckOut(userID);
    // Xóa mã giảm giá nếu đã sử dụng để đặt hàng
    if (newOrder.voucherID) {
      const voucherUsed = await voucherUsedsService.getOneVoucherUsed({
        userID: userID,
        voucherID: newOrder.voucherID,
      });
      if (!voucherUsed) {
        return next(new ApiError(400, "Lỗi khi áp dụng mã giảm giá"));
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

    return res.send({
      message: "Đặt hàng thành công",
      newOrder,
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi đặt hàng!"));
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const userID = req.user ? req.user.id : null;
    if (!userID) {
      return next(new ApiError(400, "Vui lòng đăng nhập"));
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const skip = (page - 1) * limit;
    const status = req.query.status || "all"; // all, pending, accepted, cancelled, request-cancel

    const query = { userID: userID };
    const statusMap = {
      all: {},
      pending: { status: 1 },
      accepted: { status: 2 },
      cancelled: { status: 3 },
      "request-cancel": { status: 4 },
    };
    if (status !== "all") {
      query.status = statusMap[status].status;
    }
    // Đếm tổng đơn hàng cho từng trạng thái
    const totalOrdersByStatus = await Promise.all(
      Object.keys(statusMap).map(async (key) => {
        const count = await orderService.countDocumentsOrders({
          userID: userID,
          ...statusMap[key],
        });
        return { status: key, count };
      })
    );
    // Phân trang
    const totalOrders = await orderService.countDocumentsOrders(query);
    const totalPages = Math.ceil(totalOrders / limit);
    const orders = await orderService.getOrdersByUserID(query, skip, limit);
    return res.send({
      orders,
      totalOrders,
      totalPages,
      currentPage: page,
      totalOrdersByStatus,
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi đặt hàng!"));
  }
};

exports.updateStatus = async (req, res, next) => {
  const userID = req.user ? req.user.id : null;
  if (!userID) {
    return next(new ApiError(400, "Vui lòng đăng nhập"));
  }
  const orderID = req.params.orderID;
  const { status } = req.body;
  try {
    const orderUpdateStatus = await orderService.updateStatus(orderID, status);
    if (!orderUpdateStatus) {
      return next(new ApiError(400, "Lỗi khi hủy đơn hàng!"));
    }
    return res.send({
      message: "Đã yêu cầu hủy thành công",
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi đặt hàng!"));
  }
};

exports.findOne = async (req, res, next) => {
  const userID = req.user ? req.user.id : null;
  let totalPriceOrder = 0; // Tổng giá các sản phẩm trong đơn hàng
  let totalPrice = 0; // Tổng gía của đơn hàng
  let totalDiscountPrice = 0; // Tổng giá giảm
  if (!userID) {
    return next(new ApiError(400, "Vui lòng đăng nhập"));
  }
  const orderID = req.params.orderID;
  try {
    const orderDetail = await orderService.getOrderByIDAndUserID(
      orderID,
      userID
    );
    if (!orderDetail) {
      return next(new ApiError(400, "Lỗi khi lấy chi tiết đơn hàng!"));
    }
    // Tính tổng giá sách trong đơn hàng
    orderDetail.detail.map((book) => {
      totalPriceOrder += book.quantity * book.realPrice;
    });
    // Tính tổng giá giảm nếu áp dụng mã giảm giá
    if (orderDetail.voucherID) {
      totalPrice = totalPriceOrder + orderDetail.shippingFee;
      const voucherCategory = orderDetail?.voucherID?.voucherCategoryID;
      if (voucherCategory.discountType === "amount") {
        totalDiscountPrice = voucherCategory.maxValue;
      } else if (voucherCategory.discountType === "percent") {
        totalDiscountPrice = (voucherCategory.value / 100) * totalPrice;
        if (totalDiscountPrice > voucherCategory.maxValue) {
          totalDiscountPrice = voucherCategory.maxValue;
        }
      } else {
        totalDiscountPrice = 0;
      }
    }
    if (!orderDetail) {
      return next(new ApiError(400, "Lỗi khi lấy chi tiết đơn hàng!"));
    }
    return res.send({
      ...orderDetail._doc,
      totalPriceOrder,
      totalDiscountPrice,
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi đặt hàng!"));
  }
};

exports.getShippingFee = async (req, res, next) => {
  const userID = req.user ? req.user.id : null;
  if (!userID) {
    return next(new ApiError(400, "Vui lòng đăng nhập"));
  }
  const { province, district, ward, address, weight } = req.body;
  const data = {
    pick_province: "Thành phố Cần Thơ",
    pick_district: "Quận Ninh Kiều",
    pick_ward: "Phường Xuân Khánh",
    pick_address: "Đại học Cần Thơ, Đường 3/2",
    ...req.body,
    transport: "road",
  };
  try {
    const response = await axios.post(
      "https://services.giaohangtietkiem.vn/services/shipment/fee",
      data,
      {
        headers: {
          Token: "a6a107cca1321887435a483f8e20f3405ed01668",
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data.success) {
      if (!response.data.fee.delivery) {
        return next(
          new ApiError(
            500,
            "Địa chỉ này không được hỗ trợ, vui lòng chon địa chỉ khác!"
          )
        );
      }
      return res.json(response.data.fee.ship_fee_only);
    }
    if (!response.data.fee.delivery) {
      return next(
        new ApiError(
          500,
          "Địa chỉ này không được hỗ trợ, vui lòng chon địa chỉ khác!"
        )
      );
    }
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi tính phí vận chuyển!"));
  }
};
