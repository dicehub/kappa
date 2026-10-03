import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

let themeTokens;
try {
  themeTokens = (await import("@dicehub/kappa/styles/tokens.json", { with: { type: "json" } }))
    .default;
} catch (error) {
  throw new Error(
    "Run `pnpm --filter @dicehub/kappa codegen:themes` before the documentation tests.",
    { cause: error },
  );
}

const markdown = readFileSync(new URL("../../dist/docs/colors.md", import.meta.url), "utf8");

test("publishes the Colors reference with public imports", () => {
  assert.match(markdown, /^# Colors\b/);
  assert.match(markdown, /## \[Install and Use\]\(#install\)/);
  assert.match(markdown, /## \[Modes\]\(#modes\)/);
  assert.match(markdown, /## \[Token Reference\]\(#reference\)/);
  assert.match(markdown, /## \[Contrast\]\(#contrast\)/);
  assert.match(markdown, /## \[Maintenance\]\(#maintenance\)/);

  assert.match(markdown, /@dicehub\/kappa\/styles\/theme-kappa\.css/);
  assert.match(markdown, /@dicehub\/kappa\/styles\/tokens\.json/);
  assert.match(markdown, /var\(--kappa-tint\)/);
  assert.match(markdown, /data-kappa-theme="dark"/);
  assert.match(markdown, /data-mode="dark"/);

  assert.doesNotMatch(
    markdown,
    /Planned documentation|On this page|Copy page|View Code|No tokens match|Search token name/,
  );

  /*
   * The Maintenance section names `data-markdown-keep` in a code span on
   * purpose. Only leaked markup, an attribute inside a tag, or an island element
   * fails these checks.
   */
  assert.match(markdown, /`data-markdown-keep`/);
  assert.doesNotMatch(markdown, /<[^>\n]*data-markdown-keep/i);
  assert.doesNotMatch(markdown, /<astro-island|<\/astro-island/i);
  assert.doesNotMatch(markdown, /docs-colors-search|kappa-clipboard-text/);
});

test("renders every token with both configured values", () => {
  assert.ok(themeTokens.tokens.length > 0);

  for (const token of themeTokens.tokens) {
    assert.ok(markdown.includes(token.name), `missing ${token.name}`);
    assert.ok(markdown.includes(token.description), `missing description for ${token.name}`);

    for (const mode of themeTokens.modes) {
      const value = token[mode];
      if (/^(?:#|rgb)/i.test(value)) {
        assert.ok(markdown.includes(value), `missing ${mode} value for ${token.name}`);
      }
    }
  }
});

test("documents contrast pairs, ratios, and the withdrawn token", () => {
  for (const pair of themeTokens.contrastPairs) {
    assert.ok(markdown.includes(pair.label), `missing contrast pair ${pair.id}`);
    assert.ok(markdown.includes(pair.note), `missing note for ${pair.id}`);
  }

  assert.match(markdown, /\d+\.\d{2}:1/);
  assert.match(markdown, /--kappa-selected-background/);
  assert.match(markdown, /--kappa-selected-contrast/);
  assert.match(markdown, /codegen:themes/);
  assert.match(markdown, /check:themes/);
});
