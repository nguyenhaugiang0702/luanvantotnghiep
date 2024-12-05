import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import "dotenv/config";

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
      "/api/v1/user/payment/momo": {
        target: "https://nhgbookstore.serveo.net",
        changeOrigin: true,
      },
      "/api/v1/user/payment/zalopay": {
        target: "https://nhgbookstore.serveo.net",
        changeOrigin: true,
      },
    },
  },
});
