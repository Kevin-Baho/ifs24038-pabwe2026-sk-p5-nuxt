import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  srcDir: "src/",
  modules: ["@pinia/nuxt"],
  vite: {
    plugins: [tailwindcss()]
  },
  devServer: {
    port: Number(process.env.APP_PORT) || 3000
  },
  runtimeConfig: {
    public: {
      delcomBaseUrl: process.env.VITE_DELCOM_BASEURL || "https://open-api.delcom.org/api/v1"
    }
  },
  app: {
    head: {
      title: "Delcom Cash Flow",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" }
      ],
      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
        }
      ]
    }
  }
});

