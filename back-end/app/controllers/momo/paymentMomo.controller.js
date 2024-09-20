const orderService = require("../../services/order.service");
const cartService = require("../../services/cart.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../../config/index");
const moment = require("moment-timezone");
const ApiError = require("../../api-error");
const axios = require("axios");

exports.createLinkOrderByMomo = async (req, res, next) => {
  try {
    const userID = req.user.id;
    req.body.userID = userID;
    // req.body.createdAt = moment.tz("Asia/Ho_Chi_Minh").toDate();
    // req.body.updatedAt = moment.tz("Asia/Ho_Chi_Minh").toDate();
    // const newOrder = await orderService.createOrder(req.body);
    // if (!newOrder) {
    //   return next(new ApiError(400, "Lỗi khi đặt hàng!"));
    // }
    //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
    //parameters
    const accessKey = config.momo.accessKey;
    const secretKey = config.momo.secretKey;
    const orderInfo = `${req.body.totalQuantity} quyển sách`;
    const partnerCode = "MOMO";
    const redirectUrl = "http://localhost:3001/thanks";
    const ipnUrl =
      "https://nhgbookstore.serveo.net/api/v1/orders/momo/callback";
    const requestType = "payWithMethod";
    const amount = req.body.totalPrice;
    const orderId = Date.now();
    const requestId = orderId;
    const extraData = JSON.stringify(req.body);
    const orderExpireTime = 5;
    const paymentCode =
      "T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==";
    const orderGroupId = "";
    const autoCapture = true;
    const lang = "vi";

    //before sign HMAC SHA256 with format
    //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    //puts raw signature
    console.log("--------------------RAW SIGNATURE----------------");
    console.log(rawSignature);
    //signature
    const crypto = require("crypto");
    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");
    console.log("--------------------SIGNATURE----------------");
    console.log(signature);

    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
      partnerCode: partnerCode,
      partnerName: "Test",
      storeId: "MomoTestStore",
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      lang: lang,
      requestType: requestType,
      autoCapture: autoCapture,
      extraData: extraData,
      orderExpireTime: orderExpireTime,
      orderGroupId: orderGroupId,
      signature: signature,
    });
    console.log("--------------------REQUEST BODY----------------");
    console.log(requestBody);
    // Option for axios
    const options = {
      url: "https://test-payment.momo.vn/v2/gateway/api/create",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestBody),
      },
      data: requestBody,
    };
    let result;
    try {
      result = await axios(options);
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

exports.handleMomoIPN = async (req, res, next) => {
  const { orderId, resultCode, extraData } = req.body;
  if (resultCode !== 0) {
    // Thanh toán không thành công
    return next(new ApiError(400, "Thanh toán thất bại!"));
  }
  const extraDataObj = JSON.parse(extraData);
  extraDataObj.createdAt = moment.tz("Asia/Ho_Chi_Minh").toDate(),
  extraDataObj.updatedAt = moment.tz("Asia/Ho_Chi_Minh").toDate(),
  extraDataObj.wasPaided = true;
  console.log(extraDataObj);
  const newOrder = await orderService.createOrder(extraDataObj);
  if (!newOrder) {
    return next(new ApiError(400, "Lỗi khi tạo đơn hàng sau thanh toán"));
  }
  // Thanh toán thành công
  await cartService.deleteBookFromCartWhenCheckOut(extraDataObj.userID);
  await cartService.calculateTotalPriceWhenCheckOut(extraDataObj.userID);
};

exports.handleMomoIPNTransactionStatus = async (req, res, next) => {
  const { orderId, resultCode } = req.body;
  console.log(req.body);
  const rawSignature = `accessKey=${config.momo.accessKey}$orderId=${orderId}&partnerCode=MOMO$requestId=${orderId}`;
  const crypto = require("crypto");
  const signature = crypto
    .createHmac("sha256", config.momo.secretKey)
    .update(rawSignature)
    .digest("hex");

  const requestBody = JSON.stringify({
    partnerCode: "MOMO",
    requestId: requestId,
    orderId: orderId,
    signature: signature,
    lang: "vi",
  });

  const options = {
    url: "https://test-payment.momo.vn/v2/gateway/api/query",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestBody,
  };
  let result;
  try {
    result = await axios(options);
    return res.send(result.data);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Lôi khi thanh toán momo!"));
  }
};
