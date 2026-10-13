import { test, expect, visitConsumer } from "./fixtures";

test("TimeseriesChart removes a series when its public series prop changes", async ({ page }) => {
  await visitConsumer(page, "/test-consumer/timeseries");
  const chart = page.getByRole("img", { name: "Updating series", exact: true });
  await expect(chart.locator("svg")).toBeVisible();
  await expect(chart.locator("svg text").filter({ hasText: /^A$/ })).toHaveCount(1);
  await expect(chart.locator("svg text").filter({ hasText: /^B$/ })).toHaveCount(1);
  await page.getByRole("button", { name: "Remove series B", exact: true }).click();
  await expect(chart.locator("svg text").filter({ hasText: /^B$/ })).toHaveCount(0);
  await expect(chart.locator("svg text").filter({ hasText: /^A$/ })).toHaveCount(1);
  await expect(page.getByRole("alert")).toHaveCount(0);
});

test("TimeseriesChart renders distinct second labels and years across year boundaries", async ({ page }) => {
  await visitConsumer(page, "/test-consumer/timeseries");
  const seconds = page.getByRole("img", { name: "Second-scale samples", exact: true });
  await expect.poll(async () => {
    const labels = await seconds.locator("svg text").allTextContents();
    return new Set(labels.filter(label => /^10:00:\d{2}$/.test(label))).size;
  }).toBeGreaterThan(1);

  const years = page.getByRole("img", { name: "Year-scale samples", exact: true });
  await expect(years.locator("svg text").filter({ hasText: /2025/ }).first()).toBeVisible();
  await expect(years.locator("svg text").filter({ hasText: /2026/ }).first()).toBeVisible();

  const boundary = page.getByRole("img", { name: "Year-boundary samples", exact: true });
  await expect(boundary.locator("svg text").filter({ hasText: /^30 Dec 2025$/ })).toBeVisible();
  await expect(boundary.locator("svg text").filter({ hasText: /^3 Jan 2026$/ })).toBeVisible();
  await expect(page.getByRole("alert")).toHaveCount(0);
});
