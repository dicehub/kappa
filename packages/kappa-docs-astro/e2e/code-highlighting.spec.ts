import { expect, test, type Locator, type Page } from "@playwright/test";

const readThemeColors = (token: Locator) =>
  token.evaluate((element) => {
    const styles = getComputedStyle(element);
    const resolveColor = (value: string) => {
      const probe = document.createElement("span");
      probe.style.color = value.trim();
      document.body.append(probe);
      const resolved = getComputedStyle(probe).color;
      probe.remove();
      return resolved;
    };

    return {
      actual: styles.color,
      dark: resolveColor(styles.getPropertyValue("--shiki-dark")),
      light: resolveColor(styles.getPropertyValue("--shiki-light")),
    };
  });

const readClipboard = (page: Page) => page.evaluate(() => navigator.clipboard.readText());

test.describe("Documentation code highlighting", () => {
  test("renders Shiki tokens and follows the docs theme", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/docs/components/dicehub-logo");

    const root = page.locator("html");
    const block = page.locator("#preview .docs-code-block");
    const fullCode = block.locator("[data-code-full]");
    const highlighted = fullCode.locator("pre.astro-code");
    const token = highlighted.locator("code .line > span").first();

    await expect(block).toHaveAttribute("data-code-expanded", "false");
    await expect(highlighted).toHaveAttribute("data-language", "vue");
    expect(await highlighted.locator("code .line").count()).toBeGreaterThan(3);
    await expect(block.locator("pre.astro-code")).toHaveCount(1);
    await expect(fullCode).toBeVisible();
    await expect(fullCode).toHaveAttribute("inert", "");
    await expect(fullCode).toHaveAttribute("aria-hidden", "true");
    await expect(token).toHaveAttribute("style", /--shiki-light:/);
    await expect(token).toHaveAttribute("style", /--shiki-dark:/);

    const lightColors = await readThemeColors(token);
    expect(lightColors.light).not.toBe(lightColors.dark);
    expect(lightColors.actual).toBe(lightColors.light);

    await page.locator(".docs-header").getByRole("button", { name: "Toggle theme" }).click();
    await expect(root).toHaveAttribute("data-mode", "dark");

    const darkColors = await readThemeColors(token);
    expect(darkColors.actual).toBe(darkColors.dark);
  });

  test("tokenizes nested markup in standalone Vue fragments", async ({ page }) => {
    await page.goto("/docs/components/filter-bar#filters-and-actions");

    const block = page.locator("#filters-and-actions + p + .docs-component-example");
    await block.getByRole("button", { name: "View Code" }).click();

    const code = block.locator("[data-code-full] code");
    const slotLine = code.locator(".line").filter({ hasText: "#filters" }).first();
    const source = (await code.textContent()) ?? "";
    const tokenColors = await slotLine.locator(":scope > span").evaluateAll((tokens) =>
      [...new Set(tokens.map((token) => getComputedStyle(token).color))],
    );

    expect(source.startsWith('<FilterBar v-model="query"')).toBe(true);
    expect(source.startsWith("<template>")).toBe(false);
    expect(await slotLine.locator(":scope > span").count()).toBeGreaterThan(3);
    expect(tokenColors.length).toBeGreaterThan(2);
  });

  test("copies the original source and exposes keyboard feedback", async ({ context, page }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/docs/components/dicehub-logo");

    const block = page.locator("#preview .docs-code-block");
    const fullCode = block.locator("[data-code-full]");
    const pre = fullCode.locator("pre");
    const source = (await pre.textContent()) ?? "";
    const reveal = block.getByRole("button", { name: "View Code" });
    const copy = block.locator("[data-code-copy]");

    await expect(reveal).toHaveAttribute("aria-expanded", "false");
    await expect(reveal).toHaveAttribute("aria-controls", "dicehub-logo-preview-code");
    await expect(copy).toBeHidden();
    await reveal.focus();
    await expect(reveal).toBeFocused();
    await expect(reveal).toHaveCSS("outline-style", "solid");
    await page.keyboard.press("Enter");

    await expect(block).toHaveAttribute("data-code-expanded", "true");
    await expect(reveal).toBeHidden();
    await expect(fullCode).toBeVisible();
    await expect(fullCode).not.toHaveAttribute("inert", "");
    await expect(fullCode).not.toHaveAttribute("aria-hidden", "true");
    await expect(pre).toBeFocused();
    await expect(pre).toHaveAccessibleName("Example source code");
    await expect(pre).toHaveCSS("outline-style", "solid");
    await expect(copy).toHaveAccessibleName("Copy code");
    await copy.focus();
    await expect(copy).toBeFocused();
    await expect(copy).toHaveCSS("outline-style", "solid");
    await page.keyboard.press("Enter");

    await expect(copy).toHaveAccessibleName("Code copied");
    await expect.poll(() => readClipboard(page)).toBe(source);
    await expect(copy.locator(".docs-code-copy__icon--copy")).toBeHidden();
    await expect(copy.locator(".docs-code-copy__icon--done")).toBeVisible();
  });

  test("contains highlighted code and its copy control on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/docs/components/dicehub-logo");

    const block = page.locator("#preview .docs-code-block");
    const fullCode = block.locator("[data-code-full]");
    const highlighted = fullCode.locator("pre.astro-code");
    const reveal = block.getByRole("button", { name: "View Code" });
    const copy = block.locator("[data-code-copy]");

    await expect(block).toBeVisible();
    await expect(highlighted).toBeVisible();
    await expect(highlighted).toHaveCSS("overflow-x", "hidden");
    await expect(highlighted).toHaveCSS("scrollbar-width", "none");
    await expect(fullCode).toHaveAttribute("inert", "");
    await expect(fullCode).toHaveAttribute("aria-hidden", "true");
    await expect(reveal).toBeVisible();
    await expect(copy).toHaveAttribute("aria-label", "Copy code");
    await expect(copy).toBeHidden();
    await expect
      .poll(async () => {
        const [blockBox, revealBox] = await Promise.all([
          block.boundingBox(),
          reveal.boundingBox(),
        ]);
        if (!blockBox || !revealBox) return false;
        return (
          blockBox.x >= 0 &&
          blockBox.x + blockBox.width <= 390 &&
          revealBox.x >= blockBox.x &&
          revealBox.x + revealBox.width <= blockBox.x + blockBox.width
        );
      })
      .toBe(true);

    await reveal.click();
    await expect(fullCode).toBeVisible();
    await expect(highlighted).toBeVisible();
    await expect(copy).toBeVisible();
    await expect(highlighted).toHaveCSS("max-height", "288px");
    await expect
      .poll(async () => {
        const [blockBox, copyBox] = await Promise.all([block.boundingBox(), copy.boundingBox()]);
        if (!blockBox || !copyBox) return false;
        return (
          blockBox.x >= 0 &&
          blockBox.x + blockBox.width <= 390 &&
          copyBox.x >= blockBox.x &&
          copyBox.x + copyBox.width <= blockBox.x + blockBox.width
        );
      })
      .toBe(true);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
  });

  test("reveals code only for examples and resets after soft navigation", async ({ page }) => {
    await page.goto("/docs/components/dicehub-logo");

    const examples = page.locator(".docs-component-example [data-code-expanded]");
    const installation = page.locator("#installation");
    const svgGeneration = page.locator("#svg-generation");

    await expect(examples).toHaveCount(10);
    await expect(page.getByRole("button", { name: "View Code" })).toHaveCount(10);
    await expect(installation.getByRole("button", { name: "View Code" })).toHaveCount(0);
    await expect(svgGeneration.getByRole("button", { name: "View Code" })).toHaveCount(0);
    await expect(installation.locator("[data-code-full]")).toHaveCount(2);
    await expect(installation.locator("[data-code-full]").first()).toBeVisible();

    await page.getByRole("button", { name: "View Code" }).first().click();
    await expect(examples.first()).toHaveAttribute("data-code-expanded", "true");
    await page.evaluate(() => ((window as Window & { docsMarker?: string }).docsMarker = "kept"));

    await page
      .locator("#desktop-navigation")
      .getByRole("link", { name: "Installation", exact: true })
      .click();
    await expect(page).toHaveURL(/\/docs\/installation$/);
    await page
      .locator("#desktop-navigation")
      .getByRole("link", { name: "dicehub logo", exact: true })
      .click();
    await expect(page).toHaveURL(/\/docs\/components\/dicehub-logo$/);
    await expect.poll(() => page.evaluate(() => (window as Window & { docsMarker?: string }).docsMarker)).toBe("kept");
    await expect(page.locator("#preview [data-code-expanded]")).toHaveAttribute(
      "data-code-expanded",
      "false",
    );
  });

  test("keeps full source available when JavaScript is disabled", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();

    try {
      await page.goto("/docs/components/dicehub-logo");

      const block = page.locator("#preview .docs-code-block");
      await expect(page.locator("html")).not.toHaveAttribute("data-docs-js", "true");
      await expect(block.locator("[data-code-preview]")).toHaveCount(0);
      await expect(block.locator("[data-code-full]")).toBeVisible();
      await expect(block.locator("[data-code-full]")).not.toHaveAttribute("inert", "");
      await expect(block.locator("[data-code-full]")).not.toHaveAttribute("aria-hidden", "true");
      await expect(block.getByRole("button", { name: "View Code" })).toBeHidden();
      await expect(block.locator("[data-code-copy]")).toBeHidden();
    } finally {
      await context.close();
    }
  });
});
