import { createSSRApp } from "vue";
import App from "./App.vue";
import messages from "./locales/index";
import { createI18n } from "vue-i18n"; // v9.x
import * as Pinia from "pinia";
import ppp from "@/store/pinia"
let i18nConfig = {
  legacy: false,
  locale: uni.getLocale() || "en", // 获取已设置的语言
  messages
};

const i18n = createI18n(i18nConfig);

export function createApp() {
  const app = createSSRApp(App);
  app.use(ppp);
  app.use(i18n);
  return {
    app,
    Pinia
  };
}
