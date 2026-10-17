import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { waitForDocsIsland } from "./helpers/docs-island";

test.beforeEach(async ({ page }) => {
  await page.goto("/docs/components/code-block");
});

test("switches request variants by keyboard and keeps the selected language", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  const demo = page.locator('[data-code-block-demo="tabbed-examples"]');
  await waitForDocsIsland(demo);
  const basic = demo.getByRole("tab", { name: "Basic request", exact: true });
  const filtered = demo.getByRole("tab", { name: "With filters", exact: true });
  await expect(basic).toHaveAttribute("aria-selected", "true");
  await demo.getByRole("combobox", { name: "Code language" }).click();
  await page.getByRole("option", { name: "Python", exact: true }).click();
  await expect(demo.getByRole("region")).toContainText("print(runs)");
  await basic.focus();
  await page.keyboard.press("ArrowRight");
  await expect(filtered).toBeFocused();
  await expect(filtered).toHaveAttribute("aria-selected", "true");
  await expect(demo.getByRole("tabpanel")).toHaveCount(1);
  await expect(demo.getByRole("combobox")).toContainText("Python");
  await expect(demo.getByRole("region")).toContainText('"status": "completed"');
  await demo.getByRole("button", { name: "Copy", exact: true }).click();
  const source = await page.evaluate(() => navigator.clipboard.readText());
  expect(source).toContain('query = urlencode({"status": "completed", "limit": 10})');
  expect(source).not.toContain("With filters");
  expect(source).not.toMatch(/^\d/m);
  await filtered.focus();
  await page.keyboard.press("Home");
  await expect(basic).toBeFocused();
  await expect(basic).toHaveAttribute("aria-selected", "true");
  await expect(demo.getByRole("tabpanel")).toHaveCount(1);
  await expect(demo.getByRole("region")).toContainText("print(runs)");
});

test("the plain-text snippet copies complete output without a provider", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  const demo = page.locator('[data-code-block-demo="plain-text"]');
  await waitForDocsIsland(demo);
  await expect(demo.getByRole("region", { name: "Build output" })).toContainText("Build complete.");
  await expect(demo.locator(".shiki")).toHaveCount(0);
  await demo.getByRole("button", { name: "Copy", exact: true }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('$ pnpm build\nBuilding application...\n\n12 modules transformed.\nBuild complete.');
});

test("shows a terminal icon in the header and copies only the output", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  const demo = page.locator('[data-code-block-demo="header"]');
  await waitForDocsIsland(demo);
  await expect(demo.locator("figcaption")).toContainText("Terminal");
  await expect(demo.locator("figcaption svg").first()).toBeVisible();
  await expect(demo.getByRole("region", { name: "Terminal", exact: true })).toContainText("Packages installed.");
  await demo.screenshot({ path: test.info().outputPath("terminal-header.png") });
  await demo.getByRole("button", { name: "Copy", exact: true }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('$ pnpm add @dicehub/kappa\nPackages installed.\nDone.');
});

for (const theme of ["light", "dark"] as const) {
  test(`header actions wrap, download, and copy the same output in ${theme} mode`, async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.setViewportSize({ width: 320, height: 844 });
    if (theme === "dark") {
      await page.getByRole("button", { name: "Toggle theme" }).filter({ visible: true }).click();
    }
    const demo = page.locator('[data-code-block-demo="actions"]');
    await waitForDocsIsland(demo);
    const region = demo.getByRole("region", { name: "Terminal", exact: true });
    const wrap = demo.getByRole("button", { name: "Wrap lines", exact: true });
    await expect(wrap).toHaveAttribute("aria-pressed", "true");
    await expect.poll(() => region.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
    await demo.screenshot({ path: test.info().outputPath(`terminal-actions-${theme}.png`) });
    await demo.getByRole("button", { name: "Copy", exact: true }).click();
    const source = await page.evaluate(() => navigator.clipboard.readText());
    expect(source).toBe(`$ pnpm lint
src/pages/runs.vue
  8:15  error    'runs' is possibly 'undefined'. Check the response before reading the first run.
  24:7  warning  'selectedRun' is declared but its value is never read.

2 problems (1 error, 1 warning)`);
    await wrap.focus();
    await page.keyboard.press("Space");
    await expect(wrap).toHaveAttribute("aria-pressed", "false");
    await expect.poll(() => region.evaluate(element => element.scrollWidth > element.clientWidth)).toBe(true);
    await expect(wrap).toBeFocused();
    await page.keyboard.press("Tab");
    const downloadLink = demo.getByRole("link", { name: "Download output", exact: true });
    await expect(downloadLink).toBeFocused();
    const downloaded = page.waitForEvent("download");
    await page.keyboard.press("Enter");
    const download = await downloaded;
    expect(download.suggestedFilename()).toBe("lint.log");
    expect(await readFile((await download.path())!, "utf8")).toBe(source);
    await wrap.click();
    await expect.poll(() => region.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
    await demo.getByRole("button", { name: /Copy|Copied!/ }).click();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(source);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test("switches files and copies only the visible file on mobile", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.setViewportSize({ width: 320, height: 844 });
  const demo = page.locator('[data-code-block-demo="file-tabs"]');
  await waitForDocsIsland(demo);
  await demo.getByRole("tab", { name: "config.json", exact: true }).click();
  await expect(demo.getByRole("tab", { name: "config.json", exact: true })).toHaveAttribute("aria-selected", "true");
  await expect(demo.getByRole("tabpanel")).toHaveCount(1);
  await expect(demo.getByRole("region")).toContainText('"solver": "pimpleFoam"');
  await demo.getByRole("button", { name: "Copy", exact: true }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('{' + '\n  "solver": "pimpleFoam",\n  "partitions": 8,\n  "adaptive": true\n}');
  await demo.getByRole("tab", { name: "client.ts", exact: true }).focus();
  await page.keyboard.press("End");
  await expect(demo.getByRole("tab", { name: "run.sh", exact: true })).toHaveAttribute("aria-selected", "true");
  await expect(demo.getByRole("tabpanel")).toHaveCount(1);
  await expect(demo.getByRole("region")).toContainText("set -euo pipefail");
  await expect(demo.locator(".shiki")).toBeVisible();
  await demo.screenshot({ path: test.info().outputPath("file-tabs-mobile.png") });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

for (const theme of ["light", "dark"] as const) {
  test(`wraps numbered lines without changing the source in ${theme} mode`, async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.setViewportSize({ width: 320, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    if (theme === "dark") {
      await page.getByRole("button", { name: "Toggle theme" }).filter({ visible: true }).click();
    }
    const demo = page.locator('[data-code-block-demo="wrap"]');
    await waitForDocsIsland(demo);
    const region = demo.getByRole("region", { name: "Fetch simulation results" });
    const toggle = demo.getByRole("button", { name: "Wrap lines", exact: true });
    await expect(region.locator(".shiki")).toBeVisible();
    await expect.poll(() => region.evaluate(e => e.scrollWidth > e.clientWidth)).toBe(true);
    const numbers = region.locator('[data-slot="code-block-line-number"]');
    await expect(numbers).toHaveText(["1", "2", "3", "4"]);
    await demo.getByRole("button", { name: "Copy", exact: true }).click();
    const source = await page.evaluate(() => navigator.clipboard.readText());
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await expect.poll(() => region.evaluate(e => e.scrollWidth <= e.clientWidth)).toBe(true);
    const line1 = await numbers.nth(0).boundingBox();
    const line2 = await numbers.nth(1).boundingBox();
    const line3 = await numbers.nth(2).boundingBox();
    const line4 = await numbers.nth(3).boundingBox();
    expect(line2!.y - line1!.y).toBeGreaterThan(40);
    expect(line3!.y - line2!.y).toBeCloseTo(20, 0);
    expect(line4!.y - line3!.y).toBeGreaterThanOrEqual(20);
    await region.focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Shift+Tab");
    await expect(region).toBeFocused();
    await expect(region).toHaveCSS("outline-style", "solid");
    await expect(region).toHaveAttribute("dir", "ltr");
    await demo.getByRole("button", { name: /Copy|Copied!/ }).click();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(source);
    expect(source).toContain(";\n\nconst response");
    const selected = await region.locator("code").evaluate(element => {
      const range = document.createRange();
      range.selectNodeContents(element);
      const selection = window.getSelection()!;
      selection.removeAllRanges();
      selection.addRange(range);
      const text = selection.toString();
      selection.removeAllRanges();
      return text;
    });
    expect(selected).toBe(source);
    await toggle.click();
    await expect.poll(() => region.evaluate(e => e.scrollWidth > e.clientWidth)).toBe(true);
  });
}

for (const theme of ["light", "dark"] as const) {
  test(`expands long code and copies the full source while collapsed in ${theme} mode`, async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.setViewportSize(theme === "dark" ? { width: 320, height: 844 } : { width: 1280, height: 900 });
    if (theme === "dark") {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.getByRole("button", { name: "Toggle theme" }).filter({ visible: true }).click();
    }
    const demo = page.locator('[data-code-block-demo="collapsible"]');
    await waitForDocsIsland(demo);
    const region = demo.getByRole("region", { name: "fetch-runs.ts", exact: true });
    const expand = demo.getByRole("button", { name: "Expand code", exact: true });
    await expect(region.locator(".shiki")).toBeVisible();
    await expect(expand).toHaveAttribute("aria-expanded", "false");
    await expect(region).not.toHaveAttribute("tabindex", "0");
    const content = page.locator(`[id="${await expand.getAttribute("aria-controls")}"]`);
    await expect.poll(async () => Math.round((await content.boundingBox())!.height)).toBe(144);
    await demo.getByRole("button", { name: "Copy", exact: true }).click();
    const source = await page.evaluate(() => navigator.clipboard.readText());
    expect(source).toBe(`export async function fetchRuns(projectId: string) {
  const query = new URLSearchParams({ projectId });
  const response = await fetch(\`/api/runs?\${query}\`);

  if (!response.ok) {
    throw new Error("Could not fetch runs");
  }

  const runs = await response.json();
  return runs.filter((run) => run.status === "completed");
}

const runs = await fetchRuns("wind-tunnel");
console.log(runs);`);
    await expand.focus();
    await page.keyboard.press("Enter");
    const collapse = demo.getByRole("button", { name: "Collapse code", exact: true });
    await expect(collapse).toHaveAttribute("aria-expanded", "true");
    await expect(collapse).toBeFocused();
    await expect(region).toHaveAttribute("tabindex", "0");
    await expect.poll(async () => (await content.boundingBox())!.height).toBeGreaterThan(290);
    await demo.getByRole("button", { name: /Copy|Copied!/ }).click();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(source);
    await collapse.focus();
    await page.keyboard.press("Space");
    await expect(expand).toHaveAttribute("aria-expanded", "false");
    await expect(expand).toBeFocused();
    await expect.poll(async () => Math.round((await content.boundingBox())!.height)).toBe(144);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (theme === "dark") await expect(content).toHaveCSS("animation-name", "none");
  });
}

test("keeps the legacy URL and Markdown available", async ({ page, request }) => {
  await page.goto("/docs/components/code-highlighted#tabbed-examples");
  await expect(page.getByRole("heading", { name: "Code Block", exact: true, level: 1 })).toBeVisible();
  await expect(page.locator("#desktop-navigation").getByRole("link", { name: "Code Block", exact: true }))
    .toHaveAttribute("aria-current", "page");
  for (const route of ["code-highlighted", "code-block"]) {
    const response = await request.get(`/docs/components/${route}.md`);
    expect(response.ok()).toBe(true);
    expect(await response.text()).toContain('@dicehub/kappa/components/code-block');
  }
});
