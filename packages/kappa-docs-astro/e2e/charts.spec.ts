import { expect, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) =>
  page.locator(`[data-charts-demo="${variant}"]`);

test.describe("Charts documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/charts");
  });

  test("renders both isolated engines and the documented public API", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Charts" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(page.locator("#examples .docs-component-example")).toHaveCount(6);

    await expect(demo(page, "preview").locator('[data-slot="chart-plot"] canvas')).toHaveCount(1);
    await expect(demo(page, "dense").locator('[data-slot="xy-plot-plot"] .uplot')).toBeVisible();
    await expect(demo(page, "dense").getByText("200,000 values", { exact: false })).toBeVisible();

    const densePlot = demo(page, "dense").getByRole("img", {
      name: "Dense transient solver signal plot",
    });
    await expect(densePlot).toHaveAttribute("aria-keyshortcuts", "+ - 0 Home");
    await expect(demo(page, "dense").getByRole("button", { name: "Reset plot view" })).toBeVisible();

    const response = await request.get("/docs/charts.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Charts");
    expect(markdown).toContain("@dicehub/kappa/components/chart");
    expect(markdown).toContain("@dicehub/kappa/components/xy-plot");
    expect(markdown).not.toContain("View Code");
  });

  test("batches a bounded live stream and keeps chart states explicit", async ({ page }) => {
    const streaming = demo(page, "streaming");
    await expect(streaming.locator(".uplot")).toBeVisible();
    await expect(streaming.getByText("180 samples received", { exact: false })).toBeVisible();
    await streaming.getByRole("button", { name: "Start stream" }).click();
    await expect(streaming.getByRole("button", { name: "Pause" })).toBeVisible();
    await expect(streaming.getByText(/(?:19|2\d)0 samples received/)).toBeVisible();
    await streaming.getByRole("button", { name: "Pause" }).click();

    const states = demo(page, "states");
    await expect(states.locator('[role="status"]').filter({ hasText: "Loading chart" })).toBeVisible();
    await expect(states.locator('[role="status"]').filter({ hasText: "No data available" })).toBeVisible();
    await expect(states.getByRole("alert")).toHaveText("The data query failed.");
    await expect(states.locator("canvas")).toHaveCount(0);
  });

  test("fits chart frames within a narrow documentation viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const frame = demo(page, "dense").locator('[data-slot="xy-plot"]');
    await expect(frame).toBeVisible();
    const box = await frame.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(390);
  });
});
