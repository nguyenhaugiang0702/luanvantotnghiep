// orders/user/order.route.js
const express = require("express");
const order = require("../../../controllers/order.controller");
const jwt = require("../../../middlewares/jwt.middleware");
const validation = require("../../../middlewares/validateOrder.middelware");
const momo = require("../../../controllers/momo/paymentMomo.controller");
const zalopay = require("../../../controllers/zalopay/paymentZalopay.controller");
const paypal = require("../../../controllers/paypal/paymentPaypal.controller");

const router = express.Router();

router
  .route("/")
  .get(jwt.authenticateTokenFromHeader, order.findAllOrdersByUserID) // Lấy tất cả đơn hàng của user
  .post(
    jwt.authenticateTokenFromHeader,
    validation.ordersValidation,
    order.create
  ); // Tạo đơn hàng cho user

router
  .route("/detail/:orderID")
  .get(jwt.authenticateTokenFromHeader, order.findOne); // Chi tiết đơn hàng của user

router
  .route("/updateStatus/:orderID")
  .put(jwt.authenticateTokenFromHeader, order.updateStatusByCustomer); // Cập nhật trạng thái cho user

router
  .route("/shipping-fee")
  .post(jwt.authenticateTokenFromHeader, order.getShippingFee); // Tính tiền ship qua API của GHTK

// Các route thanh toán MOMO, ZALOPAY, PAYPAL
// MOMO
router
  .route("/momo/createLink")
  .post(
    jwt.authenticateTokenFromHeader,
    validation.ordersValidation,
    momo.createLinkOrderByMomo
  );

router.route("/momo/callback").post(momo.handleMomoIPN);

router
  .route("/momo/transaction-status")
  .post(momo.handleMomoIPNTransactionStatus);

// End MOMO

// ZALOPAY
router
  .route("/zalopay/createLink")
  .post(
    jwt.authenticateTokenFromHeader,
    validation.ordersValidation,
    zalopay.createLinkOrderByZaloPay
  );

router.route("/zalopay/callback").post(zalopay.handleZaloPayIPN);

router
  .route("/zalopay/transaction-status/:app_trans_id")
  .post(zalopay.handleZaloPayIPNTransactionStatus);
router.route("/zalopay/refund").post(zalopay.refundOrderZaloPay);

// End ZALOPAY

// PAYPAL
router
  .route("/paypal/createLink")
  .post(
    jwt.authenticateTokenFromHeader,
    validation.ordersValidation,
    paypal.createLinkOrderByPayPal
  );

router.route("/paypal/success").get(paypal.handlePayPalSuccess);

router.route("/paypal/cancel").post(paypal.handlePayPalCancel);

// End PAYPAL

module.exports = router;
