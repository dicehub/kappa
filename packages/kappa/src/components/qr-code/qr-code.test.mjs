import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { resolveQrCodeEncoding } from "./qr-code.ts";

const source = (name) => readFileSync(new URL(`./${name}`, import.meta.url), "utf8");

const root = source("QrCodeRoot.vue");
const download = source("QrCodeDownloadTrigger.vue");
const styles = source("qr-code.css");
const types = source("qr-code.ts");
const barrel = source("index.ts");

const parts = [
  ["Frame", "qr-code-frame"],
  ["Pattern", "qr-code-pattern"],
  ["Overlay", "qr-code-overlay"],
];

test("builds the root from Ark useQrCode so v-model events remain public", () => {
  assert.match(root, /useQrCode/);
  assert.match(root, /ArkQrCode\.RootProvider/);
  assert.match(root, /const emit = defineEmits<QrCodeRootEmits>/);
  assert.match(root, /data-slot="qr-code"/);
  assert.match(root, /v-bind="\$attrs"/);

  for (const prop of ["defaultValue", "encoding", "id", "ids", "modelValue", "pixelSize"]) {
    assert.match(root, new RegExp(`${prop}: props\\.${prop}`));
  }
});

test("defaults only the quiet zone and preserves explicit encoding options", () => {
  assert.deepEqual(resolveQrCodeEncoding(), { border: 4 });
  assert.deepEqual(resolveQrCodeEncoding({ ecc: "H" }), { ecc: "H", border: 4 });
  assert.deepEqual(resolveQrCodeEncoding({ border: undefined }), { border: 4 });
  for (const border of [0, 1, 4, 8]) {
    const encoding = Object.freeze({ border, ecc: "Q", boostEcc: true });
    assert.deepEqual(resolveQrCodeEncoding(encoding), encoding);
    assert.notEqual(resolveQrCodeEncoding(encoding), encoding);
  }
  assert.match(root, /from "\.\/use-qr-code"/);
  assert.match(barrel, /export \{ useQrCode \} from "\.\/use-qr-code"/);
  assert.match(source("use-qr-code.ts"), /useArkQrCode\(computed/);
  assert.match(source("use-qr-code.ts"), /resolveQrCodeEncoding\(options\?\.encoding\)/);
});

test("includes export-safe SVG paint without adding children to asChild frames", () => {
  assert.match(source("QrCodeFrame.vue"), /<rect/);
  assert.match(source("QrCodeFrame.vue"), /v-if="!props.asChild"/);
  assert.match(source("QrCodeFrame.vue"), /fill="var\(--kappa-qr-code-background, #ffffff\)"/);
  assert.match(source("QrCodePattern.vue"), /fill="var\(--kappa-qr-code-foreground, #111318\)"/);
  assert.doesNotMatch(styles, /min-inline-size: 1\.5rem/);
});

test("wraps every visual Ark part and forwards attributes", () => {
  for (const [part, slot] of parts) {
    const component = source(`QrCode${part}.vue`);
    assert.match(component, new RegExp(`<ArkQrCode\\.${part}`));
    assert.match(component, /v-bind="\$attrs"/);
    assert.match(component, new RegExp(`data-slot="${slot}"`));
  }

  assert.match(source("QrCodeRootProvider.vue"), /:value="props\.value"/);
  assert.match(source("QrCodeContext.vue"), /<slot v-bind="context" \/>/);
});

test("uses the Kappa button contract for QR image downloads", () => {
  assert.match(download, /ArkQrCode\.DownloadTrigger/);
  assert.match(download, /class="kappa-button kappa-qr-code__download-trigger"/);
  assert.match(download, /:file-name="props\.fileName"/);
  assert.match(download, /:mime-type="props\.mimeType"/);
  assert.match(download, /:quality="props\.quality"/);
  assert.match(types, /extends ButtonVisualProps/);
});

test("keeps the generated graphic scan-safe and theme independent", () => {
  assert.match(styles, /--kappa-qr-code-foreground/);
  assert.match(styles, /--kappa-qr-code-background/);
  assert.match(styles, /shape-rendering: crispEdges/);
  assert.match(styles, /forced-colors: active/);
  assert.doesNotMatch(styles, /(?:margin|padding|border)-(?:left|right)/);
});

test("exports the complete compound API and Ark utilities", () => {
  for (const name of [
    "QrCode",
    "QrCodeRoot",
    "QrCodeRootProvider",
    "QrCodeFrame",
    "QrCodePattern",
    "QrCodeOverlay",
    "QrCodeDownloadTrigger",
    "QrCodeContext",
    "useQrCode",
    "useQrCodeContext",
    "qrCodeAnatomy",
  ]) {
    assert.match(barrel, new RegExp(name));
  }
});
