import { resolve } from "node:path";
import mdx from "@astrojs/mdx";
import vue from "@astrojs/vue";
import { defineConfig } from "astro/config";
import { developmentNavigation } from "./src/lib/astro-development-navigation";
import { markdownPages } from "./src/lib/astro-markdown-pages";
import { isolatedViteCache } from "./src/lib/astro-vite-cache";
import { licenseNotices } from "./src/lib/astro-license-notices";

const useKappaSource = process.env.KAPPA_SOURCE === "1";

export default defineConfig({
  site: "https://kappa-ui.com",
  integrations: [
    mdx(),
    vue(),
    markdownPages(),
    developmentNavigation(),
    isolatedViteCache(),
    licenseNotices(),
  ],
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover",
  },
  vite: {
    build: {
      cssMinify: "esbuild",
      license: { fileName: "dependency-licenses.md" },
    },
    optimizeDeps: {
      // MapLibre resolves its Web Worker at runtime. Vite's dependency optimizer
      // can rewrite that URL to a transient file and leave the map canvas blank.
      exclude: ["maplibre-gl"],
      include: [
        "@ark-ui/vue/combobox",
        "@ark-ui/vue/dialog",
        "@ark-ui/vue/factory",
        "@ark-ui/vue/menu",
      ],
    },
    resolve: {
      alias: {
        "@kappa-docs/component-styles.css": resolve(
          import.meta.dirname,
          useKappaSource ? "src/styles/kappa-source.css" : "../kappa/dist/styles/kappa.css",
        ),
      },
      ...(useKappaSource ? { conditions: ["kappa-source"] } : {}),
      dedupe: ["vue"],
    },
    ...(useKappaSource ? {
      ssr: {
        noExternal: ["@dicehub/kappa"],
        resolve: { conditions: ["kappa-source", "module", "node", "development|production"] },
      },
    } : {}),
  },
  markdown: {
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "vesper",
      },
      defaultColor: false,
    },
  },
});
