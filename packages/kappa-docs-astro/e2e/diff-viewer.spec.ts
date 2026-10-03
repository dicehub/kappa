import { expect, type Page, test } from "@playwright/test";
import { previewPatch } from "../src/data/diff-viewer-docs";

const demo = (page: Page, variant: string) => page.locator(`[data-diff-viewer-demo="${variant}"]`);

test.beforeEach(async ({ page }) => {
  await page.goto("/docs/components/diff-viewer");
  await expect(page.locator('astro-island[component-export="default"][ssr]').filter({ has: demo(page, "preview") })).toHaveCount(0);
});

test("documents public usage and renders line ranges and inline emphasis", async ({ page, request }) => {
  await expect(page.getByRole("heading", { level: 1, name: "Diff Viewer" })).toBeVisible();
  const viewer = demo(page, "preview").locator('[data-slot="diff-viewer"]');
  await expect(viewer).toHaveAttribute("data-state", "ready");
  await expect(viewer.locator(".kappa-diff-viewer__addition")).toHaveText("+1");
  await expect(viewer.locator(".kappa-diff-viewer__deletion")).toHaveText("−1");
  await expect(viewer.locator("mark")).toHaveText(["3", "5"]);
  await expect(viewer.locator(".kappa-diff-viewer__number")).toHaveText(["1", "1", "2", "", "", "2", "3", "3", "4", "4"]);
  await expect(page.locator('pre[data-language="vue"]').first()).toContainText('@dicehub/kappa/components/diff-viewer');
  const codeBlock = page.locator("#preview .docs-code-block");
  await codeBlock.getByRole("button", { name: "View Code" }).click();
  const source = codeBlock.locator("pre");
  await expect(source).toHaveCSS("overflow-y", "auto");
  await expect(source).toHaveCSS("scrollbar-width", "thin");
  expect(await source.evaluate(element => element.scrollHeight > element.clientHeight)).toBe(true);
  const markdown = await request.get("/docs/components/diff-viewer.md");
  expect(markdown.ok()).toBe(true);
  expect(await markdown.text()).toContain("parseUnifiedDiff");
});

test("copies the original patch and announces status", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  const viewer = demo(page, "preview");
  await viewer.getByRole("button", { name: "Copy patch", exact: true }).click();
  await expect(viewer.getByRole("status")).toHaveText("Patch copied");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(previewPatch);
});

test("switches to paired columns with keyboard activation", async ({ page }) => {
  const example = demo(page, "split");
  const button = example.getByRole("button", { name: "Split view", exact: true });
  await button.focus();
  await page.keyboard.press("Space");
  await expect(button).toHaveAttribute("aria-pressed", "true");
  await expect(example.locator('[data-slot="diff-viewer"]')).toHaveAttribute("data-view", "split");
  await expect(example.getByRole("columnheader")).toHaveText(["Before", "After"]);
  await expect(example.locator('td[data-kind="removed"] .kappa-diff-viewer__code')).toHaveText("retryLimit: 3");
  await expect(example.locator('td[data-kind="added"] .kappa-diff-viewer__code')).toHaveText("retryLimit: 5");
  const scroll = example.getByRole("region", { name: "Application settings: Content" });
  await scroll.focus();
  await expect(scroll).toBeFocused();
  expect(await scroll.evaluate((el) => getComputedStyle(el).outlineStyle)).toBe("solid");
});

test("updates empty and invalid states without a stale table or copy control", async ({ page }) => {
  const example = demo(page, "states");
  await example.getByRole("button", { name: "Empty patch", exact: true }).click();
  await expect(example.getByRole("status")).toHaveText("No file changes.");
  await expect(example.getByRole("table")).toHaveCount(0);
  await expect(example.getByRole("button", { name: "Copy patch", exact: true })).toHaveCount(0);
  await example.getByRole("button", { name: "Invalid patch", exact: true }).click();
  await expect(example.locator('[data-slot="diff-viewer"]')).toHaveAttribute("data-state", "invalid");
  await expect(example.getByRole("status")).toContainText("complete unified text diff");
  await example.getByRole("button", { name: "Valid patch", exact: true }).click();
  await expect(example.getByRole("table")).toHaveCount(1);
});

test("groups files and supports compact output", async ({ page }) => {
  const multiple = demo(page, "multiple");
  await expect(multiple.getByRole("table")).toHaveCount(2);
  await expect(multiple.locator(".kappa-diff-viewer__header .kappa-diff-viewer__addition")).toHaveText("+3");
  const compact = demo(page, "compact");
  await expect(compact.locator(".kappa-diff-viewer__number")).toHaveCount(0);
  await expect(compact.locator("mark")).toHaveCount(0);
  await expect(compact.getByRole("button")).toHaveCount(0);
});

test("escapes source markup and contains long lines on mobile in both themes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const example = demo(page, "scrolling");
  await expect(example.locator(".kappa-diff-viewer__code").last()).toContainText('<img src=x onerror="alert(1)">');
  await expect(example.locator("img, script")).toHaveCount(0);
  const scroll = example.locator(".kappa-diff-viewer__scroll");
  expect(await scroll.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  const colors: string[] = [];
  for (const theme of ["light", "dark"]) {
    await page.locator("html").evaluate((el, value) => el.setAttribute("data-kappa-theme", value), theme);
    colors.push(await example.locator('tr[data-kind="added"]').first().evaluate((el) => getComputedStyle(el).backgroundColor));
  }
  expect(colors[0]).not.toBe(colors[1]);
});
