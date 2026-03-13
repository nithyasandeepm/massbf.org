// @ts-check

import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 5000,
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: "all",
    },
  },
});
