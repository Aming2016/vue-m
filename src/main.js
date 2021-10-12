import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "amfe-flexible";
import "@/styles/index.scss";
import components from "@/components";

const app = createApp(App);
app.use(components);
app.use(store);
app.use(router);
app.mount("#app");
