import { defineConfig } from "astro/config";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  site: "https://ann-k.github.io",
  base: "/martin-portfolio",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "ru"],
    fallback: { ru: "en" },
    falbackType: "rewrite",
  },
});
