import { expect, test } from "@playwright/test";

test.describe("Menu Bar documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/menu-bar");
    await expect(page.locator('astro-island[component-url*="MenuBarDocsDemo"]:not([ssr])')).toHaveCount(4);
  });

  test("shows a real component page and syntax-highlighted code", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Menu Bar" })).toBeVisible();
    await expect(page.locator('[data-menu-bar-demo="preview"] [role="menubar"]')).toHaveCount(1);
    await expect(page.locator('pre[data-language="vue"] span[style*="--shiki-light"]')).not.toHaveCount(0);
    const markdown = await (await request.get("/docs/components/menu-bar.md")).text();
    expect(markdown).toContain("# Menu Bar");
    expect(markdown).toContain("MenuBar.Root");
  });

  test("switches menus by pointer and keyboard, then selects an action", async ({ page }) => {
    const demo = page.locator('[data-menu-bar-demo="preview"]');
    const bar = demo.getByRole("menubar", { name: "Document commands" });
    const file = bar.getByRole("menuitem", { name: "File" });
    const edit = bar.getByRole("menuitem", { name: "Edit" });

    await file.click();
    await expect(page.locator('[data-menu-bar-surface="file"]')).toBeVisible();
    await edit.hover();
    await expect(page.locator('[data-menu-bar-surface="edit"]')).toBeVisible();
    await edit.focus();
    await page.keyboard.press("ArrowLeft");
    await expect(page.locator('[data-menu-bar-surface="file"]')).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator('[data-menu-bar-surface="file"]')).not.toBeVisible();

    await file.click();
    await page.getByRole("menuitem", { name: /New document/ }).click();
    await expect(demo.locator("output")).toHaveText("new");
  });

  test("keeps pointer switching active when revisiting a menu", async ({ page }) => {
    const bar = page.locator('[data-menu-bar-demo="preview"] [role="menubar"]');
    const file = bar.getByRole("menuitem", { name: "File" });
    const edit = bar.getByRole("menuitem", { name: "Edit" });
    const view = bar.getByRole("menuitem", { name: "View" });

    await file.click();
    await expect(page.locator('[data-menu-bar-surface="file"]')).toBeVisible();

    for (const [trigger, surface] of [
      [edit, "edit"], [view, "view"], [edit, "edit"], [file, "file"],
    ] as const) {
      const bounds = await trigger.boundingBox();
      expect(bounds).not.toBeNull();
      await page.mouse.move(bounds!.x + bounds!.width / 2, bounds!.y + bounds!.height / 2, { steps: 12 });
      await expect(page.locator(`[data-menu-bar-surface="${surface}"]`)).toBeVisible();
    }

  });

  test("keeps the current menu open while crossing another trigger toward an item", async ({ page }) => {
    const bar = page.locator('[data-menu-bar-demo="preview"] [role="menubar"]');
    await bar.getByRole("menuitem", { name: "File" }).click();
    const fileMenu = page.locator('[data-menu-bar-surface="file"]');
    const newDocument = fileMenu.getByRole("menuitem", { name: /New document/ });
    await expect(fileMenu).toBeVisible();

    const bounds = await newDocument.boundingBox();
    expect(bounds).not.toBeNull();
    await page.mouse.move(bounds!.x + bounds!.width / 2, bounds!.y + bounds!.height / 2, { steps: 12 });
    await expect(fileMenu).toBeVisible();
    await expect(page.locator('[data-menu-bar-surface="edit"]')).not.toBeVisible();
    await newDocument.click();
    await expect(page.locator('[data-menu-bar-demo="preview"] output')).toHaveText("new");
  });

  test("keeps options open and skips disabled triggers", async ({ page }) => {
    const options = page.locator('[data-menu-bar-demo="options"]');
    await options.getByRole("menuitem", { name: "View" }).click();
    const grid = page.getByRole("menuitemcheckbox", { name: "Show grid" });
    await grid.click();
    await expect(grid).toHaveAttribute("aria-checked", "false");
    await expect(options.locator("output")).toContainText("Grid off");
    await page.keyboard.press("Escape");

    const controlled = page.locator('[data-menu-bar-demo="controlled"]');
    await expect(controlled.getByRole("menuitem", { name: "Edit" })).toBeDisabled();
    await controlled.getByRole("menuitem", { name: "File" }).click();
    await expect(controlled.locator("output")).toHaveText("Open menu: file");
  });

  test("opens a nested menu and selects its action", async ({ page }) => {
    const nested = page.locator('[data-menu-bar-demo="nested"]');
    await nested.getByRole("menuitem", { name: "File" }).click();
    await page.getByRole("menuitem", { name: "Export as" }).click();
    const exportMenu = page.locator('[data-menu-bar-surface="export"]');
    await expect(exportMenu).toBeVisible();
    const triggerBounds = await page.getByRole("menuitem", { name: "Export as" }).boundingBox();
    const submenuBounds = await exportMenu.boundingBox();
    expect(triggerBounds).not.toBeNull();
    expect(submenuBounds).not.toBeNull();
    await page.mouse.move(
      submenuBounds!.x + 12,
      triggerBounds!.y + triggerBounds!.height / 2,
      { steps: 8 },
    );
    await expect(exportMenu).toBeVisible();
    await page.getByRole("menuitem", { name: "Save" }).hover();
    await expect(exportMenu).not.toBeVisible();
    await page.getByRole("menuitem", { name: "Export as" }).click();
    await expect(exportMenu).toBeVisible();
    await page.mouse.move(
      submenuBounds!.x + 12,
      triggerBounds!.y + triggerBounds!.height / 2,
      { steps: 8 },
    );
    await exportMenu.getByRole("menuitem", { name: "SVG" }).click();
    await expect(nested.locator("output")).toHaveText("export-svg");
  });
});
