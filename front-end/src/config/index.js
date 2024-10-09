const apiUrl = import.meta.env.VITE_APP_API_URL;
// const apiPort = import.meta.env.VITE_APP_API_PORT;
const appPort = import.meta.env.VITE_APP_PORT;
const TOKEN_API_GHN = import.meta.env.VITE_APP_GHN_TOKEN_API;
const SHOP_ID_GHN = import.meta.env.VITE_APP_SHOP_ID;

const config = {
  apiUrl: `${apiUrl}/api/v1`,
  appPort: appPort,
  imgUrl: apiUrl,
  ghn: {
    token: TOKEN_API_GHN,
    shopID: SHOP_ID_GHN,
  },
};

export default config;
