import { expect, test } from "@playwright/test";

const componentLinks = [
  ["accordion", "accordion"],
  ["autocomplete", "combobox"],
  ["avatar", "avatar"],
  ["checkbox", "checkbox"],
  ["clipboard-text", "clipboard"],
  ["collapsible", "collapsible"],
  ["combobox", "combobox"],
  ["date-picker", "date-picker"],
  ["dialog", "dialog"],
  ["drawer", "drawer"],
  ["dropdown", "menu"],
  ["editable", "editable"],
  ["field", "field"],
  ["highlight", "highlight"],
  ["hover-card", "hover-card"],
  ["input", "field"],
  ["input-area", "field"],
  ["input-otp", "pin-input"],
  ["native-select", "field"],
  ["number-input", "number-input"],
  ["popover", "popover"],
  ["progress", "progress-linear"],
  ["progress-circle", "progress-circular"],
  ["qr-code", "qr-code"],
  ["radio", "radio-group"],
  ["resizable", "splitter"],
  ["scroll-area", "scroll-area"],
  ["select", "select"],
  ["slider", "slider"],
  ["tabs", "tabs"],
  ["table-of-contents", "toc"],
  ["toggle-group", "toggle-group"],
  ["tooltip", "tooltip"],
] as const;

const pagesWithoutPrimitiveReference = [
  "aspect-ratio",
  "attachment",
  "badge",
  "banner",
  "breadcrumbs",
  "button",
  "button-group",
  "card",
  "code",
  "code-highlighted",
  "dicehub-logo",
  "empty",
  "flow",
  "grid",
  "input-group",
  "item",
  "label",
  "loader",
  "meter",
  "separator",
  "sensitive-input",
  "skeleton-line",
  "text",
  "toggle",
  "toolbar",
] as const;

test.describe("Ark UI documentation links", () => {
  test("links every single-primitive component header", async ({ context }) => {
    test.setTimeout(120_000);

    for (const [component, primitive] of componentLinks) {
      await test.step(component, async () => {
        const page = await context.newPage();
        try {
          await page.goto(`/docs/components/${component}`);

          const link = page
            .locator(".docs-page-header__title-row")
            .getByRole("link", { name: "View Ark UI documentation" });
          await expect(link).toHaveCount(1);
          await expect(link).toHaveAttribute(
            "href",
            `https://ark-ui.com/docs/components/${primitive}`,
          );
          await expect(link).toHaveAttribute("target", "_blank");
          await expect(link).toHaveAttribute("rel", "noopener noreferrer");
          await expect(link.locator("svg")).toHaveAttribute("aria-hidden", "true");
          await expect(link.locator("svg")).toHaveAttribute("focusable", "false");
        } finally {
          await page.close();
        }
      });
    }
  });

  test("renders both Command Palette primitive references", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/docs/components/command-palette");

    const references = page.locator(".docs-page-header__links");
    const combobox = references.getByRole("link", {
      name: "View Ark UI Combobox documentation",
    });
    const dialog = references.getByRole("link", {
      name: "View Ark UI Dialog documentation",
    });

    await expect(references).toBeVisible();
    await expect(references.getByRole("link")).toHaveCount(2);
    await expect(combobox).toHaveAttribute(
      "href",
      "https://ark-ui.com/docs/components/combobox",
    );
    await expect(combobox).toContainText("Combobox behavior");
    await expect(dialog).toHaveAttribute(
      "href",
      "https://ark-ui.com/docs/components/dialog",
    );
    await expect(dialog).toContainText("Dialog behavior");
    await expect(references.locator('svg[aria-hidden="true"]')).toHaveCount(2);
    await expect(combobox).toHaveCSS("border-top-width", "1px");
    const transitionDurationMs = await combobox.evaluate(
      (element) => Number.parseFloat(getComputedStyle(element).transitionDuration) * 1_000,
    );
    expect(transitionDurationMs).toBeLessThanOrEqual(0.01);
  });

  test("omits unrelated primitive references from headers", async ({ context }) => {
    test.setTimeout(120_000);

    for (const component of pagesWithoutPrimitiveReference) {
      await test.step(component, async () => {
        const page = await context.newPage();
        try {
          await page.goto(`/docs/components/${component}`);
          await expect(
            page.locator('.docs-page-header__title-row a[href*="ark-ui.com"]'),
          ).toHaveCount(0);
        } finally {
          await page.close();
        }
      });
    }
  });
});
