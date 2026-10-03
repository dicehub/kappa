import { expect, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) =>
  page.locator(`[data-input-group-demo="${variant}"]`);

test.describe("Input Group documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/input-group");
  });

  test("renders the component guide, examples, API, and Markdown", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Input Group" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(demo(page, "preview").locator('[data-slot="input-group"]')).toHaveCount(1);

    const snippets = page.locator("pre[data-language]");
    await expect(snippets.filter({ hasText: "@dicehub/kappa/components/input-group" })).not.toHaveCount(0);
    await expect(snippets.filter({ hasText: "../../../kappa/src" })).toHaveCount(0);
    await expect(page.getByText("InputGroupButton", { exact: true }).last()).toBeVisible();
    await expect(page.locator("#composition")).toContainText(
      "Input Group combines a control, logical addons, helper text, and related buttons.",
    );

    const toc = page.getByRole("complementary", { name: "On this page" });
    await expect(toc.getByRole("link")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Composition",
      "Examples",
      "Alignment",
      "Text",
      "Button",
      "Textarea",
      "States",
      "Sizes",
      "Right to Left",
      "Accessibility",
      "API Reference",
      "InputGroup",
      "InputGroupAddon",
      "InputGroupInput / Textarea",
      "InputGroupButton",
      "Events",
      "Slots",
      "Data Attributes",
      "Exports",
    ]);

    const response = await request.get("/docs/components/input-group.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Input Group");
    expect(markdown).toContain("## [Accessibility](#accessibility)");
    expect(markdown).toContain("InputGroupSize / InputGroupAddonAlign");
    expect(markdown).not.toContain("View Code");
    expect(markdown).not.toContain("On this page");
  });

  test("keeps native controls, logical addons, and actions usable", async ({ page }) => {
    const preview = demo(page, "preview");
    const group = preview.locator('[data-slot="input-group"]');
    const input = group.locator('[data-slot="input-group-control"]');
    const addons = group.locator('[data-slot="input-group-addon"]');

    await expect(group).toHaveAttribute("role", "group");
    await expect(input).toHaveJSProperty("tagName", "INPUT");
    await expect(input).toHaveAttribute("type", "url");
    await expect(addons).toHaveCount(2);
    await expect(addons.nth(0)).toHaveAttribute("data-align", "inline-start");
    await expect(addons.nth(1)).toHaveAttribute("data-align", "inline-end");
    await expect(group.locator('[data-input-group-button]')).toHaveCount(1);
    await addons.nth(0).locator('[data-slot="input-group-text"]').click();
    await expect(input).toBeFocused();

    await input.fill("runs.example/api");
    await expect(preview.getByText("Ready to inspect runs.example/api")).toBeVisible();
    await input.focus();
    await expect(group).toHaveCSS("border-color", /rgb\(/);
    const prefixGap = await preview.locator('[data-slot="input-group-text"]').evaluate((element) => {
      const icon = element.querySelector("svg");
      const textNode = [...element.childNodes].find(
        (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim(),
      );
      if (!icon || !textNode) return 0;
      const range = document.createRange();
      range.selectNodeContents(textNode);
      return range.getBoundingClientRect().left - icon.getBoundingClientRect().right;
    });
    expect(prefixGap).toBeGreaterThanOrEqual(6);
    const prefixIconOffset = await preview
      .locator('[data-slot="input-group-text"]')
      .evaluate((element) => {
        const icon = element.querySelector("svg");
        if (!icon) return 0;
        return icon.getBoundingClientRect().top - element.getBoundingClientRect().top;
      });
    expect(prefixIconOffset).toBe(-1);
    const inspect = preview.getByRole("button", { name: "Inspect repository endpoint" });
    await page.mouse.move(0, 0);
    const inspectColor = await inspect.evaluate((element) => getComputedStyle(element).color);
    await inspect.hover();
    await expect(inspect).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await expect.poll(() => inspect.evaluate((element) => getComputedStyle(element).color)).not.toBe(
      inspectColor,
    );

    const buttonDemo = demo(page, "button");
    const tokenInput = buttonDemo.locator('[data-slot="input-group-control"]').first();
    const reveal = buttonDemo.getByRole("button", { name: "Toggle access token visibility" });
    await expect(tokenInput).toHaveValue("••••••••••••••••");
    await reveal.click();
    await expect(tokenInput).toHaveValue("kappa-demo-token");
    await reveal.click();
    await expect(tokenInput).toHaveValue("••••••••••••••••");
    await buttonDemo.getByRole("button", { name: "Copy access token" }).click();
    await expect(buttonDemo.getByRole("button", { name: "Access token copied" })).toBeVisible();

    const textareaDemo = demo(page, "textarea");
    const textarea = textareaDemo.locator('[data-slot="input-group-control"]');
    const post = textareaDemo.getByRole("button", { name: "Post release note" });
    await expect(textarea).toHaveJSProperty("tagName", "TEXTAREA");
    await expect(post).toBeDisabled();
    await textarea.fill("Mesh refinement completed.");
    await expect(post).toBeEnabled();
    const footerBox = await textareaDemo.locator('[data-align="block-end"]').boundingBox();
    const postBox = await post.boundingBox();
    expect(footerBox).not.toBeNull();
    expect(postBox).not.toBeNull();
    const footerEnd = (footerBox?.x ?? 0) + (footerBox?.width ?? 0);
    const postEnd = (postBox?.x ?? 0) + (postBox?.width ?? 0);
    expect(footerEnd - postEnd).toBeLessThanOrEqual(12);
    await post.click();
    await expect(textareaDemo.getByText("Release note queued")).toBeVisible();

    for (const variant of ["preview", "button", "textarea"]) {
      const icons = demo(page, variant).locator("svg");
      const dimensions = await icons.evaluateAll((elements) =>
        elements.map((element) => {
          const box = element.getBoundingClientRect();
          return [box.width, box.height];
        }),
      );
      expect(dimensions.every(([width, height]) => width === 16 && height === 16)).toBe(true);
    }
  });

  test("covers placement, states, sizes, themes, RTL, and narrow screens", async ({ page }) => {
    const alignment = demo(page, "alignment");
    await expect(alignment.locator('[data-align="inline-start"]')).toHaveCount(1);
    await expect(alignment.locator('[data-align="inline-end"]')).toHaveCount(1);
    await expect(alignment.locator('[data-align="block-start"]')).toHaveCount(1);
    await expect(alignment.locator('[data-align="block-end"]')).toHaveCount(1);
    await expect(alignment.locator('[data-align="block-start"]').locator(".."))
      .toHaveCSS("flex-direction", "column");

    const states = demo(page, "states");
    await expect(states.locator('[data-slot="input-group"][data-invalid]')).toHaveCount(1);
    await expect(states.locator('[data-slot="input-group"] input:disabled')).toHaveCount(1);
    const loadingButton = states.getByRole("button", { name: "Search in progress" });
    await expect(loadingButton).toHaveAttribute(
      "aria-busy",
      "true",
    );
    await expect(loadingButton.locator('[data-slot="button-spinner"]')).toHaveCount(1);
    await expect(loadingButton.locator("svg")).toHaveCount(0);

    const expectedHeights = ["24px", "28px", "36px", "40px"];
    const sizeGroups = demo(page, "sizes").locator('[data-slot="input-group"]');
    await expect(sizeGroups).toHaveCount(4);
    for (const [index, height] of expectedHeights.entries()) {
      await expect(sizeGroups.nth(index)).toHaveCSS("height", height);
    }

    const rtl = demo(page, "rtl");
    await expect(rtl.locator('[dir="rtl"]')).toHaveAttribute("lang", "ar");
    await expect(rtl.locator('[data-align="inline-start"]')).toHaveCount(1);

    const themeToggle = page.locator('button[aria-label="Toggle theme"]:visible').first();
    const usageGroup = demo(page, "usage").locator('[data-slot="input-group"]');
    const lightBackground = await usageGroup.evaluate((element) => getComputedStyle(element).backgroundColor);
    await themeToggle.click();
    await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
    await expect.poll(() => usageGroup.evaluate((element) => getComputedStyle(element).backgroundColor)).not.toBe(
      lightBackground,
    );

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole("complementary", { name: "On this page" })).toBeHidden();
    await expect(demo(page, "preview").locator('[data-slot="input-group"]')).toBeVisible();
  });
});
