import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [],
  site: "https://ann-k.github.io",
  // base: "/martin-portfolio",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "ru"],
    fallback: { ru: "en" },
    falbackType: "rewrite",
  },
});
