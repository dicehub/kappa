import { expect, test } from "@playwright/test";

test.describe("Maps documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/charts/maps");
  });

  test("renders the real page and interactive Kappa map controls", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Maps" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);

    const preview = page.locator('[data-slot="map-view"]').first();
    await expect(preview).toBeVisible();
    await expect(preview.locator('[data-slot="map-view-controls"]')).toBeVisible();
    await expect(preview.getByRole("button", { name: "Zoom in" })).toBeEnabled();
    await expect(preview.getByRole("button", { name: "Zoom out" })).toBeEnabled();
    await expect(preview.getByRole("button", { name: "Reset map view" })).toBeEnabled();
  });

  test("selects a marker and opens its safe text popup", async ({ page }) => {
    const preview = page.locator('[data-slot="map-view"]').first();
    const berlin = preview.getByRole("button", { name: "Berlin" });
    await expect(berlin).toBeVisible();
    await berlin.click();

    await expect(berlin).toHaveAttribute("aria-pressed", "true");
    await expect(
      preview.locator(".kappa-map-view__popup-content").getByText("Primary engineering office"),
    ).toBeVisible();
  });

  test("searches for an address and selects the result", async ({ page }) => {
    await page.route(/^https:\/\/photon\.komoot\.io\/api\/.*$/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        headers: { "access-control-allow-origin": "*" },
        body: JSON.stringify({
          features: [
            {
              geometry: { coordinates: [13.3777, 52.5163] },
              properties: {
                city: "Berlin",
                country: "Germany",
                name: "Brandenburg Gate",
                osm_id: 518071791,
                osm_type: "W",
                postcode: "10117",
                street: "Pariser Platz",
              },
            },
          ],
        }),
      });
    });
    await page.goto("/examples/maps/search");
    const input = page.getByRole("combobox", { name: "Find an address" });
    const searchMap = input.locator("xpath=ancestor::*[@data-slot='map-view']");
    await expect(searchMap.getByRole("button", { name: "Zoom in" })).toBeEnabled();
    const searchResponse = page.waitForResponse(/^https:\/\/photon\.komoot\.io\/api\/.*$/);
    await input.fill("Brandenburger Tor Berlin");
    await searchResponse;

    const result = page.getByRole("option", { name: /Brandenburg Gate/ });
    await expect(result).toBeVisible();
    await result.click();
    await expect(searchMap.locator('.kappa-map-view__marker[aria-label="Brandenburg Gate"]')).toHaveAttribute("aria-pressed", "true");
  });

  test("renders the standalone address map at the viewport height", async ({ page }) => {
    await page.goto("/examples/maps/search");
    const map = page.locator('[data-slot="map-view"]');
    await expect(map).toBeVisible();
    await expect(map).toHaveCSS("height", `${page.viewportSize()?.height ?? 720}px`);
  });

  test("keeps loading, empty, and error states in the map frame", async ({ page }) => {
    await expect(page.locator('[data-slot="map-view-loading"]')).toContainText("Loading map");
    await expect(page.locator('[data-slot="map-view-empty"]')).toContainText("No locations available");
    await expect(page.locator('[data-slot="map-view-error"]')).toContainText("The location service is unavailable.");
  });
});
