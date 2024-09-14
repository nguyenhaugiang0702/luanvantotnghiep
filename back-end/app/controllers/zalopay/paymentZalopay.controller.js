const orderService = require("../../services/order.service");
const cartService = require("../../services/cart.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../../config/index");
const moment = require("moment-timezone");
const ApiError = require("../../api-error");
const axios = require("axios");
const CryptoJS = require("crypto-js");
const qs = require('qs')

exports.createLinkOrderByZaloPay = async (req, res, next) => {
  try {
    const userID = req.user.id;
    req.body.userID = userID;
    req.body.createdAt = moment.tz("Asia/Ho_Chi_Minh").toDate();
    req.body.updatedAt = moment.tz("Asia/Ho_Chi_Minh").toDate();
    const newOrder = await orderService.createOrder(req.body);
    if (!newOrder) {
      return next(new ApiError(400, "Lỗi khi đặt hàng!"));
    }

    const embed_data = {
      redirecturl: "http://localhost:3001/thanks",
    };

    const items = [{}];
    const transID = newOrder._id;
    const order = {
      app_id: config.zalopay.app_id,
      app_trans_id: `${moment().format("YYMMDD")}_${newOrder._id}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
      app_user: "user123",
      app_time: Date.now(), // miliseconds
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount: newOrder.totalPrice,
      description: `Lazada - Payment for the order #${transID}`,
      bank_code: "zalopayapp",
      callback_url:
        "https://nhgbookstore.serveo.net/api/v1/orders/zalopay/callback",
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

    let result;
    try {
      result = await axios.post(config.zalopay.endpoint, null, {
        params: order,
      });
      return res.send(result.data);
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
    let parts = appTransId.split("_");
    let orderId = parts[1];

    let mac = CryptoJS.HmacSHA256(dataStr, config.zalopay.key2).toString();
    console.log("mac =", mac);

    // kiểm tra callback hợp lệ (đến từ ZaloPay server)
    if (reqMac !== mac) {
      // callback không hợp lệ
      result.return_code = -1;
      result.return_message = "mac not equal";
    } else {
      // thanh toán thành công
      // merchant cập nhật trạng thái cho đơn hàng
      let dataJson = JSON.parse(dataStr, config.zalopay.key2);
      console.log(
        "update order's status = success where app_trans_id =",
        dataJson["app_trans_id"]
      );

      const curentOrder = await orderService.getOrderByID(orderId);

      // Thanh toán thành công
      const updateOrder = await orderService.updateWasPaidedOrderByID(orderId);
      if (!updateOrder) {
        return next(
          new ApiError(400, "Lỗi khi cập nhật trạng thái thanh toán!")
        );
      }
      await cartService.deleteBookFromCartWhenCheckOut(curentOrder.userID);
      await cartService.calculateTotalPriceWhenCheckOut(curentOrder.userID);

      result.return_code = 1;
      result.return_message = "success";
    }
  } catch (ex) {
    result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
    result.return_message = ex.message;
  }

  // thông báo kết quả cho ZaloPay server
  res.json(result);
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
