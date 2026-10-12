import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (name) => readFile(new URL(name, import.meta.url), "utf8");



test("keeps size resolution deterministic", async () => {
  const source = await read("./rating.ts");

  assert.match(source, /RATING_SIZES = \["sm", "base", "lg"\] as const/);
  assert.match(source, /RATING_DEFAULT_SIZE = "base"/);
  assert.match(source, /isRatingSize/);
  assert.match(source, /resolveRatingSize/);
});

test("styles complete interactive, invalid, and half-value states", async () => {
  const styles = await read("./rating.css");

  assert.match(styles, /\.kappa-rating__item\[data-highlighted\]/);
  assert.match(styles, /\.kappa-rating__item\[data-half\]/);
  assert.match(styles, /clip-path: inset\(0 50% 0 0\)/);
  assert.match(styles, /\.kappa-rating\[dir="rtl"\]/);
  assert.match(styles, /\.kappa-rating__item:hover/);
  assert.match(styles, /:focus-visible/);
  assert.match(styles, /\[data-invalid\]/);
  assert.match(styles, /\[data-disabled\]/);
  assert.match(styles, /\[data-readonly\]/);
  assert.match(styles, /prefers-reduced-motion/);
  assert.match(styles, /forced-colors/);
  assert.doesNotMatch(styles, /#[0-9a-f]{3,8}(?![^\n]*\))/i);
});
