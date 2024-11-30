const orderService = require("../../../../services/order.service");
const cartService = require("../../../../services/cart.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../../../../config/index");
const moment = require("moment-timezone");
const ApiError = require("../../../../api-error");
const axios = require("axios");
const CryptoJS = require("crypto-js");
const qs = require("qs");

exports.createLinkOrderByZaloPay = async (req, res, next) => {
  try {
    const userID = req.user.id;
    const { addressID, totalQuantity, notes, payment, voucherID, shippingFee } =
      req.body;
    const embed_data = {
      redirecturl: "http://localhost:3001/thanks",
      userID: userID,
      totalQuantity: totalQuantity,
      addressID: addressID,
      notes: notes,
      payment: payment,
      voucherID: voucherID,
      shippingFee: shippingFee,
    };

    // Chuyển đổi req.body.detail thành định dạng phù hợp
    const items = req.body.detail.map((item) => ({
      bookID: item.bookID,
      realPrice: item.realPrice,
      quantity: item.quantity,
    }));

    let uid = Date.now();
    const order = {
      app_id: config.zalopay.app_id,
      app_trans_id: `${moment().format("YYMMDD")}_${uid}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
      app_user: "user123",
      app_time: Date.now(),
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount: req.body.totalPrice,
      description: `Lazada - Payment for the order`,
      bank_code: "zalopayapp",
      callback_url: "https://nhgbookstore.serveo.net/api/v1/user/payment/zalopay/callback",
    };

    // appid|app_trans_id|appuser|amount|apptime|embeddata|item
    const data =
      config.zalopay.app_id +
      "|" +
      order.app_trans_id +
      "|" +
      order.app_user +
      "|" +
      order.amount +
      "|" +
      order.app_time +
      "|" +
      order.embed_data +
      "|" +
      order.item;
    order.mac = CryptoJS.HmacSHA256(data, config.zalopay.key1).toString();

    try {
      let result;

      result = await axios.post(config.zalopay.endpoint, null, {
        params: order,
      });
      // Kiểm tra phản hồi từ ZaloPay
      if (result.data.return_code === 1) {
        return res.send(result.data);
      } else {
        return next(
          new ApiError(500, "Lỗi khi tạo liên kết thanh toán ZaloPay!")
        );
      }
    } catch (error) {
      console.log(error.response ? error.response.data : error.message);
      return next(new ApiError(500, "Lôi khi thanh toán momo!"));
    }
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lỗi khi thêm mới địa chỉ"));
  }
};

exports.handleZaloPayIPN = async (req, res, next) => {
  let result = {};

  try {
    let dataStr = req.body.data;
    let reqMac = req.body.mac;

    let dataObj = JSON.parse(dataStr);
    let appTransId = dataObj.app_trans_id;

    const embedData = JSON.parse(dataObj.embed_data);
    const items = JSON.parse(dataObj.item);

    let mac = CryptoJS.HmacSHA256(dataStr, config.zalopay.key2).toString();

    // kiểm tra callback hợp lệ (đến từ ZaloPay server)
    if (reqMac !== mac) {
      // callback không hợp lệ
      result.return_code = -1;
      result.return_message = "mac not equal";
    } else {
      // Lưu đơn hàng từ thông tin req.body khi thanh toán thành công
      console.log('Du lieu khi tao: =' + JSON.stringify(dataObj, null, 2));

      const newOrderData = {
        userID: embedData.userID,
        addressID: embedData.addressID,
        totalPrice: dataObj.amount,
        totalQuantity: embedData.totalQuantity,
        notes: embedData.notes,
        payment: embedData.payment,
        voucherID: embedData.voucherID,
        detail: items,
        wasPaided: true,
        image: '',
        paymentDetail: {
          saleId: appTransId,
          state: "COMPLETED",
          amount: dataObj.amount,
        },
        shippingFee: embedData.shippingFee,
        createdAt: moment.tz("Asia/Ho_Chi_Minh").toDate(),
        updatedAt: moment.tz("Asia/Ho_Chi_Minh").toDate(),
      };
      // Tạo đơn hàng trong cơ sở dữ liệu
      const newOrder = await orderService.createOrder(newOrderData);
      if (!newOrder) {
        return next(new ApiError(400, "Lỗi khi tạo đơn hàng sau thanh toán"));
      }

      // Thanh toán thành công, xóa giỏ hàng, tính lại tổng tiền
      await cartService.deleteBookFromCartWhenCheckOut(embedData.userID);
      await cartService.calculateTotalPriceWhenCheckOut(embedData.userID);
      // Lấy io từ app và phát thông báo đến admin
      const io = require("../../../../../app").get("socketIo");
      io.emit("hasUpdateCheckout", {
        checkout: {
          message: "Cập nhật checkout",
          newOrder: newOrder,
        },
      });
      result.return_code = 1;
      result.return_message = "success";
    }
  } catch (ex) {
    result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
    result.return_message = ex.message;
  }

  // thông báo kết quả cho ZaloPay server
  return res.redirect(302, "http://localhost:3001/thanks");
};

exports.handleZaloPayIPNTransactionStatus = async (req, res, next) => {
  const app_trans_id = req.params.app_trans_id;
  let postData = {
    app_id: config.zalopay.app_id,
    app_trans_id: app_trans_id,
  };

  let data =
    postData.app_id + "|" + postData.app_trans_id + "|" + config.zalopay.key1; // appid|app_trans_id|key1
  postData.mac = CryptoJS.HmacSHA256(data, config.zalopay.key1).toString();

  let postConfig = {
    method: "post",
    url: "https://sb-openapi.zalopay.vn/v2/query",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: qs.stringify(postData),
  };
  let result;
  try {
    result = await axios(postConfig);
    return res.send(result.data);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lôi khi thanh toán momo!"));
  }
};

exports.refundOrderZaloPay = async (zp_trans_id, amount, description) => {
  try {
    const timestamp = Date.now();
    const uniqueId = `${timestamp}${Math.floor(111 + Math.random() * 999)}`;
    const m_refund_id = `${moment().format("YYMMDD")}_${
      config.zalopay.app_id
    }_${uniqueId}`;

    let params = {
      app_id: config.zalopay.app_id,
      m_refund_id: m_refund_id,
      timestamp: Date.now(),
      zp_trans_id,
      amount: amount,
      description: description,
    };

    let data =
      params.app_id +
      "|" +
      params.zp_trans_id +
      "|" +
      params.amount +
      "|" +
      params.description +
      "|" +
      params.timestamp;
    params.mac = CryptoJS.HmacSHA256(data, config.zalopay.key1).toString();

    const response = await axios.post(
      "https://sb-openapi.zalopay.vn/v2/refund",
      null,
      { params }
    );

    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error:", error.message);
    throw new Error("Lỗi khi hoàn tiền qua ZaloPay");
  }
};
