import type { AstroIntegration } from "astro";
import { glob, readFile, writeFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { htmlToMarkdown } from "./html-to-markdown.js";
import { markdownPathToHtmlPath } from "./markdown-route-paths.js";

export function markdownPages(): AstroIntegration {
  return {
    name: "kappa-markdown-pages",
    hooks: {
      "astro:server:setup": ({ server }) => {
        server.middlewares.use(async (request, response, next) => {
          const requestUrl = request.url ?? "";
          const pathname = new URL(requestUrl, "http://localhost").pathname;
          const htmlPath = markdownPathToHtmlPath(pathname);

          if (!htmlPath) return next();

          try {
            const address = server.httpServer?.address();
            const port = address && typeof address === "object" ? address.port : 4321;
            const pageResponse = await fetch(`http://127.0.0.1:${port}${htmlPath}`, {
              headers: { Accept: "text/html" },
            });

            if (!pageResponse.ok) {
              response.statusCode = 404;
              response.end("Page not found");
              return;
            }

            const markdown = htmlToMarkdown(await pageResponse.text());
            response.setHeader("Content-Type", "text/markdown; charset=utf-8");
            response.end(markdown);
          } catch (error) {
            console.error(`[kappa-markdown-pages] Failed to convert ${requestUrl}:`, error);
            response.statusCode = 500;
            response.end("Internal server error");
          }
        });
      },

      "astro:build:done": async ({ dir, logger }) => {
        const outDir = fileURLToPath(dir);
        const changelogAllPage = "docs/changelog/all/index.html";
        let generated = 0;
        let skipped = 0;

        for await (const htmlFile of glob(join(outDir, "docs", "**", "index.html"))) {
          const relativeHtmlFile = relative(outDir, htmlFile).split(sep).join("/");

          if (
            relativeHtmlFile.startsWith("docs/changelog/") &&
            relativeHtmlFile !== changelogAllPage
          ) {
            skipped++;
            continue;
          }

          try {
            const html = await readFile(htmlFile, "utf8");
            if (!/<main[^>]*>/i.test(html)) {
              skipped++;
              continue;
            }

            const markdown = htmlToMarkdown(html);
            if (!markdown) {
              skipped++;
              continue;
            }

            const relativeMarkdownFile =
              relativeHtmlFile === changelogAllPage
                ? "docs/changelog.md"
                : relativeHtmlFile.replace(/\/index\.html$/, ".md");
            await writeFile(join(outDir, relativeMarkdownFile), markdown, "utf8");
            generated++;
          } catch (error) {
            logger.warn(`Failed to generate Markdown for ${relativeHtmlFile}: ${String(error)}`);
            skipped++;
          }
        }

        logger.info(`Generated ${generated} Markdown pages (${skipped} skipped)`);
      },
    },
  };
}
