import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  DICEHUB_FULL_LOGO_PATHS,
  DICEHUB_FULL_LOGO_VIEWBOX,
  DICEHUB_GLYPH_PATHS,
  DICEHUB_GLYPH_VIEWBOX,
  DICEHUB_LOGO_COLORS,
  DICEHUB_LOGO_DEFAULT_COLOR,
  DICEHUB_LOGO_DEFAULT_VARIANT,
  DICEHUB_LOGO_INK,
  DICEHUB_LOGO_VARIANTS,
  DICEHUB_WORDMARK_PATH,
  generateDicehubLogoSvg,
  isDicehubLogoColor,
  isDicehubLogoVariant,
} from "./dicehub-logo.ts";

const countPaths = (svg) => svg.match(/<path /g)?.length ?? 0;
const poweredBySource = readFileSync(new URL("./PoweredByDicehub.vue", import.meta.url), "utf8");
const logoStyles = readFileSync(new URL("./dicehub-logo.css", import.meta.url), "utf8");
const moduleBarrel = readFileSync(new URL("./index.ts", import.meta.url), "utf8");

test("keeps the public logo metadata synchronized", () => {
  assert.deepEqual(DICEHUB_LOGO_VARIANTS, ["glyph", "full"]);
  assert.deepEqual(DICEHUB_LOGO_COLORS, ["color", "black", "white"]);
  assert.equal(DICEHUB_LOGO_DEFAULT_VARIANT, "full");
  assert.equal(DICEHUB_LOGO_DEFAULT_COLOR, "color");
  assert.equal(DICEHUB_LOGO_INK, "#333333");
  assert.equal(DICEHUB_GLYPH_VIEWBOX, "0 0 33 36");
  assert.equal(DICEHUB_FULL_LOGO_VIEWBOX, "0 0 137 41");
  assert.equal(DICEHUB_GLYPH_PATHS.length, 5);
  assert.equal(DICEHUB_FULL_LOGO_PATHS.length, 13);
  assert.equal(DICEHUB_WORDMARK_PATH, DICEHUB_FULL_LOGO_PATHS.slice(5).join(" "));
});

test("validates logo variants and colors", () => {
  assert.equal(isDicehubLogoVariant("glyph"), true);
  assert.equal(isDicehubLogoVariant("full"), true);
  assert.equal(isDicehubLogoVariant("mark"), false);
  assert.equal(isDicehubLogoColor("color"), true);
  assert.equal(isDicehubLogoColor("black"), true);
  assert.equal(isDicehubLogoColor("white"), true);
  assert.equal(isDicehubLogoColor("currentColor"), false);
});

test("generates the default full-color SVG", () => {
  const svg = generateDicehubLogoSvg();

  assert.match(svg, /^<svg viewBox="0 0 137 41"/);
  assert.match(svg, /role="img" aria-label="dicehub logo"/);
  assert.equal(countPaths(svg), DICEHUB_FULL_LOGO_PATHS.length);
  assert.equal(svg.match(/fill="#333333"/g)?.length, DICEHUB_FULL_LOGO_PATHS.length);
});

test("generates glyph and monochrome SVG variants", () => {
  const blackGlyph = generateDicehubLogoSvg({ variant: "glyph", color: "black" });
  const whiteFull = generateDicehubLogoSvg({ variant: "full", color: "white" });

  assert.match(blackGlyph, /^<svg viewBox="0 0 33 36"/);
  assert.equal(countPaths(blackGlyph), DICEHUB_GLYPH_PATHS.length);
  assert.equal(blackGlyph.match(/fill="#000000"/g)?.length, DICEHUB_GLYPH_PATHS.length);
  assert.equal(whiteFull.match(/fill="#FFFFFF"/g)?.length, DICEHUB_FULL_LOGO_PATHS.length);
});

test("falls back when JavaScript callers pass unsupported values", () => {
  const svg = generateDicehubLogoSvg({ variant: "mark", color: "currentColor" });

  assert.match(svg, /^<svg viewBox="0 0 137 41"/);
  assert.equal(countPaths(svg), DICEHUB_FULL_LOGO_PATHS.length);
  assert.equal(svg.match(/fill="#333333"/g)?.length, DICEHUB_FULL_LOGO_PATHS.length);
});

test("exports the powered-by composition from the public logo module", () => {
  assert.match(moduleBarrel, /export \{ default as PoweredByDicehub \} from "\.\/PoweredByDicehub\.vue";/);
});

test("keeps the powered-by link defaults and safe external-link relationship", () => {
  assert.match(poweredBySource, /href: "https:\/\/dicehub\.com"/);
  assert.match(poweredBySource, /target: "_blank"/);
  assert.match(
    poweredBySource,
    /props\.rel \?\? \(props\.target === "_blank" \? "noopener noreferrer" : undefined\)/,
  );
  assert.match(poweredBySource, /variant="glyph"/);
  assert.match(poweredBySource, /aria-hidden="true"/);
  assert.match(poweredBySource, /Powered by <strong>dicehub<\/strong>/);
});

test("namespaces powered-by styles and respects reduced motion", () => {
  assert.match(poweredBySource, /class="kappa-powered-by-dicehub"/);
  assert.doesNotMatch(poweredBySource, /class="(?!kappa-)[a-z]|(?<![\w-])--(?!kappa-)[a-z][\w-]*/);
  assert.match(logoStyles, /\.kappa-powered-by-dicehub:focus-visible/);
  assert.match(logoStyles, /@media \(prefers-reduced-motion: reduce\)/);
});
