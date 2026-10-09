import tailwindcss from "@tailwindcss/vite";

const customPort = Number(process.env.APP_PORT || process.env.PORT) || 3000;

export default defineNuxtConfig({
  compatibilityDate: "2026-10-08",
  devtools: { enabled: true },
  telemetry: false,

  ssr: false,
  srcDir: "src/",
  pages: true,

  css: ["~/index.css"],
  modules: ["@pinia/nuxt"],

  experimental: {
    appManifest: false,
  },

  vite: {
    plugins: [tailwindcss()],
    define: {
      DELCOM_BASEURL: JSON.stringify(
        process.env.VITE_DELCOM_BASEURL || "https://open-api.delcom.org/api/v1"
      ),
    },
  },

  devServer: {
    port: customPort,
  },

  app: {
    head: {
      title: "Delcom Cash Flow",
      htmlAttrs: { lang: "id" },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/logo.svg" },
        { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" },
      ],
      bodyAttrs: {
        class: "bg-slate-50 text-slate-900 font-sans antialiased min-h-screen",
      },
    },
  },
});