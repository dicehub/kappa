import { cp, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { run } from "./process.mjs";
import { writeContracts } from "./contracts.mjs";
import { checkConsumerLock, writeConsumerLock } from "./lock.mjs";

export async function prepare(root, scratch) {
  const failures = [];
  const check = async (label, command, args, options) => {
    try { await run(command, args, options); console.log(`${label}: passed.`); }
    catch (error) { failures.push(error); console.error(`${label}: FAILED; ${options.log}`); }
  };
  const library = join(root, "packages/kappa");
  console.log("Build the library for the packed consumers.");
  await run("pnpm", ["--filter", "@dicehub/kappa", "build"], { cwd: root, log: join(scratch, "library-build.log") });
  await run("pnpm", ["pack", "--pack-destination", scratch], { cwd: library, log: join(scratch, "pack.log") });
  const archives = (await readdir(scratch)).filter(name => name.endsWith(".tgz"));
  if (archives.length !== 1) throw new Error("Expected exactly one freshly packed tarball.");
  const tarball = join(scratch, archives[0]);
  const docsManifest = JSON.parse(await readFile(join(root, "packages/kappa-docs-astro/package.json"), "utf8"));
  const libraryManifest = JSON.parse(await readFile(join(library, "package.json"), "utf8"));
  const rootManifest = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
  const full = join(scratch, "application/packages/kappa-docs-astro");
  const core = join(scratch, "core-consumer");
  for (const consumer of [core, full]) {
    await mkdir(consumer, { recursive: true });
    const isFull = consumer === full;
    const manifest = {
      name: isFull ? "kappa-blackbox-application" : "kappa-blackbox-core", private: true, type: "module",
      packageManager: rootManifest.packageManager,
      dependencies: {
        ...(isFull ? docsManifest.dependencies : { vue: libraryManifest.devDependencies.vue }),
        "@dicehub/kappa": `file:${relative(consumer, tarball)}`,
      },
      devDependencies: {
        ...(isFull ? docsManifest.devDependencies : {}),
        typescript: rootManifest.devDependencies.typescript,
        "vue-tsc": libraryManifest.devDependencies["vue-tsc"],
        vite: libraryManifest.devDependencies.vite,
        "@vitejs/plugin-vue": libraryManifest.devDependencies["@vitejs/plugin-vue"],
      },
    };
    await writeFile(join(consumer, "package.json"), JSON.stringify(manifest, null, 2));
    const workspace = await readFile(join(root, "pnpm-workspace.yaml"), "utf8");
    const isolatedWorkspace = workspace.replace(/^packages:\n(?:[ \t].*\n)+/, 'packages:\n  - "."\n');
    if (isolatedWorkspace === workspace) throw new Error("Cannot isolate the workspace settings for the consumer.");
    await writeFile(join(consumer, "pnpm-workspace.yaml"), isolatedWorkspace);
    console.log(`Install ${isFull ? "full" : "core-only"} consumer from the tarball.`);
    // Preserve exact workspace resolutions; only the packed Kappa node changes.
    await writeConsumerLock(root, consumer, tarball, manifest.dependencies["@dicehub/kappa"], manifest, libraryManifest);
    await run("pnpm", ["install", "--frozen-lockfile", "--ignore-scripts", "--config.auto-install-peers=false", ...(process.env.KAPPA_BLACKBOX_OFFLINE === "1" ? ["--offline"] : [])], {
      cwd: consumer, log: join(scratch, isFull ? "install-full.log" : "install-core.log"),
    });
    await checkConsumerLock(root, consumer, scratch, isFull ? "full" : "core");
    // Retain the frozen consumer lock and graph fingerprint for paired comparisons.
    await cp(join(consumer, "pnpm-lock.yaml"), join(scratch, isFull ? "consumer-full-lock.yaml" : "consumer-core-lock.yaml"));
    await writeContracts(consumer, join(root, "docs/test-rework/public-api-baseline.jsonl"), join(root, "docs/test-rework/public-compound-baseline.jsonl"), isFull);
    await cp(join(root, "docs/test-rework/public-registry-baseline.json"), join(consumer, "blackbox-contracts/registry-baseline.json"));
    for (const suffix of ["a", "b"]) await cp(join(root, `docs/test-rework/public-registry-contract-${suffix}.jsonl`), join(consumer, `blackbox-contracts/registry-contract-${suffix}.jsonl`));
    await cp(join(root, "docs/test-rework/licenses-baseline.json"), join(consumer, "blackbox-contracts/licenses-baseline.json"));
    await cp(join(root, "docs/test-rework/runtime-guards.jsonl"), join(consumer, "blackbox-contracts/runtime-guards.jsonl"));
    await cp(join(library, "scripts/fixtures/consumer-types.ts"), join(consumer, "blackbox-consumer-types.ts"));
    await mkdir(join(consumer, "blackbox"));
    await cp(join(root, "tests/blackbox/package"), join(consumer, "blackbox/package"), { recursive: true });
    await cp(join(root, "tests/blackbox/optional-entrypoints.mjs"), join(consumer, "blackbox/optional-entrypoints.mjs"));
    console.log(`Compile strict ${isFull ? "full" : "core-only"} named-import consumer.`);
    await check(`${isFull ? "Full" : "Core"} consumer declarations`, "pnpm", ["exec", "vue-tsc", "--noEmit", "-p", "tsconfig.blackbox.json"], {
      cwd: consumer, log: join(scratch, isFull ? "types-full.log" : "types-core.log"),
    });
    await check(`${isFull ? "Full" : "Core"} package behavior`, "node", ["--test", ...(isFull ? ["blackbox/package/*.test.mjs"] : ["blackbox/package/exports.test.mjs", "blackbox/package/public-functions.test.mjs", "blackbox/package/runtime-guards.test.mjs", "blackbox/package/ssr.test.mjs"])], {
      cwd: consumer, env: { KAPPA_BLACKBOX_PROFILE: isFull ? "full" : "core" },
      log: join(scratch, isFull ? "package-full.log" : "package-core.log"),
    });
  }
  // The docs build reads only published metadata/styles at this sibling path.
  const sibling = join(scratch, "application/packages/kappa");
  await mkdir(sibling);
  await run("tar", ["-xzf", tarball, "--strip-components=1", "-C", sibling], { log: join(scratch, "extract.log") });
  await cp(join(root, "LICENSE"), join(scratch, "application/LICENSE"));
  await cp(join(root, "tsconfig.base.json"), join(scratch, "application/tsconfig.base.json"));
  for (const entry of ["src", "public", "astro.config.mjs", "tsconfig.json"]) {
    await cp(join(root, "packages/kappa-docs-astro", entry), join(full, entry), { recursive: true });
  }
  const fixturePages = join(full, "src/pages/test-consumer");
  const fixtureComponents = join(full, "src/components/blackbox");
  await mkdir(fixturePages, { recursive: true });
  await mkdir(fixtureComponents, { recursive: true });
  for (const entry of await readdir(join(root, "tests/blackbox/consumer"))) {
    const source = join(root, "tests/blackbox/consumer", entry);
    if (entry.endsWith(".vue")) await cp(source, join(fixtureComponents, entry));
    else if (entry.endsWith(".astro")) {
      const page = (await readFile(source, "utf8")).replace(/from '\.\/(\w+\.vue)'/g, "from '../../components/blackbox/$1'");
      await writeFile(join(fixturePages, entry), page);
    } else throw new Error(`Unexpected consumer fixture: ${entry}`);
  }
  // Compile copied snippets and fixture applications too, against installed declarations.
  await check("Copied snippet and fixture declarations", "pnpm", ["exec", "vue-tsc", "--noEmit", "-p", "tsconfig.blackbox.json"], {
    cwd: full, log: join(scratch, "types-snippets.log"),
  });
  return { full, core, tarball, failures };
}
