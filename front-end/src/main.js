import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router/index.js";
import axios from "axios";
window.axios = axios;

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Antd from "ant-design-vue";
import * as Icons from "@ant-design/icons-vue";
import {
  Card,
  Table,
  Menu,
  List,
  Drawer,
  Button,
  Dropdown,
} from "ant-design-vue";
import "ant-design-vue/dist/reset.css";

const app = createApp(App);
app.use(router);
app.use(createPinia());
app.use(Antd);
app.use(Button);
app.use(Card);
app.use(Table);
app.use(Drawer);
app.use(Menu);
app.use(List);
app.use(Dropdown);

// Đăng ký các biểu tượng
Object.keys(Icons).forEach((key) => {
  app.component(key, Icons[key]);
});
app.mount("#app");
