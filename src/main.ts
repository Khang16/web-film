import { createApp } from "vue";
import { VueQueryPlugin } from "@tanstack/vue-query";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import i18n from "./i18n";
import "./style.css"

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(i18n)
app.use(router);
app.use(VueQueryPlugin);

app.mount("#app");
