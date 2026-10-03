import { expect, test } from "@playwright/test";

test.describe("Collapsible Section documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/collapsible-section");
    await expect
      .poll(() =>
        page.locator("[data-collapsible-section-demo]").evaluateAll((demos) =>
          demos.every((demo) => !demo.closest("astro-island")?.hasAttribute("ssr")),
        ),
      )
      .toBe(true);
  });

  test("renders the public composition and toggles with pointer and keyboard", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Collapsible Section" })).toBeVisible();

    const preview = page.locator('[data-collapsible-section-demo="preview"]');
    const trigger = preview.getByRole("button", { name: "Surface refinement" });
    const content = preview.locator('[data-slot="collapsible-section-content"]');

    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(content).toBeVisible();

    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(content).toBeHidden();

    await trigger.focus();
    await trigger.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(content).toBeVisible();

    const level = preview.getByLabel("Refinement level");
    await level.fill("9");
    await preview.getByRole("button", { name: "Reset" }).click();
    await expect(level).toHaveValue("4");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  test("keeps header actions independent and exposes the disabled state", async ({ page }) => {
    const actions = page.locator('[data-collapsible-section-demo="actions"]');
    const trigger = actions.getByRole("button", { name: "Boundary conditions" });

    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await actions.getByRole("button", { name: "Reset" }).click();
    await expect(actions.getByRole("status")).toHaveText("Section open · Resets 1");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");

    const disabled = page.locator('[data-collapsible-section-demo="disabled"]');
    const disabledTrigger = disabled.getByRole("button", { name: "Generated controls" });
    await expect(disabledTrigger).toHaveAttribute("data-disabled", "");
    await disabledTrigger.click();
    await expect(disabledTrigger).toHaveAttribute("aria-expanded", "true");
    await expect(disabled.locator('[data-slot="collapsible-section-content"]')).toBeVisible();
  });

  test("renders the compact technical form at its dense size", async ({ page }) => {
    const compact = page.locator('[data-collapsible-section-demo="compact"]');
    const root = compact.locator('[data-slot="collapsible-section"]');
    const header = compact.locator('[data-slot="collapsible-section-header"]');

    await expect(root).toHaveAttribute("data-size", "compact");
    await expect(header).toHaveCSS("min-height", "24px");
    await expect(header).toHaveCSS("height", "24px");
    await expect(compact.getByRole("spinbutton")).toHaveCount(3);
    await expect(compact.getByRole("spinbutton", { name: "Level" })).toHaveValue("4");
    await expect(compact.getByRole("spinbutton", { name: "Buffer cells" })).toHaveValue("3");
    await expect(compact.getByRole("spinbutton", { name: "Angle" })).toHaveValue("30");
    await expect(compact.locator('[data-slot="number-input-control"]').first()).toHaveCSS(
      "height",
      "20px",
    );
  });
});
