// vite.config.js

import { defineConfig } from "vite";
import { resolve } from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  appType: "mpa",
  plugins: [tailwindcss()],
  build: {
    emptyOutDir: true,
    rollupOptions: {
      input: {},
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@js": resolve(__dirname, "./src/assets/js"),
      "@css": resolve(__dirname, "./src/assets/css"),
      "@img": resolve(__dirname, "./src/assets/img"),
      "@icons": resolve(__dirname, "./src/assets/icons"),
      "@audio": resolve(__dirname, "./src/assets/audio"),
      "@json": resolve(__dirname, "./src/assets/json"),
    },
  },
});
