import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { checkConsumerDeclarations } from "./check-consumer-declarations.mjs";

test("strict consumer validation rejects upstream declaration errors", () => {
  const root = mkdtempSync(join(tmpdir(), "kappa-declaration-test-"));
  try {
    const upstream = join(root, "node_modules/@ark-ui/vue/dist/components/slider");
    mkdirSync(upstream, { recursive: true });
    writeFileSync(join(root, "tsconfig.json"), JSON.stringify({
      compilerOptions: { strict: true, skipLibCheck: true, types: [] },
      files: ["index.ts"],
    }));
    writeFileSync(join(root, "index.ts"), 'import type { Slots } from "./node_modules/@ark-ui/vue/dist/components/slider/slider-value-text.vue";\nexport type Value = Slots;\n');
    const declaration = join(upstream, "slider-value-text.vue.d.ts");
    writeFileSync(declaration, "export type Slots = __VLS_Slots;\n");
    assert.throws(() => checkConsumerDeclarations(root), /Cannot find name '__VLS_Slots'/);
    writeFileSync(declaration, "export type Slots = { default?: () => string };\n");
    assert.doesNotThrow(() => checkConsumerDeclarations(root));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
