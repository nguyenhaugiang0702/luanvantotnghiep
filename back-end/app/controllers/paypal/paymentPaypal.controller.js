const orderService = require("../../services/order.service");
const cartService = require("../../services/cart.service");
const bookService = require("../../services/book.service");
const convert = require("../../utils/convertVNDToUSD.util");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../../config/index");
const moment = require("moment-timezone");
const ApiError = require("../../api-error");
const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: config.paypal.mode, //sandbox or live
  client_id: config.paypal.client_id,
  client_secret: config.paypal.client_secret,
});

exports.createLinkOrderByPayPal = async (req, res, next) => {
  try {
    const { detail } = req.body;
    // Tạo danh sách sách sau khi lấy tên sách từ bookID
    const books = await Promise.all(
      detail.map(async (item) => {
        const book = await bookService.getBookByID(item.bookID);
        if (!book) {
          throw new ApiError(404, `Không tìm thấy sách với ID: ${item._id}`);
        }
        const priceUSD = await convert.convertVNDToUSD(item.price);
        return {
          name: book.name, // Tên sách
          sku: book._id, // ID sách
          price: priceUSD, // Định dạng giá tiền
          currency: "USD", // Đơn vị tiền tệ
          quantity: item.quantity, // Số lượng sách
        };
      })
    );

    // Tính tổng tiền bằng USD
    const totalAmount = books.reduce(
      (total, book) => total + parseFloat(book.price) * book.quantity,
      0
    );

    // Tạo đơn hàng
    const userID = req.user.id;
    req.body.userID = userID;
    req.body.createdAt = moment.tz("Asia/Ho_Chi_Minh").toDate();
    req.body.updatedAt = moment.tz("Asia/Ho_Chi_Minh").toDate();
    req.body.totalPrice = totalAmount;
    const newOrder = await orderService.createOrder(req.body);
    if (!newOrder) {
      return next(new ApiError(400, "Lỗi khi đặt hàng!"));
    }

    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: `https://nhgbookstore.serveo.net/api/v1/orders/paypal/success?orderId=${newOrder._id}&totalAmount=${totalAmount}`,
        cancel_url:
          "https://nhgbookstore.serveo.net/api/v1/orders/paypal/cancel",
      },
      transactions: [
        {
          item_list: {
            items: books,
          },
          amount: {
            currency: "USD",
            total: totalAmount.toFixed(2),
          },
          description: "Thanh toán đơn hàng sách",
        },
      ],
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        throw error;
      } else {
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === "approval_url") {
            return res.send({ paypal_url: payment.links[i].href });
          }
        }
      }
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi thêm mới địa chỉ"));
  }
};

exports.handlePayPalSuccess = async (req, res, next) => {
  const { orderId, PayerID, paymentId, totalAmount } = req.query;
  const execute_payment_json = {
    payer_id: PayerID,
    transactions: [
      {
        amount: {
          currency: "USD",
          total: totalAmount,
        },
      },
    ],
  };

  // Xác nhận thanh toán qua PayPal
  paypal.payment.execute(
    paymentId,
    execute_payment_json,
    async function (error, payment) {
      if (error) {
        console.log(error.response);
        throw error;
      } else {
        const curentOrder = await orderService.getOrderByID(orderId);
        // Thanh toán thành công
        const updateOrder = await orderService.updateWasPaidedOrderByID(
          orderId
        );
        if (!updateOrder) {
          return next(
            new ApiError(400, "Lỗi khi cập nhật trạng thái thanh toán!")
          );
        }
        await cartService.deleteBookFromCartWhenCheckOut(curentOrder.userID);
        await cartService.calculateTotalPriceWhenCheckOut(curentOrder.userID);
        return res.redirect("http://localhost:3001/thanks");
      }
    }
  );
};

exports.handlePayPalCancel = async (req, res, next) => {};
