import { createApp } from "vue";
import GoogleSignInPlugin from "vue3-google-signin";

import "./assets/css/tailwind.css";
import App from "./App.vue";
import { router } from "./core/router";

import VueTelInput from "vue3-tel-input";
import "vue3-tel-input/dist/vue3-tel-input.css";
import VueCountryCode from "vue-country-code";

import "animate.css";

import { createPinia } from "pinia";

const pinia = createPinia();
const app = createApp(App);

app.use(router);
app.use(pinia);

app.use(VueTelInput);
app.use(VueCountryCode);


app.use(GoogleSignInPlugin, {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
});

app.mount("#app");
