const orderService = require("../../services/order.service");
const cartService = require("../../services/cart.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../../config/index");
const moment = require("moment-timezone");
const ApiError = require("../../api-error");
const axios = require("axios");
const CryptoJS = require("crypto-js");
const qs = require("qs");

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
    let uid = Date.now();
    const order = {
      app_id: config.zalopay.app_id,
      app_trans_id: `${moment().format("YYMMDD")}_${uid}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
      app_user: "user123",
      app_time: Date.now(), // miliseconds
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount: newOrder.totalPrice,
      description: `Lazada - Payment for the order #${transID}`,
      bank_code: "zalopayapp",
      callback_url: `https://nhgbookstore.serveo.net/api/v1/orders/zalopay/callback?orderID=${newOrder._id}`,
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
      // Kiểm tra phản hồi từ ZaloPay
      if (result.data.return_code === 1) {
        const paymentUrl = result.data.order_url; // URL thanh toán

        // Cập nhật đơn hàng với URL thanh toán
        await orderService.updateOrderById(newOrder._id, {
          paymentUrl: paymentUrl,
        });

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
  const { orderID } = req.query;

  try {
    let dataStr = req.body.data;
    let reqMac = req.body.mac;

    let dataObj = JSON.parse(dataStr);
    let appTransId = dataObj.app_trans_id;

    let mac = CryptoJS.HmacSHA256(dataStr, config.zalopay.key2).toString();
    console.log("mac =", mac);

    // kiểm tra callback hợp lệ (đến từ ZaloPay server)
    if (reqMac !== mac) {
      // callback không hợp lệ
      result.return_code = -1;
      result.return_message = "mac not equal";
    } else {
      // Thanh toán thành công, cập nhật trạng thái đơn hàng và lưu zp_trans_id
      let zpTransID = dataObj.zp_trans_id; // Đây là mã giao dịch thực tế bạn cần
      console.log(`ZaloPay Transaction ID: ${zpTransID}`);

      // Cập nhật trạng thái đơn hàng và lưu zpTransID
      const updateOrder = await orderService.updateOrderById(orderID, {
        wasPaided: true,
        refundTransactionId: zpTransID, // Lưu zpTransID
      });

      if (!updateOrder) {
        return next(
          new ApiError(400, "Lỗi khi cập nhật trạng thái thanh toán!")
        );
      }

      // Thanh toán thành công, xóa giỏ hàng, tính lại tổng tiền
      const curentOrder = await orderService.getOrderByID(orderID);
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
  // res.json(result);
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
