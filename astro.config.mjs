// @ts-check

import mdx from "@astrojs/mdx";

import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://www.ryuko.my.id",
  integrations: [react(), mdx()],
  vite: {
    // Production builds must not replace a running dev server's dependency cache.
    cacheDir: `./node_modules/.vite/${process.env.NODE_ENV}`,
    plugins: [tailwindcss()],
  },
});
