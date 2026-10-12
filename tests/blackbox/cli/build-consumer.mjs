import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, readdir, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "../process.mjs";

export async function verifyPackedComponent(library) {
  const consumer = await mkdtemp(join(tmpdir(), "kappa-built-api-"));
  await run("pnpm", ["pack", "--pack-destination", consumer], {
    cwd: library, log: join(consumer, "pack.log"),
  });
  const archives = (await readdir(consumer)).filter(name => name.endsWith(".tgz"));
  assert.equal(archives.length, 1);
  const installed = join(consumer, "node_modules/@dicehub/kappa");
  await mkdir(installed, { recursive: true });
  await run("tar", ["-xzf", join(consumer, archives[0]), "--strip-components=1", "-C", installed], {
    log: join(consumer, "extract.log"),
  });
  // Only actual Vue is needed by the probe's granular public entry point.
  await symlink(join(library, "node_modules/vue"), join(consumer, "node_modules/vue"));
  await writeFile(join(consumer, "package.json"), JSON.stringify({ private: true, type: "module" }));
  await writeFile(join(consumer, "tsconfig.json"), JSON.stringify({
    compilerOptions: {
      target: "ES2022", module: "ESNext", moduleResolution: "Bundler", strict: true,
      noEmit: true, skipLibCheck: false, types: [], lib: ["ES2022", "DOM", "DOM.Iterable"],
    }, files: ["contract.ts"],
  }));
  await writeFile(join(consumer, "contract.ts"), [
    'import { BuildProbe, BuildProbeAlias, BuildProbeRoot } from "@dicehub/kappa/components/build-probe";',
    'type Props = InstanceType<typeof BuildProbe>["$props"];',
    'type Slot = InstanceType<typeof BuildProbe.Root>["$slots"]["default"];',
    'const props: Props = { title: "Result", count: 4 };',
    'const slot: Slot = ({ count }) => count.toFixed(2);',
    'const root: typeof BuildProbeRoot = BuildProbe.Root;',
    'const alias: typeof BuildProbeAlias = root;',
    'type AliasProps = InstanceType<typeof BuildProbeAlias>["$props"];',
    '// @ts-expect-error A title must be a string.',
    'const invalidProps: Props = { title: 42 };',
    '// @ts-expect-error The slot receives a number, not a string.',
    'const invalidSlot: Slot = (props: { count: string }) => props.count;',
    '// @ts-expect-error Aliases retain the public title prop, not any.',
    'const invalidAliasProps: AliasProps = { title: 42 };',
    'void [props, slot, root, alias, invalidProps, invalidSlot, invalidAliasProps];',
  ].join("\n"));
  await run(join(library, "node_modules/.bin/vue-tsc"), ["--noEmit", "-p", join(consumer, "tsconfig.json")], {
    cwd: consumer, log: join(consumer, "declarations.log"),
  });
  const registry = JSON.parse(await readFile(join(installed, "dist/registry/component-registry.json"), "utf8"));
  assert.ok(registry.search.byName.includes("BuildProbe"), "The tarball must include the regenerated registry.");
}
