import assert from "node:assert/strict";
import { readFile, realpath } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { createRequire } from "node:module";
import { optionalEntrypoints } from "../optional-entrypoints.mjs";

const records = JSON.parse(await readFile(new URL("../../blackbox-contracts/baseline.json", import.meta.url), "utf8"));
const decode = value => {
  if (value && typeof value === "object" && "$number" in value) return Number(value.$number);
  if (Array.isArray(value)) return value.map(decode);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, decode(item)]));
  return value;
};
const dataValues = value => {
  if (Array.isArray(value)) return value.map(dataValues);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value)
    .filter(([, item]) => typeof item !== "function").map(([key, item]) => [key, dataValues(item)]));
  return value;
};

test("the consumer loads a packed package, without workspace source resolution", async () => {
  const resolved = await realpath(fileURLToPath(import.meta.resolve("@dicehub/kappa")));
  assert.ok(resolved.includes("/node_modules/"), resolved);
  assert.ok(resolved.endsWith("/dist/index.js"), resolved);
  assert.ok(!resolved.includes("/packages/kappa/dist/"), resolved);
});

if (process.env.KAPPA_BLACKBOX_PROFILE === "core") test("core-only installation has no optional runtime peers", () => {
  const require = createRequire(import.meta.url);
  for (const dependency of ["shiki", "@shikijs/langs", "@shikijs/themes", "echarts", "uplot", "maplibre-gl"]) {
    assert.throws(() => require.resolve(dependency), { code: "MODULE_NOT_FOUND" });
  }
});

test("the published package retains full project and upstream licenses", async () => {
  const directory = dirname(dirname(fileURLToPath(import.meta.resolve("@dicehub/kappa"))));
  const required = JSON.parse(await readFile(new URL("../../blackbox-contracts/licenses-baseline.json", import.meta.url), "utf8"));
  const manifest = JSON.parse(await readFile(join(directory, "package.json"), "utf8"));
  assert.equal(manifest.license, "MIT");
  const notices = await readFile(join(directory, "THIRD_PARTY_NOTICES.md"), "utf8");
  for (const { path, content } of required) {
    assert.equal(await readFile(join(directory, path), "utf8"), content, path);
    if (path !== "LICENSE") assert.ok(notices.includes(content.trim()), `Full license missing from notices: ${path}`);
  }
});

for (const [index, record] of records.entries()) {
  test(`released named exports and constants: ${record.module}`, async () => {
    if (!record.requiredValueExports.length) return;
    const { default: actual } = await import(new URL(`../../blackbox-contracts/${index}.mjs`, import.meta.url));
    for (const name of record.requiredValueExports) assert.notEqual(actual[name], undefined, `${record.module}: ${name}`);
    for (const [name, expected] of Object.entries(record.constantValues)) {
      assert.deepEqual(dataValues(actual[name]), decode(expected), `${record.module}: ${name}`);
    }
    for (const [compound, parts] of Object.entries(record.declaredCompoundParts)) {
      for (const part of Object.keys(parts)) assert.notEqual(actual[compound][part], undefined, `${compound}.${part}`);
    }
  });
}

test("the public registry advertises imports that an installed consumer can resolve", async () => {
  const registry = (await import("@dicehub/kappa/registry/component-registry.json", { with: { type: "json" } })).default;
  const { componentRegistry, getRegistryComponent, registryComponentNames } = await import("@dicehub/kappa/registry");
  const manifest = JSON.parse(await readFile(join(dirname(dirname(fileURLToPath(import.meta.resolve("@dicehub/kappa")))), "package.json"), "utf8"));
  const { requiredNames } = JSON.parse(await readFile(new URL("../../blackbox-contracts/registry-baseline.json", import.meta.url), "utf8"));
  for (const published of [registry, componentRegistry]) {
    assert.equal(published.package.name, "@dicehub/kappa");
    assert.equal(published.package.version, manifest.version);
    assert.equal(published.schemaVersion, 1);
  }
  for (const name of requiredNames) {
    assert.ok(registryComponentNames.includes(name), `Released registry name missing: ${name}`);
    assert.equal(getRegistryComponent(name)?.name, name);
    assert.equal(registry.components[name]?.name, name);
  }
  const metadata = (await Promise.all(["a", "b"].map(suffix =>
    readFile(new URL(`../../blackbox-contracts/registry-contract-${suffix}.jsonl`, import.meta.url), "utf8"))))
    .flatMap(source => source.trim().split("\n").map(line => JSON.parse(line)));
  for (const expected of metadata) {
    for (const actual of [registry.components[expected.name], componentRegistry.components[expected.name], getRegistryComponent(expected.name)]) {
      for (const field of ["name", "type", "group", "importPath"]) assert.equal(actual?.[field], expected[field], `${expected.name}: ${field}`);
      for (const part of expected.parts ?? []) assert.ok(actual.parts?.includes(part), `${expected.name}: registry part ${part}`);
    }
  }
  const assertIndex = (names, expected, label) => {
    assert.ok(Array.isArray(names), label);
    assert.equal(new Set(names).size, names.length, `${label}: duplicate names`);
    assert.deepEqual(new Set(names), new Set(expected), `${label}: membership`);
  };
  for (const [label, published] of [["JSON", registry], ["module", componentRegistry]]) {
    const entries = Object.values(published.components);
    assertIndex(published.search.byName, entries.map(entry => entry.name), `${label}: byName`);
    assertIndex(registryComponentNames, published.search.byName, `${label}: module names`);
    for (const [kind, index] of [["group", published.search.byGroup], ["type", published.search.byType]]) {
      assert.deepEqual(new Set(Object.keys(index)), new Set(entries.map(entry => entry[kind])), `${label}: by${kind} keys`);
      for (const [key, names] of Object.entries(index)) assertIndex(names, entries.filter(entry => entry[kind] === key).map(entry => entry.name), `${label}: by${kind}.${key}`);
    }
    for (const entry of entries) {
      for (const field of ["sourceFile", "description"]) {
        assert.equal(typeof entry[field], "string", `${label}: ${entry.name} ${field}`);
        assert.ok(entry[field].trim(), `${label}: ${entry.name} nonempty ${field}`);
      }
    }
  }
  for (const entry of [registry, componentRegistry].flatMap(published => Object.values(published.components))) {
    if (process.env.KAPPA_BLACKBOX_PROFILE === "core" && optionalEntrypoints.has(entry.importPath)) continue;
    const exported = await import(entry.importPath);
    assert.notEqual(exported[entry.name], undefined, `${entry.importPath}: ${entry.name}`);
    if (entry.parts) {
      assert.equal(new Set(entry.parts).size, entry.parts.length, `${entry.name}: duplicate parts`);
      for (const part of entry.parts) assert.notEqual(exported[entry.name][part], undefined, `${entry.name}.${part}`);
    }
  }
  for (const path of ["styles/kappa.css", "styles/theme-kappa.css", "styles/tokens.json"]) {
    const content = await readFile(fileURLToPath(import.meta.resolve(`@dicehub/kappa/${path}`)), "utf8");
    assert.ok(content.trim().length > 0, path);
  }
});

test("unknown registry names return undefined, including inherited object keys", async () => {
  const { getRegistryComponent } = await import("@dicehub/kappa/registry");
  assert.equal(getRegistryComponent("Button")?.importPath, "@dicehub/kappa/components/button");
  for (const name of ["KappaMissingComponent", "__proto__", "constructor", "toString", "hasOwnProperty"]) {
    assert.equal(getRegistryComponent(name), undefined, name);
  }
});
