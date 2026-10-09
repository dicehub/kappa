import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { parse, compileScript } from "vue/compiler-sfc";
import { inlineWorkspaceSwitcherSource } from "./inline-workspace-switcher-source.ts";

const shared = readFileSync(new URL("../data/workspace-switcher-demo.ts", import.meta.url), "utf8");
const icons = source => source.match(/import \{([^\n]+)\} from "@lucide\/vue";/)[1].split(",").map(name => name.trim());

test("copied workspace examples include their shared data and icon dependencies", () => {
  for (const name of ["SidebarMinimalWorkspaceDocsDemo", "SidebarBlocksDocsDemo", "SidebarWorkspacePagesDocsDemo"]) {
    const source = readFileSync(new URL(`../components/${name}.vue`, import.meta.url), "utf8");
    const result = inlineWorkspaceSwitcherSource(source, shared);
    assert.doesNotMatch(result, /from "\.\.\/data\/workspace-switcher-demo"/);
    assert.deepEqual(new Set(icons(result)), new Set([...icons(source), ...icons(shared)]));
    const { descriptor, errors } = parse(result);
    assert.deepEqual(errors, []);
    const compiled = compileScript(descriptor, { id: name });
    for (const [, declaration] of shared.matchAll(/^export const (\w+)/gm)) {
      assert.ok(compiled.bindings[declaration], `Missing copied declaration: ${declaration}`);
    }
  }
});
