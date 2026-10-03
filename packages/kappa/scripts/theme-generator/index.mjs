import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { themeConfig } from "./config.ts";
import { collectThemeOutputs, findStaleThemeOutputs } from "./render.mjs";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(scriptDir, "../..");
const checkOnly = process.argv.includes("--check");

const outputs = collectThemeOutputs(themeConfig);
const summary = `${themeConfig.tokens.length} semantic tokens across ${themeConfig.modes.length} modes`;

const readOutput = (file) => {
  try {
    return readFileSync(resolve(packageRoot, file), "utf8");
  } catch {
    return null;
  }
};

if (checkOnly) {
  const stale = findStaleThemeOutputs(outputs, readOutput);
  if (stale.length) {
    throw new Error(
      `${stale.join(", ")}. Run \`pnpm --filter @dicehub/kappa codegen:themes\`.`,
    );
  }
} else {
  for (const output of outputs) {
    const target = resolve(packageRoot, output.file);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, output.contents);
  }
}

console.log(
  checkOnly
    ? `Validated generated theme assets for ${summary}.`
    : `Generated theme assets for ${summary}.`,
);
