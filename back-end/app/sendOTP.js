const axios = require("axios");
require("dotenv").config();

const API_KEY = process.env.INFOBIP_API_KEY;
const API_BASE_URL = process.env.INFOBIP_API_BASE_URL;

const formatPhoneNumber = async (phoneNumber) => {
  // Thêm mã quốc gia (+84) vào số điện thoại
  if (phoneNumber.startsWith("0")) {
    return `84${phoneNumber.slice(1)}`;
  }

  return await phoneNumber;
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

// Hàm gửi mã OTP tới số điện thoại
const sendOTP = async (phoneNumber) => {
  const otp = generateOTP();
  const formattedPhoneNumber = await formatPhoneNumber(phoneNumber);
  // Cấu hình request để gửi SMS
  const options = {
    method: "POST",
    url: `https://${API_BASE_URL}/sms/2/text/advanced`,
    headers: {
      Authorization: `App ${API_KEY}`, // API key của bạn
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    data: {
      messages: [
        {
          destinations: [{ to: formattedPhoneNumber }],
          from: "447491163443",
          text: `Mã OTP của bạn là ${otp}, thời gian hết hạn là 2 phút`,
        },
      ],
    },
  };

  // Gửi yêu cầu và xử lý phản hồi
  return axios(options)
    .then((response) => {
      console.log("Response:", response.data); 
      return otp; 
    })
    .catch((error) => {
      console.error("Error:", error); 
      throw error; 
    });
};

module.exports = sendOTP;
