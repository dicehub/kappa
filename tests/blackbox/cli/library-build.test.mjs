import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { test } from "node:test";
import { run } from "../process.mjs";
import { libraryFixture } from "./library-fixtures.mjs";
import { addPublicComponent, verifyGeneratedFiles } from "./generator-contracts.mjs";
import { verifyPackedComponent } from "./build-consumer.mjs";

test("the real library build refuses changed upstream declaration, runtime-slot and version inputs", async () => {
  const { library, ark } = await libraryFixture();
  await addPublicComponent(library);
  await run("pnpm", ["build"], { cwd: library, timeout: 180_000, log: join(library, "unchanged-build.log") });
  await verifyGeneratedFiles(library);
  await verifyPackedComponent(library);
  const inputs = [
    ["declaration", join(ark, "dist/components/slider/slider-value-text.vue.d.ts"), text => text + "\n", /Ark declaration repair input changed/],
    ["runtime", join(ark, "dist/components/slider/slider-value-text.vue_vue_type_script_setup_true_lang.js"), text => text + "\n", /Ark declaration repair input changed/],
    ["version", join(ark, "package.json"), text => JSON.stringify({ ...JSON.parse(text), version: "5.39.3" }), /Review or remove the Ark declaration repairs/],
  ];
  for (const [name, path, change, expected] of inputs) {
    const original = await readFile(path, "utf8");
    await writeFile(path, change(original));
    try {
      await assert.rejects(run("pnpm", ["build"], { cwd: library, timeout: 180_000, log: join(library, `changed-${name}.log`) }), error => {
        assert.equal(error.result?.code, 1, "The actual build must refuse this input, not time out.");
        assert.match(error.result.output, expected);
        return true;
      });
    } finally { await writeFile(path, original); }
  }
});
