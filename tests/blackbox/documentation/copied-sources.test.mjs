import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { test } from "node:test";
import { parse, compileScript } from "vue/compiler-sfc";
import { run } from "../process.mjs";

function publicImports(root, variant) {
  const pending = [root], seen = new WeakSet();
  while (pending.length) {
    const node = pending.pop();
    if (!node || typeof node !== "object" || seen.has(node)) continue;
    seen.add(node);
    let dependency;
    if (["ImportDeclaration", "ExportNamedDeclaration", "ExportAllDeclaration", "ImportExpression"].includes(node.type)) dependency = node.source;
    if (node.type === "TSImportType") dependency = node.argument;
    if (node.type === "CallExpression" && node.callee?.type === "Import") dependency = node.arguments[0];
    if (dependency) {
      assert.equal(dependency.type, "StringLiteral", `${variant} uses static public import paths.`);
      assert.match(dependency.value, /^(?:vue|@lucide\/vue|@dicehub\/kappa(?:\/[a-z0-9/-]+)?)$/,
        `${variant} imports only public dependencies; copied examples cannot use private docs files or aliases.`);
    }
    pending.push(...Object.values(node));
  }
}

test("workspace examples served over HTTP compile in a strict installed-package Vue project", async () => {
  const base = new URL(process.env.PLAYWRIGHT_BASE_URL);
  assert.equal(base.protocol, "http:");
  assert.equal(base.hostname, "127.0.0.1");
  const response = await fetch(new URL("/docs/blocks/sidebar/", base), { redirect: "error" });
  assert.equal(response.status, 200);
  const html = await response.text();
  const parsed = parse(`<template v-pre>${html}</template>`, {
    templateParseOptions: { delimiters: ["__KAPPA_UNUSED_OPEN__", "__KAPPA_UNUSED_CLOSE__"] },
  });
  assert.deepEqual(parsed.errors, [], "The public HTML must parse.");
  const nodes = [];
  const collect = node => { nodes.push(node); for (const child of node.children ?? []) collect(child); };
  collect(parsed.descriptor.template.ast);
  const attribute = (node, name) => node.props?.find(prop => prop.type === 6 && prop.name === name)?.value?.content;
  const text = node => node.type === 2 ? node.content : (node.children ?? []).map(text).join("");
  for (const variant of ["minimal-workspace", "workspace", "workspace-pages"]) {
    const wrapper = nodes.find(node => attribute(node, "id") === `sidebar-block-${variant}-code`);
    assert.ok(wrapper, `The ${variant} source is available to copy.`);
    const children = [];
    const descendants = node => { children.push(node); for (const child of node.children ?? []) descendants(child); };
    descendants(wrapper);
    const code = children.find(node => node.tag === "code");
    assert.ok(code, `${variant} has a code block.`);
    const source = text(code);
    const component = parse(source, { filename: `PublicCopied-${variant}.vue` });
    assert.deepEqual(component.errors, [], `${variant} is a complete Vue component.`);
    const script = compileScript(component.descriptor, { id: `public-copied-${variant}` });
    publicImports(script.scriptAst, variant);
    publicImports(script.scriptSetupAst, variant);
    await writeFile(join("src/components/blackbox", `PublicCopied-${variant}.vue`), source);
  }
  await run("pnpm", ["exec", "vue-tsc", "--noEmit", "-p", "tsconfig.blackbox.json"], {
    cwd: process.cwd(), timeout: 120_000, log: process.env.KAPPA_COPIED_SOURCE_TYPES_LOG,
  });
});
