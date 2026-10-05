import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { parse, compileScript } from "vue/compiler-sfc";
import { inlineWorkspaceSwitcherSource } from "./inline-workspace-switcher-source.ts";

const shared = readFileSync(new URL("../data/workspace-switcher-demo.ts", import.meta.url), "utf8");
for (const name of ["SidebarMinimalWorkspaceDocsDemo", "SidebarBlocksDocsDemo", "SidebarWorkspacePagesDocsDemo"]) {
  test(`${name} exports a complete Vue file with public imports`, () => {
    const source = readFileSync(new URL(`../components/${name}.vue`, import.meta.url), "utf8");
    const result = inlineWorkspaceSwitcherSource(source, shared);
    assert.doesNotMatch(result, /from "\.\.\/data\/workspace-switcher-demo"/);
    for (const declaration of ["namespaceSwitcherItems", "namespaceSwitcherActions", "namespaceSwitcherWorkspaceActions", "namespaceSwitcherFooterActions", "namespaceActionDescriptions"]) {
      assert.ok(new RegExp(`const ${declaration}(?:\\s*:[^=\\n]+)?\\s*=`).test(result), `Missing ${declaration}`);
    }
    assert.doesNotMatch(result, /export const namespace/);
    const imports = result.match(/import \{([^\n]+)\} from "@lucide\/vue";/)[1].split(",").map(name => name.trim());
    assert.equal(imports.length, new Set(imports).size);
    const { descriptor, errors } = parse(result);
    assert.deepEqual(errors, []);
    const compiled = compileScript(descriptor, { id: name });
    assert.ok(compiled.content.includes("namespaceSwitcherItems"));
    assert.equal(inlineWorkspaceSwitcherSource(result, shared), result);
  });
}
