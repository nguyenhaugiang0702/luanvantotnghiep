require("dotenv").config();
const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

const formatPhoneNumber = (phoneNumber) => {
    // Thêm mã quốc gia (+84) vào số điện thoại
    if (phoneNumber.startsWith('0')) {
      return `+84${phoneNumber.slice(1)}`;
    }
    return phoneNumber;
  };

const sendOTP = async (phoneNumber) => {
  try {
    const otpCode = Math.floor(100000 + Math.random() * 900000);
    const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
    const message = await client.messages.create({
      body: `Your OTP code is ${otpCode}`,
      from: "+19383563086", 
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
