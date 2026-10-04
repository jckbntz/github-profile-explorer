import react from "@vitejs/plugin-react";
// import { defineConfig } from "vite";
import { defineConfig } from "vitest/config";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: { "/api": "http://localhost:4000" }, // browser calls /api, Vite forwards it
  },
  test: { environment: "jsdom" },
});
