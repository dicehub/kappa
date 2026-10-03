import { expect, type Locator, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) =>
  page.locator(`[data-steps-demo="${variant}"]`);

const box = async (locator: Locator) => {
  const value = await locator.boundingBox();
  if (!value) throw new Error("Expected a visible element");
  return value;
};

test.describe("Steps documentation", () => {
  test("renders the public documentation and metadata", async ({ page, request }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });

    await page.goto("/docs/components/steps");

    await expect(page.getByRole("heading", { level: 1, name: "Steps" })).toBeVisible();
    await expect(page.locator("#examples .docs-component-example")).toHaveCount(4);
    await expect(page.locator('[data-composition-tree="steps"]')).toContainText("Steps.Indicator");
    await expect(page.getByRole("link", { name: "View Ark UI documentation" })).toHaveAttribute(
      "href",
      "https://ark-ui.com/docs/components/steps",
    );
    await expect(page.locator("#correspondence tbody tr")).toHaveCount(3);

    const response = await request.get("/docs/components/steps.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Steps");
    expect(markdown).toContain("## [Accessibility](#accessibility)");
    expect(markdown).toContain("Steps.Root");
    expect(errors).toEqual([]);
  });

  test("moves through the basic process, completes it, and resets", async ({ page }) => {
    await page.goto("/docs/components/steps");
    const basic = demo(page, "basic");
    const progress = basic.getByRole("progressbar");

    await expect(basic.getByRole("tab", { name: /Configuration/ })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await expect(progress).toHaveAttribute("aria-valuenow", "0");
    expect(
      await progress.evaluate((element) => Number.parseFloat(getComputedStyle(element, "::after").width)),
    ).toBe(0);

    await basic.getByRole("button", { name: "Next" }).click();
    await expect(basic.getByRole("tab", { name: /Review/ })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await expect(progress).toHaveAttribute("aria-valuenow", "33.33333333333333");
    await expect.poll(() => progress.evaluate((element) => {
      const fill = Number.parseFloat(getComputedStyle(element, "::after").width);
      return fill / element.clientWidth;
    })).toBeCloseTo(1 / 3, 2);

    await basic.getByRole("button", { name: "Next" }).click();
    await basic.getByRole("button", { name: "Next" }).click();
    await expect(basic.getByText("Ready to run", { exact: true })).toBeVisible();
    await expect(progress).toHaveAttribute("aria-valuenow", "100");
    await expect.poll(() => progress.evaluate((element) => {
      const fill = Number.parseFloat(getComputedStyle(element, "::after").width);
      return fill / element.clientWidth;
    })).toBeCloseTo(1, 2);

    await basic.getByRole("button", { name: "Reset" }).click();
    await expect(basic.getByRole("tab", { name: /Configuration/ })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  test("keeps controlled state and as-child indicator behavior", async ({ page }) => {
    await page.goto("/docs/components/steps");
    const controlled = demo(page, "controlled");

    await expect(controlled.locator("[data-controlled-step]")).toContainText("Step: 1");
    await controlled.getByRole("button", { name: "Next" }).click();
    await expect(controlled.locator("[data-controlled-step]")).toContainText("Step: 2");
    await controlled.getByRole("button", { name: "Reset" }).click();
    await expect(controlled.locator("[data-controlled-step]")).toContainText("Step: 0");

    const customIndicator = demo(page, "composition").locator("[data-custom-indicator]");
    await expect(customIndicator).toHaveClass(/kappa-steps__indicator/);
    await expect(customIndicator).toHaveAttribute("data-slot", "steps-indicator");
    await expect(customIndicator).toHaveAttribute("aria-hidden", "true");
    await customIndicator.click();
    await expect(demo(page, "composition")).toHaveAttribute("data-indicator-clicks", "1");
  });

  test("avoids label overlap and aligns vertical connectors at both sizes", async ({ page }) => {
    await page.setViewportSize({ width: 420, height: 900 });
    await page.goto("/docs/components/steps");

    const basic = demo(page, "basic");
    await basic.evaluate((element) => element.style.inlineSize = "12rem");
    const list = basic.getByRole("tablist");
    expect(await list.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
    const triggers = list.locator(".kappa-steps__trigger");
    const first = await box(triggers.nth(0));
    const second = await box(triggers.nth(1));
    expect(first.x + first.width).toBeLessThan(second.x);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);

    const sizes = demo(page, "sizes").locator(".kappa-steps__indicator");
    expect(Math.round((await box(sizes.first())).width)).toBe(24);
    expect(Math.round((await box(sizes.nth(3))).width)).toBe(20);

    const vertical = demo(page, "vertical");
    const marker = await box(vertical.locator(".kappa-steps__indicator").first());
    const separator = await box(vertical.locator(".kappa-steps__separator").first());
    expect(Math.abs(marker.x + marker.width / 2 - (separator.x + separator.width / 2))).toBeLessThan(1);
  });

  test("keeps focus visible and honors reduced motion and forced colors", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/docs/components/steps");
    const basic = demo(page, "basic");
    const next = basic.getByRole("button", { name: "Next" });

    await next.focus();
    await expect(next).toBeFocused();
    const focus = await next.evaluate((element) => {
      const style = getComputedStyle(element);
      return { style: style.outlineStyle, width: Number.parseFloat(style.outlineWidth) };
    });
    expect(focus.style).not.toBe("none");
    expect(focus.width).toBeGreaterThanOrEqual(2);
    expect(
      await basic.locator(".kappa-steps__indicator").first().evaluate((element) =>
        Number.parseFloat(getComputedStyle(element).transitionDuration),
      ),
    ).toBeLessThanOrEqual(0.001);

    await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
    await basic.getByRole("button", { name: "Next" }).click();
    const completeIndicator = basic.locator(".kappa-steps__indicator[data-complete]").first();
    await expect(completeIndicator).toBeVisible();
    expect(
      await basic.getByRole("progressbar").evaluate((element) =>
        getComputedStyle(element, "::after").forcedColorAdjust,
      ),
    ).toBe("none");
  });
});
