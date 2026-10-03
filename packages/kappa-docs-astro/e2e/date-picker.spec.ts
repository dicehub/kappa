import { expect, type Locator, type Page, test } from "@playwright/test";

const addDays = (value: string, offsetDays: number) => {
  const date = new Date(`${value}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + offsetDays);
  return date.toISOString().slice(0, 10);
};

const demo = (page: Page, variant: string) =>
  page.locator(`[data-date-picker-demo="${variant}"]`);

const openPopover = async (container: Locator) => {
  await container.locator('[data-slot="date-picker-trigger"]').click();
  return container.page().locator('[data-slot="date-picker-content"][data-state="open"]');
};

const day = (popover: Locator, value: string) =>
  popover.locator(`[data-slot="date-picker-cell-trigger"][data-value="${value}"]`);
const primaryDay = (container: Locator, value: string) =>
  container.locator(
    `[data-slot="date-picker-cell-trigger"][data-value="${value}"]:not([data-outside-range])`,
  );
test.describe("Date Picker documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/date-picker");
    await expect(page.locator("astro-island[ssr]:has([data-date-picker-demo])")).toHaveCount(0);
  });

  test("renders public examples, navigation, TOC, and Markdown", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Date Picker" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(demo(page, "preview").locator(".kappa-date-picker")).toHaveCount(1);
    await expect(demo(page, "inline").locator(".kappa-date-picker__calendar")).toHaveCount(1);

    const primitive = page.getByRole("link", { name: "View Ark UI documentation" });
    await expect(primitive).toHaveAttribute("href", "https://ark-ui.com/docs/components/date-picker");
    await expect(primitive).toHaveAttribute("target", "_blank");

    const snippets = page.locator("pre[data-language]");
    await expect(snippets.first()).toContainText('from "@dicehub/kappa/components/date-picker"');
    await expect(snippets.filter({ hasText: "../../../kappa/src" })).toHaveCount(0);
    await expect(page.locator('pre[data-language="typescript"]')).toHaveCount(0);
    await expect(page.locator('pre[data-language="javascript"]')).toHaveCount(2);

    const sidebar = page
      .locator("#desktop-navigation")
      .getByRole("link", { name: "Date Picker", exact: true });
    const compact = page.getByRole("navigation", { name: "Adjacent documentation pages" });
    const footer = page.getByRole("navigation", { name: "Documentation pagination" });
    await expect(sidebar).toHaveAttribute("aria-current", "page");
    await expect(
      compact.getByRole("link", { name: "Previous page: Data Grid" }),
    ).toHaveAttribute("href", "/docs/components/data-grid");
    await expect(compact.getByRole("link", { name: "Next page: Dialog" })).toHaveAttribute(
      "href",
      "/docs/components/dialog",
    );
    await expect(footer.getByRole("link", { name: "Data Grid", exact: true })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Dialog", exact: true })).toBeVisible();

    const toc = page.getByRole("complementary", { name: "On this page" });
    await expect(toc.getByRole("link")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Composition",
      "Examples",
      "Inline",
      "Date Range",
      "Range Constraints",
      "Presets",
      "Month and Year Selects",
      "Min, Max, and Unavailable",
      "Week Numbers",
      "Locale",
      "States",
      "Accessibility",
      "API Reference",
      "DatePicker.Root",
      "Parts",
      "Events",
      "Exports",
    ]);

    const response = await request.get("/docs/components/date-picker.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Date Picker");
    expect(markdown).toContain("## [Accessibility](#accessibility)");
    expect(markdown).toContain("DatePicker.Root");
    expect(markdown).not.toContain("View Code");
    expect(markdown).not.toContain("On this page");
  });

  test("opens the popover above docs overlays and selects a day", async ({ page }) => {
    const container = demo(page, "preview");
    const popover = await openPopover(container);

    const positionerZ = await page
      .locator('.kappa-date-picker__positioner:has([data-state="open"])')
      .evaluate((element) => Number.parseInt(getComputedStyle(element).zIndex, 10));
    expect(positionerZ).toBeGreaterThan(10);

    await expect(popover.locator('[data-slot="date-picker-cell-trigger"][data-today]')).toHaveCount(
      1,
    );
    await expect(
      popover.locator('[data-slot="date-picker-cell-trigger"][data-selected]'),
    ).toHaveCount(1);

    const target = popover
      .locator(
        '[data-slot="date-picker-cell-trigger"]:not([data-today]):not([data-disabled]):not([data-outside-range])',
      )
      .first();
    const targetValue = await target.getAttribute("data-value");
    expect(targetValue).not.toBeNull();
    await target.click();
    await expect(popover).toHaveCount(0);

    const input = container.locator('[data-slot="date-picker-input"]');
    await expect(input).not.toHaveValue("");
    await expect(container.locator(".date-picker-demo__hint")).toContainText(targetValue!);
  });

  test("moves the focused date with arrow keys", async ({ page }) => {
    const container = demo(page, "preview");
    const popover = await openPopover(container);

    const focusedCell = popover.locator('[data-slot="date-picker-cell-trigger"][data-focus]');
    await expect(focusedCell).toHaveCount(1);
    const focusedValue = await focusedCell.getAttribute("data-value");
    expect(focusedValue).not.toBeNull();
    await focusedCell.focus();
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    await expect(focusedCell).toHaveAttribute("data-value", addDays(focusedValue!, 2));
  });

  test("selects a range across two months", async ({ page }) => {
    const container = demo(page, "range");
    const popover = await openPopover(container);

    await expect(popover.locator('[data-slot="date-picker-table"]')).toHaveCount(2);
    await expect(popover.locator(".kappa-date-picker__month-title").first()).toBeVisible();

    const readout = container.locator(".date-picker-demo__readout");
    await expect(readout).toContainText("→");

    const firstMonth = popover.locator('[data-slot="date-picker-table"]').first();
    const secondMonth = popover.locator('[data-slot="date-picker-table"]').nth(1);
    const start = firstMonth
      .locator('[data-slot="date-picker-cell-trigger"]:not([data-outside-range])')
      .last();
    const end = secondMonth
      .locator('[data-slot="date-picker-cell-trigger"]:not([data-outside-range])')
      .first();
    const startValue = await start.getAttribute("data-value");
    const endValue = await end.getAttribute("data-value");
    expect(startValue).not.toBeNull();
    expect(endValue).not.toBeNull();

    await start.click();
    await end.click();
    await expect(readout).toContainText(`${startValue} → ${endValue}`);
  });

  test("enforces range day limits while a start is pending", async ({ page }) => {
    const container = demo(page, "range-constraints");
    const primaryValues = await container
      .locator('[data-slot="date-picker-cell-trigger"]:not([data-outside-range])')
      .evaluateAll((cells) => cells.flatMap((cell) => cell.getAttribute("data-value") ?? []));
    const candidateValues = await container
      .locator(
        '[data-slot="date-picker-cell-trigger"]:not([data-outside-range]):not([data-selected]):not([data-in-range])',
      )
      .evaluateAll((cells) => cells.flatMap((cell) => cell.getAttribute("data-value") ?? []));
    const startValue = candidateValues.find((value) =>
      primaryValues.includes(addDays(value, 7)),
    );
    expect(startValue).toBeDefined();

    await primaryDay(container, startValue!).click();
    await expect(primaryDay(container, addDays(startValue!, 1))).toHaveAttribute(
      "data-unavailable",
      "",
    );
    await expect(primaryDay(container, addDays(startValue!, 7))).toHaveAttribute(
      "data-unavailable",
      "",
    );
    await expect(primaryDay(container, addDays(startValue!, 4))).not.toHaveAttribute(
      "data-unavailable",
    );

    await primaryDay(container, addDays(startValue!, 4)).click();
    await expect(primaryDay(container, addDays(startValue!, 4))).toHaveAttribute(
      "data-range-end",
      "",
    );
  });

  test("applies presets and shows week numbers", async ({ page }) => {
    const container = demo(page, "presets");
    const popover = await openPopover(container);
    const selectedValue = await popover
      .locator('[data-slot="date-picker-cell-trigger"][data-selected]')
      .getAttribute("data-value");
    expect(selectedValue).not.toBeNull();
    const inAWeek = addDays(selectedValue!, 7);

    const preset = popover.locator(".kappa-date-picker__preset-trigger", { hasText: "In a week" });
    await expect(preset).toHaveAttribute(
      "aria-label",
      new RegExp(`^select .+ ${inAWeek.slice(0, 4)}$`),
    );
    await preset.click();
    await expect(container.locator(".date-picker-demo__hint")).toContainText(inAWeek);

    const weekNumbers = demo(page, "week-numbers");
    await weekNumbers.scrollIntoViewIfNeeded();
    const cells = weekNumbers.locator('[data-slot="date-picker-week-number-cell"]');
    const values = (await cells.allTextContents()).map((value) => Number.parseInt(value, 10));
    expect(values.length).toBeGreaterThanOrEqual(4);
    expect(values.length).toBeLessThanOrEqual(6);
    expect(values).toEqual([...values].sort((a, b) => a - b));
  });

  test("enforces min, max, and unavailable days", async ({ page }) => {
    const container = demo(page, "min-max");
    const popover = await openPopover(container);
    await expect(
      popover.locator(
        '[data-slot="date-picker-cell-trigger"]:not([data-outside-range])[data-disabled]',
      ),
    ).not.toHaveCount(0);
    await expect(
      popover.locator(
        '[data-slot="date-picker-cell-trigger"]:not([data-outside-range])[data-unavailable]',
      ),
    ).not.toHaveCount(0);
    const availableDate = popover
      .locator(
        '[data-slot="date-picker-cell-trigger"]:not([data-outside-range]):not([data-disabled]):not([data-unavailable])',
      )
      .first();
    await expect(availableDate).toBeVisible();
    const availableValue = await availableDate.getAttribute("data-value");
    expect(availableValue).not.toBeNull();

    const monthsInRange = await page.evaluate(() => {
      const now = new Date();
      const max = new Date(now);
      max.setDate(now.getDate() + 30);
      return {
        next: new Date(now.getFullYear(), now.getMonth() + 1, 1) <= max,
        following: new Date(now.getFullYear(), now.getMonth() + 2, 1) <= max,
      };
    });
    const next = popover.locator('[data-slot="date-picker-next-trigger"]');
    const previous = popover.locator('[data-slot="date-picker-prev-trigger"]');
    await expect(previous).toBeDisabled();
    if (monthsInRange.next) {
      await expect(next).toBeEnabled();
      await next.click();
      if (monthsInRange.following) await expect(next).toBeEnabled();
      else await expect(next).toBeDisabled();
      await expect(
        popover.locator(
          '[data-slot="date-picker-cell-trigger"]:not([data-outside-range])[data-disabled]',
        ),
      ).not.toHaveCount(0);
      await previous.click();
    } else {
      await expect(next).toBeDisabled();
    }
    await day(popover, availableValue!).click();
    await expect(container.locator('[data-slot="date-picker-input"]')).not.toHaveValue("");
  });

  test("localizes month, weekday, and input formatting", async ({ page }) => {
    const container = demo(page, "locale");
    const popover = await openPopover(container);

    const headers = popover.locator('[data-slot="date-picker-table-header"]');
    await expect(headers).toHaveCount(7);

    await popover
      .locator(
        '[data-slot="date-picker-cell-trigger"]:not([data-outside-range]):not([data-disabled]):not([data-selected])',
      )
      .first()
      .click();
    const inputValue = await container.locator('[data-slot="date-picker-input"]').inputValue();
    expect(inputValue).toMatch(/^\d{1,2}\.\d{1,2}\.\d{4}$/);
  });

  test("exposes disabled and invalid states", async ({ page }) => {
    const states = demo(page, "states");
    const disabledInput = states.locator('[data-slot="date-picker-input"]').first();
    const invalidInput = states.locator('[data-slot="date-picker-input"]').nth(1);

    await expect(disabledInput).toBeDisabled();
    await expect(invalidInput).toHaveAttribute("data-invalid", "");
    await expect(invalidInput).toHaveAttribute("aria-invalid", "true");
    await expect(states.locator("#milestone-error")).toBeVisible();

    const borderColor = await states
      .locator('[data-slot="date-picker-control"]')
      .nth(1)
      .evaluate((element) => getComputedStyle(element).borderColor);
    const referenceBorder = await states
      .locator('[data-slot="date-picker-control"]')
      .first()
      .evaluate((element) => getComputedStyle(element).borderColor);
    expect(borderColor).not.toBe(referenceBorder);
  });

  test("keeps the popover in view on mobile and honors reduced motion", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/docs/components/date-picker");

    const container = demo(page, "preview");
    const popover = await openPopover(container);
    const box = await popover.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(390);

    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect
      .poll(() =>
        popover
          .locator('[data-slot="date-picker-cell-trigger"]')
          .first()
          .evaluate((element) => getComputedStyle(element).transitionDuration),
      )
      .toMatch(/^(?:0s|0\.00001s|1e-05s)$/);

    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole("complementary", { name: "On this page" })).toBeHidden();
  });
});
