import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import 'dotenv/config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 3001,
    proxy: {
      "/api/v1": {
        target: "http://localhost:3000/",
        changeOrigin: true,
      },
      "/api/v1/orders/momo/callback": {
        target: "https://nhgbookstore.serveo.net",
        changeOrigin: true,
      },
      "/api/v1/orders/zalopay/callback": {
        target: "https://nhgbookstore.serveo.net",
        changeOrigin: true,
      },
      "/api/v1/orders/paypal/success": {
        target: "https://nhgbookstore.serveo.net",
        changeOrigin: true,
      },
      "/api/v1/orders/paypal/cancel": {
        target: "https://nhgbookstore.serveo.net",
        changeOrigin: true,
      },
    },
  },
});
