import { expect, test, type Page } from "@playwright/test";

async function openExample(page: Page) {
  await page.goto("/examples/sidebar/collapsible-sections");
  await expect.poll(() => page.locator('[data-sidebar-block="collapsible-sections"]').evaluate(node => node.closest("astro-island")?.hasAttribute("ssr"))).toBe(false);
}

test("section headings toggle independently with keyboard and search reveals matches", async ({ page }) => {
  await openExample(page);
  const nav = page.getByRole("navigation", { name: "Documentation navigation", exact: true });
  const start = nav.getByRole("button", { name: "Getting started", exact: true });
  const workflow = nav.getByRole("button", { name: "Project workflow", exact: true });
  await expect(start).toHaveAttribute("aria-expanded", "true");
  await start.focus();
  await start.press("Enter");
  await expect(start).toHaveAttribute("aria-expanded", "false");
  await expect(nav.getByRole("link", { name: "Installation", exact: true })).toBeHidden();
  await start.press("Tab");
  await expect(workflow).toBeFocused();
  await workflow.press("Space");
  await expect(workflow).toHaveAttribute("aria-expanded", "false");
  await expect(nav.getByRole("link", { name: "Configuration", exact: true })).toBeVisible();
  const search = nav.getByRole("searchbox");
  await search.fill("mesh");
  await expect(workflow).toHaveAttribute("aria-expanded", "true");
  await expect(nav.getByRole("link", { name: "Prepare a mesh", exact: true })).toBeVisible();
  await search.press("Escape");
  await expect(start).toHaveAttribute("aria-expanded", "false");
  await expect(workflow).toHaveAttribute("aria-expanded", "true");
});

test("section state survives mobile transitions and selection restores focus", async ({ page }) => {
  await openExample(page);
  await page.getByRole("button", { name: "Reference", exact: true }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  const toggle = page.getByRole("button", { name: "Open sidebar", exact: true });
  await toggle.click();
  const drawer = page.getByRole("dialog", { name: "Documentation navigation", exact: true });
  const reference = drawer.getByRole("button", { name: "Reference", exact: true });
  await expect(reference).toHaveAttribute("aria-expanded", "false");
  expect((await reference.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  await reference.click();
  await drawer.getByRole("link", { name: "Configuration", exact: true }).click();
  await expect(drawer).toBeHidden();
  await expect(toggle).toBeFocused();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(page.getByRole("button", { name: "Reference", exact: true })).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("heading", { name: "Configuration", exact: true })).toBeVisible();
});

test("gallery preserves previous examples and exposes complete collapsible source", async ({ page, request }) => {
  await page.goto("/docs/blocks/sidebar");
  for (const variant of ["grouped", "collapsible-sections", "workspace", "rail", "inset", "floating"]) {
    await expect(page.locator(`[data-block-example="${variant}"]`)).toHaveCount(1);
  }
  const example = page.locator('[data-block-example="collapsible-sections"]');
  await expect(example.getByRole("link", { name: /Open full example/ })).toHaveAttribute("href", "/examples/sidebar/collapsible-sections");
  const code = example.locator('[data-code-full] code');
  await expect(code).toContainText('collapsibleSections: true');
  await expect(code).toContainText('Sidebar.Collapsible');
  await expect(code).toContainText('<style>');
  expect(await (await request.get('/docs/blocks/sidebar.md')).text()).toContain('Collapsible Sections');
});
