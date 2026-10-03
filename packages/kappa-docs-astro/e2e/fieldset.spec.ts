import { expect, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) =>
  page.locator(`[data-fieldset-demo="${variant}"]`);

test.describe("Fieldset documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/fieldset");
  });

  test("renders the public contract, examples, navigation, and Markdown", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Fieldset" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(page.locator("[data-fieldset-demo]")).toHaveCount(4);
    await expect(demo(page, "preview").locator("fieldset")).toHaveCount(1);
    await expect(demo(page, "preview").getByRole("group", { name: "Delivery channels" })).toBeVisible();

    const snippets = page.locator("pre[data-language]");
    await expect(snippets.first()).toContainText('from "@dicehub/kappa/components/fieldset"');
    await expect(snippets.filter({ hasText: "../../../kappa/src" })).toHaveCount(0);
    await expect(page.locator('pre[data-language="javascript"]')).toHaveCount(2);

    const sidebar = page
      .locator("#desktop-navigation")
      .getByRole("link", { name: "Fieldset", exact: true });
    const compact = page.getByRole("navigation", { name: "Adjacent documentation pages" });
    const footer = page.getByRole("navigation", { name: "Documentation pagination" });
    await expect(sidebar).toHaveAttribute("aria-current", "page");
    await expect(compact.getByRole("link", { name: "Previous page: Field" })).toHaveAttribute(
      "href",
      "/docs/components/field",
    );
    await expect(compact.getByRole("link", { name: "Next page: File Upload" })).toHaveAttribute(
      "href",
      "/docs/components/file-upload",
    );
    await expect(footer.getByRole("link", { name: "Field", exact: true })).toBeVisible();
    await expect(footer.getByRole("link", { name: "File Upload", exact: true })).toBeVisible();

    const response = await request.get("/docs/components/fieldset.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Fieldset");
    expect(markdown).toContain("## [Accessibility](#accessibility)");
    expect(markdown).toContain("FieldsetRootProvider");
    expect(markdown).not.toContain("View Code");
    expect(markdown).not.toContain("On this page");
  });

  test("keeps native group semantics and state relationships", async ({ page }) => {
    const preview = demo(page, "preview");
    const group = preview.getByRole("group", { name: "Delivery channels" });
    const legend = group.locator('[data-slot="fieldset-legend"]');
    const helper = group.locator('[data-slot="fieldset-helper-text"]');
    await expect(group).toHaveAttribute("data-orientation", "vertical");
    await expect(legend).toHaveText("Delivery channels");
    await expect(helper).toBeVisible();
    const legendId = await legend.getAttribute("id");
    const helperId = await helper.getAttribute("id");
    expect(legendId).toBeTruthy();
    expect(helperId).toBeTruthy();
    await expect(group).toHaveAttribute("aria-labelledby", legendId!);
    await expect(group).toHaveAttribute("aria-describedby", helperId!);

    const states = demo(page, "states");
    const invalid = states.getByRole("group", { name: "Required channels" });
    const error = invalid.locator('[data-slot="fieldset-error-text"]');
    await expect(invalid).toHaveAttribute("data-invalid", "");
    await expect(error).toHaveText("Choose at least one channel.");
    await expect(error).toHaveAttribute("aria-live", "polite");
    const errorId = await error.getAttribute("id");
    expect(errorId).toBeTruthy();
    await expect(invalid).toHaveAttribute("aria-describedby", errorId!);
    await states.getByRole("checkbox", { name: "Audit log" }).check();
    await expect(invalid).not.toHaveAttribute("data-invalid");
    await expect(error).toHaveCount(0);

    const disabled = states.getByRole("group", { name: "Locked channels" });
    await expect(disabled).toHaveAttribute("disabled", "");
    await expect(disabled.getByRole("checkbox", { name: "System alerts" })).toBeDisabled();
  });

  test("lays out orientations and keeps the page within the viewport", async ({ page }) => {
    const orientation = demo(page, "orientation");
    const vertical = orientation.getByRole("group", { name: "Vertical layout" });
    const horizontal = orientation.getByRole("group", { name: "Horizontal layout" });
    await expect(vertical).toHaveAttribute("data-orientation", "vertical");
    await expect(horizontal).toHaveAttribute("data-orientation", "horizontal");

    const verticalOptions = vertical.locator(".fieldset-demo__option");
    const horizontalOptions = horizontal.locator(".fieldset-demo__option");
    const verticalBoxes = await verticalOptions.evaluateAll((elements) =>
      elements.map((element) => {
        const box = element.getBoundingClientRect();
        return { x: Math.round(box.x), y: Math.round(box.y) };
      }),
    );
    const horizontalBoxes = await horizontalOptions.evaluateAll((elements) =>
      elements.map((element) => {
        const box = element.getBoundingClientRect();
        return { x: Math.round(box.x), y: Math.round(box.y) };
      }),
    );
    expect(verticalBoxes[0]!.x).toBe(verticalBoxes[1]!.x);
    expect(verticalBoxes[0]!.y).toBeLessThan(verticalBoxes[1]!.y);
    expect(horizontalBoxes[0]!.x).toBeLessThan(horizontalBoxes[1]!.x);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole("complementary", { name: "On this page" })).toBeHidden();
    await expect(demo(page, "preview").locator("fieldset")).toBeVisible();
  });
});
