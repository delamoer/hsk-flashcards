import { createApp } from "vue";
import router from "./router";
import App from "./App.vue";
import "./styles/main.css";
import { startActivity } from "./composables/useActivity";

createApp(App).use(router).mount("#app");
// 每日学习足迹（只在登录后上报，老师在 /admin 看）
startActivity(router);
