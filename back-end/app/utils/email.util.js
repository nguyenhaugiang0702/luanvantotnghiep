const nodemailer = require("nodemailer");
const config = require("../config/index");

const sendEmail = async (option) => {
  const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    auth: {
      user: config.email.user,
      pass: config.email.password,
    },
  });
  const otpCode = Math.floor(100000 + Math.random() * 900000);

  const emailOptions = {
    from: "NHG BOOKSTORE <nhgbookstore@gmail.com>",
    to: option.email,
    subject: option.subject,
    text: `Your OTP code is ${otpCode}`,
  };

  await transporter.sendMail(emailOptions);
  return otpCode;
};

module.exports = sendEmail;
