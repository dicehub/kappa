import { expect, test, type Locator } from "@playwright/test";

const demo = (page: import("@playwright/test").Page, variant: string) =>
  page.locator(`[data-resource-list-demo="${variant}"]`);

async function ready(block: Locator) {
  await expect
    .poll(() => block.evaluate(element => element.closest("astro-island")?.hasAttribute("ssr")))
    .toBe(false);
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/docs/blocks/resource-list");
});

test("Resource List documents the published layout and highlighted examples", async ({ page, request }) => {
  await expect(page.getByRole("heading", { level: 1, name: "Resource List", exact: true })).toBeVisible();
  await expect(page.getByText("Planned documentation")).toHaveCount(0);
  await expect(page.locator('[data-block-example="complete"]')).toHaveCount(1);
  await expect(page.locator('[data-block-example="compact"]')).toHaveCount(1);
  await expect(page.locator('[data-block-example="minimal"]')).toHaveCount(1);
  await expect(page.getByRole("link", { name: /Open full example/ })).toHaveCount(3);
  await expect(page.locator('pre[data-language="vue"]')).toHaveCount(3);
  await expect(page.locator('pre[data-language="vue"]').first()).toContainText(
    "ResourceListLayout",
  );

  const markdown = await request.get("/docs/blocks/resource-list.md");
  expect(markdown.ok()).toBe(true);
  const text = await markdown.text();
  expect(text).toContain("# Resource List");
  expect(text).toContain("ResourceListLayout");
});

test("complete layout filters resources and keeps behavior outside the block", async ({ page }) => {
  const complete = demo(page, "complete");
  await ready(complete);

  const layout = complete.locator('[data-slot="resource-list-layout"]');
  await expect(layout).toHaveAttribute("data-density", "default");
  await expect(layout).toHaveAttribute("data-sidebar-side", "end");
  await expect(layout).toHaveAttribute("data-sticky-sidebar", "");
  await expect(complete.locator('[data-slot="resource-list-layout-aside"]')).toHaveCount(1);
  await expect(complete.locator('[data-slot="item"]')).toHaveCount(4);

  await complete.getByRole("searchbox", { name: "Search resources" }).fill("cryogenic");
  await expect(complete.locator('[data-slot="item"]')).toHaveCount(1);
  await expect(complete.getByText("Cryogenic transfer line", { exact: true })).toBeVisible();

  await complete.getByRole("searchbox", { name: "Search resources" }).fill("");
  await complete.getByRole("button", { name: "Sort resources: Updated date" }).click();
  await page.getByRole("menuitemradio", { name: "Name" }).click();
  await expect(complete.getByRole("button", { name: "Sort resources: Name" })).toBeVisible();
  await complete.getByRole("button", { name: "Sort ascending" }).click();
  await expect(complete.locator('[data-slot="item"]')).toHaveCount(4);
  await expect(complete.locator('[data-slot="item"]').first()).toContainText(
    "Cryogenic transfer line",
  );

  await complete.getByRole("button", { name: "Grid view" }).click();
  await expect(complete.locator(".resource-list-demo__list-surface")).toHaveAttribute(
    "data-view",
    "grid",
  );
  await complete.getByRole("button", { name: "List view" }).click();
  await expect(complete.locator(".resource-list-demo__list-surface")).toHaveAttribute(
    "data-view",
    "list",
  );
  await expect(complete.getByRole("button", { name: "New resource" })).toBeEnabled();
});

test("standalone example fills the viewport", async ({ page }) => {
  await page.goto("/examples/resource-list/complete");
  const complete = demo(page, "complete");
  await ready(complete);

  await expect(complete).toHaveAttribute("data-standalone", "");
  const bounds = await complete.locator('[data-slot="resource-list-layout"]').boundingBox();
  expect(bounds!.height).toBeGreaterThanOrEqual(999);
});

test("compact and minimal compositions omit unused regions", async ({ page }) => {
  const compact = demo(page, "compact");
  const minimal = demo(page, "minimal");
  await ready(compact);
  await ready(minimal);

  await expect(compact.locator('[data-slot="resource-list-layout"]')).toHaveAttribute(
    "data-density",
    "compact",
  );
  await expect(compact.locator('[data-slot="item"]')).toHaveCount(3);
  await expect(compact.locator('[data-slot="resource-list-layout-aside"]')).toHaveCount(0);

  await expect(minimal.locator('[data-slot="resource-list-layout-header"]')).toHaveCount(0);
  await expect(minimal.locator('[data-slot="resource-list-layout-toolbar"]')).toHaveCount(0);
  await expect(minimal.locator('[data-slot="resource-list-layout-aside"]')).toHaveCount(0);
  await expect(minimal.locator('[data-slot="item"]')).toHaveCount(4);
});

test("resource layout fits a narrow viewport and preserves primary-first document order", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  const complete = demo(page, "complete");
  await ready(complete);

  const bodyParts = await complete
    .locator('[data-slot="resource-list-layout-body"] > [data-slot]')
    .evaluateAll(elements => elements.map(element => element.getAttribute("data-slot")));
  expect(bodyParts).toEqual(["resource-list-layout-primary", "resource-list-layout-aside"]);
  await expect(complete.locator('[data-slot="resource-list-layout-aside"] > div')).toHaveCSS(
    "position",
    "static",
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

for (const theme of ["light", "dark"]) {
  test(`resource previews fill their containers and keep controls inside rows in ${theme} mode`, async ({ page }) => {
    await page.evaluate(mode => {
      document.documentElement.dataset.kappaTheme = mode;
    }, theme);

    if (theme === "light") {
      await expect(
        demo(page, "complete").locator('[data-slot="resource-list-layout"]'),
      ).toHaveCSS("background-color", "rgb(244, 244, 244)");
    }

    for (const { width, maxInlineSize } of [
      { width: 1440, maxInlineSize: "none" },
      { width: 1440, maxInlineSize: "28rem" },
      { width: 390, maxInlineSize: "none" },
    ]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const variant of ["complete", "compact", "minimal"]) {
        const block = demo(page, variant);
        await ready(block);
        await block.evaluate((element, maxWidth) => {
          element.style.maxInlineSize = maxWidth;
        }, maxInlineSize);

        const bounds = await block.boundingBox();
        expect(bounds!.width).toBeGreaterThan(200);
        await expect(block.locator('[data-slot="resource-list-layout-body"]')).toHaveCSS(
          "display",
          "grid",
        );

        const rows = block.locator('[data-slot="item"]');
        for (const row of await rows.all()) {
          const rowBounds = (await row.boundingBox())!;
          const metadata = row.locator(".resource-list-demo__meta");
          const metadataBounds = (await metadata.boundingBox())!;
          expect(metadataBounds.x).toBeGreaterThanOrEqual(rowBounds.x);
          expect(metadataBounds.x + metadataBounds.width).toBeLessThanOrEqual(
            rowBounds.x + rowBounds.width,
          );
          expect(await row.evaluate(element => element.scrollWidth - element.clientWidth))
            .toBeLessThanOrEqual(1);
        }
      }

      const complete = demo(page, "complete");
      const search = complete.getByRole("searchbox", { name: "Search resources" });
      await search.fill("no matching resource");
      await expect(complete.getByRole("status")).toContainText("No resources found");
      await search.fill("");
      await expect(complete.locator('[data-slot="item"]')).toHaveCount(4);
    }
  });
}
