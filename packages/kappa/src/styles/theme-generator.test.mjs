import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { themeConfig } from "../../scripts/theme-generator/config.ts";
import {
  classifyThemeValue,
  collectThemeOutputs,
  createThemeArtifacts,
  findThemeIssues,
  findStaleThemeOutputs,
  resolveTokenValue,
} from "../../scripts/theme-generator/render.mjs";

const cloneConfig = () => structuredClone(themeConfig);

const issuesFor = (mutate) => {
  const config = cloneConfig();
  mutate(config);
  return findThemeIssues(config);
};

test("accepts the authoritative configuration and covers both modes", () => {
  assert.deepEqual(findThemeIssues(themeConfig), []);

  const { json } = createThemeArtifacts(themeConfig);
  const metadata = JSON.parse(json);

  assert.deepEqual(metadata.modes, ["light", "dark"]);
  assert.equal(metadata.defaultMode, "light");
  assert.equal(metadata.tokens.length, themeConfig.tokens.length);
  assert.ok(metadata.tokens.length > 0);

  for (const token of metadata.tokens) {
    assert.ok(token.light.length > 0, `${token.name} light`);
    assert.ok(token.dark.length > 0, `${token.name} dark`);
    assert.ok(token.resolved.light.length > 0, `${token.name} resolved light`);
    assert.ok(token.resolved.dark.length > 0, `${token.name} resolved dark`);
    assert.ok(token.description.length > 0, `${token.name} description`);
  }

  for (const group of metadata.groups) {
    assert.ok(
      metadata.tokens.some((token) => token.group === group.id),
      `${group.id} has tokens`,
    );
  }
});

test("renders deterministic artifacts that match the checked-in files", () => {
  const first = createThemeArtifacts(themeConfig);
  const second = createThemeArtifacts(themeConfig);

  assert.equal(first.css, second.css);
  assert.equal(first.json, second.json);

  assert.equal(readFileSync(new URL("./theme-kappa.css", import.meta.url), "utf8"), first.css);
  assert.equal(readFileSync(new URL("./tokens.json", import.meta.url), "utf8"), first.json);
});

test("reports missing and stale generated files without writing them", () => {
  const outputs = collectThemeOutputs(themeConfig);
  const current = Object.fromEntries(outputs.map((output) => [output.file, output.contents]));

  assert.deepEqual(findStaleThemeOutputs(outputs, (file) => current[file]), []);
  assert.deepEqual(findStaleThemeOutputs(outputs, () => null), [
    "src/styles/theme-kappa.css is missing",
    "src/styles/tokens.json is missing",
  ]);
  assert.deepEqual(findStaleThemeOutputs(outputs, () => "stale"), [
    "src/styles/theme-kappa.css is stale",
    "src/styles/tokens.json is stale",
  ]);
  assert.deepEqual(
    findStaleThemeOutputs(outputs, (file) =>
      file.endsWith(".json") ? current[file] : `${current[file]} `,
    ),
    ["src/styles/theme-kappa.css is stale"],
  );
});

test("keeps generated CSS low-specificity and mode-driven", () => {
  const { css } = createThemeArtifacts(themeConfig);

  assert.match(css, /^:root \{/m);
  assert.match(css, /\[data-mode="light"\] \{/);
  assert.match(css, /\[data-mode="dark"\] \{/);
  assert.match(css, /\[data-kappa-theme="light"\] \{/);
  assert.doesNotMatch(css, /!important/);
  assert.doesNotMatch(css, /--kappa-selected\s*:/);

  const compatibility = css.indexOf('[data-mode="dark"]');
  const canonical = css.indexOf('[data-kappa-theme="dark"]');
  assert.ok(compatibility >= 0, "compatibility block present");
  assert.ok(canonical > compatibility, "canonical attribute block is declared after data-mode");
});

test("rejects duplicates, unknown groups, missing modes, and broken references", () => {
  const duplicate = issuesFor((config) => {
    config.tokens.push({ ...config.tokens[0] });
  });
  assert.ok(duplicate.some((issue) => issue.includes("Duplicate token")));

  const unknownGroup = issuesFor((config) => {
    config.tokens[0].group = "sparkle";
  });
  assert.ok(unknownGroup.some((issue) => issue.includes('Unknown group "sparkle"')));

  const missingMode = issuesFor((config) => {
    config.tokens[0].dark = "";
  });
  assert.ok(missingMode.some((issue) => issue.includes("Missing dark value")));

  const unknownReference = issuesFor((config) => {
    config.tokens[0].light = "var(--kappa-missing)";
  });
  assert.ok(unknownReference.some((issue) => issue.includes("Unknown token reference")));

  const malformedHex = issuesFor((config) => {
    config.tokens[0].light = "#zzz";
  });
  assert.ok(malformedHex.some((issue) => issue.includes("Malformed hex value")));

  const badPair = issuesFor((config) => {
    config.contrastPairs[0].minimum = 3;
  });
  assert.ok(badPair.some((issue) => issue.includes("at least 4.5:1 for text")));

  const unknownReplacement = issuesFor((config) => {
    config.deprecations[0].replacements.push("--kappa-nope");
  });
  assert.ok(unknownReplacement.some((issue) => issue.includes("unknown replacement")));
});

test("detects reference cycles instead of recursing forever", () => {
  const cyclic = cloneConfig();
  cyclic.tokens[0].light = "var(--kappa-base)";
  cyclic.tokens[1].light = "var(--kappa-canvas)";

  const issues = findThemeIssues(cyclic);
  assert.ok(issues.some((issue) => issue.includes("Reference cycle")));
  assert.throws(
    () => resolveTokenValue(cyclic, "--kappa-canvas", "light"),
    /Reference cycle/,
  );
});

test("resolves alias tokens and classifies values", () => {
  assert.equal(classifyThemeValue("var(--kappa-tint)").kind, "reference");
  assert.equal(classifyThemeValue("var(--kappa-tint)").reference, "--kappa-tint");
  assert.equal(classifyThemeValue("#0a0a0a").kind, "color");
  assert.equal(classifyThemeValue("rgba(76, 99, 255, 0.12)").kind, "color");
  assert.equal(classifyThemeValue("none").kind, "keyword");

  assert.equal(resolveTokenValue(themeConfig, "--kappa-selected-text", "dark"), "#fafafa");
  assert.equal(resolveTokenValue(themeConfig, "--kappa-muted", "light"), "#696969");
  assert.equal(resolveTokenValue(themeConfig, "--kappa-disabled-surface", "dark"), "#262626");
  assert.throws(
    () => resolveTokenValue(themeConfig, "--kappa-unknown", "light"),
    /Unknown token reference/,
  );
});
