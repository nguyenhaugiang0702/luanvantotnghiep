const orderService = require("../../../../services/order.service");
const cartService = require("../../../../services/cart.service");
const bookService = require("../../../../services/book.service");
const convert = require("../../../../utils/convertVNDToUSD.util");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../../../../config/index");
const moment = require("moment-timezone");
const ApiError = require("../../../../api-error");
const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: config.paypal.mode, //sandbox or live
  client_id: config.paypal.client_id,
  client_secret: config.paypal.client_secret,
});

exports.createLinkOrderByPayPal = async (req, res, next) => {
  try {
    const {
      detail,
      addressID,
      notes,
      voucherID,
      shippingFee,
      totalPrice,
      totalQuantity,
    } = req.body;
    const userID = req.user.id;
    // Tạo danh sách sách sau khi lấy tên sách từ bookID
    const books = await Promise.all(
      detail.map(async (item) => {
        const book = await bookService.getBookByID(item.bookID);
        if (!book) {
          throw new ApiError(404, `Không tìm thấy sách với ID: ${item._id}`);
        }
        const priceUSD = await convert.convertVNDToUSD(item.realPrice);
        return {
          name: book.name,
          sku: book._id,
          price: priceUSD,
          currency: "USD",
          quantity: item.quantity,
        };
      })
    );

    // Tính tổng tiền bằng USD
    const totalAmount = books.reduce(
      (total, book) => total + parseFloat(book.price) * book.quantity,
      0
    );
    try {
      const create_payment_json = {
        intent: "sale",
        payer: {
          payment_method: "paypal",
        },
        redirect_urls: {
          return_url: `http://localhost:3000/api/v1/user/payment/paypal/success?totalAmount=${totalAmount}&detail=${encodeURIComponent(
            JSON.stringify(detail)
          )}`,
          cancel_url:
            "http://localhost:3000/api/v1/user/payment/paypal/cancel",
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
            custom: JSON.stringify({
              userID,
              addressID,
              notes,
              voucherID,
              shippingFee,
              totalPrice,
              totalQuantity,
            }),
          },
        ],
      };
      paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
          return next(new ApiError(500, "Lỗi khi tạo link thanh toán"));
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
    }
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi tạo link thanh toán"));
  }
};

exports.handlePayPalSuccess = async (req, res, next) => {
  const { orderId, PayerID, paymentId, totalAmount, detail } = req.query;
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
        return next(new ApiError(500, "Lỗi khi xác nhận thanh toán"));
      } else {
        console.log(
          "saleID: " + payment.transactions[0].related_resources[0].sale.id
        );
        const customObj = JSON.parse(payment.transactions[0]?.custom);
        const detailOrder = JSON.parse(detail);
        const orderData = {
          userID: customObj.userID,
          detail: detailOrder,
          notes: customObj.notes,
          addressID: customObj.addressID,
          totalPrice: parseInt(customObj.totalPrice),
          totalQuantity: parseInt(customObj.totalQuantity),
          payment: "PAYPAL",
          voucherID: customObj.voucherID ? customObj.voucherID : null,
          wasPaided: true,
          image: '',
          status: 1,
          shippingFee: customObj.shippingFee,
          paymentDetail: {
            saleId: payment.transactions[0]?.related_resources[0]?.sale.id,
            state: "COMPLETED",
            amount: parseFloat(totalAmount),
          },
          createdAt: moment.tz("Asia/Ho_Chi_Minh").toDate(),
          updatedAt: moment.tz("Asia/Ho_Chi_Minh").toDate(),
        };
        const newOrder = await orderService.createOrder(orderData);
        if (!newOrder) {
          return next(new ApiError(400, "Lỗi khi tạo đơn hàng!"));
        }
        await cartService.deleteBookFromCartWhenCheckOut(customObj.userID);
        await cartService.calculateTotalPriceWhenCheckOut(customObj.userID);
        // Lấy io từ app và phát thông báo đến admin
        const io = require("../../../../../app").get("socketIo");
        io.emit("hasUpdateCheckout", {
          checkout: {
            message: "Cập nhật checkout",
            newOrder: newOrder,
          },
        });
        return res.redirect("http://localhost:3001/thanks");
      }
    }
  );
};

exports.handlePayPalCancel = async (req, res, next) => {
  return res.redirect("http://localhost:3001/checkout");
};

exports.handleRefundPayPal = async (saleId, amount, next) => {
  try {
    if (!saleId) {
      throw new ApiError(400, "Vui lòng nhập saleId");
    }

    const refundData = {
      amount: {
        currency: "USD",
        total: amount.toFixed(2),
      },
    };

    return new Promise((resolve, reject) => {
      paypal.sale.refund(saleId, refundData, (error, refund) => {
        if (error) {
          console.error("Refund Error:", error);
          return reject(new ApiError(500, "Refund process failed"));
        } else {
          console.log("Refund Response:", refund);
          return resolve({
            success: true,
            refund,
          });
        }
      });
    });
  } catch (error) {
    console.error("Refund Exception:", error);
    return next(new ApiError(500, "Lỗi khi tính toán hoàn tiền"));
  }
};

