import { expect, test } from "@playwright/test";

for (const theme of ["light", "dark"] as const) {
  test(`segmented tabs keep even nested borders in ${theme} mode`, async ({ page }) => {
    await page.goto("/docs/components/tabs");
    await page.evaluate((theme) => {
      document.documentElement.setAttribute("data-kappa-theme", theme);
    }, theme);

    const lists = page.locator('[data-tabs-demo="sizes"] [role="tablist"]');
    await expect(lists).toHaveCount(2);
    for (const list of await lists.all()) {
      const tabs = list.getByRole("tab");
      const indicator = list.locator('[data-part="indicator"]');
      for (const edge of ["first", "last"] as const) {
        const selected = edge === "first" ? tabs.first() : tabs.last();
        await selected.click();
        await expect(selected).toHaveAttribute("aria-selected", "true");
        await expect(indicator).toBeVisible();
        // Ark UI rounds its measured rectangle to CSS pixels.
        await expect.poll(async () => {
          const tabBox = (await selected.boundingBox())!;
          const indicatorBox = (await indicator.boundingBox())!;
          return Math.max(...(["x", "y", "width", "height"] as const)
            .map((key) => Math.abs(tabBox[key] - indicatorBox[key])));
        }).toBeLessThanOrEqual(1);

        const geometry = await list.evaluate((list, edge) => {
          const indicator = list.querySelector('[data-part="indicator"]')!;
          const rail = list.getBoundingClientRect();
          const surface = indicator.getBoundingClientRect();
          const railStyle = getComputedStyle(list);
          const surfaceStyle = getComputedStyle(indicator);
          return {
            top: surface.top - rail.top - parseFloat(railStyle.borderTopWidth),
            bottom: rail.bottom - surface.bottom - parseFloat(railStyle.borderBottomWidth),
            end: edge === "first"
              ? surface.left - rail.left - parseFloat(railStyle.borderLeftWidth)
              : rail.right - surface.right - parseFloat(railStyle.borderRightWidth),
            railRadius: parseFloat(railStyle.borderTopLeftRadius),
            surfaceRadius: parseFloat(surfaceStyle.borderTopLeftRadius),
            border: parseFloat(surfaceStyle.borderTopWidth),
            borderStyle: surfaceStyle.borderTopStyle,
            borderColor: surfaceStyle.borderTopColor,
            background: surfaceStyle.backgroundColor,
          };
        }, edge);
        expect(geometry.top).toBeGreaterThanOrEqual(2);
        expect(Math.abs(geometry.top - geometry.bottom)).toBeLessThanOrEqual(1);
        expect(Math.abs(geometry.top - geometry.end)).toBeLessThanOrEqual(1);
        expect(geometry.railRadius - geometry.surfaceRadius).toBeCloseTo(geometry.top + 1);
        expect(geometry.border).toBe(1);
        expect(geometry.borderStyle).toBe("solid");
        expect(geometry.borderColor).not.toBe(geometry.background);
      }
    }
  });
}

test("selected tab borders survive disabled shadows and forced colors", async ({ page }) => {
  await page.goto("/docs/components/tabs");
  const list = page.locator('[data-tabs-demo="sizes"] [role="tablist"]').first();
  const indicator = list.locator('[data-part="indicator"]');
  await expect(indicator).toBeVisible();
  await list.evaluate((element) => (element as HTMLElement).style.setProperty("--kappa-shadow", "none"));
  await expect(indicator).toHaveCSS("box-shadow", "none");
  await expect(indicator).toHaveCSS("border-top-width", "1px");
  await expect(indicator).toHaveCSS("border-top-style", "solid");

  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
  await list.getByRole("tab").first().focus();
  await page.keyboard.press("ArrowRight");
  const selected = list.getByRole("tab", { name: "Weekly", exact: true });
  await expect(selected).toBeFocused();
  await expect(selected).toHaveAttribute("aria-selected", "true");
  await expect(selected).toHaveCSS("outline-style", "solid");
  await expect(selected).toHaveCSS("outline-width", "2px");
  await expect(indicator).toHaveCSS("border-top-width", "1px");
  await expect(indicator).toHaveCSS("border-top-style", "solid");
  const colors = await indicator.evaluate((element) => {
    const style = getComputedStyle(element);
    return [style.borderTopColor, style.backgroundColor];
  });
  expect(colors[0]).not.toBe(colors[1]);

  const line = page.locator('[data-tabs-demo="variants"] [role="tablist"]').last();
  const underline = line.locator('[data-part="indicator"]');
  await expect(underline).toHaveCSS("border-top-width", "0px");
  await expect(underline).toHaveCSS("border-left-width", "0px");
  await expect(underline).toHaveCSS("border-right-width", "0px");
  await expect(underline).toHaveCSS("border-bottom-width", "2px");
});
