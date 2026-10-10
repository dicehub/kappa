import { expect, type Page, test } from "@playwright/test";
import { waitForDocsIsland } from "./helpers/docs-island";

const demo = (page: Page, variant: string) =>
  page.locator(`[data-code-highlighted-demo="${variant}"]`);

const expectLanguageLabelsFit = async (page: Page) => {
  const menu = page.getByRole("listbox", { name: "Code language" });
  await expect(menu).toBeVisible();
  await expect.poll(() => menu
    .locator('[data-slot="select-item-text"]')
    .evaluateAll((elements) => elements.length > 0 && elements.every((element) => element.scrollWidth <= element.clientWidth)),
  ).toBe(true);
};

test.describe("Code Highlighted documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/code-highlighted");
  });

  test("renders public examples, navigation, TOC, and Markdown", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Code Highlighted" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(demo(page, "preview").locator(".kappa-code-highlighted")).toHaveCount(1);
    await expect(demo(page, "preview").locator(".kappa-code-highlighted__title")).toHaveText("courant-limit.ts");

    const snippets = page.locator("pre[data-language]");
    await expect(snippets.first()).toContainText('from "@dicehub/kappa/components/code-highlighted"');
    await expect(snippets.filter({ hasText: "../../../kappa/src" })).toHaveCount(0);
    await expect(page.locator('pre[data-language="typescript"]')).toHaveCount(0);
    await expect(page.locator('pre[data-language="javascript"]')).toHaveCount(1);

    const sidebar = page
      .locator("#desktop-navigation")
      .getByRole("link", { name: "Code Highlighted", exact: true });
    const compact = page.getByRole("navigation", { name: "Adjacent documentation pages" });
    const footer = page.getByRole("navigation", { name: "Documentation pagination" });
    await expect(sidebar).toHaveAttribute("aria-current", "page");
    await expect(
      compact.getByRole("link", { name: "Previous page: Clipboard Text" }),
    ).toHaveAttribute("href", "/docs/components/clipboard-text");
    await expect(compact.getByRole("link", { name: "Next page: Collapsible" })).toHaveAttribute(
      "href",
      "/docs/components/collapsible",
    );
    await expect(footer.getByRole("link", { name: "Clipboard Text", exact: true })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Collapsible", exact: true })).toBeVisible();

    const toc = page.getByRole("complementary", { name: "On this page" });
    await expect(toc.getByRole("link")).toHaveText([
      "Language Switch",
      "Installation",
      "Dedicated Entry Point",
      "Usage",
      "Composition",
      "Examples",
      "Title",
      "Languages",
      "Highlight Lines",
      "Custom Highlight Color",
      "Line Numbers",
      "Copy Button",
      "Copy Button Labels",
      "Accessibility",
      "API Reference",
      "ShikiProvider",
      "CodeHighlighted",
      "Exports",
    ]);

    const response = await request.get("/docs/components/code-highlighted.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Code Highlighted");
    expect(markdown).toContain("## [Accessibility](#accessibility)");
    expect(markdown).toContain("ShikiProvider");
    expect(markdown).not.toContain("View Code");
    expect(markdown).not.toContain("On this page");
  });

  test("switches the preview language with the keyboard and copies its source", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await waitForDocsIsland(demo(page, "preview"));
    const block = demo(page, "preview").locator(".kappa-code-highlighted");
    const language = block.getByRole("combobox", { name: "Code language" });
    await expect(language).toContainText("TypeScript");

    await language.focus();
    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("listbox", { name: "Code language" })).toBeVisible();
    await expectLanguageLabelsFit(page);
    await page.keyboard.press("End");
    await page.keyboard.press("Enter");
    await expect(language).toContainText("Python");
    await expect(language).toBeFocused();
    await expect(block.locator("figcaption")).toContainText("courant_limit.py");
    await expect(block.locator(".shiki")).toContainText("solver.set_max_courant(courant)");
    await expect(block.locator(".shiki")).not.toContainText("Math.min");

    await block.getByRole("button", { name: "Copy", exact: true }).click();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      await block.locator(".shiki code").innerText(),
    );

    await language.click();
    await expect(page.getByRole("option", { name: "Python", exact: true })).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("Escape");
    await expect(language).toBeFocused();
    await expect(page.getByRole("listbox", { name: "Code language" })).toBeHidden();
    await expect(language).toContainText("Python");
  });

  test("updates numbered code and the clipboard for each language on mobile", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.setViewportSize({ width: 390, height: 844 });
    await waitForDocsIsland(demo(page, "language-switch"));
    const block = demo(page, "language-switch").locator(".kappa-code-highlighted");
    const language = block.getByRole("combobox", { name: "Code language" });
    const numbers = block.locator(".kappa-code-highlighted__line-numbers");

    for (const [name, source, lineCount] of [
      ["JavaScript", "console.log(run.status)", 8],
      ["Python", 'print(run["status"])', 9],
      ["Bash", "jq -r '.status'", 3],
    ] as const) {
      await language.click();
      await expectLanguageLabelsFit(page);
      await page.getByRole("option", { name, exact: true }).click();
      await expect(language).toContainText(name);
      await expect(block.locator(".shiki")).toContainText(source);
      await expect(numbers.locator("span")).toHaveText(
        Array.from({ length: lineCount }, (_, index) => String(index + 1)),
      );
      await expect(numbers).toHaveAttribute("aria-hidden", "true");
      await block.getByRole("button", { name: "Copy", exact: true }).click();
      expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
        await block.locator(".shiki code").innerText(),
      );
    }

    const headerFits = await block.evaluate((element) => {
      const trigger = element.querySelector('[data-slot="select-trigger"]')!.getBoundingClientRect();
      const copyElement = element.querySelector('[data-slot="code-highlighted-copy"]')!;
      const copy = copyElement.getBoundingClientRect();
      const header = element.querySelector("figcaption")!.getBoundingClientRect();
      return !!copyElement.closest("figcaption") && trigger.right <= copy.left
        && copy.right <= header.right && Math.abs(trigger.y - copy.y) <= 1;
    });
    expect(headerFits).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });

  test("highlights TypeScript with token spans after lazy load", async ({ page }) => {
    const block = demo(page, "usage").locator(".kappa-code-highlighted");
    await expect(block.locator(".kappa-code-highlighted__plain")).toBeVisible();
    await expect(block.locator(".shiki")).toBeVisible();
    await expect(block.locator(".shiki .line")).toHaveCount(5);
    const coloredSpan = block.locator(".shiki .line span[style]").first();
    await expect(coloredSpan).toBeVisible();
    await expect(block.locator(".kappa-code-highlighted__plain")).toHaveCount(0);
  });

  test("shows line numbers and emphasizes highlighted lines", async ({ page }) => {
    const numbered = demo(page, "line-numbers").locator(".kappa-code-highlighted");
    await expect(numbered.locator(".kappa-code-highlighted__line-numbers")).toBeVisible();
    await expect(numbered.locator(".kappa-code-highlighted__line-numbers span")).toHaveCount(11);

    const highlighted = demo(page, "highlight-lines").locator(".kappa-code-highlighted");
    await expect(highlighted.locator(".shiki")).toBeVisible();
    await expect(highlighted.locator(".line-highlighted")).toHaveCount(1);
    await expect(highlighted.locator(".line-highlighted")).toContainText("balance");
  });

  test("copies code through the copy button and localizes labels", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await waitForDocsIsland(demo(page, "preview"));
    const block = demo(page, "preview").locator(".kappa-code-highlighted");
    const copyButton = block.getByRole("button", { name: "Copy" });

    await block.hover();
    await expect(copyButton).toBeVisible();
    await copyButton.click();
    await expect(block.getByRole("button", { name: "Copied!" })).toBeVisible();
    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboard).toContain("Math.min(rawCourant.value, 5)");

    const german = demo(page, "labels").locator(".kappa-code-highlighted");
    await german.hover();
    await expect(german.getByRole("button", { name: "Kopieren" })).toBeVisible();
  });

  test("renders labeled blocks for every provider language", async ({ page }) => {
    const grid = demo(page, "languages");
    await expect(grid.locator(".kappa-code-highlighted")).toHaveCount(5);
    await expect(grid.locator(".code-highlighted-demo__caption")).toHaveText([
      "TypeScript",
      "Vue",
      "Bash",
      "JSON",
      "CSS",
    ]);
    await expect(grid.locator(".shiki")).toHaveCount(5);
    await expect(grid.locator(".kappa-code-highlighted").nth(1).locator(".shiki")).toContainText(
      "script setup",
    );
  });

  test("recolors highlighted lines through the CSS token", async ({ page }) => {
    const block = demo(page, "highlight-color").locator(".kappa-code-highlighted");
    await expect(block.locator(".line-highlighted")).toHaveCount(1);
    const customBg = await block
      .locator(".line-highlighted")
      .evaluate((element) => getComputedStyle(element).backgroundColor);
    const referenceBg = await demo(page, "highlight-lines")
      .locator(".line-highlighted")
      .evaluate((element) => getComputedStyle(element).backgroundColor);
    expect(customBg).not.toBe(referenceBg);
  });

  test("keeps the copy button inline and visible on single-line blocks", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await waitForDocsIsland(demo(page, "copy-button"));
    const block = demo(page, "copy-button").locator(".kappa-code-highlighted");
    const copyButton = block.getByRole("button", { name: "Copy" });

    await expect(copyButton).toBeVisible();
    const layout = await block.evaluate((element) => getComputedStyle(element).display);
    expect(layout).toBe("flex");

    await copyButton.click();
    await expect(block.getByRole("button", { name: "Copied!" })).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("pnpm add @dicehub/kappa");
  });

  test("keeps the multiline copy button visible on touch devices", async ({ browser }) => {
    const touchContext = await browser.newContext({
      hasTouch: true,
      isMobile: true,
      viewport: { width: 390, height: 844 },
    });
    const touchPage = await touchContext.newPage();
    await touchPage.goto("/docs/components/code-highlighted");

    const copyRoot = demo(touchPage, "labels").locator(".kappa-code-highlighted__copy-root");
    await expect(copyRoot).toBeVisible();
    await expect
      .poll(() => copyRoot.evaluate((element) => getComputedStyle(element).opacity))
      .toBe("1");

    await touchContext.close();
  });

  test("keeps the dark theme, copy focus, and reduced motion intact", async ({ page }) => {
    const block = demo(page, "usage").locator(".kappa-code-highlighted");
    await expect(block.locator(".shiki")).toBeVisible();
    const lightColor = await block
      .locator(".shiki")
      .evaluate((element) => getComputedStyle(element).color);

    await page.getByRole("button", { name: "Toggle theme" }).filter({ visible: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
    await expect
      .poll(() => block.locator(".shiki").evaluate((element) => getComputedStyle(element).color))
      .not.toBe(lightColor);

    const copyButton = demo(page, "preview").locator(".kappa-code-highlighted__copy");
    await copyButton.focus();
    await expect(copyButton).toBeFocused();
    await expect(copyButton).toBeVisible();

    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect
      .poll(() => copyButton.evaluate((element) => getComputedStyle(element).transitionDuration))
      .toMatch(/^(?:0s|0\.00001s|1e-05s)$/);
    await expect(demo(page, "preview").getByRole("combobox", { name: "Code language" }))
      .toHaveCSS("transition-duration", /^(?:0s|0\.00001s|1e-05s)$/);

    await page.emulateMedia({ forcedColors: "active", colorScheme: "dark" });
    const language = demo(page, "preview").getByRole("combobox", { name: "Code language" });
    const palette = await page.evaluate(() => {
      const probe = document.createElement("button");
      probe.style.color = "ButtonText";
      probe.style.outlineColor = "Highlight";
      document.body.append(probe);
      const style = getComputedStyle(probe);
      const colors = { text: style.color, focus: style.outlineColor };
      probe.remove();
      return colors;
    });
    await language.focus();
    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("listbox", { name: "Code language" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(language).toHaveCSS("color", palette.text);
    await expect(language).toHaveCSS("outline-color", palette.focus);
    await expect(language.locator('[data-slot="select-indicator"]')).toHaveCSS("color", palette.text);
    await language.click();
    await expect(language).toHaveCSS("color", palette.text);
    await page.keyboard.press("Escape");
    await page.emulateMedia({ forcedColors: "none", colorScheme: "light" });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole("complementary", { name: "On this page" })).toBeHidden();
  });
});
