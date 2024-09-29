const express = require("express");
const order = require("../controllers/order.controller");
const momo = require("../controllers/momo/paymentMomo.controller");
const zalopay = require("../controllers/zalopay/paymentZalopay.controller");
const paypal = require("../controllers/paypal/paymentPaypal.controller");
const jwt = require("../middlewares/jwt.middleware");
const validation = require("../middlewares/validateOrder.middelware");

const router = express.Router();

router
  .route("/")
  .post(
    jwt.authenticateTokenFromHeader,
    validation.ordersValidation,
    order.create
  )
  .get(order.findAllByAdmin);
router
  .route("/getAll")
  .get(jwt.authenticateTokenFromHeader, order.findAllOrdersByUserID); // Lấy tất cả đơn hàng của khách hàng
router.route("/:orderID").get(order.findOneByAdmin);
router
  .route("/detail/:orderID")
  .get(jwt.authenticateTokenFromHeader, order.findOne); // Chi tiết đơn hàng khách hàng

router
  .route("/updateStatus/:orderID")
  .put(jwt.authenticateTokenFromHeader, order.updateStatusByCustomer); // Cập nhật trạng thái bên customer
router.route("/updateStatusByAd/:orderID").put(order.updateStatusByAd); // Cập nhật trạng thái bên admin

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
