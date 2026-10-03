import { expect, type Locator, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) =>
  page.locator(`[data-checkbox-demo="${variant}"]`);

const control = (container: Locator, name: string) =>
  container
    .getByRole("checkbox", { name, exact: true })
    .locator("xpath=ancestor::*[@data-slot='checkbox'][1]")
    .locator('[data-slot="checkbox-control"]');

test.describe("Checkbox documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/checkbox");
    await expect(page.locator("astro-island[ssr]:has([data-checkbox-demo])")).toHaveCount(0);
  });

  test("renders public examples, navigation, TOC, and Markdown", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Checkbox" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(demo(page, "preview").locator(".kappa-checkbox")).toHaveCount(1);
    await expect(demo(page, "group").locator(".kappa-checkbox-group")).toHaveCount(1);

    const snippets = page.locator("pre[data-language]");
    await expect(snippets.first()).toContainText('from "@dicehub/kappa/components/checkbox"');
    await expect(snippets.filter({ hasText: "../../../kappa/src" })).toHaveCount(0);
    await expect(page.locator('pre[data-language="typescript"]')).toHaveCount(0);
    await expect(page.locator('pre[data-language="javascript"]')).toHaveCount(2);

    const sidebar = page
      .locator("#desktop-navigation")
      .getByRole("link", { name: "Checkbox", exact: true });
    const compact = page.getByRole("navigation", { name: "Adjacent documentation pages" });
    const footer = page.getByRole("navigation", { name: "Documentation pagination" });
    await expect(sidebar).toHaveAttribute("aria-current", "page");
    await expect(compact.getByRole("link", { name: "Previous page: Card" })).toHaveAttribute(
      "href",
      "/docs/components/card",
    );
    await expect(
      compact.getByRole("link", { name: "Next page: Client Only" }),
    ).toHaveAttribute("href", "/docs/components/client-only");
    await expect(footer.getByRole("link", { name: "Card", exact: true })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Client Only", exact: true })).toBeVisible();

    const toc = page.getByRole("complementary", { name: "On this page" });
    await expect(toc.getByRole("link")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Composition",
      "Examples",
      "Basic",
      "Indeterminate",
      "Group",
      "Bordered Items",
      "Controlled",
      "States",
      "Accessibility",
      "API Reference",
      "Checkbox.Root",
      "Checkbox.Group",
      "Parts",
      "Events",
      "Exports",
    ]);
    await expect(
      page.getByRole("link", { name: "Ark UI Checkbox" }),
    ).toHaveAttribute("href", "https://ark-ui.com/docs/components/checkbox");

    const response = await request.get("/docs/components/checkbox.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Checkbox");
    expect(markdown).toContain("## [Accessibility](#accessibility)");
    expect(markdown).toContain("Checkbox.Root");
    expect(markdown).not.toContain("View Code");
    expect(markdown).not.toContain("On this page");
  });

  test("toggles with click and Space and exposes native form semantics", async ({ page }) => {
    const usage = demo(page, "usage");
    const input = usage.getByRole("checkbox", { name: "Export residuals after each write interval" });
    const usageControl = usage.locator('[data-slot="checkbox-control"]');

    await expect(input).toBeChecked();
    await expect(input).toHaveAttribute("name", "residual-export");
    await expect(input).toHaveAttribute("value", "residuals");
    await expect(usageControl).toHaveAttribute("data-state", "checked");

    await usageControl.click();
    await expect(input).not.toBeChecked();
    await expect(usageControl).toHaveAttribute("data-state", "unchecked");

    await input.focus();
    await input.press("Space");
    await expect(input).toBeChecked();
    await expect(usageControl).toHaveAttribute("data-state", "checked");
  });

  test("drives the indeterminate parent from group selection", async ({ page }) => {
    const container = demo(page, "indeterminate");
    const parent = container.getByRole("checkbox", { name: "Monitor all fields" });
    const parentControl = control(container, "Monitor all fields");
    const residualsControl = control(container, "Residuals");
    const spectra = container.getByRole("checkbox", { name: "Pressure spectra" });

    await expect.poll(() => parent.evaluate((element) => (element as HTMLInputElement).indeterminate)).toBe(true);
    await expect(parentControl).toHaveAttribute("data-state", "indeterminate");
    await expect(parentControl.locator('[data-slot="checkbox-indicator"]:visible')).toHaveCount(1);

    await parentControl.click();
    await expect(parent).toBeChecked();
    await expect(spectra).toBeChecked();
    await expect(parentControl).toHaveAttribute("data-state", "checked");

    await parentControl.click();
    await expect(parent).not.toBeChecked();
    await expect(spectra).not.toBeChecked();
    await expect(parentControl).toHaveAttribute("data-state", "unchecked");

    await residualsControl.click();
    await expect.poll(() => parent.evaluate((element) => (element as HTMLInputElement).indeterminate)).toBe(true);
    await expect(parentControl).toHaveAttribute("data-state", "indeterminate");
  });

  test("binds group values with v-model and enforces the selection limit", async ({ page }) => {
    const container = demo(page, "group");
    const readout = container.locator(".checkbox-demo__readout");
    const vtkControl = control(container, "VTK surface data");
    const csvControl = control(container, "CSV force history");
    const hdf5Control = control(container, "HDF5 field archive");
    const hdf5 = container.getByRole("checkbox", { name: "HDF5 field archive" });
    const group = container.locator(".kappa-checkbox-group");

    await expect(group).toHaveAttribute("role", "group");
    await expect(group).toHaveAttribute("aria-labelledby", "export-group-label");
    await expect(readout).toContainText("vtk");

    await csvControl.click();
    await expect(readout).toContainText("vtk, csv");

    await expect(hdf5).toBeDisabled();
    await expect(hdf5Control).toHaveAttribute("data-disabled", "");
    await expect(readout).toContainText("vtk, csv");

    await vtkControl.click();
    await expect(readout).toContainText("csv");
    await expect(readout).not.toContainText("vtk");
    await expect(hdf5).toBeEnabled();

    await hdf5Control.click();
    await expect(hdf5).toBeChecked();
    await expect(readout).toContainText("csv, hdf5");
  });

  test("toggles bordered rows from any point and marks the checked row", async ({ page }) => {
    const container = demo(page, "bordered");
    const meshInput = container.getByRole("checkbox", { name: /Run pre-solver mesh checks/ });
    const meshRow = container.locator(".checkbox-demo__item", { hasText: "Run pre-solver mesh checks" });
    const historyRow = container.locator(".checkbox-demo__item", { hasText: "Write residual history" });

    const checkedBorder = await meshRow.evaluate((element) => getComputedStyle(element).borderColor);
    const plainBorder = await historyRow.evaluate((element) => getComputedStyle(element).borderColor);
    expect(checkedBorder).not.toBe(plainBorder);

    await historyRow.getByText("Appends normalized residuals at every iteration.").click();
    await expect(container.getByRole("checkbox", { name: /Write residual history/ })).toBeChecked();

    await meshRow.locator('[data-slot="checkbox-control"]').click();
    await expect(meshInput).not.toBeChecked();
  });

  test("supports controlled state through update:checked", async ({ page }) => {
    const container = demo(page, "controlled");
    const input = container.getByRole("checkbox", { name: "Run orthogonal quality check" });
    const inputControl = control(container, "Run orthogonal quality check");
    const readout = container.locator(".checkbox-demo__readout");

    await expect(input).toBeChecked();
    await expect(readout).toContainText("true");
    await inputControl.click();
    await expect(readout).toContainText("false");
    await expect(input).not.toBeChecked();
  });

  test("blocks disabled and read-only changes and marks invalid state", async ({ page }) => {
    const states = demo(page, "states");
    const disabled = states.getByRole("checkbox", { name: "Disabled while meshing" });
    const readOnly = states.getByRole("checkbox", { name: "Read-only license option" });
    const readOnlyControl = control(states, "Read-only license option");
    const invalidControl = control(states, "Accept the compute policy");

    await expect(disabled).toBeDisabled();
    await expect(readOnly).toBeChecked();
    await readOnlyControl.click();
    await expect(readOnly).toBeChecked();
    await expect(invalidControl).toHaveAttribute("data-invalid", "");
    await expect(states.locator("#terms-error")).toBeVisible();
  });

  test("keeps focus, themes, and reduced motion intact", async ({ page }) => {
    const preview = demo(page, "preview");
    const input = preview.getByRole("checkbox", { name: "Verify mesh quality before solving" });
    const previewControl = preview.locator('[data-slot="checkbox-control"]');
    const previewLabel = preview.locator('[data-slot="checkbox-label"]');

    await input.focus();
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");
    await expect(input).toBeFocused();
    await expect(previewControl).toHaveAttribute("data-focus-visible", "");
    const focus = await previewControl.evaluate((element) => {
      const styles = getComputedStyle(element);
      return { style: styles.outlineStyle, width: Number.parseFloat(styles.outlineWidth) };
    });
    expect(focus.style).not.toBe("none");
    expect(focus.width).toBeGreaterThanOrEqual(2);

    const lightColor = await previewLabel.evaluate((element) => getComputedStyle(element).color);
    await page.getByRole("button", { name: "Toggle theme" }).filter({ visible: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
    await expect
      .poll(() => previewLabel.evaluate((element) => getComputedStyle(element).color))
      .not.toBe(lightColor);

    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect
      .poll(() => previewControl.evaluate((element) => getComputedStyle(element).transitionDuration))
      .toMatch(/^(?:0s|0\.00001s|1e-05s)$/);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole("complementary", { name: "On this page" })).toBeHidden();
  });
});
