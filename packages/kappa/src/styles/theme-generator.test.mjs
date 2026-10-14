import assert from "node:assert/strict";

import { test } from "node:test";
import { themeConfig } from "../../scripts/theme-generator/config.ts";
import { classifyThemeValue, findThemeIssues, resolveTokenValue } from "../../scripts/theme-generator/render.mjs";

const cloneConfig = () => structuredClone(themeConfig);

const issuesFor = (mutate) => {
  const config = cloneConfig();
  mutate(config);
  return findThemeIssues(config);
};

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
