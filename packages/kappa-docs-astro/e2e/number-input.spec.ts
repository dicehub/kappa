import { expect, type Locator, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) =>
  page.locator(`[data-number-input-demo="${variant}"]`);

const input = (scope: Locator, name: string) =>
  scope.getByRole("spinbutton", { name, exact: true });

const numericValue = async (field: Locator) =>
  Number.parseFloat((await field.inputValue()).replace(/[^\d,.-]/g, "").replace(",", "."));

test.describe("Number Input documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/number-input");
  });

  test("renders public examples, navigation, TOC, and Markdown", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Number Input" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(demo(page, "preview").locator('[data-slot="number-input"]')).toHaveCount(1);

    await expect(page.locator('.docs-code-full pre[data-language="vue"]')).toHaveCount(15);
    await expect(page.locator('.docs-code-full pre[data-language="javascript"]')).toHaveCount(2);
    await expect(page.locator('.docs-code-full pre[data-language="typescript"]')).toHaveCount(0);
    await expect(page.locator(".docs-code-full pre[data-language]").first()).toContainText(
      'from "@dicehub/kappa/components/number-input"',
    );
    await expect(page.locator('pre:has-text("../../../kappa/src")')).toHaveCount(0);
    await expect(page.getByRole("button", { name: "View Code" })).toHaveCount(15);

    const sidebar = page
      .locator("#desktop-navigation")
      .getByRole("link", { name: "Number Input", exact: true });
    const compact = page.getByRole("navigation", { name: "Adjacent documentation pages" });
    const footer = page.getByRole("navigation", { name: "Documentation pagination" });
    await expect(sidebar).toHaveAttribute("aria-current", "page");
    await expect(compact.getByRole("link", { name: "Previous page: Native Select" })).toHaveAttribute(
      "href",
      "/docs/components/native-select",
    );
    await expect(compact.getByRole("link", { name: "Next page: Pagination" })).toHaveAttribute(
      "href",
      "/docs/components/pagination",
    );
    await expect(footer.getByRole("link", { name: "Native Select", exact: true })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Pagination", exact: true })).toBeVisible();

    const toc = page.getByRole("complementary", { name: "On this page" });
    await expect(toc.getByRole("link")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Composition",
      "Examples",
      "Basic",
      "Scrubbable Input",
      "Compact Use",
      "Separate Scrubber Handle",
      "Min and Max",
      "Precision",
      "Units",
      "Controlled and Commit",
      "States",
      "Sizes",
      "Locale and Formatting",
      "Mouse Wheel",
      "Right-to-left",
      "Accessibility",
      "API Reference",
      "NumberInput.Root",
      "NumberInput.ScrubbableInput",
      "Parts",
      "Events",
      "Exports",
    ]);
    await expect(page.getByRole("link", { name: "Ark UI Number Input" })).toHaveAttribute(
      "href",
      "https://ark-ui.com/docs/components/number-input",
    );

    const response = await request.get("/docs/components/number-input.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Number Input");
    expect(markdown).toContain("### [Scrubbable Input](#scrubbable-input)");
    expect(markdown).toContain("### [Compact Use](#compact-use)");
    expect(markdown).toContain("scrubSensitivity");
    expect(markdown).toContain("### [Separate Scrubber Handle](#scrubbing)");
    expect(markdown).toContain("NumberInput.ScrubbableInput");
    expect(markdown).toContain("NumberInput.Unit");
    expect(markdown).toContain("valueCommit");
    expect(markdown).not.toContain("View Code");
    expect(markdown).not.toContain("On this page");
  });

  test("supports spinbutton keyboard steps, range limits, and direct entry", async ({ page }) => {
    const basic = input(demo(page, "basic"), "Solver processes");
    await expect(basic).toHaveAttribute("role", "spinbutton");
    await expect(basic).toHaveAttribute("aria-valuemin", "1");
    await expect(basic).toHaveAttribute("aria-valuemax", "64");
    await expect(basic).toHaveAttribute("aria-valuenow", "12");

    await basic.click();
    await expect(basic).toBeFocused();
    await basic.press("ArrowUp");
    await expect(basic).toHaveValue("13");
    await basic.press("Shift+ArrowUp");
    await expect(basic).toHaveValue("23");
    await basic.press("Alt+ArrowDown");
    await expect(basic).toHaveValue("22.9");
    await basic.press("Home");
    await expect(basic).toHaveValue("1");
    await basic.press("End");
    await expect(basic).toHaveValue("64");

    await basic.press("ControlOrMeta+A");
    await basic.fill("16");
    await basic.press("Enter");
    await expect(basic).toHaveValue("16");
    await expect(basic).toHaveAttribute("aria-valuenow", "16");
  });

  test("supports triggers, live controlled values, commit, and native form attributes", async ({ page }) => {
    const basicDemo = demo(page, "basic");
    const basic = input(basicDemo, "Solver processes");
    const decrement = basicDemo.getByRole("button", { name: "Decrease solver processes" });
    const increment = basicDemo.getByRole("button", { name: "Increase solver processes" });
    await expect(decrement).toHaveAttribute("type", "button");
    await expect(increment).toHaveAttribute("type", "button");
    await expect(decrement.locator("svg")).toHaveAttribute("aria-hidden", "true");
    await expect(increment.locator("svg")).toHaveAttribute("aria-hidden", "true");
    await increment.click();
    await expect(basic).toHaveValue("13");
    await decrement.click();
    await expect(basic).toHaveValue("12");

    const controlledDemo = demo(page, "controlled");
    const controlled = input(controlledDemo, "Write interval (s)");
    await controlled.click();
    await controlled.press("ControlOrMeta+A");
    await controlled.fill("0.01");
    await expect(controlledDemo.getByText(/Live:/)).toContainText("Live: 0.01");
    await expect(controlledDemo.getByText(/Committed:/)).toContainText("Committed: 0.005");
    await controlled.press("Enter");
    await expect(controlledDemo.getByText(/Committed:/)).toContainText("Committed: 0.01");

    const usage = input(demo(page, "usage"), "Inlet velocity (m/s)");
    await expect(usage).toHaveAttribute("name", "inlet-velocity");
    await expect(usage).toHaveAttribute("type", "text");
    await expect(usage).toHaveAttribute("inputmode", "decimal");
    await expect(usage).toHaveAttribute("aria-roledescription", "numberfield");
    await expect(demo(page, "usage").locator('[data-slot="number-input-unit"]')).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  test("scrubs in both directions and blocks read-only scrubbing", async ({ page }) => {
    const scrubDemo = demo(page, "scrubbing");
    const scrubInput = input(scrubDemo, "Under-relaxation factor");
    const scrubber = scrubDemo.locator('[data-slot="number-input-scrubber"]');
    await scrubber.scrollIntoViewIfNeeded();
    const box = await scrubber.boundingBox();
    expect(box).not.toBeNull();
    const initial = await numericValue(scrubInput);
    await page.evaluate(() => {
      const browserWindow = window as Window & { __pointerLockRequests?: number };
      browserWindow.__pointerLockRequests = 0;
      document.body.requestPointerLock = () => {
        browserWindow.__pointerLockRequests = (browserWindow.__pointerLockRequests ?? 0) + 1;
        return Promise.resolve();
      };
    });

    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
    await page.mouse.down();
    await expect(scrubber).toHaveAttribute("data-scrubbing", "");
    await expect
      .poll(() =>
        page.evaluate(
          () => (window as Window & { __pointerLockRequests?: number }).__pointerLockRequests,
        ),
      )
      .toBe(1);
    await page.mouse.move(box!.x + box!.width / 2 + 40, box!.y + box!.height / 2, {
      steps: 5,
    });
    await expect.poll(() => numericValue(scrubInput)).toBeGreaterThan(initial);
    await page.mouse.up();
    const increased = await numericValue(scrubInput);

    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
    await page.mouse.down();
    await page.mouse.move(box!.x + box!.width / 2 - 80, box!.y + box!.height / 2, {
      steps: 5,
    });
    await expect.poll(() => numericValue(scrubInput)).toBeLessThan(increased);
    await page.mouse.up();

    const states = demo(page, "states");
    const readOnly = input(states, "Read-only partitions");
    const readOnlyScrubber = states.locator('[data-slot="number-input-scrubber"]');
    await expect(readOnly).toHaveAttribute("readonly", "");
    await expect(readOnlyScrubber).toHaveAttribute("data-readonly", "");
    await expect(readOnlyScrubber).toHaveCSS("cursor", "default");
    await readOnlyScrubber.scrollIntoViewIfNeeded();
    const readOnlyBox = await readOnlyScrubber.boundingBox();
    expect(readOnlyBox).not.toBeNull();
    await page.mouse.move(readOnlyBox!.x + 4, readOnlyBox!.y + 4);
    await page.mouse.down();
    await page.mouse.move(readOnlyBox!.x + 60, readOnlyBox!.y + 4, { steps: 5 });
    await page.mouse.up();
    await expect(readOnly).toHaveValue("24");
  });

  test("preserves field states, locale, wheel opt-in, and RTL", async ({ page }) => {
    const states = demo(page, "states");
    await expect(input(states, "Disabled partitions")).toBeDisabled();
    const invalid = input(states, "Invalid load balance (%)");
    await expect(invalid).toHaveAttribute("aria-invalid", "true");
    await expect(invalid).toHaveAttribute("aria-describedby", "load-balance-error");

    const locale = input(demo(page, "locale"), "Volumenstrom (m³/s)");
    await expect(locale).toHaveValue(/1\.234,5/);

    const defaultWheel = input(demo(page, "basic"), "Solver processes");
    await defaultWheel.hover();
    await page.mouse.wheel(0, -100);
    await expect(defaultWheel).toHaveValue("12");

    const wheel = input(demo(page, "mouse-wheel"), "Mesh refinement (%)");
    await wheel.scrollIntoViewIfNeeded();
    const wheelBox = await wheel.boundingBox();
    expect(wheelBox).not.toBeNull();
    await page.mouse.move(
      wheelBox!.x + wheelBox!.width / 2,
      wheelBox!.y + wheelBox!.height / 2,
    );
    await page.mouse.wheel(0, -100);
    await expect(wheel).toHaveValue("55");
    await expect(wheel).not.toBeFocused();
    await wheel.click();
    await expect(wheel).toBeFocused();
    await page.mouse.wheel(0, -100);
    await expect(wheel).toHaveValue("60");

    const rtlDemo = demo(page, "rtl");
    const rtl = input(rtlDemo, "عدد عمليات الحل");
    await expect(rtl).toHaveCSS("direction", "rtl");
    await expect(rtl).toHaveAttribute("aria-valuenow", "24");
    const decrement = rtlDemo.getByRole("button", { name: "تقليل عدد العمليات" });
    const increment = rtlDemo.getByRole("button", { name: "زيادة عدد العمليات" });
    const [decrementBox, incrementBox] = await Promise.all([
      decrement.boundingBox(),
      increment.boundingBox(),
    ]);
    expect(decrementBox).not.toBeNull();
    expect(incrementBox).not.toBeNull();
    expect(decrementBox!.x).toBeGreaterThan(incrementBox!.x);

    const directionOnly = input(rtlDemo, "RTL layout, German number format");
    await expect(directionOnly).toHaveCSS("direction", "rtl");
    await expect(directionOnly).toHaveValue(/1\.234,5/);
  });

  test("keeps focus, sizes, themes, forced colors, reduced motion, and mobile width intact", async ({ page }) => {
    const preview = demo(page, "preview");
    const previewInput = input(preview, "Maximum Courant number");
    const control = preview.locator('[data-slot="number-input-control"]');
    await previewInput.focus();
    await expect(previewInput).toBeFocused();
    const focus = await control.evaluate((element) => {
      const styles = getComputedStyle(element);
      return { style: styles.outlineStyle, width: Number.parseFloat(styles.outlineWidth) };
    });
    expect(focus.style).not.toBe("none");
    expect(focus.width).toBeGreaterThanOrEqual(2);

    const sizeRoots = demo(page, "sizes").locator('[data-slot="number-input"]');
    await expect(sizeRoots).toHaveCount(4);
    for (const [index, size] of ["xs", "sm", "default", "lg"].entries()) {
      await expect(sizeRoots.nth(index)).toHaveAttribute("data-size", size);
    }
    const heights = await sizeRoots.locator('[data-slot="number-input-control"]').evaluateAll(
      (elements) => elements.map((element) => element.getBoundingClientRect().height),
    );
    expect(heights).toEqual([20, 28, 32, 36]);
    const xs = sizeRoots.first();
    await expect(xs.locator('[data-slot="number-input-control"]')).toHaveCSS("border-radius", "2px");
    await expect(xs.getByRole("spinbutton")).toHaveCSS("padding-inline-start", "3px");
    await expect(xs.getByRole("spinbutton")).toHaveCSS("height", "18px");
    await xs.locator('[data-slot="number-input-increment-trigger"]').click();
    await expect(xs.getByRole("spinbutton")).toHaveValue("33");

    const lightBackground = await control.evaluate((element) => getComputedStyle(element).backgroundColor);
    await page.getByRole("button", { name: "Toggle theme" }).filter({ visible: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
    await expect.poll(() => control.evaluate((element) => getComputedStyle(element).backgroundColor)).not.toBe(lightBackground);

    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect
      .poll(() =>
        control.evaluate((element) => Number.parseFloat(getComputedStyle(element).transitionDuration)),
      )
      .toBeLessThanOrEqual(0.00001);

    await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
    await expect.poll(() => control.evaluate((element) => getComputedStyle(element).borderStyle)).not.toBe("none");

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    await expect(demo(page, "preview")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole("complementary", { name: "On this page" })).toBeHidden();
  });
});
