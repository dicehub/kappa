import assert from "node:assert/strict";
import test from "node:test";
import ts from "typescript";
import { preserveCompoundDeclarations } from "../../scripts/declaration-barrels.mjs";
import { isKnownArkDeclarationError } from "../../scripts/check-consumer-declarations.mjs";

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

test("only the exact known Ark diagnostics are reported without failing validation", () => {
  const slot = { code: 2304, messageText: "Cannot find name '__VLS_Slots'.", file: { fileName: "/deps/@ark-ui/vue/dist/components/select/select-value-text.vue.d.ts" } };
  assert.equal(isKnownArkDeclarationError(slot), true);
  assert.equal(isKnownArkDeclarationError({ ...slot, file: { fileName: "/deps/@dicehub/kappa/dist/select.d.ts" } }), false);
  assert.equal(isKnownArkDeclarationError({ ...slot, messageText: "Cannot find name 'MissingType'." }), false);
  assert.equal(isKnownArkDeclarationError({ ...slot, file: { fileName: "/deps/@ark-ui/vue/dist/components/new-component/new-component.vue.d.ts" } }), false);
  assert.equal(isKnownArkDeclarationError({ code: 2300, messageText: "Duplicate identifier 'HighlightChunk'.", file: { fileName: "/deps/@ark-ui/vue/dist/components/highlight/use-highlight.d.ts" } }), true);
  assert.equal(isKnownArkDeclarationError({ ...slot, code: 2344 }), false);
});
