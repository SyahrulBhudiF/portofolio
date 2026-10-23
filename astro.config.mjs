// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";

import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";

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
