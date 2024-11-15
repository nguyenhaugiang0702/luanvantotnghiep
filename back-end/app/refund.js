const config = require("./config/index");
const moment = require("moment-timezone");
const axios = require("axios");
const CryptoJS = require("crypto-js");
const qs = require("qs");
const ApiError = require("./api-error");

const refundOrderZaloPay = async () => {
  try {
    const timestamp = Date.now();
    const uniqueId = `${timestamp}${Math.floor(111 + Math.random() * 999)}`;
    const m_refund_id = `${moment().format("YYMMDD")}_${
      2554
    }_${uniqueId}`;

    console.log(m_refund_id);

    let params = {
      app_id: 2554,
      m_refund_id: m_refund_id,
      timestamp: moment().tz("Asia/Ho_Chi_Minh").valueOf(),
      zp_trans_id: 241113000013868,
      amount: 191500,
      description: "Hoan tien cho don hang",
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
      console.log(data);
      params.mac = CryptoJS.HmacSHA256(data, 'sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn').toString();

    const response = await axios.post(
      "https://sb-openapi.zalopay.vn/v2/refund",
      params
    );

    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Lỗi khi hoàn tiền qua ZaloPay");
  }
};

refundOrderZaloPay();
