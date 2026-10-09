// Entry point khusus mode Vite murni (`bun run dev:vite`).
// Saat dijalankan lewat Nuxt, berkas ini tidak dipakai.
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import { createAppRouter } from "./router";
import "./index.css";

createApp(App).use(createPinia()).use(createAppRouter()).mount("#app");
