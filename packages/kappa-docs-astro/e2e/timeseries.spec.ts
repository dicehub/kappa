import { expect, test } from "@playwright/test";

test.describe("Timeseries documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/charts/timeseries");
  });

  test("renders the ECharts composition and complete public examples", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Timeseries" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(page.locator("#examples .docs-component-example")).toHaveCount(5);
    await expect(page.locator('[data-timeseries-demo="preview"] canvas')).toBeVisible();
    await expect(page.locator('[data-timeseries-demo="bars"] canvas')).toBeVisible();
    await expect(page.getByText("Updated 2 minutes ago · UTC", { exact: true })).toBeVisible();

    const response = await request.get("/docs/charts/timeseries.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# Timeseries");
    expect(markdown).toContain("@dicehub/kappa/components/timeseries-chart");
  });

  test("keeps states explicit and accessible", async ({ page }) => {
    const preview = page.locator('[data-timeseries-demo="preview"]');
    await expect(preview.getByRole("img", { name: "Compute and storage utilization" })).toBeVisible();

    const states = page.locator('[data-timeseries-demo="states"]');
    await expect(states.getByRole("status").filter({ hasText: "Loading timeseries" })).toBeVisible();
    await expect(states.getByRole("status").filter({ hasText: "No samples in this range" })).toBeVisible();
    await expect(states.getByRole("alert")).toHaveText("The data query failed.");
  });
});
