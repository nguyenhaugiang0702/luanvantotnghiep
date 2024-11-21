const nodemailer = require("nodemailer");
const config = require("../config/index");

exports.sendEmail = async (option) => {
  const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    auth: {
      user: config.email.user,
      pass: config.email.password,
    },
  });

  const emailOptions = {
    from: "NHG BOOKSTORE <nhgbookstore@gmail.com>",
    to: option.email,
    subject: option.subject,
    text: option.text,
  };

  await transporter.sendMail(emailOptions);
};

