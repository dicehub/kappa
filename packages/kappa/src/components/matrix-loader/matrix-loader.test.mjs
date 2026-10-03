import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  MATRIX_LOADER_DEFAULT_DURATION,
  MATRIX_LOADER_DEFAULT_LABEL,
  MATRIX_LOADER_DEFAULT_MOTION,
  MATRIX_LOADER_DEFAULT_SHAPE,
  MATRIX_LOADER_DEFAULT_SIZE,
  MATRIX_LOADER_MOTIONS,
  MATRIX_LOADER_SHAPES,
  MATRIX_LOADER_SIZES,
  createMatrixLoaderDots,
  resolveMatrixLoaderDuration,
  resolveMatrixLoaderLabel,
  resolveMatrixLoaderMotion,
  resolveMatrixLoaderShape,
  resolveMatrixLoaderSize,
} from "./matrix-loader.ts";

const source = (name) => readFileSync(new URL(`./${name}`, import.meta.url), "utf8");

test("defines stable presets and safe runtime fallbacks", () => {
  assert.deepEqual(MATRIX_LOADER_SIZES, { sm: 16, base: 24, lg: 32 });
  assert.deepEqual(MATRIX_LOADER_SHAPES, ["square", "circle", "diamond", "ring"]);
  assert.deepEqual(MATRIX_LOADER_MOTIONS, ["pulse", "scan", "twinkle", "orbit"]);
  assert.equal(MATRIX_LOADER_DEFAULT_SIZE, "base");
  assert.equal(MATRIX_LOADER_DEFAULT_SHAPE, "square");
  assert.equal(MATRIX_LOADER_DEFAULT_MOTION, "pulse");
  assert.equal(MATRIX_LOADER_DEFAULT_DURATION, 1200);
  assert.equal(MATRIX_LOADER_DEFAULT_LABEL, "Loading");

  assert.equal(resolveMatrixLoaderSize("sm"), 16);
  assert.equal(resolveMatrixLoaderSize(48), 48);
  assert.equal(resolveMatrixLoaderSize("missing"), 24);
  assert.equal(resolveMatrixLoaderShape("ring"), "ring");
  assert.equal(resolveMatrixLoaderShape("missing"), "square");
  assert.equal(resolveMatrixLoaderMotion("orbit"), "orbit");
  assert.equal(resolveMatrixLoaderMotion("missing"), "pulse");
  assert.equal(resolveMatrixLoaderDuration(200), 400);
  assert.equal(resolveMatrixLoaderDuration(20_000), 10_000);
  assert.equal(resolveMatrixLoaderDuration(Number.NaN), 1200);
  assert.equal(resolveMatrixLoaderLabel("Meshing"), "Meshing");
  assert.equal(resolveMatrixLoaderLabel("  "), "Loading");
});

test("builds deterministic five by five matrices for every shape and motion", () => {
  const visibleCounts = { square: 25, circle: 21, diamond: 13, ring: 16 };

  for (const shape of MATRIX_LOADER_SHAPES) {
    for (const motion of MATRIX_LOADER_MOTIONS) {
      const dots = createMatrixLoaderDots(shape, motion);
      assert.equal(dots.length, 25);
      assert.equal(dots.filter((dot) => dot.visible).length, visibleCounts[shape]);
      assert.ok(dots.every((dot) => dot.phase >= 0 && dot.phase <= 1));
      assert.deepEqual(dots, createMatrixLoaderDots(shape, motion));
    }
  }
});

test("renders accessible status semantics and deterministic dot parts", () => {
  const component = source("MatrixLoader.vue");

  assert.match(component, /defineOptions\(\{ inheritAttrs: false \}\)/);
  assert.match(component, /class="kappa-matrix-loader"/);
  assert.match(component, /data-slot="matrix-loader"/);
  assert.match(component, /data-slot="matrix-loader-dot"/);
  assert.match(component, /:role="props\.decorative \? undefined : 'status'"/);
  assert.match(component, /:aria-live="props\.decorative \? undefined : 'polite'"/);
  assert.match(component, /:aria-hidden="props\.decorative \? 'true' : undefined"/);
  assert.match(component, /v-if="!props\.decorative" class="kappa-matrix-loader__label"/);
  assert.doesNotMatch(component, /Math\.random|@ark-ui|@zag-js/);
});

test("uses current color and supplies motion accessibility fallbacks", () => {
  const styles = source("matrix-loader.css");

  assert.match(styles, /\.kappa-matrix-loader \{/);
  assert.match(styles, /grid-template-columns: repeat\(5/);
  assert.match(styles, /color: currentColor/);
  assert.match(styles, /@keyframes kappa-matrix-loader-pulse/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.match(styles, /animation: none/);
  assert.match(styles, /clip-path: inset\(50%\)/);
  assert.doesNotMatch(styles, /#[0-9a-f]{3,8}/i);
});
