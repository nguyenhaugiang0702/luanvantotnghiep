require("dotenv").config();

const config = {
  app: {
    port: process.env.APP_PORT,
    appUrl: `${process.env.APP_URL}:${process.env.APP_PORT}`,
  },
  db: {
    uri: process.env.MONGODB_URI,
  },
  email: {
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
  },
  viteApp: {
    viteURL: `${process.env.VITE_APP_API_URL}:${process.env.VITE_APP_API_PORT}`,
  },
  momo: {
    accessKey: process.env.MOMO_ACCESSKEY,
    secretKey: process.env.MOMO_SECRETKEY,
  },
  zalopay: {
    app_id: process.env.ZALOPAY_APP_ID,
    key1: process.env.ZALOPAY_KEY1,
    key2: process.env.ZALOPAY_KEY2,
    endpoint: process.env.ZALOPAY_ENDPOINT,
  },
  paypal: {
    client_id: process.env.PAYPAL_CLIENT_ID,
    client_secret: process.env.PAYPAL_CLIENT_SECRET,
    mode: process.env.PAYPAL_MODE,
  },
};

module.exports = config;
