import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import Toast, { useToast } from "vue-toastification";
import "vue-toastification/dist/index.css";

import App from "./App.vue";
import router from "./router";


const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Toast, {
  position: "top-center",
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true,
  hideProgressBar: false,    // 顯示底部進度條
  toastClassName: "bg-primary/10 text-primary border border-primary/30 rounded-lg",
});


app.mount("#app");
