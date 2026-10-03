import { expect, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) =>
  page.locator(`[data-collapsible-demo="${variant}"]`);

test.describe("Collapsible documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/collapsible");
  });

  test("renders public examples, navigation, TOC, and Markdown", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Collapsible" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(demo(page, "preview").locator(".kappa-collapsible")).toHaveCount(1);

    const snippets = page.locator("pre[data-language]");
    await expect(snippets.first()).toContainText(
      'from "@dicehub/kappa/components/collapsible"',
    );
    await expect(snippets.filter({ hasText: "../../../kappa/src" })).toHaveCount(0);
    await expect(page.locator('pre[data-language="javascript"]')).toHaveCount(2);

    const sidebar = page
      .locator("#desktop-navigation")
      .getByRole("link", { name: "Collapsible", exact: true });
    const compact = page.getByRole("navigation", { name: "Adjacent documentation pages" });
    const footer = page.getByRole("navigation", { name: "Documentation pagination" });
    await expect(sidebar).toHaveAttribute("aria-current", "page");
    await expect(
      compact.getByRole("link", { name: "Previous page: Code Highlighted" }),
    ).toHaveAttribute("href", "/docs/components/code-highlighted");
    await expect(
      compact.getByRole("link", { name: "Next page: Collapsible Section" }),
    ).toHaveAttribute("href", "/docs/components/collapsible-section");
    await expect(footer.getByRole("link", { name: "Code Highlighted", exact: true })).toBeVisible();
    await expect(
      footer.getByRole("link", { name: "Collapsible Section", exact: true }),
    ).toBeVisible();

    const toc = page.getByRole("complementary", { name: "On this page" });
    await expect(toc.getByRole("link")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Composition",
      "Examples",
      "Basic",
      "Multiple Items",
      "Custom Trigger Example",
      "Controlled",
      "Partial Collapse",
      "Lazy Mount",
      "Disabled",
      "Right-to-left",
      "Accessibility",
      "API Reference",
      "Collapsible.Root",
      "Parts",
      "Events",
      "Exports",
    ]);

    const response = await request.get("/docs/components/collapsible.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Collapsible");
    expect(markdown).toContain("## [Accessibility](#accessibility)");
    expect(markdown).toContain("### [Multiple Items](#multiple-items)");
    expect(markdown).toContain("Collapsible.Root");
    expect(markdown).not.toContain("View Code");
    expect(markdown).not.toContain("On this page");
  });

  test("manages disclosure semantics with pointer and keyboard input", async ({ page }) => {
    const preview = demo(page, "preview");
    const root = preview.locator(".kappa-collapsible");
    const trigger = preview.getByRole("button", { name: /Solver diagnostics/ });
    const content = preview.locator(".kappa-collapsible__content");
    const indicator = preview.locator(".kappa-collapsible__indicator");

    await expect(root).toHaveAttribute("data-state", "open");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    const contentId = await content.getAttribute("id");
    expect(contentId).toBeTruthy();
    await expect(trigger).toHaveAttribute("aria-controls", contentId!);
    await expect(content).toBeVisible();
    await expect(indicator).toHaveAttribute("data-state", "open");
    const openTriggerTop = (await trigger.boundingBox())!.y;

    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(content).toBeHidden();
    await expect(indicator).toHaveAttribute("data-state", "closed");
    expect((await trigger.boundingBox())!.y).toBeCloseTo(openTriggerTop, 0);

    await trigger.focus();
    await page.keyboard.press("Space");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(content).toBeVisible();
    expect((await trigger.boundingBox())!.y).toBeCloseTo(openTriggerTop, 0);
    await page.keyboard.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("supports multiple items, controlled state, and asChild trigger composition", async ({
    page,
  }) => {
    const multiple = demo(page, "multiple");
    const multiplePanels = multiple.locator(".kappa-collapsible__content");
    await expect(multiplePanels).toHaveCount(3);
    await multiple.getByRole("button", { name: "What is Kappa?" }).click();
    await multiple.getByRole("button", { name: "How do I use it?" }).click();
    await expect(multiplePanels.nth(0)).toBeVisible();
    await expect(multiplePanels.nth(1)).toBeVisible();
    await expect(multiplePanels.nth(2)).toBeHidden();

    const controlled = demo(page, "controlled");
    const controlledTrigger = controlled.getByRole("button", { name: "Boundary summary" });
    await expect(controlled.getByRole("status")).toHaveText("Panel state: closed");
    await controlledTrigger.click();
    await expect(controlled.getByRole("status")).toHaveText("Panel state: open");
    await expect(controlled.locator(".kappa-collapsible__content")).toBeVisible();

    const custom = demo(page, "custom-trigger");
    const customTrigger = custom.getByRole("button", { name: "Show details" });
    await expect(customTrigger).toHaveClass(/kappa-button/);
    await expect(customTrigger).toHaveClass(/kappa-collapsible__trigger/);
    await expect(custom.locator(".kappa-collapsible__indicator")).toHaveCount(0);
    await customTrigger.click();
    await expect(custom.getByRole("button", { name: "Hide details" })).toBeVisible();
    await expect(custom.locator(".kappa-collapsible__content")).toContainText(
      "Kappa Button keeps its styling",
    );
  });

  test("supports partial collapse, lazy mount, and disabled state", async ({ page }) => {
    const partial = demo(page, "partial");
    const partialContent = partial.locator(".kappa-collapsible__content");
    await expect(partial.getByRole("button", { name: "Solver log" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    await expect(partialContent).toBeVisible();
    await expect(partialContent).toHaveAttribute("data-has-collapsed-size", "");
    await expect(partialContent).toHaveCSS("max-height", "44px");
    await partial.getByRole("button", { name: "Solver log" }).click();
    await expect(partial.getByText("GAMG: Solving for p", { exact: false })).toBeVisible();

    const lazy = demo(page, "lazy");
    const lazyTrigger = lazy.getByRole("button", { name: "Residual plot" });
    await expect(lazy.locator("[data-lazy-panel]")).toHaveCount(0);
    await lazyTrigger.click();
    await expect(lazy.locator("[data-lazy-panel]")).toBeVisible();
    await lazyTrigger.click();
    await expect(lazy.locator("[data-lazy-panel]")).toHaveCount(0);

    const disabled = demo(page, "disabled");
    const disabledTrigger = disabled.getByRole("button", { name: "Transient controls" });
    await expect(disabledTrigger).toHaveAttribute("data-disabled", "");
    await disabledTrigger.click({ force: true });
    await expect(disabledTrigger).toHaveAttribute("aria-expanded", "false");
    await expect(disabled.locator(".kappa-collapsible__content")).toBeHidden();
  });

  test("keeps themes, focus, RTL, motion, and mobile layout intact", async ({ page }) => {
    const preview = demo(page, "preview");
    const root = preview.locator(".kappa-collapsible");
    const trigger = preview.getByRole("button", { name: /Solver diagnostics/ });
    const lightBackground = await root.evaluate((element) => getComputedStyle(element).backgroundColor);

    await page.getByRole("button", { name: "Toggle theme" }).filter({ visible: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
    await expect
      .poll(() => root.evaluate((element) => getComputedStyle(element).backgroundColor))
      .not.toBe(lightBackground);

    await trigger.focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Shift+Tab");
    await expect(trigger).toBeFocused();
    await expect(trigger).toHaveCSS("outline-style", "solid");
    await expect(trigger).toHaveCSS("outline-width", "2px");

    const rtl = demo(page, "rtl");
    const rtlTrigger = rtl.getByRole("button", { name: "نتائج المحاكاة" });
    const rtlIndicator = rtl.locator(".kappa-collapsible__indicator");
    await rtlTrigger.click();
    await expect(rtlIndicator).toHaveAttribute("data-state", "closed");
    await expect(rtlIndicator).toHaveCSS("transform", "matrix(-1, 0, 0, -1, 0, 0)");

    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect
      .poll(() => rtlIndicator.evaluate((element) => getComputedStyle(element).transitionDuration))
      .toMatch(/^(?:0s|0\.00001s|1e-05s)$/);
    await expect(preview.locator(".kappa-collapsible__content")).toHaveCSS(
      "animation-name",
      "none",
    );

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole("complementary", { name: "On this page" })).toBeHidden();
    await expect(demo(page, "preview").locator(".collapsible-demo__metrics")).toHaveCSS(
      "grid-template-columns",
      /.+/,
    );
  });
});
