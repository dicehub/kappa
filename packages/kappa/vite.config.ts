import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import vue from "@vitejs/plugin-vue";
import dts from "unplugin-dts/vite";
import { defineConfig, type Plugin } from "vite";
import { preserveCompoundDeclarations } from "./scripts/declaration-barrels.mjs";
import { generateArkDeclarations, rewriteArkDeclarationImports } from "./scripts/ark-declarations.mjs";

const source = (...parts: string[]) => resolve(import.meta.dirname, "src", ...parts);
const output = (...parts: string[]) => resolve(import.meta.dirname, "dist", ...parts);
const packageManifest = JSON.parse(readFileSync(resolve(import.meta.dirname, "package.json"), "utf8")) as {
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};
const externalPackages = [
  ...Object.keys(packageManifest.dependencies ?? {}),
  ...Object.keys(packageManifest.peerDependencies ?? {}),
];

/**
 * Copies the generated theme assets into the published output. The theme has no
 * JavaScript entry, so the library build has to emit the files directly.
 */
const themeAssets = (): Plugin => ({
  name: "kappa-theme-assets",
  generateBundle() {
    for (const file of [
      "registry/component-registry.json",
      "styles/theme-kappa.css",
      "styles/tokens.json",
    ]) {
      this.emitFile({
        type: "asset",
        fileName: file,
        source: readFileSync(source(file), "utf8"),
      });
    }
  },
});


const publicEntries = Object.fromEntries(
  ["components", "blocks"].flatMap((area) =>
    readdirSync(source(area), { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => [`${area}/${entry.name}`, source(area, entry.name, "index.ts")]),
  ),
);

export default defineConfig({
  plugins: [
    vue(),
    dts({
      beforeWriteFile(filePath, content) {
        const outputPath = relative(output(), filePath);
        // Keep MapLibre's ambient types when consumers set compilerOptions.types.
        // unplugin-dts removes the preserved source reference during its rewrite.
        if (outputPath === "components/map-view/map-view.d.ts") {
          content = `/// <reference types="geojson" />\n${content}`;
        }
        if (/^(blocks|components)\/[^/]+\/index\.d\.ts$/.test(outputPath)) {
          content = preserveCompoundDeclarations(
            readFileSync(source(outputPath.replace(/\.d\.ts$/, ".ts")), "utf8"),
            content,
          );
        }
        // JS entries sit beside declaration folders. Refer to each folder's
        // index explicitly so TypeScript does not select the sibling JS file.
        content = content.replace(
          /(\bfrom\s*["']|\bimport\(\s*["'])(\.[^"']+)(["'])/g,
          (match, prefix: string, specifier: string, suffix: string) =>
            existsSync(source(dirname(outputPath), specifier, "index.ts"))
              ? `${prefix}${specifier}/index${suffix}`
              : match,
        );
        return { content: rewriteArkDeclarationImports(content, filePath, output()) };
      },
      afterBuild() {
        generateArkDeclarations(import.meta.dirname, output());
      },
      entryRoot: source(),
      outDirs: output(),
      pathsToAliases: false,
      processor: "vue",
      tsconfigPath: resolve(import.meta.dirname, "tsconfig.build.json"),
    }),
    themeAssets(),
  ],
  build: {
    cssMinify: "esbuild",
    lib: {
      entry: {
        index: source("index.ts"),
        ...publicEntries,
        "components/toast/store": source("components", "toast", "store.ts"),
        registry: source("registry", "index.ts"),
      },
      formats: ["es"],
      cssFileName: "styles/kappa",
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    cssCodeSplit: false,
    rollupOptions: {
      external: (id) =>
        externalPackages.some((packageName) => id === packageName || id.startsWith(`${packageName}/`)),
    },
    sourcemap: true,
  },
});
