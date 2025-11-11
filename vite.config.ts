import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => ({
  base: "/frontend",
  server: {
    host: true,
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
      },
      "/images": {
        target: "http://localhost:9000",
      },
    },
  },
  plugins: [
    react(),
    tsconfigPaths(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Lab5 App",
        short_name: "Lab5",
        start_url: mode === 'development' ? "/" : "/lab56/",
        scope: mode === 'development' ? "/" : "/lab56/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#0d6efd",
        icons: [
          { src: "/pwa-192.png", sizes: "192x192", type: "image/png" },
          { src: "/pwa-512.png", sizes: "512x512", type: "image/png" },
        ],
      },
    }),
  ],
}));
