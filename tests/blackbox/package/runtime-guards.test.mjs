import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { optionalEntrypoints } from "../optional-entrypoints.mjs";

const records = (await readFile(new URL("../../blackbox-contracts/runtime-guards.jsonl", import.meta.url), "utf8")).trim().split("\n").map(line => JSON.parse(line));
const decode = value => {
  if (value && typeof value === "object" && "$undefined" in value) return undefined;
  if (value && typeof value === "object" && "$number" in value) return Number(value.$number);
  if (Array.isArray(value)) return value.map(decode);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, decode(item)]));
  return value;
};

for (const record of records) {
  const optional = optionalEntrypoints.has(record.module);
  // Pure guard contracts run once: core APIs in core, optional APIs in full.
  if ((process.env.KAPPA_BLACKBOX_PROFILE === "core") === optional) continue;
  test(`public JavaScript input acceptance, rejection and fallback: ${record.module}`, async () => {
    const api = await import(record.module);
    for (const requirement of record.cases) {
      const actual = api[requirement.function](...decode(requirement.args));
      const expected = decode(requirement.expected);
      const message = `${requirement.id}: ${requirement.function}`;
      if (requirement.equality === "deep") assert.deepEqual(actual, expected, message);
      else assert.equal(actual, expected, message);
    }
  });
}
