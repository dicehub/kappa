import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import { createServer } from "node:net";
import { once } from "node:events";
import { join, resolve } from "node:path";
import { test } from "node:test";
import { parse } from "vue/compiler-sfc";
import { developmentFixture } from "../development-fixture.mjs";
import { run, start } from "../process.mjs";

function elements(html) {
  const result = parse(`<template v-pre>${html}</template>`, {
    templateParseOptions: { delimiters: ["__KAPPA_UNUSED_OPEN__", "__KAPPA_UNUSED_CLOSE__"] },
  });
  assert.deepEqual(result.errors, []);
  const nodes = [], pending = [result.descriptor.template.ast];
  while (pending.length) { const node = pending.shift(); nodes.push(node); pending.push(...node.children ?? []); }
  return nodes;
}
const attribute = (node, name) => node.props?.find(prop => prop.type === 6 && prop.name === name)?.value?.content;
const text = node => node.type === 2 ? node.content : (node.children ?? []).map(text).join("");

test("real changelog pages partition releases and expose usable pagination links", { timeout: 240_000 }, async () => {
  const root = await developmentFixture(process.cwd(), { copyLibrary: true });
  const versions = Array.from({ length: 13 }, (_, index) => `1.0.${12 - index}`);
  await writeFile(resolve(root, "../kappa/CHANGELOG.md"), "# @dicehub/kappa\n\n" + versions.map(version =>
    `## ${version}\n\n### Patch Changes\n\n- Release ${version} includes a tested update.\n`).join("\n"));
  console.log(`Changelog fixture: ${root}`);
  await run("pnpm", ["exec", "astro", "build"], { cwd: root, timeout: 120_000,
    env: { KAPPA_SOURCE: "" }, log: join(root, "changelog-build.log") });
  const socket = createServer();
  socket.listen(0, "127.0.0.1"); await once(socket, "listening");
  const port = socket.address().port;
  await new Promise(resolve => socket.close(resolve));
  const url = `http://127.0.0.1:${port}`;
  const preview = await start("pnpm", ["exec", "astro", "preview", "--ignore-lock", "--host", "127.0.0.1", "--port", String(port)], {
    cwd: root, log: join(root, "changelog-preview.log"),
    ready: async signal => (await fetch(`${url}/docs/changelog/`, { signal })).ok,
  });
  const page = async path => {
    const response = await fetch(`${url}${path}`, { redirect: "error", signal: AbortSignal.timeout(10_000) });
    assert.equal(response.status, 200, path);
    const nodes = elements(await response.text());
    return {
      versions: nodes.filter(node => node.tag === "h2" && attribute(node, "class")?.split(/\s+/).includes("changelog-release__version")).map(node => text(node).trim()),
      links: nodes.filter(node => node.tag === "a").map(node => ({ label: attribute(node, "aria-label"), href: attribute(node, "href") })),
      paginated: nodes.some(node => attribute(node, "aria-label") === "Changelog pages"),
    };
  };
  try {
    const first = await page("/docs/changelog/");
    assert.deepEqual(first.versions, versions.slice(0, 10));
    const next = first.links.find(link => link.label === "Next changelog page");
    assert.equal(next?.href, "/docs/changelog/2/");
    const second = await page(next.href);
    assert.deepEqual(second.versions, versions.slice(10));
    assert.equal(second.links.find(link => link.label === "Previous changelog page")?.href, "/docs/changelog/");
    assert.deepEqual([...first.versions, ...second.versions], versions);
    const all = await page("/docs/changelog/all/");
    assert.deepEqual(all.versions, versions);
    assert.equal(all.paginated, false);
    const markdown = await fetch(`${url}/docs/changelog.md`, { signal: AbortSignal.timeout(10_000) });
    assert.equal(markdown.status, 200);
    const content = await markdown.text();
    for (const version of versions) assert.match(content, new RegExp(`^## \\[${version.replaceAll(".", "\\.")}\\]`, "m"));
    const absent = await fetch(`${url}/docs/changelog/3/`, { signal: AbortSignal.timeout(10_000) });
    assert.equal(absent.status, 404);
  } finally { await preview.close(); }
});
