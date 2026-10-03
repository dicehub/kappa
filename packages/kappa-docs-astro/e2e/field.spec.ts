import { expect, type Locator, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) => page.locator(`[data-field-demo="${variant}"]`);

const expectDescribedBy = async (control: Locator, description: Locator) => {
  const descriptionId = await description.getAttribute("id");
  expect(descriptionId).toBeTruthy();
  await expect(control).toHaveAttribute("aria-describedby", descriptionId!);
};

test.describe("Field documentation", () => {
  test.beforeEach(async ({ page }) => {
    const vueWarnings: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "warning" && message.text().includes("[Vue warn]")) {
        vueWarnings.push(message.text());
      }
    });
    await page.goto("/docs/components/field");
    await page.waitForFunction(
      () =>
        [...document.querySelectorAll("[data-field-demo]")].every(
          (element) => !element.closest("astro-island")?.hasAttribute("ssr"),
        ),
    );
    expect(vueWarnings).toEqual([]);
  });

  test("renders examples, navigation, TOC, and Markdown", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Field" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(page.locator("[data-field-demo]")).toHaveCount(11);
    await expect(demo(page, "preview").getByRole("heading", { name: "Create a workspace" })).toBeVisible();

    const snippets = page.locator("pre[data-language]");
    await expect(snippets.first()).toContainText('from "@dicehub/kappa/components/field"');
    await expect(snippets.filter({ hasText: "../../../kappa/src" })).toHaveCount(0);
    await expect(page.locator('pre[data-language="javascript"]')).toHaveCount(2);

    const sidebar = page
      .locator("#desktop-navigation")
      .getByRole("link", { name: "Field", exact: true });
    const compact = page.getByRole("navigation", { name: "Adjacent documentation pages" });
    const footer = page.getByRole("navigation", { name: "Documentation pagination" });
    await expect(sidebar).toHaveAttribute("aria-current", "page");
    await expect(compact.getByRole("link", { name: "Previous page: Expandable Text" })).toHaveAttribute(
      "href",
      "/docs/components/expandable-text",
    );
    await expect(compact.getByRole("link", { name: "Next page: Fieldset" })).toHaveAttribute(
      "href",
      "/docs/components/fieldset",
    );
    await expect(footer.getByRole("link", { name: "Expandable Text", exact: true })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Fieldset", exact: true })).toBeVisible();

    const toc = page.getByRole("complementary", { name: "On this page" });
    await expect(toc.getByRole("link")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Composition",
      "Examples",
      "Basic",
      "Textarea",
      "Select",
      "Validation",
      "Required and Optional",
      "Checkbox",
      "Multiple Controls",
      "Orientation",
      "Disabled and Read-only",
      "Accessibility",
      "API Reference",
      "Field.Root",
      "Native Controls",
      "Parts",
      "Exports",
    ]);

    const response = await request.get("/docs/components/field.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Field");
    expect(markdown).toContain("## [Accessibility](#accessibility)");
    expect(markdown).toContain("### [Multiple Controls](#multiple-controls)");
    expect(markdown).toContain("FieldRequiredIndicator");
    expect(markdown).not.toContain("View Code");
    expect(markdown).not.toContain("On this page");
  });

  test("connects labels, helper text, required state, and optional fallback", async ({ page }) => {
    const basic = demo(page, "basic");
    const input = basic.getByRole("textbox", { name: "Email address" });
    const label = basic.locator('[data-slot="field-label"]');
    const helper = basic.locator('[data-slot="field-helper-text"]');
    await expect(input).toHaveAttribute("id", "contact-email");
    await expect(label).toHaveAttribute("for", "contact-email");
    await expectDescribedBy(input, helper);

    const required = demo(page, "required");
    const contact = required.getByRole("textbox", { name: /Contact name/ });
    const indicator = required.locator(
      '[data-slot="field-required-indicator"]:not([data-optional])',
    );
    const optionalIndicator = required.locator(
      '[data-slot="field-required-indicator"][data-optional]',
    );
    await expect(contact).toHaveAttribute("required", "");
    await expect(indicator).toHaveText("*");
    await expect(indicator).toHaveAttribute("aria-hidden", "true");
    await expect(optionalIndicator).toHaveText("(optional)");
    await expect(optionalIndicator).toBeVisible();
    await expect(required.getByRole("textbox", { name: /Company/ })).not.toHaveAttribute("required");
  });

  test("updates native values and exposes invalid error relationships", async ({ page }) => {
    const textareaDemo = demo(page, "textarea");
    const textarea = textareaDemo.getByRole("textbox", { name: "Review notes" });
    const initialHeight = await textarea.evaluate((element) => element.getBoundingClientRect().height);
    await textarea.fill(
      "Line one\nLine two\nLine three\nLine four\nLine five\nLine six\nLine seven\nLine eight",
    );
    await expect(textarea).toHaveValue(/Line eight/);
    await expect.poll(() => textarea.evaluate((element) => element.getBoundingClientRect().height)).toBeGreaterThan(initialHeight);
    await expect(textarea).toHaveCSS("resize", "none");

    const select = demo(page, "select").getByRole("combobox", { name: "Timezone" });
    await select.selectOption("America/New_York");
    await expect(select).toHaveValue("America/New_York");
    const selectControl = select.locator("..");
    const selectIcon = selectControl.locator(".kappa-field__select-icon");
    const [selectControlBox, selectIconBox] = await Promise.all([
      selectControl.boundingBox(),
      selectIcon.boundingBox(),
    ]);
    expect(selectControlBox).not.toBeNull();
    expect(selectIconBox).not.toBeNull();
    const iconEndGap =
      selectControlBox!.x + selectControlBox!.width - (selectIconBox!.x + selectIconBox!.width);
    expect(iconEndGap).toBeGreaterThanOrEqual(11);
    expect(iconEndGap).toBeLessThanOrEqual(13);

    const validation = demo(page, "validation");
    const password = validation.getByLabel(/Password/);
    const error = validation.locator('[data-slot="field-error-text"]');
    const helper = validation.locator('[data-slot="field-helper-text"]');
    await expect(password).toHaveAttribute("aria-invalid", "true");
    await expect(password).toHaveAttribute("required", "");
    await expectDescribedBy(password, helper);
    const errorId = await error.getAttribute("id");
    expect(errorId).toBeTruthy();
    await expect(password).toHaveAttribute("aria-errormessage", errorId!);
    await expect(error).toHaveAttribute("aria-live", "polite");
    await expect(error.getByRole("listitem")).toHaveCount(3);

    await password.fill("SecureA8");
    await expect(error).toHaveCount(0);
    await expect(password).not.toHaveAttribute("aria-invalid");
    await expect(password).not.toHaveAttribute("aria-errormessage");
  });

  test("connects checkbox and multi-control fields through Ark context", async ({ page }) => {
    const checkboxDemo = demo(page, "checkbox");
    const checkbox = checkboxDemo.getByRole("checkbox", { name: "Send me product updates" });
    const checkboxLabel = checkboxDemo.locator('[data-scope="field"][data-part="label"]');
    const checkboxHelper = checkboxDemo.locator('[data-slot="field-helper-text"]');
    await expect(checkbox).toBeChecked();
    await expectDescribedBy(checkbox, checkboxHelper);
    const checkboxLabelId = await checkboxLabel.getAttribute("id");
    expect(checkboxLabelId).toBeTruthy();
    await expect(checkbox).toHaveAttribute("aria-labelledby", checkboxLabelId!);
    await checkboxDemo.locator('[data-slot="checkbox-control"]').click();
    await expect(checkbox).not.toBeChecked();

    const multiple = demo(page, "multiple");
    const amount = multiple.getByRole("textbox", { name: "Monthly budget" });
    const currency = multiple.getByRole("combobox", { name: "Currency" });
    const helper = multiple.locator('[data-slot="field-helper-text"]');
    await expect(amount).toHaveAttribute("id", "field::monthly-budget::item::amount");
    await expect(currency).toHaveAttribute("id", "field::monthly-budget::item::currency");
    await expectDescribedBy(amount, helper);
    await expectDescribedBy(currency, helper);
    await amount.fill("3600");
    await currency.selectOption("USD");
    await expect(amount).toHaveValue("3600");
    await expect(currency).toHaveValue("USD");
  });

  test("applies layout, native states, themes, reduced motion, and mobile behavior", async ({ page }) => {
    const orientation = demo(page, "orientation");
    const horizontal = orientation.locator('[data-orientation="horizontal"]');
    const responsive = orientation.locator('[data-orientation="responsive"]');
    const horizontalLabel = horizontal.locator('[data-slot="field-label"]');
    const horizontalInput = horizontal.locator('[data-slot="field-input"]');
    const responsiveLabel = responsive.locator('[data-slot="field-label"]');
    const responsiveSelect = responsive.locator('[data-slot="field-select"]');

    const [horizontalLabelBox, horizontalInputBox, responsiveLabelBox, responsiveSelectBox] =
      await Promise.all([
        horizontalLabel.boundingBox(),
        horizontalInput.boundingBox(),
        responsiveLabel.boundingBox(),
        responsiveSelect.boundingBox(),
      ]);
    expect(horizontalLabelBox!.x).toBeLessThan(horizontalInputBox!.x);
    expect(responsiveLabelBox!.x).toBeLessThan(responsiveSelectBox!.x);

    const states = demo(page, "states");
    const disabled = states.getByRole("textbox", { name: "Customer ID" });
    const readOnly = states.getByRole("textbox", { name: "Account owner" });
    await expect(disabled).toBeDisabled();
    await expect(readOnly).toHaveAttribute("readonly", "");
    await readOnly.focus();
    await expect(readOnly).toBeFocused();

    const lightBackground = await horizontalInput.evaluate(
      (element) => getComputedStyle(element).backgroundColor,
    );
    await page.getByRole("button", { name: "Toggle theme" }).filter({ visible: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
    await expect
      .poll(() => horizontalInput.evaluate((element) => getComputedStyle(element).backgroundColor))
      .not.toBe(lightBackground);

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.reload();
    await expect(demo(page, "basic").locator('[data-slot="field-input"]')).toHaveCSS(
      "transition-property",
      "none",
    );

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole("complementary", { name: "On this page" })).toBeHidden();

    const mobileResponsive = demo(page, "orientation").locator('[data-orientation="responsive"]');
    const mobileLabelBox = await mobileResponsive.locator('[data-slot="field-label"]').boundingBox();
    const mobileSelectBox = await mobileResponsive.locator('[data-slot="field-select"]').boundingBox();
    expect(mobileLabelBox!.y).toBeLessThan(mobileSelectBox!.y);
    expect(Math.abs(mobileLabelBox!.x - mobileSelectBox!.x)).toBeLessThan(2);
  });
});
