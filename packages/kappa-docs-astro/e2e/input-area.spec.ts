import { expect, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) =>
  page.locator(`[data-input-area-demo="${variant}"]`);

test.describe("Input Area documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/input-area");
  });

  test("renders examples, navigation, TOC, composition, and Markdown", async ({
    page,
    request,
  }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Input Area" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(demo(page, "preview").locator(".kappa-input-area")).toHaveCount(1);
    await expect(page.getByRole("link", { name: "View Ark UI documentation" })).toHaveAttribute(
      "href",
      "https://ark-ui.com/docs/components/field",
    );

    const exampleFrames = page.locator(".docs-component-example");
    await expect(exampleFrames).toHaveCount(10);
    await expect(exampleFrames.first()).toHaveCSS("border-top-width", "1px");
    await expect(page.locator("#usage .docs-component-preview")).not.toHaveCSS(
      "padding-top",
      "0px",
    );
    await expect(page.locator('.docs-code-full pre[data-language="vue"]')).toHaveCount(10);
    await expect(page.locator('.docs-code-full pre[data-language="javascript"]')).toHaveCount(2);
    await expect(page.locator(".docs-code-full pre[data-language]").first()).toContainText(
      'from "@dicehub/kappa/components/input-area"',
    );
    await expect(page.getByRole("button", { name: "View Code" })).toHaveCount(10);

    const composition = page.locator(
      '#composition [data-composition-tree="inputArea"]',
    );
    await expect(composition).toContainText("InputArea <textarea>");
    await expect(composition).toContainText("Ark UI autoresize");

    const sidebar = page
      .locator("#desktop-navigation")
      .getByRole("link", { name: "Input Area", exact: true });
    const compact = page.getByRole("navigation", {
      name: "Adjacent documentation pages",
    });
    const footer = page.getByRole("navigation", { name: "Documentation pagination" });
    await expect(sidebar).toHaveAttribute("aria-current", "page");
    await expect(compact.getByRole("link", { name: "Previous page: Input" })).toHaveAttribute(
      "href",
      "/docs/components/input",
    );
    await expect(
      compact.getByRole("link", { name: "Next page: Input Group" }),
    ).toHaveAttribute("href", "/docs/components/input-group");
    await expect(footer.getByRole("link", { name: "Input", exact: true })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Input Group", exact: true })).toBeVisible();

    const toc = page.getByRole("complementary", { name: "On this page" });
    await expect(toc.getByRole("link")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Composition",
      "Examples",
      "Field Composition",
      "Sizes",
      "Controlled Value",
      "Auto Resize",
      "Form States",
      "Character Limit",
      "With Button",
      "Right to Left",
      "Accessibility",
      "API Reference",
      "InputArea",
      "Events",
      "Data Attributes",
      "Exports",
    ]);

    const response = await request.get("/docs/components/input-area.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Input Area");
    expect(markdown).toContain("## [Composition](#composition)");
    expect(markdown).toContain("### [Auto Resize](#autoresize)");
    expect(markdown).toContain("InputAreaProps / InputAreaEmits / InputAreaSlots");
    expect(markdown).not.toContain("View Code");
    expect(markdown).not.toContain("On this page");
  });

  test("forwards native semantics, v-model, and Field context", async ({ page }) => {
    const preview = demo(page, "preview");
    const description = preview.getByRole("textbox", { name: "Project description" });
    await expect(description).toHaveAttribute("data-slot", "input-area");
    await expect(description).toHaveAttribute("data-size", "base");
    await expect(description).toHaveAttribute("name", "description");
    await expect(description).toHaveAttribute("rows", "4");
    await expect(description).toHaveAttribute(
      "aria-describedby",
      "input-area-preview-help",
    );
    await expect(description).toHaveAccessibleDescription(
      "Keep the summary concise and actionable.",
    );
    await preview.getByText("Project description", { exact: true }).click();
    await expect(description).toBeFocused();
    await description.fill("A compact technical summary.");
    await expect(description).toHaveValue("A compact technical summary.");

    const field = demo(page, "field");
    const fieldControl = field.getByRole("textbox", { name: /Simulation notes/ });
    await expect(fieldControl).toHaveAttribute("required", "");
    await expect(fieldControl).toHaveAttribute("name", "simulation-notes");
    await expect(fieldControl).toHaveAccessibleDescription(
      "Record assumptions that affect the result.",
    );
    await expect(fieldControl).toHaveAttribute("data-scope", "field");
    await expect(fieldControl).toHaveAttribute("data-part", "textarea");

    const controlled = demo(page, "controlled");
    const reviewNotes = controlled.getByRole("textbox", { name: "Review notes" });
    await expect(reviewNotes).toHaveValue("Review the boundary conditions.");
    await reviewNotes.fill("Approve the boundary conditions.");
    await expect(controlled.locator("output")).toHaveText("32 characters");
  });

  test("renders all densities and complete form states", async ({ page }) => {
    const sizeControls = demo(page, "sizes").locator(".kappa-input-area");
    await expect(sizeControls).toHaveCount(4);
    const sizes = await sizeControls.evaluateAll((elements) =>
      elements.map((element) => ({
        height: Math.round(element.getBoundingClientRect().height),
        size: element.getAttribute("data-size"),
      })),
    );
    expect(sizes).toEqual([
      { height: 56, size: "xs" },
      { height: 64, size: "sm" },
      { height: 80, size: "base" },
      { height: 96, size: "lg" },
    ]);

    const states = demo(page, "states");
    const stateFields = states.locator(".input-area-demo__states > .input-area-demo__field");
    await expect(stateFields).toHaveCount(3);
    const positions = await stateFields.evaluateAll((elements) =>
      elements.map((element) => {
        const box = element.getBoundingClientRect();
        return { x: Math.round(box.x), y: Math.round(box.y) };
      }),
    );
    expect(new Set(positions.map(({ x }) => x)).size).toBe(1);
    expect(positions[0]!.y).toBeLessThan(positions[1]!.y);
    expect(positions[1]!.y).toBeLessThan(positions[2]!.y);
    await expect(states.getByRole("textbox", { name: "Disabled" })).toBeDisabled();
    await expect(states.getByRole("textbox", { name: "Read only" })).toHaveAttribute(
      "readonly",
      "",
    );
    const invalid = states.getByRole("textbox", { name: "Invalid" });
    await expect(invalid).toHaveAttribute("aria-invalid", "true");
    await expect(invalid).toHaveAttribute("data-invalid", "");
    await expect(invalid).toHaveAccessibleDescription("Add at least 20 characters.");
  });

  test("autoresizes and preserves native length and validation behavior", async ({ page }) => {
    const autoresize = demo(page, "autoresize").getByRole("textbox", {
      name: "Solver log",
    });
    await expect(autoresize).toHaveAttribute("data-autoresize", "");
    await expect(autoresize).toHaveAttribute("rows", "2");
    await expect(autoresize).toHaveCSS("resize", "none");
    const initialHeight = await autoresize.evaluate((element) =>
      Math.round(element.getBoundingClientRect().height),
    );
    await autoresize.fill(
      Array.from({ length: 9 }, (_, index) => `Iteration ${index + 1}`).join("\n"),
    );
    await expect
      .poll(() =>
        autoresize.evaluate((element) =>
          Math.round(element.getBoundingClientRect().height),
        ),
      )
      .toBeGreaterThan(initialHeight);

    const limit = demo(page, "limit");
    const summary = limit.getByRole("textbox", { name: "Release summary" });
    await expect(summary).toHaveAttribute("maxlength", "180");
    await summary.fill("Ready");
    await expect(limit.locator("output")).toHaveText("175 remaining");

    const action = demo(page, "action");
    const feedback = action.getByRole("textbox", { name: "Feedback" });
    await expect(feedback).toHaveAttribute("required", "");
    await action.getByRole("button", { name: "Send feedback" }).click();
    await expect(feedback).toBeFocused();
    await expect(action.getByRole("status")).toHaveCount(0);
    await feedback.fill("The new control works well.");
    await action.getByRole("button", { name: "Send feedback" }).click();
    await expect(action.getByRole("status")).toHaveText("Feedback sent.");
  });

  test("supports themes, RTL, and mobile layout without runtime warnings", async ({ page }) => {
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

    const inputArea = demo(page, "preview").locator(".kappa-input-area");
    const lightBackground = await inputArea.evaluate(
      (element) => getComputedStyle(element).backgroundColor,
    );
    await page.getByRole("button", { name: "Toggle theme" }).filter({ visible: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
    await expect
      .poll(() =>
        inputArea.evaluate((element) => getComputedStyle(element).backgroundColor),
      )
      .not.toBe(lightBackground);

    const rtl = demo(page, "rtl").locator('[dir="rtl"]');
    await expect(rtl).toHaveAttribute("dir", "rtl");
    await expect(rtl.getByRole("textbox", { name: "ملاحظات" })).toHaveAccessibleDescription(
      "أضف التفاصيل المهمة للمراجعة.",
    );

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await expect(page.getByRole("complementary", { name: "On this page" })).toBeHidden();
    await expect(demo(page, "preview").locator(".kappa-input-area")).toBeVisible();
    expect(errors).toEqual([]);
  });
});
