import assert from "node:assert/strict";
import test from "node:test";
import ts from "typescript";
import { preserveCompoundDeclarations } from "../../scripts/declaration-barrels.mjs";

test("compound declarations keep root and part references, named exports, and hooks", () => {
  const source = `
import Root from "./Root.vue";
import Part from "./Part.vue";
export const Compound = Object.assign(Root, { Root, Part: Part });
export { Root, Part };
export { useCompound } from "@ark-ui/vue/tooltip";
`;
  // Production barrels use explicit property assignments.
  const declaration = `
export declare const Compound: ExpandedVueType;
export { default as Root } from "./Root.vue";
export { default as Part } from "./Part.vue";
export { useCompound } from "@ark-ui/vue/tooltip";
`;
  const output = preserveCompoundDeclarations(source.replace("{ Root,", "{ Root: Root,"), declaration);
  assert.match(output, /import type Root from "\.\/Root\.vue"/);
  assert.match(output, /import type Part from "\.\/Part\.vue"/);
  assert.match(output, /Compound: typeof Root & \{/);
  assert.match(output, /Root: typeof Root/);
  assert.match(output, /Part: typeof Part/);
  assert.doesNotMatch(output, /ExpandedVueType/);
  assert.match(output, /export \{ default as Root \}/);
  assert.match(output, /export \{ useCompound \}/);
  assert.equal(ts.createSourceFile("index.d.ts", output, ts.ScriptTarget.Latest, true).parseDiagnostics.length, 0);
});

test("compound declarations retain existing imports without duplicate bindings", () => {
  const source = 'import Root from "./Root.vue"; export const Compound = Object.assign(Root, { Root: Root });';
  const declaration = 'import Root from "./Root.vue"; export declare const Compound: ExpandedVueType;';
  const output = preserveCompoundDeclarations(source, declaration);
  assert.equal((output.match(/import .*Root from/g) ?? []).length, 1);
  assert.match(output, /Compound: typeof Root/);
});

test("component aliases preserve their imported type identity", () => {
  const source = 'import Item from "./Item.vue"; const Option = Item; export { Option };';
  const output = preserveCompoundDeclarations(source, 'declare const Option: ExpandedVueType; export { Option };');
  assert.match(output, /Option: typeof Item/);
  assert.match(output, /import type Item from "\.\/Item\.vue"/);
  assert.doesNotMatch(output, /ExpandedVueType/);
});

test("declaration generation leaves ordinary exports and unsupported expressions intact", () => {
  const declaration = "export declare const Value: string;";
  assert.equal(preserveCompoundDeclarations('export const Value = "value";', declaration), declaration);
  assert.equal(preserveCompoundDeclarations('export const Value = Object.assign({}, { value: "value" });', declaration), declaration);
});
