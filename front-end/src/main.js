import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router/index.js";
import axios from "axios";
window.axios = axios;
// Boostrap v5.3
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.js";
// Fontawesome
import "../node_modules/@fortawesome/fontawesome-free/css/all.min.css";
// Ant Design
import Antd from "ant-design-vue";
import * as Icons from "@ant-design/icons-vue";
import "ant-design-vue/dist/reset.css";
// Vue3 toast
import "vue3-toastify/dist/index.css";
// ApexChart
import VueApexCharts from 'vue3-apexcharts';


const app = createApp(App);
app.use(VueApexCharts);
app.component('apexchart', VueApexCharts);
app.use(router);
app.use(createPinia());
app.use(Antd);

// Đăng ký các biểu tượng
Object.keys(Icons).forEach((key) => {
  app.component(key, Icons[key]);
});
app.mount("#app");
