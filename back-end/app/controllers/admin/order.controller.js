const orderService = require("../../services/order.service");
const bookService = require("../../services/book.service");
const voucherService = require("../../services/vouchers/voucher.service");
const voucherUsedService = require("../../services/vouchers/voucherUseds.service");
const ApiError = require("../../api-error");
const moment = require("moment-timezone");
const payment = require("../../controllers/user/payment/paypal/paymentPaypal.controller");
const paymentMomo = require("../../controllers/user/payment/momo/paymentMomo.controller");
const smsService = require("../../sendOTP");
const emailService = require("../../utils/email.util");

exports.findAll = async (req, res, next) => {
  try {
    console.log(req.admin.id);
    let orders;
    if (req.admin.id && req.admin.role === "shipper") {
      const ordersAwaitAccepted = await orderService.getAllOrdersByAdmin({
        status: 2
      });
      const ordersWithShipperID = await orderService.getAllOrdersByAdmin({
        shipperID: req.admin.id
      });
      orders = [...ordersAwaitAccepted, ...ordersWithShipperID]
      console.log(ordersAwaitAccepted.length);
      console.log(ordersWithShipperID.length);
      console.log(ordersAwaitAccepted[8]);

    } else {
      orders = await orderService.getAllOrdersByAdmin({});
    }
    orders = orders.map((order) => {
      const { statusOptions, statusFormat } =
        orderService.getStatusOptionsAndFormat(order.status);
      // Gán mảng statusOptions cho từng đơn hàng
      return { ...order._doc, statusOptions, status: statusFormat };
    });
    if (!orders) {
      return next(new ApiError(400, "Lỗi khi lấy tất cả đơn hàng!"));
    }
    console.log(orders[0]);
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
  const status = parseInt(req.body.status);
  try {
    const order = await orderService.getOrderByID(orderID);
    if (!order) {
      return next(new ApiError(404, "Đơn hàng không tồn tại!"));
    }
    if (status === 1) {
      // Admin từ chối hủy đơn cho khách
      const orderUpdateStatus = await orderService.updateStatus(
        orderID,
        req.body
      );
      if (!orderUpdateStatus) {
        return next(new ApiError(400, "Lỗi khi cập nhật trạng thái đơn hàng!"));
      }
    } else if (status === 2) {
      // Admin xác nhận đơn hàng -> Tăng số lượng bán
      const error = await updateBookQuantities(order.detail);
      if (error) return next(new ApiError(400, error));
      req.body.status = status;
      req.body.updatedAt = moment.tz("Asia/Ho_Chi_Minh");
      const orderUpdateStatus = await orderService.updateStatus(
        orderID,
        req.body
      );
      if (!orderUpdateStatus) {
        return next(new ApiError(400, "Lỗi khi cập nhật trạng thái đơn hàng!"));
      }
    } else if (status === 7 || status === 3) {
      // Shipper giao hàng không thành công hoặc xác nhận hủy đơn
      const updateFailShipOrder = await orderService.updateStatus(orderID, {
        status: status,
      });
      if (!updateFailShipOrder) {
        return next(new ApiError(400, "Lỗi khi cập nhật trạng thái đơn hàng"));
      }
      // Cập nhật lại số lượng bán
      if (status === 7) {
        await Promise.all(
          updateFailShipOrder.detail.map(async (book) => {
            await bookService.updateBook(book.bookID, {
              $inc: { quantitySold: -book.quantity },
            });
          })
        );
      }

      if (status === 3) {
        // Nếu admin hủy đơn mà đơn hàng có áp dụng mã giảm giá thì reset lại mã giảm giá cho user
        if (order.voucherID) {
          await voucherUsedService.updateVoucherUsedsByQuery(
            {
              voucherID: order.voucherID._id,
            },
            { isApplied: false, isUsed: false }
          );
        }
      }

      if (order.payment === "PAYPAL" && order.paymentDetail?.saleId) {
        const refundResult = await payment.handleRefundPayPal(
          order.paymentDetail.saleId,
          order.paymentDetail.amount
        );
        if (!refundResult.success) {
          return next(new ApiError(400, "Hoàn tiền qua PayPal thất bại!"));
        }
        await orderService.updateOrderById(order._id, {
          "paymentDetail.state": "REFUNDED",
        });
      }
      // nếu giao dịch là MOMO hoẵcj ZALOPAY thì gửi về thông báo
      if (order.payment === "MOMO" || order.payment === "ZALOPAY") {
        const notificationMessage = `Đơn hàng ${orderID} đã được hủy. Liên hệ hotline: 0384804407 hoặc email: nhgbookstore@gmail.com để được hỗ trợ hoàn tiền.
      `;
        try {
          await orderService.updateOrderById(order._id, {
            "paymentDetail.state": "PENDING_REFUND",
          });
          // Gửi SMS
          await smsService.sendOTP(
            order.userID?.phoneNumber,
            notificationMessage
          );
          // Gửi Email
          if (order.userID?.email) {
            await emailService.sendEmail({
              email: order.userID.email,
              subject: "Thông báo hủy đơn hàng",
              text: notificationMessage,
            });
          }
        } catch (notifyError) {
          console.error("Lỗi khi gửi thông báo:", notifyError);
        }
      }
    } else if (status === 8 && req.file) {
      // Giao hàng thành công và chụp ảnh giao hàng
      req.body.image = req.file.path;
      req.body.status = status;
      req.body.updatedAt = moment.tz("Asia/Ho_Chi_Minh");
      const orderUpdateStatus = await orderService.updateStatus(
        orderID,
        req.body
      );
      if (!orderUpdateStatus) {
        return next(new ApiError(400, "Lỗi khi cập nhật trạng thái đơn hàng!"));
      }
      // Cập nhật cho shipper nếu là "8 : Đã giao" thì cập nhật đã trả tiền thành true
      if (
        orderUpdateStatus.status === 8 &&
        !orderUpdateStatus.wasPaided &&
        orderUpdateStatus.payment === "COD"
      ) {
        // Đã giao
        await orderService.updateStatus(orderUpdateStatus._id, {
          wasPaided: true,
        });
      }
    } else if (status === 5 || status === 6) {
      const shipperID = req.admin.id;
      if (status === 5) {
        const updateGettedOrder = await orderService.updateStatus(orderID, {
          status: status,
          shipperID: shipperID,
        });
        if (!updateGettedOrder) {
          return next(
            new ApiError(400, "Lỗi khi cập nhật trạng thái nhận hàng")
          );
        }
      } else if (status === 6) {
        const updateGettedOrder = await orderService.updateStatus(orderID, {
          status: status,
        });
        if (!updateGettedOrder) {
          return next(
            new ApiError(400, "Lỗi khi cập nhật trạng thái đang giao hàng")
          );
        }
      }
    }

    // Lấy io từ app và phát thông báo đến admin
    const io = require("../../../app").get("socketIo");
    io.emit("hasNewOrderStatus", {
      orderStatus: {
        message: "Có trạng thái mới",
        newOrderStatus: status,
      },
    });
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
    // Chỉ cho phép xóa các trạng thái: 1, 3, 4, 7
    if (![1, 3, 4, 7].includes(currentOrder.status)) {
      return next(
        new ApiError(400, "Không thể xóa đơn hàng ở trạng thái hiện tại")
      );
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

exports.findAllOrderByStatus = async (req, res, next) => {
  try {
    const shipperID = req.admin.id;
    const status = parseInt(req.query.status);

    let orders;
    if ([5, 6, 8].includes(status)) {
      orders = await orderService.getAllOrdersByAdmin({
        status: status,
        shipperID: shipperID,
      });
    }
    // Nếu status là 2, thì trả về tất cả các đơn hàng có status = 2
    else if (status === 2) {
      orders = await orderService.getAllOrdersByAdmin({ status: 2 });
    } else {
      return next(new ApiError(400, "Trạng thái đơn hàng không hợp lệ!"));
    }

    // Map thêm thông tin statusOptions và statusFormat
    orders = orders.map((order) => {
      const { statusOptions, statusFormat } =
        orderService.getStatusOptionsAndFormat(order.status);
      return { ...order._doc, statusOptions, status: statusFormat };
    });

    // Kiểm tra nếu không có đơn hàng nào được tìm thấy
    if (!orders || orders.length === 0) {
      return next(new ApiError(404, "Không tìm thấy đơn hàng!"));
    }

    return res.send(orders);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi đặt hàng!"));
  }
};
