import assert from "node:assert/strict";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { run } from "../process.mjs";

export async function addPublicComponent(library) {
  const directory = join(library, "src/components/build-probe");
  await mkdir(directory);
  await writeFile(join(directory, "BuildProbe.vue"), [
    '<script setup lang="ts">',
    'defineProps<{ title: string; count?: number }>();',
    'defineSlots<{ default(props: { count: number }): unknown }>();',
    '</script>',
    '<template><section :aria-label="title"><slot :count="count ?? 0" /></section></template>',
  ].join("\n"));
  await writeFile(join(directory, "index.ts"), [
    'import BuildProbeRoot from "./BuildProbe.vue";',
    'export const BuildProbe = Object.assign(Object.assign({}, BuildProbeRoot) as typeof BuildProbeRoot, { Root: BuildProbeRoot });',
    'const BuildProbeAlias = BuildProbeRoot;',
    'export const BuildProbeTypedAlias: typeof BuildProbeRoot = BuildProbeRoot;',
    'export const { buildProbeLimit } = { buildProbeLimit: 3 };',
    'export const buildProbeConfig = Object.assign({ enabled: true }, { label: "Ready" });',
    'export { BuildProbeAlias, BuildProbeRoot };',
  ].join("\n"));
  const barrel = join(library, "src/components/index.ts");
  await writeFile(barrel, (await readFile(barrel, "utf8")) + '\nexport * from "./build-probe";\n');
}

export async function verifyGeneratedFiles(library) {
  const outputs = [
    ["registry", "src/registry/generated.ts", /Registry output is (?:missing|stale)/],
    ["registry", "src/registry/component-registry.json", /Registry output is (?:missing|stale)/],
    ["themes", "src/styles/theme-kappa.css", /theme-kappa\.css.*codegen:themes/s],
    ["themes", "src/styles/tokens.json", /tokens\.json.*codegen:themes/s],
  ];
  for (const [generator, file, expected] of outputs) {
    const path = join(library, file), saved = `${path}.saved`;
    const original = await readFile(path, "utf8");
    const check = async state => {
      await assert.rejects(run("pnpm", [`check:${generator}`], {
        cwd: library, log: join(library, `${generator}-${state}-${file.split("/").at(-1)}.log`),
      }), error => {
        assert.equal(error.result?.code, 1);
        assert.match(error.result.output, expected);
        return true;
      });
    };
    await rename(path, saved);
    try {
      await check("missing");
      await assert.rejects(readFile(path), { code: "ENOENT" }, "A check must not recreate missing output.");
    }
    finally { await rename(saved, path); }
    await writeFile(path, original + "\n");
    try {
      await check("stale");
      assert.equal(await readFile(path, "utf8"), original + "\n", "A check must not rewrite stale output.");
    }
    finally { await writeFile(path, original); }
  }
  for (const generator of ["registry", "themes"]) {
    await run("pnpm", [`check:${generator}`], { cwd: library, log: join(library, `${generator}-valid.log`) });
  }
  const registry = JSON.parse(await readFile(join(library, "dist/registry/component-registry.json"), "utf8"));
  for (const name of ["BuildProbe", "BuildProbeAlias", "BuildProbeRoot"]) {
    assert.ok(registry.search.byName.includes(name), `${name} must be discoverable.`);
    assert.equal(registry.components[name].importPath, "@dicehub/kappa/components/build-probe");
  }
  assert.deepEqual(registry.components.BuildProbe.parts, ["Root"]);
}
