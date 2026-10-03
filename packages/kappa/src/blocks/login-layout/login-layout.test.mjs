import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  LOGIN_LAYOUT_DEFAULTS,
  LOGIN_LAYOUT_MEDIA_SIDES,
  LOGIN_LAYOUT_VARIANTS,
  resolveLoginLayoutMediaSide,
  resolveLoginLayoutVariant,
} from "./login-layout.ts";

const source = name => readFileSync(new URL(name, import.meta.url), "utf8");

test("login layouts expose stable variants and defensive defaults", () => {
  assert.deepEqual(LOGIN_LAYOUT_VARIANTS, ["centered", "split", "panel", "card"]);
  assert.deepEqual(LOGIN_LAYOUT_MEDIA_SIDES, ["start", "end"]);
  assert.equal(LOGIN_LAYOUT_DEFAULTS.variant, "centered");
  assert.equal(resolveLoginLayoutVariant("split"), "split");
  assert.equal(resolveLoginLayoutVariant("unknown"), "centered");
  assert.equal(resolveLoginLayoutMediaSide("start"), "start");
  assert.equal(resolveLoginLayoutMediaSide(undefined), "end");
});

test("LoginLayout exposes structure without owning authentication behavior", () => {
  const component = source("LoginLayout.vue");
  for (const slot of ["brand", "media", "footer"]) {
    assert.ok(component.includes(`name="${slot}"`), slot);
  }
  for (const part of ["login-layout", "login-layout-brand", "login-layout-body", "login-layout-media"]) {
    assert.ok(component.includes(`data-slot="${part}"`), part);
  }
  assert.doesNotMatch(component, /fetch\(|localStorage|sessionStorage|type="password"/);
});

test("login layout styling is scoped, responsive, and motion-safe", () => {
  const css = source("login-layout.css");
  assert.match(css, /\.kappa-login-layout\[data-variant="split"\]/);
  assert.match(css, /\.kappa-login-layout\[data-variant="card"\]/);
  assert.match(css, /@media \(min-width: 100rem\)/);
  assert.match(css, /grid-template-columns: minmax\(0, 1fr\) 50rem/);
  assert.match(css, /@media \(max-width: 48rem\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(css, /data-mode/);
  assert.doesNotMatch(css, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-)[a-z][\w-]*/);
});

test("LoginLayout is a published block with a generated registry entry", () => {
  const registry = JSON.parse(source("../../registry/component-registry.json"));
  assert.equal(registry.components.LoginLayout?.type, "block");
  assert.equal(registry.components.LoginLayout?.importPath, "@dicehub/kappa/blocks/login-layout");
  const manifest = JSON.parse(source("../../../package.json"));
  assert.equal(manifest.exports["./blocks/*"]["kappa-source"], "./src/blocks/*/index.ts");
  assert.equal(manifest.exports["./blocks/*"].import, "./dist/blocks/*.js");
});
