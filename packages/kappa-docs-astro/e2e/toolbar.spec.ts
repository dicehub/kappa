import { expect, type Locator, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) =>
  page.locator(`[data-toolbar-demo="${variant}"]`);

const waitForHydration = async (container: Locator) => {
  await expect
    .poll(() =>
      container.evaluate((element) => {
        const island = element.closest("astro-island");
        return island ? !island.hasAttribute("ssr") : true;
      }),
    )
    .toBe(true);
};

test.describe("Toolbar documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/toolbar");
  });

  test("renders the preview, composition, imports, and page TOC", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Toolbar" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(demo(page, "preview").getByRole("toolbar", { name: "Record tools" })).toBeVisible();
    await expect(
      page
        .locator('pre[data-language="typescript"]')
        .filter({ hasText: 'from "@dicehub/kappa/components/toolbar"' }),
    ).toHaveCount(1);
    await expect(page.locator('pre:has-text("../../../kappa/src")')).toHaveCount(0);
    await expect(page.locator('[data-composition-tree="toolbar"]')).toContainText("Toolbar.Root");

    await expect(page.getByRole("complementary", { name: "On this page" }).getByRole("link")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Composition",
      "Examples",
      "Select",
      "Combobox",
      "Input shorthand",
      "Input group",
      "Sizes",
      "Button actions",
      "Links",
      "Accessible labels",
      "Accessibility",
      "Keyboard support",
      "API Reference",
      "Toolbar.Root",
      "Parts",
      "Keyboard",
      "Data attributes",
      "Exports",
    ]);
  });

  test("supports Select, Combobox, Input Group, sizes, and links", async ({ page }) => {
    const preview = demo(page, "preview");
    const search = preview.getByRole("textbox", { name: "Search records" });
    await search.fill("edge case");
    await expect(search).toHaveValue("edge case");

    const select = demo(page, "select");
    await waitForHydration(select);
    const selectTrigger = select.getByRole("combobox", { name: "Sort records" });
    await selectTrigger.click();
    await page.getByRole("option", { name: "Created date" }).click();
    await expect(selectTrigger).toContainText("Created date");

    const combobox = demo(page, "combobox");
    await waitForHydration(combobox);
    const comboboxInput = combobox.getByRole("combobox", { name: "Filter status" });
    await comboboxInput.fill("Pa");
    await expect(page.getByRole("option", { name: "Paused" })).toBeVisible();
    await comboboxInput.press("ArrowDown");
    await comboboxInput.press("Enter");
    await expect(comboboxInput).toHaveValue("Paused");

    const inputGroup = demo(page, "input-group");
    await expect(inputGroup.getByRole("textbox", { name: "Site subdomain" })).toBeVisible();
    await expect(inputGroup.getByText(".example.com")).toBeVisible();

    await expect(demo(page, "sizes").getByRole("toolbar")).toHaveCount(4);

    const links = demo(page, "links");
    await expect(links.getByRole("link", { name: "Button docs" })).toHaveAttribute(
      "href",
      "/docs/components/button",
    );
  });

  test("fills the toolbar inner height with buttons", async ({ page }) => {
    const toolbar = demo(page, "preview").getByRole("toolbar", { name: "Record tools" });
    const measurements = await toolbar.evaluate((root) => {
      const rootRect = root.getBoundingClientRect();
      const rootStyle = getComputedStyle(root);
      const innerHeight =
        rootRect.height -
        Number.parseFloat(rootStyle.borderTopWidth) -
        Number.parseFloat(rootStyle.borderBottomWidth);

      return Array.from(root.querySelectorAll("button")).map((button) => ({
        height: button.getBoundingClientRect().height,
        innerHeight,
      }));
    });

    expect(measurements.length).toBeGreaterThan(0);
    for (const measurement of measurements) {
      expect(measurement.height).toBeCloseTo(measurement.innerHeight, 1);
    }
  });

  test("uses roving focus and preserves native input editing keys", async ({ page }) => {
    const preview = demo(page, "preview");
    const toolbar = preview.getByRole("toolbar", { name: "Record tools" });
    const controls = toolbar.locator("input, button");
    await expect(controls.first()).toHaveAttribute("tabindex", "0");
    await expect(controls.nth(1)).toHaveAttribute("tabindex", "-1");

    await controls.first().focus();
    await controls.first().press("ArrowRight");
    await expect(controls.nth(1)).toBeFocused();
    await controls.nth(1).press("End");
    await expect(controls.nth(2)).toBeFocused();

    const input = controls.first();
    await input.fill("search term");
    await input.focus();
    await input.press("Home");
    await expect(input).toBeFocused();
  });

  test("updates the single tab stop when focus enters by pointer", async ({ page }) => {
    const toolbar = demo(page, "preview").getByRole("toolbar", { name: "Record tools" });
    const controls = toolbar.locator("input, button");
    await controls.nth(1).click();
    await expect(controls.nth(1)).toBeFocused();
    await expect(toolbar.locator('[tabindex="0"]')).toHaveCount(1);
    await expect(controls.nth(1)).toHaveAttribute("tabindex", "0");
    await expect(controls.first()).toHaveAttribute("tabindex", "-1");
  });

  test("preserves RTL text editing and native select/range arrows", async ({ page }) => {
    const preview = demo(page, "preview");
    await waitForHydration(preview);
    const toolbar = preview.getByRole("toolbar", { name: "Record tools" });
    await toolbar.evaluate((root) => {
      root.setAttribute("dir", "rtl");
      const input = document.createElement("input");
      input.type = "text";
      input.value = "אבג";
      input.setAttribute("data-toolbar-rtl-input", "");
      root.append(input);
    });
    const rtlInput = toolbar.locator("[data-toolbar-rtl-input]");
    await rtlInput.focus();
    await rtlInput.evaluate((element) => (element as HTMLInputElement).setSelectionRange(0, 0));
    await rtlInput.press("ArrowLeft");
    await expect(rtlInput).toBeFocused();

    await toolbar.evaluate((root) => {
      const select = document.createElement("select");
      select.setAttribute("data-toolbar-select", "");
      select.innerHTML = "<option>One</option><option>Two</option>";
      root.append(select);
    });
    const select = toolbar.locator("[data-toolbar-select]");
    await select.focus();
    await select.press("ArrowDown");
    await expect(select).toHaveValue("Two");
    await toolbar.evaluate((root) => {
      const range = document.createElement("input");
      range.type = "range";
      range.min = "0";
      range.max = "10";
      range.value = "5";
      range.setAttribute("data-toolbar-range", "");
      root.append(range);
    });
    const range = toolbar.locator("[data-toolbar-range]");
    await range.focus();
    await range.press("ArrowRight");
    await expect(range).toHaveValue("4");
  });
});
