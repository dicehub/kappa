import type { AstroIntegration } from "astro";

/** Avoid duplicate page renders from Astro's client router during local development. */
export const developmentNavigation = (): AstroIntegration => ({
  name: "kappa-development-navigation",
  hooks: {
    "astro:config:setup": ({ command, updateConfig }) => {
      if (command === "dev") updateConfig({ prefetch: false });
    },
  },
});
