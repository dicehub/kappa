import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, relative, resolve, sep } from "node:path";

const repairs = JSON.parse(readFileSync(new URL("./ark-declaration-repairs.json", import.meta.url), "utf8"));
const groups = new Set(["color-picker", "file-upload", "listbox", "progress", "select", "slider", "highlight"]);
const vendorDirectory = "_vendor/ark-ui-vue";
const moduleReferences = /(?:\bfrom\s*|\bimport\s*\(\s*)["']([^"']+)["']/g;
const sha256 = (content) => createHash("sha256").update(content).digest("hex");

export const rewriteArkDeclarationImports = (content, filePath, outputRoot) =>
  content.replace(/(\bfrom\s*["']|\bimport\(\s*["'])@ark-ui\/vue\/([^"']+)(["'])/g,
    (match, prefix, group, suffix) => {
      if (!groups.has(group)) return match;
      const target = resolve(outputRoot, vendorDirectory, "components", group, "index.js");
      const path = relative(dirname(filePath), target).split(sep).join("/");
      return `${prefix}${path.startsWith(".") ? path : `./${path}`}${suffix}`;
    });

export const repairArkDeclaration = (path, content, runtime) => {
  const key = path.replace(/^components\//, "").replace(/(?:\.vue)?\.d\.ts$/, "");
  const repair = repairs[key];
  if (!repair) return content;
  if (sha256(content) !== repair.declaration || (repair.runtime && sha256(runtime) !== repair.runtime)) {
    throw new Error(`Ark declaration repair input changed: ${path}. Review the upstream declaration and slot contract.`);
  }
  if (repair.runtime) {
    // These nine upstream components render an unscoped default slot. Keep the
    // missing helper local to its declaration; never add a global Vue shim.
    return `${content}\ntype __VLS_Slots = { default?: () => import("vue").VNode[] };\n`;
  }
  return content.replace("import { HighlightChunk } from '@zag-js/highlight-word';\n", "");
};

export const generateArkDeclarations = (packageRoot, outputRoot) => {
  const arkRoot = resolve(packageRoot, "node_modules/@ark-ui/vue");
  const arkManifest = JSON.parse(readFileSync(resolve(arkRoot, "package.json"), "utf8"));
  const manifest = JSON.parse(readFileSync(resolve(packageRoot, "package.json"), "utf8"));
  if (arkManifest.version !== "5.39.2" || manifest.dependencies["@ark-ui/vue"] !== "5.39.2") {
    throw new Error("Review or remove the Ark declaration repairs when changing @ark-ui/vue 5.39.2.");
  }
  const sourceRoot = resolve(arkRoot, "dist");
  const vendorRoot = resolve(outputRoot, vendorDirectory);
  const visited = new Set();
  const externals = new Set();
  const visit = (path) => {
    if (visited.has(path)) return;
    visited.add(path);
    const relativePath = relative(sourceRoot, path).split(sep).join("/");
    if (relativePath.startsWith("../")) throw new Error(`Ark declaration escapes dist: ${path}`);
    const key = relativePath.replace(/^components\//, "").replace(/(?:\.vue)?\.d\.ts$/, "");
    const runtime = repairs[key]?.runtime
      ? readFileSync(path.replace(/\.vue\.d\.ts$/, ".vue_vue_type_script_setup_true_lang.js"), "utf8")
      : undefined;
    const content = repairArkDeclaration(relativePath, readFileSync(path, "utf8"), runtime);
    for (const [, specifier] of content.matchAll(moduleReferences)) {
      if (!specifier.startsWith(".")) {
        externals.add(specifier);
        continue;
      }
      const declaration = specifier.endsWith(".js")
        ? specifier.replace(/\.js$/, ".d.ts") : `${specifier}.d.ts`;
      visit(resolve(dirname(path), declaration));
    }
    const destination = resolve(vendorRoot, relativePath);
    mkdirSync(dirname(destination), { recursive: true });
    writeFileSync(destination, content);
  };
  for (const group of groups) visit(resolve(sourceRoot, "components", group, "index.d.ts"));
  for (const dependency of externals) {
    if (dependency === "vue") continue;
    if (!arkManifest.dependencies[dependency] || !manifest.dependencies[dependency]
      || manifest.dependencies[dependency] !== arkManifest.dependencies[dependency]) {
      throw new Error(`Declare ${dependency} at Ark's exact version ${arkManifest.dependencies[dependency]}.`);
    }
  }
  writeFileSync(resolve(vendorRoot, "LICENSE"), readFileSync(resolve(arkRoot, "LICENSE")));
  console.log(`Generated ${visited.size} private Ark declarations with bounded repairs.`);
};
