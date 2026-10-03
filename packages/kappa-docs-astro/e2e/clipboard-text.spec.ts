import { expect, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) =>
  page.locator(`[data-clipboard-text-demo="${variant}"]`);

test.describe("Clipboard Text documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/clipboard-text");
    await expect(page.locator("astro-island[ssr]:has([data-clipboard-text-demo])")).toHaveCount(0);
  });

  test("renders public examples, navigation, TOC, and Markdown", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Clipboard Text" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(demo(page, "preview").locator(".kappa-clipboard-text")).toHaveCount(1);

    const primitive = page.getByRole("link", { name: "View Ark UI documentation" });
    await expect(primitive).toHaveAttribute("href", "https://ark-ui.com/docs/components/clipboard");
    await expect(primitive).toHaveAttribute("target", "_blank");

    const snippets = page.locator("pre[data-language]");
    await expect(snippets.first()).toContainText('from "@dicehub/kappa/components/clipboard-text"');
    await expect(snippets.filter({ hasText: "../../../kappa/src" })).toHaveCount(0);
    await expect(page.locator('pre[data-language="typescript"]')).toHaveCount(0);
    await expect(page.locator('pre[data-language="javascript"]')).toHaveCount(2);

    const sidebar = page
      .locator("#desktop-navigation")
      .getByRole("link", { name: "Clipboard Text", exact: true });
    const compact = page.getByRole("navigation", { name: "Adjacent documentation pages" });
    const footer = page.getByRole("navigation", { name: "Documentation pagination" });
    await expect(sidebar).toHaveAttribute("aria-current", "page");
    await expect(compact.getByRole("link", { name: "Previous page: Client Only" })).toHaveAttribute(
      "href",
      "/docs/components/client-only",
    );
    await expect(
      compact.getByRole("link", { name: "Next page: Code Highlighted" }),
    ).toHaveAttribute("href", "/docs/components/code-highlighted");
    await expect(footer.getByRole("link", { name: "Client Only", exact: true })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Code Highlighted", exact: true })).toBeVisible();

    const toc = page.getByRole("complementary", { name: "On this page" });
    await expect(toc.getByRole("link")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Composition",
      "Examples",
      "Inline Value",
      "Feedback Timeout",
      "Controlled",
      "Accessibility",
      "API Reference",
      "ClipboardText.Root",
      "Parts",
      "Events",
      "Exports",
    ]);

    const response = await request.get("/docs/components/clipboard-text.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Clipboard Text");
    expect(markdown).toContain("## [Accessibility](#accessibility)");
    expect(markdown).toContain("ClipboardText.Root");
    expect(markdown).not.toContain("View Code");
    expect(markdown).not.toContain("On this page");
  });

  test("copies the value and swaps the trigger icon with feedback", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    const container = demo(page, "preview");
    const input = container.locator('[data-slot="clipboard-text-input"]');
    const trigger = container.locator('[data-slot="clipboard-text-trigger"]');

    await expect(input).toHaveAttribute("readonly", "");
    await expect(input).toHaveValue("ws_01J9X4A8C2E6G0K4M8P2R6T0V4");
    await expect(trigger).not.toHaveAttribute("data-copied");

    await trigger.click();
    await expect(trigger).toHaveAttribute("data-copied", "");
    await expect(trigger.locator(".kappa-clipboard-text__icon--copied")).toBeVisible();

    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboard).toBe("ws_01J9X4A8C2E6G0K4M8P2R6T0V4");
  });

  test("reverts feedback after the configured timeout", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    const now = new Date();
    await page.clock.install({ time: now });
    await page.clock.pauseAt(new Date(now.getTime() + 60_000));
    const container = demo(page, "timeout");
    const trigger = container.locator('[data-slot="clipboard-text-trigger"]');

    await trigger.click();
    await expect(trigger).toHaveAttribute("data-copied", "");
    await page.clock.runFor(799);
    await expect(trigger).toHaveAttribute("data-copied", "");
    await page.clock.runFor(1);
    await expect(trigger).not.toHaveAttribute("data-copied");
  });

  test("reports copies through statusChange on the controlled value", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    const container = demo(page, "controlled");
    const readout = container.locator(".clipboard-text-demo__readout");

    await expect(readout).toContainText("Last copied: none");
    await container.locator('[data-slot="clipboard-text-trigger"]').click();
    await expect(readout).toContainText("run_01J9X7KQ2M4V8N6P3R5T7W9Y0B");
  });

  test("keeps focus visible on the trigger and themes intact", async ({ page }) => {
    const container = demo(page, "preview");
    const trigger = container.locator('[data-slot="clipboard-text-trigger"]');

    await trigger.focus();
    await expect(trigger).toBeFocused();
    const focus = await trigger.evaluate((element) => {
      const styles = getComputedStyle(element);
      return { style: styles.outlineStyle, width: Number.parseFloat(styles.outlineWidth) };
    });
    expect(focus.style).not.toBe("none");
    expect(focus.width).toBeGreaterThanOrEqual(2);

    const input = container.locator('[data-slot="clipboard-text-input"]');
    const lightColor = await input.evaluate((element) => getComputedStyle(element).color);
    await page.getByRole("button", { name: "Toggle theme" }).filter({ visible: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
    await expect
      .poll(() => input.evaluate((element) => getComputedStyle(element).color))
      .not.toBe(lightColor);

    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect
      .poll(() => trigger.evaluate((element) => getComputedStyle(element).transitionDuration))
      .toMatch(/^(?:0s|0\.00001s|1e-05s)$/);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole("complementary", { name: "On this page" })).toBeHidden();
  });
});
