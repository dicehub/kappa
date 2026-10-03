import { expect, test, type Locator, type Page } from "@playwright/test";

const demo = (page: Page, variant: string) =>
  page.locator(`[data-floating-panel-demo="${variant}"]`);
const panel = (page: Page, title: string) => page.locator(`[data-demo-window="${title}"]`);

async function ready(container: Locator) {
  await expect
    .poll(
      () => container.evaluate((element) => element.closest("astro-island")?.hasAttribute("ssr")),
      { timeout: 15_000 },
    )
    .toBe(false);
}

async function box(locator: Locator) {
  const result = await locator.boundingBox();
  if (!result) throw new Error("Expected a visible floating panel element");
  return result;
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/docs/components/floating-panel");
  await ready(demo(page, "preview"));
});

test("documents the public API and highlighted examples", async ({ page, request }) => {
  await expect(page.getByRole("heading", { level: 1, name: "Floating Panel" })).toBeVisible();
  await expect(page.getByRole("link", { name: "View Ark UI documentation" })).toHaveAttribute(
    "href",
    "https://ark-ui.com/docs/components/floating-panel",
  );
  await expect(page.locator('[data-composition-tree="floatingPanel"]')).toContainText(
    "FloatingPanel.ResizeTrigger",
  );
  await expect(page.locator("#examples .docs-component-example")).toHaveCount(6);
  await expect(page.locator('pre[data-language="javascript"]')).toHaveCount(2);
  await expect(page.locator('pre[data-language="vue"]').first()).toContainText(
    "FloatingPanel.Root",
  );

  const response = await request.get("/docs/components/floating-panel.md");
  expect(response.ok()).toBe(true);
  const markdown = await response.text();
  expect(markdown).toContain("# Floating Panel");
  expect(markdown).toContain("FloatingPanel.Root");
  expect(markdown).toContain("## [Accessibility](#accessibility)");
});

test("drags, resizes, closes, and restores focus", async ({ page }) => {
  const preview = demo(page, "preview");
  const workspace = preview.locator(".floating-panel-demo__workspace");
  const runMonitor = panel(page, "Run monitor");
  const dragHandle = runMonitor.locator('[data-slot="floating-panel-drag-trigger"]');
  const resizeHandle = runMonitor.locator('[data-slot="floating-panel-resize-trigger"][data-axis="se"]');

  await expect(runMonitor).toBeVisible();
  await expect(runMonitor).toHaveAttribute("role", "dialog");
  await expect(runMonitor).not.toHaveAttribute("aria-modal", "true");
  await expect(runMonitor).not.toHaveAttribute("data-disabled", "");
  await expect(dragHandle).toHaveCSS("cursor", "grab");
  await expect(runMonitor.locator("xpath=..")).toHaveAttribute(
    "data-slot",
    "floating-panel-positioner",
  );
  await expect(runMonitor.locator("xpath=..")).toHaveCSS("--kappa-floating-panel-z-index", "10");
  expect(
    await runMonitor.locator("xpath=..").evaluate((element) =>
      element.parentElement?.classList.contains("floating-panel-demo__workspace"),
    ),
  ).toBe(true);

  const beforeResize = await box(runMonitor);
  const resizeBox = await box(resizeHandle);
  await expect(resizeHandle).not.toHaveAttribute("data-disabled", "");
  await resizeHandle.hover();
  await page.mouse.down();
  await page.mouse.move(
    resizeBox.x + resizeBox.width / 2 + 42,
    resizeBox.y + resizeBox.height / 2 + 32,
    { steps: 6 },
  );
  await page.mouse.up();
  const afterResize = await box(runMonitor);
  expect(afterResize.width).toBeGreaterThan(beforeResize.width + 20);
  expect(afterResize.height).toBeGreaterThan(beforeResize.height + 15);

  const handleBox = await box(dragHandle);
  await page.mouse.move(handleBox.x + 90, handleBox.y + handleBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(handleBox.x + 154, handleBox.y + 40, { steps: 6 });
  await page.mouse.up();
  const afterDrag = await box(runMonitor);
  expect(afterDrag.x).toBeGreaterThan(afterResize.x + 30);
  expect(afterDrag.y).toBeGreaterThan(afterResize.y + 10);

  const workspaceBox = await box(workspace);
  expect(afterDrag.x).toBeGreaterThanOrEqual(workspaceBox.x - 1);
  expect(afterDrag.y).toBeGreaterThanOrEqual(workspaceBox.y - 1);
  expect(afterDrag.x + afterDrag.width).toBeLessThanOrEqual(workspaceBox.x + workspaceBox.width + 1);
  expect(afterDrag.y + afterDrag.height).toBeLessThanOrEqual(workspaceBox.y + workspaceBox.height + 1);

  await runMonitor.getByRole("button", { name: "Close panel" }).click();
  const open = preview.getByRole("button", { name: "Open Run monitor" });
  await expect(runMonitor).toBeHidden();
  await expect(open).toBeFocused();
  await open.click();
  await expect(runMonitor).toBeVisible();
  await expect(runMonitor).toBeFocused();

  await runMonitor.evaluate(async (element) => {
    await Promise.all(element.getAnimations().map((animation) => animation.finished));
  });
  const beforeKeyboardMove = await box(runMonitor);
  await runMonitor.press("ArrowLeft");
  expect((await box(runMonitor)).x).toBeLessThan(beforeKeyboardMove.x);

  await page.emulateMedia({ forcedColors: "active" });
  await runMonitor.focus();
  await expect(runMonitor).toHaveCSS("outline-style", "solid");
  await expect(runMonitor).toHaveCSS("outline-width", "2px");

  await runMonitor.press("Escape");
  await expect(runMonitor).toBeHidden();
  await expect(runMonitor).toHaveAttribute("hidden", "");
  await expect(open).toBeFocused();
});

test("changes stages and keeps controlled geometry synchronized", async ({ page }) => {
  const stages = demo(page, "stages");
  await ready(stages);
  await stages.locator(".floating-panel-demo__workspace").scrollIntoViewIfNeeded();
  const inspector = panel(page, "Inspector");
  const body = inspector.locator('[data-slot="floating-panel-body"]');
  await expect(inspector).toBeInViewport();
  const workspace = stages.locator(".floating-panel-demo__workspace");
  const beforeStage = await box(inspector);
  const beforeWorkspace = await box(workspace);

  await inspector.getByRole("button", { name: "Minimize window" }).click();
  await expect(body).toBeHidden();
  await expect(body).toContainText("minimized");
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollBy(0, 80);
  });
  await inspector.getByRole("button", { name: "Restore window" }).click();
  await expect(body).toBeVisible();
  await expect(body).toContainText("default");
  const afterStage = await box(inspector);
  const afterWorkspace = await box(workspace);
  expect(afterStage.x - afterWorkspace.x).toBeCloseTo(beforeStage.x - beforeWorkspace.x, 0);
  expect(afterStage.y - afterWorkspace.y).toBeCloseTo(beforeStage.y - beforeWorkspace.y, 0);

  await inspector.getByRole("button", { name: "Maximize window" }).click();
  await expect(inspector).toHaveAttribute("data-maximized", "");
  await inspector.getByRole("button", { name: "Restore window" }).click();
  await expect(inspector).not.toHaveAttribute("data-maximized", "");

  await inspector.getByRole("button", { name: "Minimize window" }).click();
  await inspector.getByRole("button", { name: "Restore window" }).click();
  await expect(body).toBeVisible();
  await inspector.focus();
  const beforeFirstMove = await box(inspector);
  await inspector.press("ArrowLeft");
  expect((await box(inspector)).x).toBeLessThan(beforeFirstMove.x);

  const controlled = demo(page, "controlled");
  await ready(controlled);
  await controlled.getByRole("button", { name: "Large" }).click();
  await expect(controlled.getByRole("status")).toContainText("400 × 270");
  await controlled.getByRole("button", { name: "Reset position" }).click();
  await expect(controlled.getByRole("status")).toContainText("24, 24");

  const fixed = demo(page, "fixed");
  await fixed.locator(".floating-panel-demo__workspace").scrollIntoViewIfNeeded();
  const fixedPanel = panel(page, "Read-only summary");
  await expect(fixedPanel.locator('[data-slot="floating-panel-stage-trigger"]')).toHaveCount(0);
  await expect(fixedPanel.locator('[data-slot="floating-panel-resize-trigger"]')).toHaveCount(0);
  await expect(fixedPanel.locator('[data-slot="floating-panel-drag-trigger"]')).toHaveCSS(
    "cursor",
    "default",
  );

  const transformDemo = demo(page, "transform");
  await transformDemo.locator(".floating-panel-demo__workspace").scrollIntoViewIfNeeded();
  const transform = panel(page, "Transform geometry");
  await transform.getByRole("button", { name: "Minimize window" }).click();
  await expect(transform.getByRole("button", { name: "Apply transform" })).toBeHidden();
});

test("keeps panels aligned after documentation layout changes", async ({ page }) => {
  const controlled = demo(page, "controlled");
  await ready(controlled);
  const controlledWorkspace = controlled.locator(".floating-panel-demo__workspace");
  const controlledPanel = panel(page, "Controlled geometry");
  const beforePanel = await box(controlledPanel);
  const beforeWorkspace = await box(controlledWorkspace);

  await page.locator("#transform-tool").locator("xpath=following::button[@data-code-reveal][1]").click();

  await expect
    .poll(async () => {
      const nextPanel = await box(controlledPanel);
      const nextWorkspace = await box(controlledWorkspace);
      return Math.round(nextPanel.y - nextWorkspace.y);
    })
    .toBe(Math.round(beforePanel.y - beforeWorkspace.y));
});

test("keeps multiple windows non-modal and raises the active window", async ({ page }) => {
  const multiple = demo(page, "multiple");
  await ready(multiple);
  await multiple.locator(".floating-panel-demo__workspace").scrollIntoViewIfNeeded();
  const variables = panel(page, "Variables");
  const chart = panel(page, "Probe chart");
  await expect(chart).toBeInViewport();

  await chart.click();
  await expect(chart).toHaveAttribute("data-topmost", "");
  await expect(variables).toHaveAttribute("data-behind", "");
  await variables.click();
  await expect(variables).toHaveAttribute("data-topmost", "");
  await expect(chart).toHaveAttribute("data-behind", "");
  await expect(page.getByRole("heading", { level: 1, name: "Floating Panel" })).toBeVisible();
});

test("renders a full-viewport standalone example", async ({ page }) => {
  await page.goto("/examples/components/floating-panel");
  const standalone = demo(page, "preview");
  await ready(standalone);
  const workspace = standalone.locator(".floating-panel-demo__workspace--standalone");
  await expect(workspace).toBeVisible();
  expect((await box(workspace)).height).toBeGreaterThanOrEqual(700);
  await expect(panel(page, "Run monitor")).toBeVisible();
});

test("clamps initial panel geometry on a narrow viewport", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto("/docs/components/floating-panel");
  const preview = demo(page, "preview");
  await ready(preview);
  const workspace = preview.locator(".floating-panel-demo__workspace");
  const workspaceBox = await box(workspace);
  const panelBox = await box(panel(page, "Run monitor"));

  expect(panelBox.x).toBeGreaterThanOrEqual(workspaceBox.x - 1);
  expect(panelBox.y).toBeGreaterThanOrEqual(workspaceBox.y - 1);
  expect(panelBox.x + panelBox.width).toBeLessThanOrEqual(workspaceBox.x + workspaceBox.width + 1);
  expect(panelBox.y + panelBox.height).toBeLessThanOrEqual(workspaceBox.y + workspaceBox.height + 1);
});
