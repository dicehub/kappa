import type { AstroIntegration } from "astro";
import { glob, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

export function licenseNotices(): AstroIntegration {
  let root: URL;

  const sourceNotices = async () => {
    const [license, notices, geist, nunito, echartsNotice] = await Promise.all([
      readFile(new URL("../../LICENSE", root), "utf8"),
      readFile(new URL("../kappa/THIRD_PARTY_NOTICES.md", root), "utf8"),
      readFile(new URL("public/fonts/geist/OFL.txt", root), "utf8"),
      readFile(new URL("public/fonts/nunito/LICENSE", root), "utf8"),
      readFile(new URL("node_modules/echarts/NOTICE", root), "utf8"),
    ]);
    return [
      "# License scope",
      "Kappa's MIT license covers its original source code, examples, and documentation text. Adapted source, dependencies, and fonts retain their own copyright and license notices.",
      "Documentation artwork and brand assets are excluded from Kappa's MIT grant. Component code remains MIT. The MIT license does not grant trademark rights.",
      "# Kappa license", license, notices,
      "# Geist font", geist,
      "# Nunito font", nunito,
      "# Apache ECharts attribution", echartsNotice,
    ].join("\n\n");
  };

  return {
    name: "kappa-license-notices",
    hooks: {
      "astro:config:done": ({ config }) => { root = config.root; },
      "astro:server:setup": ({ server }) => {
        server.middlewares.use(async (request, response, next) => {
          if (new URL(request.url ?? "", "http://localhost").pathname !== "/licenses.txt") return next();
          try {
            response.setHeader("Content-Type", "text/plain; charset=utf-8");
            response.end(await sourceNotices());
          } catch (error) {
            next(error);
          }
        });
      },
      "astro:build:done": async ({ dir, logger }) => {
        const outputRoot = fileURLToPath(dir);
        const bundledNotices: string[] = [];
        for await (const path of glob(join(outputRoot, "**", "dependency-licenses.md"))) {
          bundledNotices.push(await readFile(path, "utf8"));
        }
        if (bundledNotices.length === 0) throw new Error("The docs build is missing bundled dependency licenses.");
        await writeFile(join(outputRoot, "licenses.txt"), [
          await sourceNotices(),
          "# Bundled documentation dependencies",
          ...bundledNotices,
        ].join("\n\n"), "utf8");
        logger.info("Published project, upstream, font, and bundled dependency notices at /licenses.txt");
      },
    },
  };
}
