import { createServer } from "node:net";
import { once } from "node:events";
import { cp, readFile, readdir, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { run, start } from "./process.mjs";
import { createService } from "./service.mjs";
import { documentationArtifacts } from "./documentation-artifacts.mjs";

async function availablePort() {
  const server = createServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const port = server.address().port;
  await new Promise(resolve => server.close(resolve));
  return port;
}

export async function browserSuite(root, scratch, full, args = []) {
  await cp(join(root, "tests/blackbox/browser"), join(full, "blackbox/browser"), { recursive: true });
  await cp(join(root, "tests/blackbox/documentation"), join(full, "blackbox/documentation"), { recursive: true });
  await cp(join(root, "tests/blackbox/process.mjs"), join(full, "blackbox/process.mjs"));
  await cp(join(root, "tests/blackbox/development-fixture.mjs"), join(full, "blackbox/development-fixture.mjs"));
  await cp(join(root, "docs/test-rework/docs-routes-baseline.json"), join(full, "blackbox/docs-routes-baseline.json"));
  await cp(join(root, "tests/blackbox/playwright.config.ts"), join(full, "playwright.blackbox.config.ts"));
  await cp(join(root, "packages/kappa-docs-astro/e2e"), join(full, "e2e"), { recursive: true });
  for (const name of await readdir(join(full, "e2e"))) {
    if (!name.endsWith(".spec.ts")) continue;
    const path = join(full, "e2e", name);
    const network = `../${relative(full, join(full, "blackbox/browser/network"))}`;
    let source = (await readFile(path, "utf8")).replace(/from (["'])@playwright\/test\1/g, `from ${JSON.stringify(network)}`);
    if (source.includes("browser.newContext(")) {
      source = `import { networkContext } from ${JSON.stringify(network)};\n` + source.replaceAll("browser.newContext(", "networkContext(browser, ");
    }
    await writeFile(path, source);
  }
  console.log("Build the production documentation with the installed package.");
  await run("pnpm", ["exec", "astro", "build"], { cwd: full, env: { KAPPA_SOURCE: "" }, log: join(scratch, "docs-build.log") });
  await documentationArtifacts(root, scratch, full);
  if (process.env.KAPPA_AUDIT_BROWSER_COVERAGE === "1") {
    // Preserve the exact executed production maps before contributor tests rebuild the site.
    await cp(join(full, "dist"), join(scratch, "compiled-docs"), { recursive: true });
  }
  const service = await createService();
  const port = await availablePort();
  const url = `http://127.0.0.1:${port}`;
  let preview;
  const failures = [];
  try {
    preview = await start("pnpm", ["exec", "astro", "preview", "--ignore-lock", "--host", "127.0.0.1", "--port", String(port)], {
      cwd: full, log: join(scratch, "docs-preview.log"),
      ready: async signal => (await fetch(`${url}/test-consumer/`, { signal })).ok,
    });
    console.log(`Test the public browser surface at ${url}`);
    try {
      await run("node", ["--test", "blackbox/documentation/*.test.mjs"], {
        cwd: full, timeout: 360_000, log: join(scratch, "copied-sources.log"),
        env: { PLAYWRIGHT_BASE_URL: url, KAPPA_COPIED_SOURCE_TYPES_LOG: join(scratch, "copied-sources-types.log") },
      });
    } catch (error) { failures.push(error); }
    try { await run("pnpm", ["exec", "playwright", "test", "-c", "playwright.blackbox.config.ts", ...args], {
      cwd: full, timeout: 1_800_000, log: join(scratch, "browser.log"),
      env: { PLAYWRIGHT_BASE_URL: url, KAPPA_BLACKBOX_SERVICE: service.url },
    }); } catch (error) { failures.push(error); }
  } finally {
    try { await preview?.close(); }
    finally { await service.close(); }
  }
  if (failures.length) throw new AggregateError(failures, `Public HTTP/compiler/browser checks failed; ${scratch}`);
}
