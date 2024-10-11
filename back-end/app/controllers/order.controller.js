const orderService = require("../services/order.service");
const cartService = require("../services/cart.service");
const bookService = require("../services/book.service");
const voucherUsedsService = require("../services/vouchers/voucherUseds.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/index");
const moment = require("moment-timezone");
const ApiError = require("../api-error");
const axios = require("axios");

exports.create = async (req, res, next) => {
  try {
    const userID = req.user ? req.user.id : null;
    if (!userID) {
      return next(new ApiError(400, "Vui lòng đăng nhập"));
    }
    req.body.userID = userID;
    req.body.createdAt = moment.tz("Asia/Ho_Chi_Minh").toDate();
    req.body.updatedAt = moment.tz("Asia/Ho_Chi_Minh").toDate();
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
      await voucherUsedsService.updateVoucherUseds(voucherUsed._id, {
        isUsed: true,
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

exports.findAllOrdersByUserID = async (req, res, next) => {
  let orders = [];
  try {
    const userID = req.user ? req.user.id : null;
    if (!userID) {
      return next(new ApiError(400, "Vui lòng đăng nhập"));
    }
    orders = await orderService.getOrdersByUserID(userID);
    return res.send({
      message: "Đặt hàng thành công",
      orders,
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi đặt hàng!"));
  }
};

exports.updateStatusByCustomer = async (req, res, next) => {
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
    return res.send(orderDetail);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi đặt hàng!"));
  }
};

// Admin

exports.findAllByAdmin = async (req, res, next) => {
  try {
    const orders = await orderService.getAllOrdersByAdmin();
    if (!orders) {
      return next(new ApiError(400, "Lỗi khi lấy tất cả đơn hàng!"));
    }
    return res.send(orders);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi đặt hàng!"));
  }
};

exports.findOneByAdmin = async (req, res, next) => {
  const orderID = req.params.orderID;
  try {
    const orderDetail = await orderService.getOrderByID(orderID);
    if (!orderDetail) {
      return next(new ApiError(400, "Lỗi khi lấy chi tiết đơn hàng!"));
    }
    return res.send(orderDetail);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi đặt hàng!"));
  }
};

exports.updateStatusByAd = async (req, res, next) => {
  const orderID = req.params.orderID;
  const { status } = req.body;
  try {
    const order = await orderService.getOrderByID(orderID);
    if (!order) {
      return next(new ApiError(404, "Đơn hàng không tồn tại!"));
    }
    if (status === 2) {
      // Đơn hàng đã được xác nhận -> Tăng số lượng bán
      const error = await updateBookQuantities(order.detail);
      if (error) return next(new ApiError(400, error));
    }
    const orderUpdateStatus = await orderService.updateStatus(orderID, status);
    if (!orderUpdateStatus) {
      return next(new ApiError(400, "Lỗi khi cập nhật trạng thái đơn hàng!"));
    }
    return res.send({
      message: "Đã cập nhật thành công trạng thái đơn hàng",
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi đặt hàng!"));
  }
};

// Hàm phụ để cập nhật số lượng sách
async function updateBookQuantities(orderDetails) {
  let error = "";
  await Promise.all(
    orderDetails.map(async (bookObj) => {
      const book = await bookService.getBookByID(bookObj.bookID);
      let updatedQuantitySold = book.quantitySold;

      updatedQuantitySold += bookObj.quantity;
      if (bookObj.quantity > book.quantityImported - updatedQuantitySold) {
        error += "Số lượng vượt quá số lượng tồn kho!";
        return;
      }

      await bookService.updateBook(bookObj.bookID, {
        quantitySold: updatedQuantitySold,
      });
    })
  );
  return error;
}

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
    value: 100000,
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
