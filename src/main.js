import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import Toast, { toastOptions } from "./plugins/toast";

import App from "./App.vue";
import router from "./router";


const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Toast, toastOptions);


app.mount("#app");
