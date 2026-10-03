/**
 * Post-build check for `pnpm build`: the packed theme assets must match the
 * generated sources. A stale `dist/` fails loudly here instead of silently
 * differing from the published files.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { themeOutputFiles } from "./theme-generator/render.mjs";

const packageRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));

const readText = (file) => {
  try {
    return readFileSync(resolve(packageRoot, file), "utf8");
  } catch {
    return null;
  }
};

const problems = [];
for (const sourceFile of Object.values(themeOutputFiles)) {
  const builtFile = `dist/${sourceFile.replace("src/", "")}`;
  const built = readText(builtFile);

  if (built === null) problems.push(`${builtFile} is missing`);
  else if (built !== readText(sourceFile)) problems.push(`${builtFile} does not match ${sourceFile}`);
}

if (problems.length) {
  throw new Error(`${problems.join(", ")}. Run \`pnpm --filter @dicehub/kappa build\`.`);
}

console.log(`Validated built theme assets for ${Object.keys(themeOutputFiles).length} files.`);
