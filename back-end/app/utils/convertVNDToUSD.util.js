const axios = require("axios");

// Hàm để lấy tỷ giá VNĐ sang USD
async function getExchangeRate() {
  const apiKey = "1dfb96183ff6a103ecfcd935";
  const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;

  try {
    const response = await axios.get(url);
    const exchangeRates = response.data.conversion_rates;
    return exchangeRates["VND"]; // Tỷ giá VNĐ sang USD
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    throw new Error("Không thể lấy tỷ giá USD");
  }
}

// Hàm chuyển đổi VNĐ sang USD
async function convertVNDToUSD(amountVND) {
  try {
    const exchangeRate = await getExchangeRate();
    const amountUSD = amountVND / exchangeRate;
    return amountUSD.toFixed(2); // Định dạng giá tiền USD với 2 chữ số thập phân
  } catch (error) {
    console.error("Error converting VND to USD:", error);
    throw new Error("Không thể chuyển đổi VNĐ sang USD");
  }
}

module.exports = {
  convertVNDToUSD,
};
