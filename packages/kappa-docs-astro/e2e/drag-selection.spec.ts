import { expect, test, type Page } from "@playwright/test";

const demo = (page: Page, variant = "preview") => page.locator(`[data-drag-selection-demo="${variant}"]`);
const selectedValues = (page: Page, variant = "preview") => demo(page, variant).locator('[role="option"][aria-selected="true"]').evaluateAll(elements => elements.map(element => element.getAttribute("data-value")));

test.beforeEach(async ({ page }) => {
  await page.goto("/docs/components/drag-selection");
  await expect(page.locator('astro-island:has([data-drag-selection-demo="preview"])')).not.toHaveAttribute("ssr");
});

async function beginRectangle(page: Page, variant = "preview") {
  const viewport = await demo(page, variant).getByRole("listbox").boundingBox();
  const item = await demo(page, variant).getByRole("option").nth(1).boundingBox();
  await page.mouse.move(viewport!.x + 4, viewport!.y + 4);
  await page.mouse.down();
  await page.mouse.move(item!.x + item!.width - 3, item!.y + item!.height - 3, { steps: 8 });
  await expect(demo(page, variant).locator('[data-slot="drag-selection-rectangle"]')).toBeVisible();
}

test("rectangle replaces selection and additive drag preserves existing items", async ({ page }) => {
  await beginRectangle(page);
  await expect.poll(() => selectedValues(page)).toEqual(["file-0", "file-1"]);
  await page.mouse.up();
  await expect.poll(() => selectedValues(page)).toEqual(["file-0", "file-1"]);
  await demo(page).getByRole("option").nth(5).click();
  await page.keyboard.down("Control");
  await beginRectangle(page);
  await page.mouse.up();
  await page.keyboard.up("Control");
  await expect.poll(() => selectedValues(page)).toEqual(["file-0", "file-1", "file-5"]);
});

test("Escape cancels the gesture and restores its initial selection", async ({ page }) => {
  await beginRectangle(page);
  await page.keyboard.press("Escape");
  await page.mouse.up();
  await expect(demo(page).locator('[data-slot="drag-selection-rectangle"]')).toHaveCount(0);
  await expect.poll(() => selectedValues(page)).toEqual(["file-2"]);
});

test("an unrelated pointer cancel does not stop the active drag", async ({ page }) => {
  await beginRectangle(page);
  await page.evaluate(() => window.dispatchEvent(new PointerEvent("pointercancel", { pointerId: 999, pointerType: "touch" })));
  await expect(demo(page).locator('[data-slot="drag-selection-rectangle"]')).toBeVisible();
  await page.mouse.up();
  await expect.poll(() => selectedValues(page)).toEqual(["file-0", "file-1"]);
});

test("dragging from an item selects crossed cells and grid arrows follow columns", async ({ page }) => {
  const scope = demo(page);
  const first = (await scope.getByRole("option").nth(0).boundingBox())!;
  const fourth = (await scope.getByRole("option").nth(4).boundingBox())!;
  await page.mouse.move(first.x + first.width / 2, first.y + first.height / 2);
  await page.mouse.down();
  await page.mouse.move(fourth.x + fourth.width / 2, fourth.y + fourth.height / 2, { steps: 8 });
  await page.mouse.up();
  await expect.poll(() => selectedValues(page)).toEqual(["file-0", "file-1", "file-3", "file-4"]);
  const listbox = scope.getByRole("listbox");
  await listbox.press("Home");
  await expect(scope.getByRole("option").nth(0)).toHaveAttribute("data-highlighted");
  await listbox.press("ArrowDown");
  await expect(scope.getByRole("option").nth(3)).toHaveAttribute("data-highlighted");
  await listbox.press("ArrowRight");
  await expect(scope.getByRole("option").nth(4)).toHaveAttribute("data-highlighted");
});

test("Ark keyboard selection and disabled items remain consistent", async ({ page }) => {
  const scope = demo(page, "disabled");
  const listbox = scope.getByRole("listbox");
  await listbox.focus();
  await listbox.press("Control+a");
  await expect(scope.locator('[role="option"][aria-selected="true"]')).toHaveCount(5);
  await expect(scope.getByRole("option").nth(1)).toHaveAttribute("aria-disabled", "true");
  await expect(scope.getByRole("option").nth(1)).toHaveAttribute("aria-selected", "false");
  await scope.getByRole("button", { name: "Disable selection" }).click();
  await scope.getByRole("option").first().click({ force: true });
  await expect(scope.locator('[role="option"][aria-selected="true"]')).toHaveCount(5);
});

test("edge scrolling extends the rectangle and click-only mode prevents it", async ({ page }) => {
  const scope = demo(page, "scrolling");
  await scope.scrollIntoViewIfNeeded();
  const box = await scope.getByRole("listbox").boundingBox();
  await page.mouse.move(box!.x + 5, box!.y + 5);
  await page.mouse.down();
  await page.mouse.move(box!.x + box!.width - 8, box!.y + box!.height - 3, { steps: 8 });
  await expect.poll(() => scope.getByRole("listbox").evaluate(element => element.scrollTop)).toBeGreaterThan(70);
  await page.mouse.up();
  await expect.poll(() => selectedValues(page, "scrolling")).not.toEqual([]);
  const clickOnly = demo(page, "click-only");
  await clickOnly.scrollIntoViewIfNeeded();
  const clickBox = await clickOnly.getByRole("listbox").boundingBox();
  await page.mouse.move(clickBox!.x + 3, clickBox!.y + 3);
  await page.mouse.down();
  await page.mouse.move(clickBox!.x + 140, clickBox!.y + 80, { steps: 6 });
  await expect(clickOnly.locator('[data-slot="drag-selection-rectangle"]')).toHaveCount(0);
  await page.mouse.up();
});

test("docs snippets are highlighted and the grid fits narrow screens", async ({ page }) => {
  const code = page.locator('pre[data-language="vue"]');
  await expect(code).toHaveCount(5);
  for (const block of await code.all()) await expect(block.locator('span[style*="--shiki"]').first()).toBeAttached();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.locator("html").evaluate(element => element.setAttribute("data-kappa-theme", "dark"));
  await expect(demo(page).getByRole("listbox")).toBeVisible();
});

test("opens a viewport-sized asset library example", async ({ page }) => {
  const links = page.getByRole("link", { name: /Open full example/ });
  await expect(links).toHaveCount(5);
  expect(await links.evaluateAll(elements => elements.map(element => element.getAttribute("href")))).toEqual([
    "/examples/drag-selection/full-screen", "/examples/drag-selection/list",
    "/examples/drag-selection/scrolling", "/examples/drag-selection/disabled",
    "/examples/drag-selection/click-only",
  ]);
  for (const [variant, count] of [["full-screen", 36], ["list", 36], ["scrolling", 72], ["disabled", 36], ["click-only", 36]] as const) {
    await page.goto(`/examples/drag-selection/${variant}`);
    const demoVariant = variant === "full-screen" ? "preview" : variant;
    const example = page.locator(`[data-drag-selection-demo="${demoVariant}"][data-standalone]`);
    await expect(example.getByRole("heading", { name: "Asset library" })).toBeVisible();
    await expect(example.getByRole("option")).toHaveCount(count);
    await expect(example.getByRole("listbox")).toBeVisible();
    const bounds = await example.boundingBox();
    expect(bounds?.height).toBeGreaterThanOrEqual(700);
  }
});
