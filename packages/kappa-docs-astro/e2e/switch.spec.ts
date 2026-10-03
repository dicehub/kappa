import { expect, type Locator, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) =>
  page.locator(`[data-switch-demo="${variant}"]`);

const control = (container: Locator, name: string) =>
  container
    .getByRole("checkbox", { name, exact: true })
    .locator("xpath=ancestor::*[@data-slot='switch'][1]")
    .locator('[data-slot="switch-control"]');

test.describe("Switch documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/switch");
    await expect(page.locator("astro-island[ssr]:has([data-switch-demo])")).toHaveCount(0);
  });

  test("renders examples, references, navigation, TOC, and Markdown", async ({
    page,
    request,
  }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Switch" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(demo(page, "preview").locator(".kappa-switch")).toHaveCount(1);
    await expect(page.locator('.docs-code-full pre[data-language="vue"]')).toHaveCount(11);
    await expect(page.locator('pre[data-language="javascript"]')).toHaveCount(2);
    await expect(
      page.locator('.docs-code-full pre[data-language="vue"]').filter({
        hasNotText: '@dicehub/kappa/components/switch',
      }),
    ).toHaveCount(0);

    await expect(page.getByRole("link", { name: "View Ark UI documentation" })).toHaveAttribute(
      "href",
      "https://ark-ui.com/docs/components/switch",
    );
    await expect(page.locator("#composition")).toContainText(
      "Kappa uses Ark parts and native fieldsets instead of a custom switch-group state layer.",
    );

    const sidebar = page
      .locator("#desktop-navigation")
      .getByRole("link", { name: "Switch", exact: true });
    const compact = page.getByRole("navigation", { name: "Adjacent documentation pages" });
    const footer = page.getByRole("navigation", { name: "Documentation pagination" });
    await expect(sidebar).toHaveAttribute("aria-current", "page");
    await expect(
      compact.getByRole("link", { name: "Previous page: Steps" }),
    ).toHaveAttribute("href", "/docs/components/steps");
    await expect(compact.getByRole("link", { name: "Next page: Table" })).toHaveAttribute(
      "href",
      "/docs/components/table",
    );
    await expect(footer.getByRole("link", { name: "Steps", exact: true })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Table", exact: true })).toBeVisible();

    const toc = page.getByRole("complementary", { name: "On this page" });
    await expect(toc.getByRole("link")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Composition",
      "Examples",
      "With Description",
      "Choice Card",
      "Controlled",
      "State from Context",
      "States",
      "Sizes",
      "Native Form",
      "Right to Left",
      "Accessibility",
      "Keyboard Support",
      "API Reference",
      "Root",
      "Parts",
      "Events",
      "Data Attributes",
      "Exports",
    ]);

    const composition = page.locator('#composition [data-composition-tree="switch"]');
    await expect(composition).toContainText("Switch.Root");
    await expect(composition).toContainText("HiddenInput (automatic)");

    const response = await request.get("/docs/components/switch.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Switch");
    expect(markdown).toContain("## [Keyboard Support](#keyboard-support)");
    expect(markdown).toContain("Switch.Root");
    expect(markdown).not.toContain("View Code");
    expect(markdown).not.toContain("On this page");
  });

  test("toggles by pointer and keyboard and exposes one native input", async ({ page }) => {
    const preview = demo(page, "preview");
    const input = preview.getByRole("checkbox", { name: "Airplane mode" });
    const root = preview.locator('[data-slot="switch"]');
    const previewControl = preview.locator('[data-slot="switch-control"]');
    const label = preview.locator('[data-slot="switch-label"]');

    await expect(root).toHaveJSProperty("tagName", "LABEL");
    await expect(root.locator('input[type="checkbox"]')).toHaveCount(1);
    await expect(input).not.toBeChecked();
    await expect(previewControl).toHaveAttribute("data-state", "unchecked");

    await previewControl.click();
    await expect(input).toBeChecked();
    await expect(previewControl).toHaveAttribute("data-state", "checked");

    await label.click();
    await expect(input).not.toBeChecked();

    await input.focus();
    await input.press("Space");
    await expect(input).toBeChecked();
  });

  test("supports sizes, context, disabled, read-only, and invalid state", async ({ page }) => {
    const sizes = demo(page, "sizes");
    const smallRoot = sizes
      .getByRole("checkbox", { name: "Small" })
      .locator("xpath=ancestor::*[@data-slot='switch'][1]");
    const baseRoot = sizes
      .getByRole("checkbox", { name: "Base" })
      .locator("xpath=ancestor::*[@data-slot='switch'][1]");
    const largeRoot = sizes
      .getByRole("checkbox", { name: "Large" })
      .locator("xpath=ancestor::*[@data-slot='switch'][1]");
    await expect(smallRoot).toHaveAttribute("data-size", "sm");
    await expect(baseRoot).toHaveAttribute("data-size", "base");
    await expect(largeRoot).toHaveAttribute("data-size", "lg");

    const smallBox = await control(sizes, "Small").boundingBox();
    const baseBox = await control(sizes, "Base").boundingBox();
    const largeBox = await control(sizes, "Large").boundingBox();
    expect(smallBox?.width ?? 0).toBeLessThan(baseBox?.width ?? 0);
    expect(baseBox?.width ?? 0).toBeLessThan(largeBox?.width ?? 0);

    const context = demo(page, "context");
    const contextInput = context.getByRole("checkbox", { name: /Wi-Fi/ });
    await expect(context.getByText("On", { exact: true })).toBeVisible();
    await control(context, "Wi-Fi On").click();
    await expect(contextInput).not.toBeChecked();
    await expect(context.getByText("Off", { exact: true })).toBeVisible();

    const states = demo(page, "states");
    const disabled = states.getByRole("checkbox", { name: "Disabled", exact: true });
    const disabledOn = states.getByRole("checkbox", { name: "Disabled and on" });
    const readOnly = states.getByRole("checkbox", { name: "Read-only" });
    const invalid = states.getByRole("checkbox", { name: "Accept the terms" });
    await expect(disabled).toBeDisabled();
    await expect(disabledOn).toBeDisabled();
    await expect(disabledOn).toBeChecked();
    await expect(readOnly).toBeChecked();
    await control(states, "Read-only").click();
    await expect(readOnly).toBeChecked();
    await expect(control(states, "Accept the terms")).toHaveAttribute("data-invalid", "");
    const error = states.getByText("You must accept the terms to continue.");
    await expect(error).toBeVisible();
    const errorId = await error.getAttribute("id");
    expect(errorId).toBeTruthy();
    await expect(invalid).toHaveAttribute("aria-errormessage", errorId ?? "");
  });

  test("synchronizes controlled state and submits native form values", async ({ page }) => {
    const controlled = demo(page, "controlled");
    const controlledInput = controlled.getByRole("checkbox", { name: "Focus mode" });
    const readout = controlled.getByRole("status");
    await expect(controlledInput).toBeChecked();
    await expect(readout).toContainText("on");
    await control(controlled, "Focus mode").click();
    await expect(controlledInput).not.toBeChecked();
    await expect(readout).toContainText("off");

    const form = demo(page, "form");
    const formInput = form.getByRole("checkbox", { name: "Product updates" });
    const formOutput = form.getByRole("status");
    await expect(formInput).toHaveAttribute("name", "product-updates");
    await expect(formInput).toHaveAttribute("value", "enabled");
    await form.getByRole("button", { name: "Save preferences" }).click();
    await expect(formOutput).toHaveText("Product updates enabled");
    await control(form, "Product updates").click();
    await form.getByRole("button", { name: "Save preferences" }).click();
    await expect(formOutput).toHaveText("Product updates disabled");
  });

  test("keeps the whole choice card operable", async ({ page }) => {
    const choice = demo(page, "choice-card");
    const root = choice.locator(".switch-demo__choice-card");
    const input = choice.getByRole("checkbox", { name: /Enable notifications/ });
    await expect(input).toBeChecked();
    const checkedBorder = await root.evaluate((element) => getComputedStyle(element).borderColor);
    await choice.getByText("Receive a message when important activity needs attention.").click();
    await expect(input).not.toBeChecked();
    await expect
      .poll(() => root.evaluate((element) => getComputedStyle(element).borderColor))
      .not.toBe(checkedBorder);
  });

  test("keeps focus, themes, RTL, reduced motion, and mobile layout intact", async ({ page }) => {
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
    const preview = demo(page, "preview");
    const input = preview.getByRole("checkbox", { name: "Airplane mode" });
    const previewControl = preview.locator('[data-slot="switch-control"]');
    const previewLabel = preview.locator('[data-slot="switch-label"]');
    await input.focus();
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");
    await expect(input).toBeFocused();
    await expect(previewControl).toHaveAttribute("data-focus-visible", "");
    await expect(previewControl).toHaveCSS("outline-style", "solid");
    await expect(previewControl).toHaveCSS("outline-width", "2px");

    const lightColor = await previewLabel.evaluate((element) => getComputedStyle(element).color);
    await page.getByRole("button", { name: "Toggle theme" }).filter({ visible: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
    await expect
      .poll(() => previewLabel.evaluate((element) => getComputedStyle(element).color))
      .not.toBe(lightColor);

    const rtl = demo(page, "rtl");
    const rtlControl = rtl.locator('[data-slot="switch-control"]');
    const rtlThumb = rtl.locator('[data-slot="switch-thumb"]');
    const [rtlControlBox, rtlThumbBox] = await Promise.all([
      rtlControl.boundingBox(),
      rtlThumb.boundingBox(),
    ]);
    expect(rtlThumbBox?.x ?? Infinity).toBeLessThan(
      (rtlControlBox?.x ?? 0) + (rtlControlBox?.width ?? 0) / 2,
    );

    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect
      .poll(() => rtlThumb.evaluate((element) => getComputedStyle(element).transitionDuration))
      .toMatch(/^(?:0s|0\.00001s|1e-05s)$/);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole("complementary", { name: "On this page" })).toBeHidden();
    await expect(demo(page, "choice-card").locator(".kappa-switch")).toBeVisible();
    expect(errors).toEqual([]);
  });
});
