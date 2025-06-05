import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

// FontAwesome 匯入
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUser, faCoffee ,faUserPen, faRightToBracket , faStar ,faCartShopping ,faComment} from '@fortawesome/free-solid-svg-icons'
library.add(faUser, faCoffee, faUserPen ,faRightToBracket ,faStar ,faCartShopping, faComment)

const app = createApp(App);
app.component('font-awesome-icon', FontAwesomeIcon);

app.use(createPinia());
app.use(router);

app.mount("#app");
