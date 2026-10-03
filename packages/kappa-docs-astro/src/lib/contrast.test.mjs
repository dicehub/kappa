import assert from "node:assert/strict";
import { test } from "node:test";
import {
  compositeOver,
  contrastRatio,
  formatContrastRatio,
  parseColor,
  relativeLuminance,
} from "./contrast.ts";

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

test("parses hex and rgb notation", () => {
  assert.deepEqual(parseColor("#ffffff"), { red: 255, green: 255, blue: 255, alpha: 1 });
  assert.deepEqual(parseColor("#0f0f0f"), { red: 15, green: 15, blue: 15, alpha: 1 });
  assert.deepEqual(parseColor("#abc"), { red: 170, green: 187, blue: 204, alpha: 1 });
  assert.deepEqual(parseColor("#abcd"), { red: 170, green: 187, blue: 204, alpha: 221 / 255 });
  assert.deepEqual(parseColor("rgb(76, 99, 255)"), { red: 76, green: 99, blue: 255, alpha: 1 });
  assert.deepEqual(parseColor("rgba(76, 99, 255, 0.12)"), {
    red: 76,
    green: 99,
    blue: 255,
    alpha: 0.12,
  });
  assert.deepEqual(parseColor("rgb(0 0 0 / 50%)"), { red: 0, green: 0, blue: 0, alpha: 0.5 });
  assert.deepEqual(parseColor("rgb(0 0 0/50%)"), { red: 0, green: 0, blue: 0, alpha: 0.5 });
  assert.deepEqual(parseColor("rgba(0, 0, 0, 0.5)"), { red: 0, green: 0, blue: 0, alpha: 0.5 });
  assert.equal(parseColor("#056dff29").alpha, 41 / 255);

  assert.throws(() => parseColor("var(--kappa-tint)"), /Unsupported color value/);
  assert.throws(() => parseColor("#nope"), /Unsupported color value/);
  assert.throws(() => parseColor("rgba(0, 0, 0, 1.5)"), /Unsupported alpha/);
  assert.throws(() => parseColor("rgb(0 0)"), /Unsupported color value/);
  assert.throws(() => parseColor("rgb(1, 2, 3, 4, 5)"), /Unsupported color value/);
  assert.throws(() => parseColor("rgb(0,,0,0)"), /Unsupported color value/);
  assert.throws(() => parseColor("rgb(0, 0, 0,)"), /Unsupported color value/);
  assert.throws(() => parseColor("rgb(1, 2, 3 / 0.5)"), /Unsupported color value/);
  assert.throws(() => parseColor("rgb(0 0 0 0.5)"), /Unsupported color value/);
  assert.throws(() => parseColor("rgb(0 0 0 /)"), /Unsupported color value/);
  assert.throws(() => parseColor("rgb(0 0 0 / 50% / 60%)"), /Unsupported color value/);
  assert.throws(() => parseColor("rgb(0 0 0 / 50% extra)"), /Unsupported color value/);
  assert.throws(() => parseColor("rgb(10px, 0, 0)"), /Unsupported color channel/);
  assert.throws(() => parseColor("rgba(0, 0, 0, half)"), /Unsupported alpha/);
});

test("measures translucent backgrounds against an explicit opaque backdrop", () => {
  assert.throws(
    () => contrastRatio("#000000", "#056dff29"),
    /needs an opaque backdrop/,
  );
  assert.throws(
    () => contrastRatio("#000000", "#056dff29", "#030303aa"),
    /Backdrop must be opaque/,
  );

  const onLight = contrastRatio("#000000", "#056dff29", "#fafafa");
  const onDark = contrastRatio("#000000", "#056dff29", "#030303");

  assert.ok(onDark < 3, `translucent halo on canvas stays low: ${onDark}`);
  assert.ok(onLight > onDark, `light backdrop reads higher: ${onLight} vs ${onDark}`);
  assert.ok(
    onLight > 4.5,
    `the same halo over the light canvas reads as light text: ${onLight}`,
  );
});

test("composites translucent colors over their backdrop", () => {
  assert.deepEqual(compositeOver(parseColor("rgba(0, 0, 0, 0.5)"), parseColor("#ffffff")), {
    red: 127.5,
    green: 127.5,
    blue: 127.5,
    alpha: 1,
  });

  const tintOverCanvas = compositeOver(parseColor("#056dff29"), parseColor("#030303"));
  assert.equal(tintOverCanvas.alpha, 1);
  assert.ok(tintOverCanvas.blue > tintOverCanvas.green);
});

test("measures unrounded WCAG ratios", () => {
  assert.ok(Math.abs(contrastRatio("#000000", "#ffffff") - 21) < 1e-9);
  assert.ok(Math.abs(contrastRatio("#ffffff", "#000000") - 21) < 1e-9);
  assert.ok(Math.abs(relativeLuminance(parseColor("#ffffff")) - 1) < 1e-12);
  assert.equal(relativeLuminance(parseColor("#000000")), 0);

  const correctedSubtle = contrastRatio("#696969", "#f2f3f5");
  assert.ok(correctedSubtle > 4.94 && correctedSubtle < 4.96, `got ${correctedSubtle}`);
  assert.ok(
    contrastRatio("#737373", "#f2f3f5") < 4.5,
    "the previous supporting-text value missed 4.5:1 on tint",
  );

  const halfBlackOnWhite = contrastRatio("rgba(0, 0, 0, 0.5)", "#ffffff");
  assert.ok(halfBlackOnWhite > 3.97 && halfBlackOnWhite < 3.99, `got ${halfBlackOnWhite}`);

  assert.equal(formatContrastRatio(21), "21.00:1");
  assert.equal(formatContrastRatio(4.7565), "4.76:1");
});

test("keeps every recommended Kappa pair at or above its minimum", () => {
  const tokensByName = Object.fromEntries(
    themeTokens.tokens.map((token) => [token.name, token]),
  );

  assert.ok(themeTokens.modes.length === 2, "both modes are measured");
  assert.ok(themeTokens.contrastPairs.length >= 20, "the theme recommends a full pair set");

  for (const pair of themeTokens.contrastPairs) {
    const foreground = tokensByName[pair.foreground];
    const background = tokensByName[pair.background];
    assert.ok(foreground, `${pair.id} foreground ${pair.foreground} is declared`);
    assert.ok(background, `${pair.id} background ${pair.background} is declared`);

    assert.ok(
      pair.kind === "text" ? pair.minimum >= 4.5 : pair.minimum >= 3,
      `${pair.id} declares a usable minimum`,
    );

    for (const mode of themeTokens.modes) {
      const ratio = contrastRatio(foreground.resolved[mode], background.resolved[mode]);
      assert.ok(
        ratio >= pair.minimum,
        `${pair.id} in ${mode} mode measures ${ratio.toFixed(3)}:1, below ${pair.minimum}:1`,
      );
    }
  }
});
