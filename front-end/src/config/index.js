const apiUrl = import.meta.env.VITE_APP_API_URL;
// const apiPort = import.meta.env.VITE_APP_API_PORT;
const appPort = import.meta.env.VITE_APP_PORT;

const config = {
  apiUrl: `${apiUrl}/api/v1`,
  appPort: appPort,
  imgUrl: apiUrl,
};

export default config;
