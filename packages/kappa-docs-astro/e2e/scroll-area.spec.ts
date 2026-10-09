import { expect, type Page, test } from "@playwright/test";
import { waitForDocsIsland } from "./helpers/docs-island";

const demo = (page: Page, variant: string) =>
  page.locator(`[data-scroll-area-demo="${variant}"]`);

test.describe("Scroll Area documentation", () => {
  test("renders vertical, horizontal, and two-axis overflow", async ({ page }) => {
    await page.goto("/docs/components/scroll-area");

    await expect(page.getByRole("heading", { level: 1, name: "Scroll Area" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(
      page.locator('.docs-page-header__title-row a[href$="/scroll-area"]'),
    ).toHaveCount(1);

    const verticalViewport = demo(page, "preview").getByRole("region", {
      name: "Recent activity",
    });
    await expect(verticalViewport).toBeVisible();
    expect(
      await verticalViewport.evaluate((element) => element.scrollHeight > element.clientHeight),
    ).toBe(true);

    const horizontalViewport = demo(page, "horizontal").getByRole("region", { name: "Cases" });
    expect(
      await horizontalViewport.evaluate((element) => element.scrollWidth > element.clientWidth),
    ).toBe(true);
    const horizontalScrollbar = demo(page, "horizontal").locator(
      '[data-slot="scroll-area-scrollbar"][data-orientation="horizontal"]',
    );
    const horizontalThumb = horizontalScrollbar.locator('[data-slot="scroll-area-thumb"]');
    await expect(horizontalScrollbar).toBeVisible();
    await horizontalScrollbar.scrollIntoViewIfNeeded();
    const scrollbarBox = await horizontalScrollbar.boundingBox();
    const thumbBox = await horizontalThumb.boundingBox();
    expect(scrollbarBox).toBeTruthy();
    expect(thumbBox).toBeTruthy();
    expect(thumbBox!.width).toBeLessThan(scrollbarBox!.width);
    await page.mouse.move(thumbBox!.x + thumbBox!.width / 2, thumbBox!.y + thumbBox!.height / 2);
    await page.mouse.down();
    await page.mouse.move(thumbBox!.x + thumbBox!.width / 2 + 120, thumbBox!.y + thumbBox!.height / 2);
    await page.mouse.up();
    await expect.poll(() => horizontalViewport.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);

    const matrixViewport = demo(page, "both").getByRole("region", {
      name: "Case comparison",
    });
    expect(
      await matrixViewport.evaluate(
        (element) =>
          element.scrollWidth > element.clientWidth &&
          element.scrollHeight > element.clientHeight,
      ),
    ).toBe(true);
    await expect(demo(page, "both").locator('[data-slot="scroll-area-scrollbar"]')).toHaveCount(2);
    await expect(demo(page, "both").locator('[data-slot="scroll-area-corner"]')).toBeVisible();
  });

  test("supports context controls and hides a scrollbar without overflow", async ({ page }) => {
    await page.goto("/docs/components/scroll-area");

    const controlled = demo(page, "controls");
    await waitForDocsIsland(controlled);
    const viewport = controlled.getByRole("region", { name: "Controlled event log" });
    await controlled.getByRole("button", { name: "Last" }).click();
    await expect.poll(() => viewport.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
    await expect(controlled.getByText("At end")).toBeVisible();

    await controlled.getByRole("button", { name: "First" }).click();
    await expect.poll(() => viewport.evaluate((element) => element.scrollTop)).toBe(0);
    await expect(controlled.getByText("At start")).toBeVisible();

    const short = demo(page, "no-overflow");
    const shortViewport = short.getByRole("region", { name: "Short content" });
    expect(
      await shortViewport.evaluate((element) => element.scrollHeight <= element.clientHeight),
    ).toBe(true);
    const shortScrollbar = short.locator('[data-slot="scroll-area-scrollbar"]');
    await expect(shortScrollbar).not.toHaveAttribute("data-overflow-y");
    await expect(shortScrollbar).toHaveCSS("opacity", "0");
  });

  test("keeps focus visible and uses logical direction", async ({ page }) => {
    await page.goto("/docs/components/scroll-area");

    const previewViewport = demo(page, "preview").getByRole("region", {
      name: "Recent activity",
    });
    await previewViewport.focus();
    await expect(previewViewport).toBeFocused();
    await expect(previewViewport).toHaveCSS("outline-style", "solid");

    const rtlRoot = demo(page, "rtl").locator('[data-slot="scroll-area"]');
    await expect(rtlRoot).toHaveAttribute("dir", "rtl");
    const rtlViewport = demo(page, "rtl").getByRole("region", {
      name: "Cases, right to left",
    });
    expect(
      await rtlViewport.evaluate((element) => element.scrollWidth > element.clientWidth),
    ).toBe(true);
  });
});
