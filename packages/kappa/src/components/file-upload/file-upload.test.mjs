import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const readSource = (name) => readFileSync(new URL(name, import.meta.url), "utf8");

const root = readSource("./FileUpload.vue");
const provider = readSource("./FileUploadRootProvider.vue");
const context = readSource("./FileUploadContext.vue");
const styles = readSource("./file-upload.css");
const types = readSource("./file-upload.ts");
const barrel = readSource("./index.ts");

const parts = [
  ["Label", "file-upload-label"],
  ["Dropzone", "file-upload-dropzone"],
  ["Trigger", "file-upload-trigger"],
  ["HiddenInput", "file-upload-hidden-input"],
  ["ItemGroup", "file-upload-item-group"],
  ["Item", "file-upload-item"],
  ["ItemPreview", "file-upload-item-preview"],
  ["ItemPreviewImage", "file-upload-item-preview-image"],
  ["ItemName", "file-upload-item-name"],
  ["ItemSizeText", "file-upload-item-size-text"],
  ["ItemDeleteTrigger", "file-upload-item-delete-trigger"],
  ["ClearTrigger", "file-upload-clear-trigger"],
];

test("forwards the complete Ark root contract", () => {
  assert.match(root, /from "@ark-ui\/vue\/file-upload"/);
  assert.match(root, /v-bind="\$attrs"/);
  assert.match(root, /data-slot="file-upload"/);

  for (const prop of [
    "accept",
    "acceptedFiles",
    "allowDrop",
    "asChild",
    "capture",
    "defaultAcceptedFiles",
    "directory",
    "disabled",
    "id",
    "ids",
    "invalid",
    "locale",
    "maxFileSize",
    "maxFiles",
    "minFileSize",
    "name",
    "preventDocumentDrop",
    "readOnly",
    "required",
    "transformFiles",
    "translations",
    "validate",
  ]) {
    assert.match(root, new RegExp(`${prop}: undefined`));
  }

  for (const event of [
    "fileAccept",
    "fileChange",
    "fileReject",
    "update:acceptedFiles",
  ]) {
    assert.match(types, new RegExp(`(?:\\"|)${event.replace(":", "\\:")}`));
  }
});

test("wraps every Ark part and forwards attributes to its semantic element", () => {
  for (const [part, slot] of parts) {
    const source = readSource(`./FileUpload${part}.vue`);
    assert.match(source, new RegExp(`<ArkFileUpload\\.${part}`));
    assert.match(source, /v-bind="\$attrs"/);
    assert.match(source, new RegExp(`data-slot="${slot}"`));
    assert.match(source, /:as-child="props\.asChild"/);
  }

  assert.match(readSource("./FileUploadDropzone.vue"), /:disable-click="props\.disableClick"/);
  assert.match(readSource("./FileUploadItemGroup.vue"), /:type="props\.type"/);
  assert.match(readSource("./FileUploadItem.vue"), /:file="props\.file"/);
  assert.match(readSource("./FileUploadItemPreview.vue"), /:type="props\.type"/);
});

test("supports external machines, context access, and both import styles", () => {
  assert.match(provider, /<ArkFileUpload\.RootProvider/);
  assert.match(provider, /:value="props\.value"/);
  assert.match(context, /<ArkFileUpload\.Context v-slot="context">/);
  assert.match(types, /FileUploadApi = UnwrapRef<UseFileUploadReturn>/);
  assert.match(barrel, /useFileUpload/);
  assert.match(barrel, /useFileUploadContext/);
  assert.match(barrel, /fileUploadAnatomy/);

  for (const part of [
    "Root",
    "RootProvider",
    ...parts.map(([name]) => name),
    "Context",
  ]) {
    assert.match(barrel, new RegExp(`${part}: FileUpload${part}`));
  }
});

test("provides useful default actions and file media", () => {
  assert.match(readSource("./FileUploadItemPreview.vue"), /<slot>[\s\S]*<svg/);
  assert.match(readSource("./FileUploadItemDeleteTrigger.vue"), /<slot>[\s\S]*<svg/);
  assert.match(readSource("./FileUploadClearTrigger.vue"), /<slot>Clear files<\/slot>/);
});

test("uses Ark state attributes and Kappa semantic styling", () => {
  assert.match(styles, /--kappa-file-upload-background/);
  assert.match(styles, /var\(--kappa-control/);
  assert.match(styles, /\[data-dragging\]/);
  assert.match(styles, /\[data-invalid\]/);
  assert.match(styles, /\[data-disabled\]/);
  assert.match(styles, /\[data-readonly\]/);
  assert.match(styles, /\[data-type="rejected"\]/);
  assert.match(styles, /:focus-visible/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-)[a-z][\w-]*/);
  assert.doesNotMatch(styles, /(?:margin|padding|border)-(?:left|right)|text-align:\s*(?:left|right)/);
  assert.doesNotMatch(styles, /#[\da-f]{3,8}(?![^\n]*\))/i);
});
