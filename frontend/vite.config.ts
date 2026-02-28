/// <reference types="vitest/config" />
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    port: 5173,
    watch: {
      // Use polling for Docker volume mounts (file-system events don't propagate)
      usePolling: true,
      interval: 1000,
    },
    hmr: {
      // Allow HMR websocket to reach the container from the host browser
      clientPort: 5173,
    },
    proxy: {
      // Only proxy API calls (not the SPA /dashboard route)
      "/dashboard/v1": {
        target: process.env.VITE_API_BASE_URL || "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/test/**", "src/**/*.d.ts", "src/main.tsx"],
    },
  },
});
