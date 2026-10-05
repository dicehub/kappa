import { expect, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) =>
  page.locator(`[data-native-select-demo="${variant}"]`);

test.describe("Native Select documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/native-select");
  });

  test("renders complete examples, navigation, and Markdown", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Native Select" })).toBeVisible();
    await expect(page.locator(".docs-component-example")).toHaveCount(7);
    await expect(page.locator('.docs-code-full pre[data-language="vue"]')).toHaveCount(7);
    await expect(page.locator('.docs-code-full pre[data-language="javascript"]')).toHaveCount(2);

    const vueExamples = await page
      .locator('.docs-code-full pre[data-language="vue"]')
      .allTextContents();
    expect(vueExamples.every((source) => source.includes("components/native-select"))).toBe(true);

    await expect(
      page.getByRole("link", { name: "View Ark UI documentation" }),
    ).toHaveAttribute("href", "https://ark-ui.com/docs/components/field");

    const compact = page.getByRole("navigation", { name: "Adjacent documentation pages" });
    await expect(compact.getByRole("link", { name: "Previous page: Meter" })).toHaveAttribute(
      "href",
      "/docs/components/meter",
    );
    await expect(
      compact.getByRole("link", { name: "Next page: Navigation Menu" }),
    ).toHaveAttribute("href", "/docs/components/navigation-menu");

    const toc = page.getByRole("complementary", { name: "On this page" });
    await expect(toc.getByRole("link")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Composition",
      "Examples",
      "Sizes",
      "Option Groups",
      "Form States",
      "Multiple",
      "Right to Left",
      "Accessibility",
      "API Reference",
      "NativeSelect",
      "Events",
      "Data Attributes",
      "Exports",
    ]);

    const response = await request.get("/docs/components/native-select.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Native Select");
    expect(markdown).toContain("## [Composition](#composition)");
    expect(markdown).toContain("### [Multiple](#multiple)");
    expect(markdown).toContain("NativeSelectModelValue / NativeSelectSize");
    expect(markdown).not.toContain("View Code");
  });

  test("keeps native values, groups, states, and multiple selection", async ({ page }) => {
    const preview = demo(page, "preview");
    const region = preview.getByRole("combobox", { name: "Deployment region" });
    await expect(region).toHaveValue("eu-central");
    await expect(region).toHaveAttribute("name", "region");
    await expect(region).toHaveAttribute("data-slot", "native-select");
    await expect(region).toHaveAttribute("data-size", "base");
    await region.selectOption("us-east");
    await expect(region).toHaveValue("us-east");
    await expect(preview.getByText("Selected: us-east")).toBeVisible();

    const groups = demo(page, "groups");
    await expect(groups.locator("optgroup")).toHaveCount(2);
    await expect(groups.locator('optgroup[label="Europe"] option')).toHaveText([
      "Berlin",
      "London",
    ]);

    const states = demo(page, "states");
    await expect(states.getByRole("combobox", { name: "Disabled" })).toBeDisabled();
    const invalid = states.getByRole("combobox", { name: "Priority" });
    await expect(invalid).toHaveAttribute("aria-invalid", "true");
    await expect(invalid).toHaveAttribute("data-invalid", "");
    await expect(invalid).toHaveAccessibleDescription("Select a priority.");

    const multiple = demo(page, "multiple");
    const formats = multiple.getByRole("listbox", { name: "Export formats" });
    await expect(formats).toHaveValues(["csv", "pdf"]);
    await formats.selectOption(["json", "xlsx"]);
    await expect(formats).toHaveValues(["json", "xlsx"]);
    await expect(multiple.getByText("Selected: json, xlsx")).toBeVisible();
    await expect(multiple.locator('[data-slot="native-select-icon"]')).toBeHidden();
  });

  test("uses all densities and logical RTL icon placement", async ({ page }) => {
    const controls = demo(page, "sizes").locator('[data-slot="native-select"]');
    const sizes = await controls.evaluateAll((elements) =>
      elements.map((element) => ({
        height: Math.round(element.getBoundingClientRect().height),
        size: element.getAttribute("data-size"),
      })),
    );
    expect(sizes).toEqual([
      { height: 24, size: "xs" },
      { height: 28, size: "sm" },
      { height: 36, size: "base" },
      { height: 40, size: "lg" },
    ]);

    const rtl = demo(page, "rtl");
    const selectBox = await rtl.locator("select").boundingBox();
    const iconBox = await rtl.locator('[data-slot="native-select-icon"]').boundingBox();
    expect(selectBox).not.toBeNull();
    expect(iconBox).not.toBeNull();
    expect(iconBox!.x).toBeLessThan(selectBox!.x + selectBox!.width / 2);
  });
});
