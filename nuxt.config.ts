import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";

const customPort = Number(process.env.APP_PORT || process.env.PORT) || 3000;

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  telemetry: false,

  // Disable SSR for SPA mode (client-side routing and storage)
  ssr: false,

  // Let Nuxt look into src/ for application source files
  srcDir: "src/",

  // Enable vue-router; routes are supplied by src/router.options.ts
  pages: true,

  css: ["~/index.css"],

  modules: ["@pinia/nuxt"],

  hooks: {
    // Komponen root proyek ini bernama src/App.vue (huruf kapital).
    // Nuxt mencari "app.vue", sehingga di sistem file case-sensitive (Linux)
    // lokasi root component perlu diarahkan secara eksplisit.
    "app:resolve"(app) {
      app.mainComponent = fileURLToPath(new URL("./src/App.vue", import.meta.url));
    },
  },

  vite: {
    plugins: [tailwindcss()],
    define: {
      DELCOM_BASEURL: JSON.stringify(
        process.env.VITE_DELCOM_BASEURL || "https://open-api.delcom.org/api/v1"
      ),
    },
    build: {
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("@toast-ui")) {
                return "toast-ui";
              }
              return "vendor";
            }
          },
        },
      },
    },
  },

  devServer: {
    port: customPort,
  },

  nitro: {
    devPort: customPort,
    externals: {
      inline: ["@vue/shared"],
    },
  },

  app: {
    head: {
      title: "Delcom Cash Flow",
      htmlAttrs: {
        lang: "id",
      },
      meta: [
        {
          name: "description",
          content:
            "Delcom Cash Flow: aplikasi pencatat arus kas pribadi untuk mencatat pemasukan, pengeluaran, dan saldo.",
        },
      ],
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/logo.svg" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          // Dimuat non-blocking agar tidak menghambat render pertama
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600&display=swap",
          media: "print",
          onload: "this.media='all'",
        },
      ],
      bodyAttrs: {
        class: "bg-slate-50 text-slate-900 font-sans antialiased min-h-screen",
      },
    },
  },
});
