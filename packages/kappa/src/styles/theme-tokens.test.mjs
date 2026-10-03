import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const readSource = (relativePath) =>
  readFileSync(new URL(`../../${relativePath}`, import.meta.url), "utf8");

const manifest = JSON.parse(readSource("package.json"));
const tokens = JSON.parse(readSource("src/styles/tokens.json"));
const themeCss = readSource("src/styles/theme-kappa.css");
const viteConfig = readSource("vite.config.ts");

/** Collect `--kappa-*` declarations per selector block, ignoring comments. */
const parseCssBlocks = (source) => {
  const blocks = new Map();
  const blockPattern = /([^{}]+)\{([^{}]*)\}/g;
  const declarationPattern = /(--kappa-[a-z0-9-]+)\s*:\s*([^;]+);/g;

  for (const block of source.replaceAll(/\/\*[\s\S]*?\*\//g, "").matchAll(blockPattern)) {
    const declarations = new Map();
    for (const declaration of block[2].matchAll(declarationPattern)) {
      declarations.set(declaration[1], declaration[2].trim());
    }
    blocks.set(block[1].trim(), declarations);
  }

  return blocks;
};

const cssBlocks = parseCssBlocks(themeCss);
const block = (selector) => {
  const declarations = cssBlocks.get(selector);
  assert.ok(declarations, `missing CSS block: ${selector}`);
  return declarations;
};

test("publishes the theme and metadata through package exports", () => {
  assert.equal(
    manifest.exports["./styles/theme-kappa.css"]["kappa-source"],
    "./src/styles/theme-kappa.css",
  );
  assert.equal(manifest.exports["./styles/theme-kappa.css"].default, "./dist/styles/theme-kappa.css");
  assert.equal(manifest.exports["./styles/tokens.json"]["kappa-source"], "./src/styles/tokens.json");
  assert.equal(manifest.exports["./styles/tokens.json"].default, "./dist/styles/tokens.json");
  assert.equal(manifest.exports["./styles/kappa.css"], "./dist/styles/kappa.css");

  assert.match(manifest.scripts["codegen:themes"], /theme-generator\/index\.mjs/);
  assert.match(manifest.scripts["check:themes"], /--check/);
  assert.match(manifest.scripts.typecheck, /check:themes/);
  assert.ok(
    manifest.scripts.build.indexOf("codegen:themes") < manifest.scripts.build.indexOf("vite build"),
    "the build generates theme assets before Vite runs",
  );
});

test("emits the theme assets into the library output", () => {
  assert.match(viteConfig, /kappa-theme-assets/);
  assert.match(viteConfig, /emitFile/);
  assert.match(viteConfig, /styles\/theme-kappa\.css/);
  assert.match(viteConfig, /styles\/tokens\.json/);

  assert.match(manifest.scripts["check:theme-build"], /check-theme-build\.mjs/);
  assert.ok(
    manifest.scripts.build.indexOf("check:theme-build") > manifest.scripts.build.indexOf("vite build"),
    "the build verifies the packed theme assets after Vite runs",
  );
});

test("keeps metadata and generated CSS in agreement", () => {
  const rootBlock = block(":root");
  const canonicalLight = block('[data-kappa-theme="light"]');
  const canonicalDark = block('[data-kappa-theme="dark"]');

  assert.deepEqual([...canonicalLight], [...rootBlock], "the root block is the light theme");
  assert.deepEqual([...block('[data-mode="light"]')], [...rootBlock]);
  assert.deepEqual([...block('[data-mode="dark"]')], [...canonicalDark]);

  assert.equal(canonicalLight.size, tokens.tokens.length);
  assert.equal(canonicalDark.size, tokens.tokens.length);

  for (const token of tokens.tokens) {
    assert.equal(canonicalLight.get(token.name), token.light, `${token.name} light`);
    assert.equal(canonicalDark.get(token.name), token.dark, `${token.name} dark`);
  }
});

test("keeps the theme free of documentation aliases and dangling references", () => {
  assert.doesNotMatch(themeCss, /--docs-/);

  const declared = new Set(tokens.tokens.map((token) => token.name));
  for (const match of themeCss.matchAll(/var\((--kappa-[a-z0-9-]+)\)/g)) {
    assert.ok(declared.has(match[1]), `unresolved reference: ${match[1]}`);
  }

  assert.deepEqual(tokens.attributes.values, tokens.modes);
  assert.equal(tokens.attributes.canonical, "data-kappa-theme");
  assert.ok(tokens.attributes.compatibility.includes("data-mode"));
});

test("withdraws the ambiguous selected token and documents its replacements", () => {
  assert.doesNotMatch(themeCss, /--kappa-selected\s*:/);

  const deprecation = tokens.deprecations.find((entry) => entry.name === "--kappa-selected");
  assert.ok(deprecation, "the ambiguous token is documented as deprecated");
  for (const replacement of deprecation.replacements) {
    assert.ok(
      tokens.tokens.some((token) => token.name === replacement),
      `${replacement} exists`,
    );
  }

  const legacyFirstChains = {
    "components/toolbar/toolbar.css":
      /background: var\(--kappa-selected, var\(--kappa-selected-background/,
    "components/date-picker/date-picker.css":
      /background: var\(--kappa-selected, var\(--kappa-selected-background/,
    "components/combobox/combobox.css": /color: var\(--kappa-selected, var\(--kappa-selected-text/,
    "components/autocomplete/autocomplete.css":
      /color: var\(--kappa-selected, var\(--kappa-selected-text/,
  };

  for (const [path, pattern] of Object.entries(legacyFirstChains)) {
    assert.match(readSource(`src/${path}`), pattern, path);
  }

  assert.match(
    readSource("src/components/date-picker/date-picker.css"),
    /color: var\(--kappa-selected-contrast, var\(--kappa-base/,
  );
});

test("keeps decorative boundaries out of the measured pairs", () => {
  const decorative = [
    "--kappa-hairline",
    "--kappa-line",
    "--kappa-input-border",
    "--kappa-line-strong",
    "--kappa-disabled-surface",
    "--kappa-readonly-surface",
  ];

  const measured = tokens.contrastPairs.flatMap((pair) => [pair.foreground, pair.background]);
  for (const name of decorative) {
    assert.ok(!measured.includes(name), `${name} must stay exempt from contrast minimums`);
  }

  const lineStrong = tokens.tokens.find((token) => token.name === "--kappa-line-strong");
  assert.ok(lineStrong, "--kappa-line-strong is published");
  assert.match(lineStrong.compatibility ?? "", /Decorative only/);
});
