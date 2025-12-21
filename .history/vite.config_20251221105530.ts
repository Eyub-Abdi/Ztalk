import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@features": "/src/features",
      "@lib": "/src/lib",
      "@theme": "/src/theme",
      "@components": "/src/components",
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://88c787f44fd1.ngrok-free.app",
        changeOrigin: true,
        secure: false,
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
        // Preserve /api prefix when proxying
        // e.g. /api/auth/login -> https://.../api/auth/login
      },
    },
  },
  build: {
    sourcemap: true,
  },
});
