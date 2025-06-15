import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import Toast from "vue-toastification";
import 'vue-toastification/dist/index.css'
import { options } from './config/toast.js'

import App from "./App.vue";
import router from "./router";


const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Toast, options)

app.mount("#app");
