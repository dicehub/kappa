import { expect, test, type Page } from "@playwright/test";

async function ready(page: Page) {
  await expect.poll(() => page.locator('[data-sidebar-block="grouped"]').evaluate(node => node.closest("astro-island")?.hasAttribute("ssr"))).toBe(false);
}

test("grouped navigation has complete source and a preview alongside the other layouts", async ({ page, request }) => {
  await page.goto("/docs/blocks/sidebar");
  await ready(page);
  await expect(page.locator("[data-block-example]")).toHaveCount(15);
  const example = page.locator('[data-block-example="grouped"]');
  await expect(example.getByRole("link", { name: /Open full example/ })).toHaveAttribute("href", "/examples/sidebar/grouped");
  const source = example.locator("[data-code-full] code");
  await expect(source).toContainText('collapsible="offcanvas"');
  await expect(source).toContainText('standalone: true');
  await expect(source).toContainText('<style>');
  await expect(source).not.toContainText('style src=');
  expect(await (await request.get("/docs/blocks/sidebar.md")).text()).toContain("Grouped Navigation");
});

test("text groups support search, empty results, version selection and offcanvas collapse", async ({ page }) => {
  await page.goto("/examples/sidebar/grouped");
  await ready(page);
  const nav = page.getByRole("navigation", { name: "Documentation navigation", exact: true });
  await expect(nav.getByRole("link")).toHaveCount(10);
  const trigger = nav.getByRole("button", { name: "Documentation version: 1.0.1" });
  const bounds = (await trigger.boundingBox())!;
  const chevrons = (await trigger.locator('.sidebar-grouped-demo__chevrons').boundingBox())!;
  expect(chevrons.y).toBeGreaterThanOrEqual(bounds.y);
  expect(chevrons.y + chevrons.height).toBeLessThanOrEqual(bounds.y + bounds.height);
  const input = nav.getByRole("searchbox", { name: "Search documentation" });
  await input.fill("MESH");
  await expect(nav.getByRole("link")).toHaveCount(1);
  await nav.getByRole("link", { name: "Prepare a mesh" }).click();
  await expect(page.getByRole("heading", { name: "Prepare a mesh", exact: true })).toBeVisible();
  await expect(nav.getByRole("link", { name: "Prepare a mesh" })).toHaveAttribute("aria-current", "page");
  await input.fill("missing page");
  await expect(nav.getByRole("status")).toHaveText("No pages found.");
  await input.press("Escape");
  await expect(nav.getByRole("link")).toHaveCount(10);
  await nav.getByRole("button", { name: "Documentation version: 1.0.1" }).click();
  await page.getByRole("menuitemradio", { name: "v1.1.0-alpha", exact: true }).click();
  await expect(nav.getByRole("button", { name: "Documentation version: 1.1.0-alpha" })).toBeFocused();
  await page.getByRole("button", { name: "Collapse sidebar", exact: true }).click();
  await expect(nav).toBeHidden();
  await page.getByRole("button", { name: "Expand sidebar", exact: true }).press("Enter");
  await expect(nav).toBeVisible();
  const light = await nav.evaluate(node => getComputedStyle(node).backgroundColor);
  await page.evaluate(() => {
    document.documentElement.dataset.mode = "dark";
    document.documentElement.dataset.kappaTheme = "dark";
  });
  await expect(nav).not.toHaveCSS("background-color", light);
});

test("mobile navigation closes on selection, restores focus and keeps local state", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/examples/sidebar/grouped");
  await ready(page);
  const toggle = page.getByRole("button", { name: "Open sidebar", exact: true });
  await toggle.click();
  const drawer = page.getByRole("dialog", { name: "Documentation navigation", exact: true });
  await expect(drawer).toHaveCSS("width", "390px");
  await expect(drawer).toHaveCSS("height", "844px");
  await drawer.getByRole("searchbox").fill("results");
  await drawer.getByRole("link", { name: "Review results" }).click();
  await expect(drawer).toBeHidden();
  await expect(toggle).toBeFocused();
  await expect(page.getByRole("heading", { name: "Review results", exact: true })).toBeVisible();
  await toggle.click();
  await expect(drawer.getByRole("searchbox")).toHaveValue("results");
  await drawer.getByRole("button", { name: "Close navigation", exact: true }).click();
  await expect(toggle).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
