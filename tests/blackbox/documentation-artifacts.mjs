import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { run } from "./process.mjs";

export async function documentationArtifacts(root, scratch, full) {
  const rows = (await readFile(join(root, "docs/test-rework/docs-and-tools.jsonl"), "utf8"))
    .trim().split("\n").map(line => JSON.parse(line));
  const groups = rows.filter(row => row.category === "KEEP-BB" && row.id.includes(".test.mjs:"));
  if (!groups.length) throw new Error("No retained public artifact checks were selected.");
  const files = [...new Set(groups.map(row => row.id.replace(/:\d+$/, "")))];
  const escape = text => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const name = value => {
    try { return JSON.parse(value); } catch { return value.replace(/^'|'$/g, ""); }
  };
  const names = groups.map(row => `${row.suite.length ? row.suite.map(name).join(" ") + " " : ""}${row.behavior}`);
  const sha256 = value => createHash("sha256").update(value).digest("hex");
  await writeFile(join(scratch, "documentation-artifacts-selection.json"), JSON.stringify({
    selected: groups.map((row, index) => ({ id: row.id, name: names[index] })),
    inventorySha256: sha256(await readFile(join(root, "docs/test-rework/docs-and-tools.jsonl"))),
    routesSha256: sha256(await readFile(join(root, "docs/test-rework/docs-routes-baseline.json"))),
  }, null, 2));
  const paths = [];
  for (const file of files) {
    const prefix = "packages/kappa-docs-astro/";
    if (!file.startsWith(prefix)) throw new Error(`Unexpected retained artifact surface: ${file}`);
    const target = join(full, file.slice(prefix.length));
    await cp(join(root, file), target);
    // This output check needs an independent sidecar-path oracle. Other groups
    // in the mixed file do not run here; they remain in the original suite.
    if (file.endsWith("astro-markdown-pages.test.mjs")) {
      const source = await readFile(target, "utf8");
      const importPath = 'from "./markdown-route-paths.ts"';
      if (source.split(importPath).length !== 2) throw new Error("Artifact path import changed; review the independent oracle.");
      await writeFile(target, source.replace(importPath, 'from "../../blackbox/artifact-paths.mjs"'));
    }
    paths.push(file.slice(prefix.length));
  }
  await mkdir(join(full, "blackbox"), { recursive: true });
  await writeFile(join(full, "blackbox/artifact-paths.mjs"), [
    'import { readFileSync } from "node:fs";',
    'const routes = JSON.parse(readFileSync(new URL("./docs-routes-baseline.json", import.meta.url)));',
    'routes.push("/docs/components/code-block/", "/docs/components/code-block.md");',
    'const pairs = routes.filter(route => route.endsWith(".md") && route.startsWith("/docs")).map(markdown => [markdown === "/docs.md" ? "/docs/" : markdown === "/docs/changelog.md" ? "/docs/changelog/all/" : `${markdown.slice(0, -3)}/`, markdown]);',
    'const html = new Map(pairs); const markdown = new Map(pairs.map(([page, sidecar]) => [sidecar, page]));',
    'html.set("/docs/changelog/", "/docs/changelog.md");',
    'export const htmlPathToMarkdownPath = path => html.get(path);',
    'export const markdownPathToHtmlPath = path => markdown.get(path);',
  ].join("\n"));
  const result = await run("node", ["--test", "--test-reporter=tap", `--test-name-pattern=^(?:${names.map(escape).join("|")})$`, ...paths], {
    cwd: full, log: join(scratch, "documentation-artifacts.log"),
  });
  const count = label => Number(result.output.match(new RegExp(`^# ${label} (\\d+)$`, "m"))?.[1]);
  if (count("tests") !== groups.length || count("pass") !== groups.length ||
    ["fail", "cancelled", "skipped", "todo"].some(label => count(label) !== 0)) {
    throw new Error(`Expected ${groups.length} passing retained artifact cases with no omissions; ${scratch}/documentation-artifacts.log`);
  }
  console.log(`Retained public documentation artifacts: ${groups.length} passed.`);
}
