import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import { repairArkDeclaration, rewriteArkDeclarationImports } from "./ark-declarations.mjs";

const arkRoot = new URL("../node_modules/@ark-ui/vue/dist/", import.meta.url);

test("repair rejects changed upstream declarations and runtime slot contracts", () => {
  const path = "components/slider/slider-value-text.vue.d.ts";
  const content = readFileSync(new URL(path, arkRoot), "utf8");
  const runtime = readFileSync(new URL(path.replace(".vue.d.ts", ".vue_vue_type_script_setup_true_lang.js"), arkRoot), "utf8");
  assert.match(repairArkDeclaration(path, content, runtime), /type __VLS_Slots =/);
  assert.throws(() => repairArkDeclaration(path, content + "\n", runtime), /input changed/);
  assert.throws(() => repairArkDeclaration(path, content, runtime + "\n"), /input changed/);
});

test("declaration imports target private repairs without changing unaffected Ark imports", () => {
  const output = resolve("dist");
  const content = [
    'export { useSlider } from "@ark-ui/vue/slider";',
    'type Value = import("@ark-ui/vue/select").SelectValueTextProps;',
    'export { useToc } from "@ark-ui/vue/toc";',
  ].join("\n");
  const rewritten = rewriteArkDeclarationImports(content, resolve(output, "components/slider/index.d.ts"), output);
  assert.match(rewritten, /from "\.\.\/\.\.\/_vendor\/ark-ui-vue\/components\/slider\/index\.js"/);
  assert.match(rewritten, /import\("\.\.\/\.\.\/_vendor\/ark-ui-vue\/components\/select\/index\.js"\)/);
  assert.match(rewritten, /from "@ark-ui\/vue\/toc"/);
});
