import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const readSource = (name) => readFileSync(new URL(name, import.meta.url), "utf8");

const barrelSource = readSource("./index.ts");
const contentSource = readSource("./DialogLayoutContent.vue");
const alertSource = readSource("./DialogLayoutAlert.vue");
const actionsSource = readSource("./DialogLayoutActions.vue");
const primarySource = readSource("./DialogLayoutPrimaryAction.vue");
const styleSource = readSource("./dialog-layout.css");

test("DialogLayout composes Kappa Dialog instead of a second behavior primitive", () => {
  assert.match(barrelSource, /import DialogRoot from "\.\.\/dialog\/Dialog\.vue"/);
  assert.match(contentSource, /import DialogContent from "\.\.\/dialog\/DialogContent\.vue"/);
  assert.doesNotMatch(`${barrelSource}${contentSource}`, /@ark-ui\/vue/);
});

test("DialogLayout exposes the structured compound API", () => {
  for (const part of [
    "Root",
    "Alert",
    "Trigger",
    "Content",
    "Header",
    "Title",
    "Description",
    "Body",
    "Actions",
    "PrimaryAction",
    "Close",
  ]) {
    assert.match(barrelSource, new RegExp(`\\b${part}:`));
  }
  assert.match(barrelSource, /Primary: DialogLayoutPrimaryAction/);
});

test("DialogLayout alert mode uses the existing alert-dialog contract", () => {
  assert.match(alertSource, /role="alertdialog"/);
  assert.match(alertSource, /open: undefined/);
  assert.match(alertSource, /closeOnEscape: true/);
});

test("DialogLayout supplies explicit dismiss and loading-aware primary actions", () => {
  assert.match(actionsSource, /<DialogClose as-child>/);
  assert.match(actionsSource, /props\.dismissLabel/);
  assert.match(primarySource, /:loading="props\.loading"/);
  assert.match(primarySource, /DIALOG_LAYOUT_DEFAULT_PRIMARY_VARIANT/);
});

test("DialogLayout keeps header, body, and actions in stable regions", () => {
  assert.match(styleSource, /\.kappa-dialog-layout__header[\s\S]*flex: none/);
  assert.match(styleSource, /\.kappa-dialog-layout__body[\s\S]*overflow-y: auto/);
  assert.match(styleSource, /\.kappa-dialog-layout__actions[\s\S]*flex: none/);
  assert.match(styleSource, /data-vertical-align="top"/);
  assert.match(styleSource, /\.kappa-dialog-layout__content\[hidden\][\s\S]*display: none/);
});
