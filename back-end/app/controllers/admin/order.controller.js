const orderService = require("../../services/order.service");
const bookService = require("../../services/book.service");
const ApiError = require("../../api-error");

exports.findAll = async (req, res, next) => {
  try {
    let orders = await orderService.getAllOrdersByAdmin({});
    orders = orders.map((order) => {
      const { statusOptions, statusFormat } =
        orderService.getStatusOptionsAndFormat(order.status);
      // Gán mảng statusOptions cho từng đơn hàng
      return { ...order._doc, statusOptions, status: statusFormat };
    });
    if (!orders) {
      return next(new ApiError(400, "Lỗi khi lấy tất cả đơn hàng!"));
    }
    return res.send(orders);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi đặt hàng!"));
  }
};

exports.findOne = async (req, res, next) => {
  const orderID = req.params.orderID;
  let totalPriceOrder = 0; // Tổng giá các sản phẩm trong đơn hàng
  let totalPrice = 0; // Tổng gía của đơn hàng
  let totalDiscountPrice = 0; // Tổng giá giảm
  try {
    const orderDetail = await orderService.getOrderByID(orderID);
    const { statusOptions, statusFormat, statusFullOptions } =
      orderService.getStatusOptionsAndFormat(orderDetail.status);
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
      statusOptions,
      status: statusFormat,
      statusFullOptions,
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi đặt hàng!"));
  }
};

exports.updateStatus = async (req, res, next) => {
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

exports.deleteOrder = async (req, res, next) => {
  const { orderID } = req.params;
  try {
    const currentOrder = await orderService.getOrderByID(orderID);
    if (!currentOrder) {
      return next(new ApiError(404, "Không tìm thấy đơn hàng"));
    }
    // Xóa đơn hàng ơ trạng thái "Đang chờ xác nhận", "yêu cầu hủy" hoặc "Đã hủy"
    if (currentOrder.status === 2) {
      return next(new ApiError(400, "Không thể xóa đơn hàng đã xác nhận"));
    }

    const deleteOrder = await orderService.deleteOrderByID(orderID);
    return res.send({
      message: "Xóa thành công đơn hàng",
      deleteOrder,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi xóa đơn hàng"));
  }
};

exports.findAllOrderConfirmed = async (req, res, next) => {
  try {
    let orders = await orderService.getAllOrdersByAdmin({ status: 2});
    console.log(1);
    orders = orders.map((order) => {
      const { statusOptions, statusFormat } =
        orderService.getStatusOptionsAndFormat(order.status);
      // Gán mảng statusOptions cho từng đơn hàng
      return { ...order._doc, statusOptions, status: statusFormat };
    });
    if (!orders) {
      return next(new ApiError(400, "Lỗi khi lấy tất cả đơn hàng!"));
    }
    return res.send(orders);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi đặt hàng!"));
  }
};
