import { createRequire } from "node:module";
import { expect, type Locator, type Page, test } from "@playwright/test";

interface ThemeMetadata {
  tokens: Array<{
    name: string;
    light: string;
    dark: string;
    resolved: Record<string, string>;
  }>;
}

const require = createRequire(import.meta.url);
/** Read the published metadata through its public export, never a source path. */
const themeTokens = require("@dicehub/kappa/styles/tokens.json") as ThemeMetadata;

const tokenValue = (name: string, mode: "light" | "dark") => {
  const token = themeTokens.tokens.find((entry) => entry.name === name);
  if (!token) throw new Error(`Unknown theme token: ${name}`);
  return token.resolved[mode];
};

const toRgb = (hexColor: string) => {
  const channels = [1, 3, 5].map((offset) =>
    Number.parseInt(hexColor.slice(offset, offset + 2), 16),
  );
  return `rgb(${channels.join(", ")})`;
};

const HEX_COLOR = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const RGB_COLOR = /^rgba?\((.*)\)$/i;

/**
 * Read CSS color spelling differences, including minified `#rrggbbaa`, as
 * channels with a tolerance of one 8-bit step.
 */
const colorChannels = (value: string) => {
  const source = value.trim();
  const hex = HEX_COLOR.exec(source)?.[1];
  if (hex) {
    const expanded = hex.length <= 4 ? [...hex].map((digit) => `${digit}${digit}`).join("") : hex;
    const [red = "ff", green = "ff", blue = "ff", alpha = "ff"] = expanded.match(/../g) ?? [];
    return {
      red: Number.parseInt(red, 16),
      green: Number.parseInt(green, 16),
      blue: Number.parseInt(blue, 16),
      alpha: Number.parseInt(alpha, 16) / 255,
    };
  }

  const body = (RGB_COLOR.exec(source)?.[1] ?? "").replaceAll(",", " ").replaceAll("/", " ");
  const tokens = body.trim().split(/\s+/);
  const [red, green, blue] = tokens.slice(0, 3).map((token) => Number.parseFloat(token));
  const alphaToken = tokens[3];
  const alpha =
    alphaToken === undefined
      ? 1
      : alphaToken.endsWith("%")
        ? Number.parseFloat(alphaToken) / 100
        : Number.parseFloat(alphaToken);
  return { red, green, blue, alpha };
};

const expectColorClose = (actual: string, expected: string) => {
  const measured = colorChannels(actual);
  const reference = colorChannels(expected);
  expect(Math.abs(measured.red - reference.red)).toBeLessThanOrEqual(1);
  expect(Math.abs(measured.green - reference.green)).toBeLessThanOrEqual(1);
  expect(Math.abs(measured.blue - reference.blue)).toBeLessThanOrEqual(1);
  expect(Math.abs(measured.alpha - reference.alpha)).toBeLessThanOrEqual(1 / 255);
};

const reference = (page: Page) => page.locator("[data-colors-reference]");

const waitForHydration = async (container: Locator) => {
  await expect
    .poll(() =>
      container.evaluate((element) => {
        const island = element.closest("astro-island");
        return island ? !island.hasAttribute("ssr") : true;
      }),
    )
    .toBe(true);
};

const expectNoHorizontalOverflow = async (page: Page) => {
  await expect
    .poll(() =>
      page.evaluate(() => {
        const root = document.documentElement;
        return root.scrollWidth <= root.clientWidth;
      }),
    )
    .toBe(true);
};

const readToken = (scope: Locator, token: string) =>
  scope.evaluate(
    (element, name) => getComputedStyle(element).getPropertyValue(name).trim(),
    token,
  );

test.describe("Colors documentation", () => {
  test("renders the complete reference, navigation, and Markdown export", async ({
    page,
    request,
  }) => {
    await page.goto("/docs/colors");

    await expect(page.getByRole("heading", { level: 1, name: "Colors" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(page.locator("[data-colors-token-row]")).toHaveCount(themeTokens.tokens.length);
    await expect(
      page.locator('[data-colors-token-row][data-token-name="--kappa-selected-background"]'),
    ).toHaveCount(1);
    await expect(page.locator("[data-colors-preview-mode]")).toHaveCount(2);
    await expect(page.locator("#desktop-navigation a[aria-current='page']")).toHaveAttribute(
      "href",
      "/docs/colors",
    );
    await expect(
      page.getByRole("complementary", { name: "On this page" }).getByRole("link"),
    ).toHaveText(["Overview", "Install and Use", "Modes", "Token Reference", "Contrast", "Maintenance"]);

    const response = await request.get("/docs/colors.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Colors");
    expect(markdown).toContain("@dicehub/kappa/styles/theme-kappa.css");
    for (const token of themeTokens.tokens) {
      expect(markdown).toContain(token.name);
    }
    expect(markdown).toContain("var(--kappa-tint)");
    expect(markdown).not.toContain("On this page");
    expect(markdown).not.toContain("No tokens match");
  });

  test("filters tokens by name and purpose without changing the URL", async ({ page }) => {
    await page.goto("/docs/colors");
    await waitForHydration(reference(page));

    const search = page.getByRole("searchbox", { name: "Search color tokens" });
    const count = page.locator("[data-colors-count]");
    const visibleRows = page.locator("[data-colors-token-row]:visible");

    await expect(count).toHaveText(`${themeTokens.tokens.length} tokens`);

    await search.fill("accent");
    await expect(count).toHaveText(/\d+ of \d+ tokens/);
    const matched = Number.parseInt(((await count.textContent()) ?? "").trim(), 10);
    expect(Number.isFinite(matched)).toBe(true);
    await expect(visibleRows).toHaveCount(matched);
    await expect(
      page.locator('[data-colors-token-row][data-token-name="--kappa-accent"]'),
    ).toBeVisible();
    await expect(page.locator('[data-colors-token-row][data-token-name="--kappa-tint"]')).toBeHidden();
    await expect(page.locator('[data-colors-group="accent"]')).toBeVisible();
    await expect(page.locator('[data-colors-group="status"]')).toBeHidden();
    await expect(page).toHaveURL(/\/docs\/colors$/);

    await page.getByRole("button", { name: "Clear" }).click();
    await expect(count).toHaveText(`${themeTokens.tokens.length} tokens`);
    await expect(visibleRows).toHaveCount(themeTokens.tokens.length);

    await search.fill("nothing-matches-this");
    await expect(page.locator("[data-colors-reference-empty]")).toBeVisible();
    await expect(visibleRows).toHaveCount(0);
    await expect(count).toHaveText(`0 of ${themeTokens.tokens.length} tokens`);
  });

  test("copies the variable expression and each configured value", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/docs/colors");
    await waitForHydration(reference(page));

    const row = page.locator('[data-colors-token-row][data-token-name="--kappa-tint"]');
    const expressionButton = row.getByRole("button", { name: "Copy var(--kappa-tint)" });
    const status = reference(page).locator(".docs-visually-hidden");

    await expressionButton.focus();
    await page.keyboard.press("Enter");
    await expect(expressionButton).toHaveAttribute("data-copied", "");
    await expect(status).toContainText("Copied var(--kappa-tint)");
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("var(--kappa-tint)");

    const lightValue = tokenValue("--kappa-tint", "light");
    const darkValue = tokenValue("--kappa-tint", "dark");

    await row.getByRole("button", { name: `Copy light value ${lightValue}` }).click();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(lightValue);
    await expect(expressionButton).not.toHaveAttribute("data-copied");
    await expect(status).toContainText(`Copied ${lightValue}`);

    await row.getByRole("button", { name: `Copy dark value ${darkValue}` }).click();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(darkValue);
    await expect(status).toContainText(`Copied ${darkValue}`);
  });

  test("keeps values selectable when the clipboard is denied", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: { writeText: () => Promise.reject(new Error("NotAllowedError")) },
      });
    });
    await page.goto("/docs/colors");
    await waitForHydration(reference(page));

    const row = page.locator('[data-colors-token-row][data-token-name="--kappa-canvas"]');
    await row.getByRole("button", { name: "Copy var(--kappa-canvas)" }).click();

    const value = row.locator("code", { hasText: tokenValue("--kappa-canvas", "light") }).first();
    await expect(value).toBeVisible();
    expect(await value.evaluate((element) => getComputedStyle(element).userSelect)).not.toBe("none");

    await value.click({ clickCount: 3 });
    expect(await page.evaluate(() => window.getSelection()?.toString() ?? "")).toContain(
      tokenValue("--kappa-canvas", "light"),
    );
  });

  test("hydrates without console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));

    await page.goto("/docs/colors");
    await waitForHydration(reference(page));
    await expect(page.getByRole("searchbox", { name: "Search color tokens" })).toBeVisible();
    await expect(page.locator("[data-colors-count]")).toBeVisible();

    expect(errors).toEqual([]);
  });

  test("keeps canonical mode attributes ahead of the legacy attribute", async ({ page }) => {
    await page.goto("/docs/colors");
    const readRootToken = (token: string) =>
      page.evaluate(
        (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim(),
        token,
      );

    await page.evaluate(() => {
      document.documentElement.setAttribute("data-kappa-theme", "light");
      document.documentElement.setAttribute("data-mode", "dark");
    });
    expectColorClose(await readRootToken("--kappa-tint"), tokenValue("--kappa-tint", "light"));
    expectColorClose(await readRootToken("--docs-line"), "rgba(15, 23, 42, 0.1)");
    expectColorClose(await readRootToken("--docs-header-bg"), "rgba(250, 250, 250, 0.94)");

    await page.evaluate(() => {
      document.documentElement.setAttribute("data-kappa-theme", "dark");
      document.documentElement.setAttribute("data-mode", "light");
    });
    expectColorClose(await readRootToken("--kappa-tint"), tokenValue("--kappa-tint", "dark"));
    expectColorClose(await readRootToken("--docs-line"), "#333333");
    expectColorClose(await readRootToken("--docs-header-bg"), "#030303f0");
  });

  test("applies modes, nested scopes, overrides, and repaired selection states", async ({
    page,
  }) => {
    await page.goto("/examples/theme");

    const scope = (id: string) => page.locator(`[data-theme-scope="${id}"]`).first();

    expect(await readToken(scope("default"), "--kappa-tint")).toBe(
      tokenValue("--kappa-tint", "light"),
    );
    expect(await readToken(scope("explicit-light"), "--kappa-tint")).toBe(
      tokenValue("--kappa-tint", "light"),
    );
    expect(await readToken(scope("explicit-dark"), "--kappa-tint")).toBe(
      tokenValue("--kappa-tint", "dark"),
    );
    expect(await readToken(scope("legacy-dark"), "--kappa-tint")).toBe(
      tokenValue("--kappa-tint", "dark"),
    );
    expect(await readToken(scope("nested"), "--kappa-tint")).toBe(
      tokenValue("--kappa-tint", "dark"),
    );
    expect(await readToken(scope("nested-light"), "--kappa-tint")).toBe(
      tokenValue("--kappa-tint", "light"),
    );
    expect(await readToken(scope("override-dark"), "--kappa-selected-background")).toBe("#b42318");
    expect(
      await page.evaluate(() =>
        getComputedStyle(document.documentElement).getPropertyValue("--docs-base").trim(),
      ),
    ).toBe("");

    const lightPressed = scope("explicit-light").locator("[data-fixture-pressed]");
    await lightPressed.hover();
    await expect(lightPressed).toHaveCSS(
      "background-color",
      toRgb(tokenValue("--kappa-selected-background", "light")),
    );
    await expect(lightPressed).toHaveCSS(
      "color",
      toRgb(tokenValue("--kappa-selected-contrast", "light")),
    );

    const darkPressed = scope("explicit-dark").locator("[data-fixture-pressed]");
    await darkPressed.hover();
    await expect(darkPressed).toHaveCSS(
      "background-color",
      toRgb(tokenValue("--kappa-selected-background", "dark")),
    );
    await expect(darkPressed).toHaveCSS(
      "color",
      toRgb(tokenValue("--kappa-selected-contrast", "dark")),
    );
    await expect(scope("override-dark").locator("[data-fixture-pressed]")).toHaveCSS(
      "background-color",
      "rgb(180, 35, 24)",
    );

    const toggle = scope("explicit-dark").locator("[data-fixture-toggle]");
    await waitForHydration(toggle);
    await expect(toggle).toHaveAttribute("aria-pressed", "true");

    // Pressed and hovered keeps the selection pair instead of the hover fill.
    await toggle.hover();
    await expect(toggle).toHaveCSS(
      "background-color",
      toRgb(tokenValue("--kappa-selected-background", "dark")),
    );
    await expect(toggle).toHaveCSS("color", toRgb(tokenValue("--kappa-selected-contrast", "dark")));

    // Unpressing returns the control to the shared quiet hover treatment.
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await toggle.hover();
    expect(await toggle.evaluate((element) => getComputedStyle(element).backgroundColor)).not.toBe(
      toRgb(tokenValue("--kappa-selected-background", "dark")),
    );

    // Pressing it again restores the pair, which survives a pointer that leaves.
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await page.mouse.move(0, 0);
    await expect(toggle).toHaveCSS(
      "background-color",
      toRgb(tokenValue("--kappa-selected-background", "dark")),
    );
    await expect(toggle).toHaveCSS("color", toRgb(tokenValue("--kappa-selected-contrast", "dark")));

    /*
     * The static pressed fixture never toggles, so pressing and releasing it
     * measures the `:active` state without another click changing the state
     * under test.
     */
    const activePressed = scope("explicit-dark").locator("[data-fixture-pressed]");
    const activeBox = await activePressed.boundingBox();
    expect(activeBox).not.toBeNull();
    await page.mouse.move(activeBox!.x + activeBox!.width / 2, activeBox!.y + activeBox!.height / 2);
    await page.mouse.down();
    await expect(activePressed).toHaveCSS(
      "background-color",
      toRgb(tokenValue("--kappa-selected-background", "dark")),
    );
    await expect(activePressed).toHaveCSS(
      "color",
      toRgb(tokenValue("--kappa-selected-contrast", "dark")),
    );
    await page.mouse.up();
    await page.mouse.move(0, 0);
    await expect(activePressed).toHaveCSS(
      "background-color",
      toRgb(tokenValue("--kappa-selected-background", "dark")),
    );
    await expect(activePressed).toHaveCSS(
      "color",
      toRgb(tokenValue("--kappa-selected-contrast", "dark")),
    );
    await expect(activePressed).toHaveAttribute("aria-pressed", "true");

    await page.goto("/docs/colors");
    const root = page.locator("html");
    await expect(root).toHaveAttribute("data-kappa-theme", "light");

    const lightSwatch = page.locator(
      '[data-colors-token-row][data-token-name="--kappa-tint"] [data-kappa-theme="light"] [data-colors-swatch]',
    );
    const darkSwatch = page.locator(
      '[data-colors-token-row][data-token-name="--kappa-tint"] [data-kappa-theme="dark"] [data-colors-swatch]',
    );
    await expect(lightSwatch).toHaveCSS(
      "background-color",
      toRgb(tokenValue("--kappa-tint", "light")),
    );
    await expect(darkSwatch).toHaveCSS("background-color", toRgb(tokenValue("--kappa-tint", "dark")));

    await page.locator(".docs-header").getByRole("button", { name: "Toggle theme" }).click();
    await expect(root).toHaveAttribute("data-kappa-theme", "dark");
    await expect(lightSwatch).toHaveCSS(
      "background-color",
      toRgb(tokenValue("--kappa-tint", "light")),
    );
    await expect(darkSwatch).toHaveCSS("background-color", toRgb(tokenValue("--kappa-tint", "dark")));

    for (const mode of ["light", "dark"] as const) {
      const contrastSwatch = page.locator(
        `[data-colors-token-row][data-token-name="--kappa-accent-contrast"] [data-kappa-theme="${mode}"] [data-colors-swatch]`,
      );
      await expect(contrastSwatch).toHaveCSS(
        "color",
        toRgb(tokenValue("--kappa-accent-contrast", mode)),
      );
      await expect(contrastSwatch).toHaveCSS(
        "background-color",
        toRgb(tokenValue("--kappa-accent-solid", mode)),
      );

      const [foreground, background] = await contrastSwatch.evaluate((element) => {
        const styles = getComputedStyle(element);
        return [styles.color, styles.backgroundColor];
      });
      expect(foreground).not.toBe(background);
    }

    await page.goto("/docs/components/date-picker");
    await expect(root).toHaveAttribute("data-kappa-theme", "dark");
    const selectedCell = page.locator(
      '[data-date-picker-demo="inline"] [data-slot="date-picker-cell-trigger"][data-selected]',
    );
    await expect(selectedCell).toHaveCount(1);
    await expect(selectedCell).toHaveCSS(
      "background-color",
      toRgb(tokenValue("--kappa-selected-background", "dark")),
    );
    await expect(selectedCell).toHaveCSS(
      "color",
      toRgb(tokenValue("--kappa-selected-contrast", "dark")),
    );

    await page.goto("/docs/components/combobox");
    const comboboxPreview = page.locator('[data-combobox-demo="preview"]');
    await waitForHydration(comboboxPreview);
    await comboboxPreview.getByRole("combobox", { name: "Compute region" }).click();
    const checkedOption = page.locator(
      '.kappa-combobox__content[data-state="open"] [role="option"][data-state="checked"]',
    );
    await expect(checkedOption).toHaveCount(1);
    await expect(checkedOption).toHaveCSS("color", toRgb(tokenValue("--kappa-selected-text", "dark")));

    await page.goto("/docs/components/autocomplete");
    const autocompletePreview = page.locator('[data-autocomplete-demo="preview"]');
    await waitForHydration(autocompletePreview);
    const autocompleteInput = autocompletePreview.locator(
      '[data-scope="combobox"][data-part="input"]',
    );
    const autocompleteContent = page.locator(
      '[data-scope="combobox"][data-part="content"][data-state="open"]',
    );
    await autocompleteInput.fill("run");
    await expect(autocompleteContent).toBeVisible();
    await autocompleteInput.press("ArrowDown");
    await autocompleteInput.press("Enter");
    await autocompleteInput.fill("run");
    await expect(autocompleteContent).toBeVisible();
    const autocompleteChecked = autocompleteContent.locator('[data-part="item"][data-state="checked"]');
    await expect(autocompleteChecked).toHaveCount(1);
    await expect(autocompleteChecked).toHaveCSS(
      "color",
      toRgb(tokenValue("--kappa-selected-text", "dark")),
    );
  });

  test("stacks the reference on mobile without horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/docs/colors");

    await expectNoHorizontalOverflow(page);
    await expect(page.getByRole("searchbox", { name: "Search color tokens" })).toBeVisible();
    await expect(page.locator("[data-colors-preview]")).toBeVisible();

    const columns = await page
      .locator('[data-colors-token-row][data-token-name="--kappa-tint"]')
      .evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length);
    expect(columns).toBe(1);
    await expectNoHorizontalOverflow(page);
  });
});
