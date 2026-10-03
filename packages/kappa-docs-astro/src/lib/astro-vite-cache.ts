import { fileURLToPath } from "node:url";
import type { AstroIntegration } from "astro";

/** Keep sync/build optimizers from replacing a running dev server's dependencies. */
export const isolatedViteCache = (): AstroIntegration => ({
  name: "kappa-isolated-vite-cache",
  hooks: {
    "astro:config:setup": ({ command, config, updateConfig }) => {
      updateConfig({
        vite: {
          cacheDir: fileURLToPath(new URL(`node_modules/.vite/kappa-${command}/`, config.root)),
        },
      });
    },
  },
});
