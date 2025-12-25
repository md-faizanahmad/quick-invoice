import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    VitePWA({
      registerType: "autoUpdate",
      strategies: "generateSW",
      injectRegister: "auto",

      devOptions: {
        enabled: false, // 🔴 TURN OFF IN DEV
      },

      includeAssets: ["favicon.svg"],
      manifest: false,

      workbox: {
        cleanupOutdatedCaches: true,
        navigateFallback: "/index.html",
        runtimeCaching: [
          {
            urlPattern:
              /^https:\/\/offline-expense-tracker-backend\.vercel\.app\/sync$/,
            handler: "NetworkOnly",
            method: "POST",
          },
        ],
      },
    }),
  ],
});
