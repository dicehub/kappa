import { expect, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) => page.locator(`[data-input-demo="${variant}"]`);

test.describe("Input documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/input");
  });

  test("renders examples, navigation, TOC, and Markdown", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Input" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(demo(page, "preview").locator(".kappa-input")).toHaveCount(1);
    await expect(page.getByRole("link", { name: "View Ark UI documentation" })).toHaveAttribute(
      "href",
      "https://ark-ui.com/docs/components/field",
    );

    const exampleFrames = page.locator(".docs-component-example");
    await expect(exampleFrames).toHaveCount(11);
    await expect(exampleFrames.first()).toHaveCSS("border-top-width", "1px");
    await expect(page.locator("#usage .docs-component-preview")).not.toHaveCSS(
      "padding-top",
      "0px",
    );

    await expect(page.locator('.docs-code-full pre[data-language="vue"]')).toHaveCount(11);
    await expect(page.locator('.docs-code-full pre[data-language="javascript"]')).toHaveCount(2);
    await expect(page.locator(".docs-code-full pre[data-language]").first()).toContainText(
      'from "@dicehub/kappa/components/input"',
    );
    await expect(page.locator('pre:has-text("../../../kappa/src")')).toHaveCount(0);
    await expect(page.getByRole("button", { name: "View Code" })).toHaveCount(11);

    const sidebar = page
      .locator("#desktop-navigation")
      .getByRole("link", { name: "Input", exact: true });
    const compact = page.getByRole("navigation", { name: "Adjacent documentation pages" });
    const footer = page.getByRole("navigation", { name: "Documentation pagination" });
    await expect(sidebar).toHaveAttribute("aria-current", "page");
    await expect(compact.getByRole("link", { name: "Previous page: Image Cropper" })).toHaveAttribute(
      "href",
      "/docs/components/image-cropper",
    );
    await expect(compact.getByRole("link", { name: "Next page: Input Area" })).toHaveAttribute(
      "href",
      "/docs/components/input-area",
    );
    await expect(footer.getByRole("link", { name: "Image Cropper", exact: true })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Input Area", exact: true })).toBeVisible();

    const toc = page.getByRole("complementary", { name: "On this page" });
    await expect(toc.getByRole("link")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Composition",
      "Examples",
      "Sizes",
      "Controlled Value",
      "Form States",
      "File",
      "Inline Action",
      "Grid",
      "Required",
      "Label Metadata",
      "Right to Left",
      "Accessibility",
      "API Reference",
      "Input",
      "Events",
      "Data Attributes",
      "Exports",
    ]);

    const response = await request.get("/docs/components/input.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Input");
    expect(markdown).toContain("## [Composition](#composition)");
    expect(markdown).toContain("### [Form States](#states)");
    expect(markdown).toContain("InputProps / InputEmits");
    expect(markdown).not.toContain("View Code");
    expect(markdown).not.toContain("On this page");
  });

  test("forwards native semantics and supports controlled values", async ({ page }) => {
    const preview = demo(page, "preview");
    const apiKey = preview.getByRole("textbox", { name: "API key" });
    await expect(apiKey).toHaveAttribute("data-slot", "input");
    await expect(apiKey).toHaveAttribute("data-size", "base");
    await expect(apiKey).toHaveAttribute("name", "api-key");
    await expect(apiKey).toHaveAttribute("autocomplete", "off");
    await expect(apiKey).toHaveAttribute("aria-describedby", "input-preview-help");
    await expect(apiKey).toHaveAccessibleDescription(
      "Your API key is encrypted before it is stored.",
    );
    await expect(apiKey).toHaveAttribute("data-1p-ignore", "true");
    await expect(apiKey).toHaveAttribute("data-bwignore", "true");
    await expect(apiKey).toHaveAttribute("data-form-type", "other");
    await expect(apiKey).toHaveAttribute("data-lpignore", "true");
    await expect(apiKey).toHaveClass(/keeper-ignore/);
    await expect(apiKey).toHaveCSS("border-color", "rgb(220, 220, 220)");
    await expect(apiKey).toHaveCSS("box-shadow", "none");
    await apiKey.hover();
    await expect(apiKey).toHaveCSS("border-color", "rgb(36, 122, 183)");
    await expect(apiKey).toHaveCSS("box-shadow", "none");
    await apiKey.click();
    await expect(apiKey).toHaveCSS("border-color", "rgb(36, 122, 183)");
    await expect(apiKey).toHaveCSS("box-shadow", "rgb(36, 122, 183) 0px 0px 5px 0px");
    await expect(apiKey).toBeFocused();

    const controlled = demo(page, "controlled");
    const caseName = controlled.getByRole("textbox", { name: "Case name" });
    await expect(caseName).toHaveValue("Rotor refinement");
    await caseName.fill("External aerodynamics");
    await expect(controlled.locator("output")).toContainText(
      "Current value: External aerodynamics",
    );
  });

  test("renders all densities and complete form states", async ({ page }) => {
    const sizeInputs = demo(page, "sizes").locator(".kappa-input");
    await expect(sizeInputs).toHaveCount(4);
    await expect(sizeInputs.first()).toHaveAttribute("data-slot", "input");
    const sizes = await sizeInputs.evaluateAll((elements) =>
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

    const states = demo(page, "states");
    const stateFields = states.locator(".input-demo__state-grid > .input-demo__field");
    await expect(stateFields).toHaveCount(3);
    const statePositions = await stateFields.evaluateAll((elements) =>
      elements.map((element) => {
        const box = element.getBoundingClientRect();
        return { x: Math.round(box.x), y: Math.round(box.y) };
      }),
    );
    expect(new Set(statePositions.map(({ x }) => x)).size).toBe(1);
    expect(statePositions[0]!.y).toBeLessThan(statePositions[1]!.y);
    expect(statePositions[1]!.y).toBeLessThan(statePositions[2]!.y);
    await expect(states.getByRole("textbox", { name: "Disabled" })).toBeDisabled();
    await expect(states.getByRole("textbox", { name: "Read only" })).toHaveAttribute(
      "readonly",
      "",
    );
    const invalid = states.getByRole("textbox", { name: "Invalid" });
    await expect(invalid).toHaveAttribute("aria-invalid", "true");
    await expect(invalid).toHaveAttribute("data-invalid", "");
    await expect(invalid).toHaveAccessibleDescription("Use letters and numbers only.");

    const nameFields = demo(page, "grid").locator(".input-demo__field");
    await expect(nameFields).toHaveCount(2);
    const namePositions = await nameFields.evaluateAll((elements) =>
      elements.map((element) => {
        const box = element.getBoundingClientRect();
        return { x: Math.round(box.x), y: Math.round(box.y) };
      }),
    );
    expect(namePositions[0]!.x).toBe(namePositions[1]!.x);
    expect(namePositions[0]!.y).toBeLessThan(namePositions[1]!.y);

    const file = demo(page, "file").locator('input[type="file"]');
    await expect(file).toHaveAttribute("accept", ".step,.stp,.iges,.igs");
    await expect(file).toHaveAccessibleName("Geometry file");
  });

  test("keeps native required validation and composed labels", async ({ page }) => {
    const required = demo(page, "required");
    const workspace = required.getByRole("textbox", { name: /Workspace name/ });
    await expect(workspace).toHaveAttribute("required", "");
    await required.getByRole("button", { name: "Create workspace" }).click();
    await expect(workspace).toBeFocused();
    await expect(required.getByRole("status")).toHaveCount(0);
    await workspace.fill("Aerodynamics");
    await required.getByRole("button", { name: "Create workspace" }).click();
    await expect(required.getByRole("status")).toHaveText("Created Aerodynamics.");

    const badge = demo(page, "badge");
    await expect(badge.getByRole("textbox", { name: "Webhook URL Beta" })).toHaveAttribute(
      "type",
      "url",
    );

    const rtl = demo(page, "rtl").locator('[dir="rtl"]');
    await expect(rtl).toHaveAttribute("dir", "rtl");
    await expect(rtl.getByRole("textbox", { name: "مفتاح API" })).toHaveAccessibleDescription(
      "يتم تشفير مفتاح API وتخزينه بأمان.",
    );
  });

  test("supports themes and mobile layout without runtime warnings", async ({ page }) => {
    const errors: string[] = [];
    const isDevToolbarRequest = (url: string) =>
      url.includes("/astro/runtime/client/dev-toolbar/");
    page.on("console", (message) => {
      const text = message.text();
      if (message.type() === "error" && !text.startsWith("Failed to load resource:")) {
        errors.push(text);
      }
      if (message.type() === "warning" && /\[Vue warn\]|hydration/i.test(text)) {
        errors.push(text);
      }
    });
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("response", (response) => {
      if (response.status() >= 400 && !isDevToolbarRequest(response.url())) {
        errors.push(`${response.status()} ${response.url()}`);
      }
    });
    page.on("requestfailed", (request) => {
      const errorText = request.failure()?.errorText ?? "request failed";
      if (errorText !== "net::ERR_ABORTED" && !isDevToolbarRequest(request.url())) {
        errors.push(`${errorText} ${request.url()}`);
      }
    });
    await page.reload();

    const input = demo(page, "preview").locator(".kappa-input");
    const lightBackground = await input.evaluate(
      (element) => getComputedStyle(element).backgroundColor,
    );
    await page.getByRole("button", { name: "Toggle theme" }).filter({ visible: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
    await expect
      .poll(() => input.evaluate((element) => getComputedStyle(element).backgroundColor))
      .not.toBe(lightBackground);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole("complementary", { name: "On this page" })).toBeHidden();
    await expect(demo(page, "preview").locator(".kappa-input")).toBeVisible();
    expect(errors).toEqual([]);
  });
});
