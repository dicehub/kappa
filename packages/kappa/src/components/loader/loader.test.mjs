import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  LOADER_DEFAULT_DURATION,
  LOADER_DEFAULT_LABEL,
  LOADER_DEFAULT_SIZE,
  LOADER_DEFAULT_VARIANT,
  LOADER_SIZES,
  LOADER_VARIANTS,
  isLoaderSize,
  isLoaderVariant,
  resolveLoaderDuration,
  resolveLoaderLabel,
  resolveLoaderSize,
  resolveLoaderVariant,
} from "./loader.ts";

const source = (name) => readFileSync(new URL(`./${name}`, import.meta.url), "utf8");

const component = source("Loader.vue");
const graphic = source("LoaderGraphic.vue");
const styles = source("loader.css");
const barrel = source("index.ts");

test("defines preset sizes and safe runtime fallbacks", () => {
  assert.deepEqual(LOADER_SIZES, { sm: 16, base: 24, lg: 32 });
  assert.equal(LOADER_DEFAULT_SIZE, "base");
  assert.equal(LOADER_DEFAULT_VARIANT, "spinner");
  assert.equal(LOADER_DEFAULT_DURATION, 1500);
  assert.equal(LOADER_DEFAULT_LABEL, "Loading");
  assert.deepEqual(LOADER_VARIANTS, [
    "spinner",
    "waveform",
    "helix",
    "quantum",
    "dot-wave",
    "dot-stream",
    "mirage",
    "ping",
    "orbit",
  ]);

  for (const size of ["sm", "base", "lg"]) assert.equal(isLoaderSize(size), true);
  for (const size of ["missing", "constructor", "__proto__", null, 24]) {
    assert.equal(isLoaderSize(size), false);
  }
  for (const variant of LOADER_VARIANTS) assert.equal(isLoaderVariant(variant), true);
  for (const variant of ["atom", "constructor", null, 1]) {
    assert.equal(isLoaderVariant(variant), false);
  }

  assert.equal(resolveLoaderSize("sm"), 16);
  assert.equal(resolveLoaderSize("lg"), 32);
  assert.equal(resolveLoaderSize(40), 40);
  for (const invalid of [0, -1, Number.NaN, Number.POSITIVE_INFINITY, "xl", null]) {
    assert.equal(resolveLoaderSize(invalid), 24);
  }
  assert.equal(resolveLoaderVariant("orbit"), "orbit");
  assert.equal(resolveLoaderVariant("atom"), "spinner");
  assert.equal(resolveLoaderDuration(900), 900);
  assert.equal(resolveLoaderDuration(100), 400);
  assert.equal(resolveLoaderDuration(20_000), 10_000);
  assert.equal(resolveLoaderDuration(null), 1500);

  assert.equal(resolveLoaderLabel("Loading reports"), "Loading reports");
  for (const invalid of ["", "   ", null, 1]) {
    assert.equal(resolveLoaderLabel(invalid), "Loading");
  }
});

test("renders an accessible status with an explicit decorative mode", () => {
  assert.match(component, /defineOptions\(\{ inheritAttrs: false \}\)/);
  assert.match(component, /<span\s+v-bind="\$attrs"\s+class="kappa-loader"/);
  assert.match(component, /data-slot="loader"/);
  assert.match(component, /:role="props\.decorative \? undefined : 'status'"/);
  assert.match(component, /:aria-live="props\.decorative \? undefined : 'polite'"/);
  assert.match(component, /:aria-hidden="props\.decorative \? 'true' : undefined"/);
  assert.match(component, /v-if="!props\.decorative" class="kappa-loader__label"/);
  assert.match(component, /<LoaderGraphic :duration="resolvedDuration" :variant="resolvedVariant"/);
  assert.match(graphic, /<svg[\s\S]*aria-hidden="true"[\s\S]*focusable="false"/);
  assert.match(graphic, /kappa-loader__track/);
  assert.match(graphic, /kappa-loader__indicator/);
  assert.doesNotMatch(`${component}\n${graphic}`, /@ark-ui|@zag-js|animateTransform|<animate/);
});

test("renders each loader variant with deterministic local markup", () => {
  for (const variant of LOADER_VARIANTS) {
    assert.match(graphic, new RegExp(`variant === ['\"]${variant}['\"]`));
  }
  assert.match(graphic, /Array\.from\(\{ length: 12 \}/);
  assert.match(graphic, /class="kappa-loader__orbit kappa-loader__orbit--three"/);
  assert.match(graphic, /--kappa-loader-delay/);
});

test("uses current color, logical sizing, scoped motion, and accessibility fallbacks", () => {
  assert.match(styles, /\.kappa-loader \{/);
  assert.match(styles, /--kappa-loader-size/);
  assert.match(styles, /inline-size: var\(--kappa-loader-size\)/);
  assert.match(styles, /block-size: var\(--kappa-loader-size\)/);
  assert.match(styles, /stroke: currentColor/);
  assert.match(styles, /background: currentColor/);
  assert.match(styles, /@keyframes kappa-loader-rotate/);
  assert.match(styles, /@keyframes kappa-loader-dash/);
  assert.match(styles, /@keyframes kappa-loader-waveform/);
  assert.match(styles, /@keyframes kappa-loader-helix/);
  assert.match(styles, /@keyframes kappa-loader-quantum/);
  assert.match(styles, /@keyframes kappa-loader-dot-wave/);
  assert.match(styles, /@keyframes kappa-loader-dot-stream/);
  assert.match(styles, /@keyframes kappa-loader-ping/);
  assert.match(styles, /@keyframes kappa-loader-orbit-three/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /animation: none/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.match(styles, /clip-path: inset\(50%\)/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-)[a-z][\w-]*/);
});

test("exports the public component, types, constants, and resolvers", () => {
  for (const name of [
    "Loader",
    "LoaderProps",
    "LoaderSize",
    "LoaderVariant",
    "LOADER_DEFAULT_DURATION",
    "LOADER_DEFAULT_LABEL",
    "LOADER_DEFAULT_SIZE",
    "LOADER_DEFAULT_VARIANT",
    "LOADER_SIZES",
    "LOADER_VARIANTS",
    "isLoaderSize",
    "isLoaderVariant",
    "resolveLoaderDuration",
    "resolveLoaderLabel",
    "resolveLoaderSize",
    "resolveLoaderVariant",
  ]) {
    assert.match(barrel, new RegExp(name));
  }
});
