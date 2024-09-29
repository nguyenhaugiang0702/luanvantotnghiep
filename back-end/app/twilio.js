require("dotenv").config();
const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const phoneNumberHost = process.env.TWILIO_PHONE_NUMBER;
const client = new twilio(accountSid, authToken);

const formatPhoneNumber = async (phoneNumber) => {
  // Thêm mã quốc gia (+84) vào số điện thoại
  if (phoneNumber.startsWith("0")) {
    return `+84${phoneNumber.slice(1)}`;
  }

  return await phoneNumber;
};



const sendOTP = async (phoneNumber) => {
  try {
    const otpCode = Math.floor(100000 + Math.random() * 900000);
    const formattedPhoneNumber = await formatPhoneNumber(phoneNumber);
    const message = await client.messages.create({
      body: `[NHG BOOKSTORE] Mã OTP của bạn là ${otpCode}, bạn có 2 phút để xác nhận.`,
      from: phoneNumberHost,
      to: formattedPhoneNumber,
    });
    console.log("OTP sent:", message.sid);
    return otpCode;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};

module.exports = sendOTP;
