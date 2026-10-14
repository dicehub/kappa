import { test, expect, visitConsumer } from "./fixtures";
import type { Page } from "@playwright/test";

const usable = (page: Page, url: string) => page.evaluate(async value => {
  try { return (await fetch(value)).ok; } catch { return false; }
}, url);
const image = (page: Page) => page.locator('[data-scope="image-cropper"][data-part="image"]');

test("owned Blob URLs are released on replacement and unmount; caller-owned URLs remain usable", async ({ page }) => {
  await visitConsumer(page, "/test-consumer/cropper");
  await page.getByRole("button", { name: "Set owned image", exact: true }).click();
  await expect(image(page)).toBeVisible();
  const owned = (await image(page).getAttribute("src"))!;
  expect(await usable(page, owned)).toBe(true);
  await page.getByRole("button", { name: "Set caller image", exact: true }).click();
  await expect(page.getByLabel("Caller URL")).not.toHaveText("");
  const caller = await page.getByLabel("Caller URL").textContent();
  await expect(image(page)).toHaveAttribute("src", caller!);
  await expect.poll(() => usable(page, owned)).toBe(false);
  expect(await usable(page, caller!)).toBe(true);
  await page.getByRole("button", { name: "Set owned image", exact: true }).click();
  await expect(image(page)).not.toHaveAttribute("src", caller!);
  expect(await usable(page, caller!)).toBe(true);
  const next = (await image(page).getAttribute("src"))!;
  await page.getByRole("button", { name: "Unmount cropper", exact: true }).click();
  await expect(image(page)).toHaveCount(0);
  expect(await usable(page, next)).toBe(false);
  expect(await usable(page, caller!)).toBe(true);
  await page.evaluate(url => URL.revokeObjectURL(url), caller!);
});

test("real image decode reports errors, recovers and exports bounded pixels", async ({ page }) => {
  await visitConsumer(page, "/test-consumer/cropper");
  await page.getByRole("button", { name: "Set invalid image", exact: true }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(page.getByLabel("Public errors")).toContainText("load");
  await page.getByRole("button", { name: "Set owned image", exact: true }).click();
  await expect(image(page)).toBeVisible();
  await expect(page.getByRole("slider", { name: "Zoom", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Export image", exact: true }).click();
  await expect(page.getByLabel("Export result")).not.toHaveText("");
  const exported = JSON.parse((await page.getByLabel("Export result").textContent())!);
  expect(exported).toEqual({ width: 20, height: 20, pixel: [255, 0, 0, 255], type: "image/png" });
  await page.getByRole("button", { name: "Clear image", exact: true }).click();
  await expect(image(page)).toHaveCount(0);
  await page.getByRole("button", { name: "Export image", exact: true }).click();
  await expect(page.getByLabel("Public errors")).toContainText("not ready to export");
});

test("a real zero-width SVG reports a load error and a replacement can still be exported", async ({ page }) => {
  await visitConsumer(page, "/test-consumer/cropper");
  await page.getByRole("button", { name: "Set zero-width image", exact: true }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(page.getByLabel("Public events")).not.toContainText("load:");
  await page.getByRole("button", { name: "Set owned image", exact: true }).click();
  await expect(image(page)).toBeVisible();
  await page.getByRole("button", { name: "Export image", exact: true }).click();
  await expect(page.getByLabel("Export result")).toContainText('"width":20');
});

test("public export rejects invalid bounds and quality, then accepts fractional bounds and zero quality", async ({ page }) => {
  await visitConsumer(page, "/test-consumer/cropper");
  await page.getByRole("button", { name: "Set owned image", exact: true }).click();
  await expect(image(page)).toBeVisible();
  const errors = page.getByLabel("Export error");
  const invalid = [
    ...[0, -1, 8193, { $number: "Infinity" }, { $number: "NaN" }].map(width => ({ maxSize: { width, height: 20 } })),
    ...[-1, 1.1, { $number: "Infinity" }, { $number: "NaN" }].map(quality => ({ quality })),
  ];
  for (const options of invalid) {
    const previousErrors = await page.getByLabel("Public errors").textContent();
    await page.getByLabel("Export options").fill(JSON.stringify(options));
    await page.getByRole("button", { name: "Export image", exact: true }).click();
    await expect(page.getByLabel("Public errors")).not.toHaveText(previousErrors!);
    await expect(errors).toHaveText("maxSize" in options
      ? "RangeError: Image export dimensions must be between 1 and 8192 pixels."
      : "RangeError: Image export quality must be between 0 and 1.");
    await expect(page.getByLabel("Export result")).toHaveText("");
  }
  await page.getByLabel("Export options").fill('{"quality":0,"maxSize":{"width":20.5,"height":20.5}}');
  await page.getByRole("button", { name: "Export image", exact: true }).click();
  await expect(page.getByLabel("Export result")).toContainText('"width":20,"height":20');
  await expect(errors).toHaveText("");
});

test("a pending network image is cancelled on replacement", async ({ page }) => {
    await visitConsumer(page, "/test-consumer/cropper");
    let release!: () => void, started!: () => void;
    const pending = new Promise<void>(resolve => { release = resolve; });
    const requested = new Promise<void>(resolve => { started = resolve; });
    const path = "/test-consumer/pending-crop.svg";
    const failed = page.waitForEvent("requestfailed", { predicate: request => new URL(request.url()).pathname === path });
    await page.route(`**${path}`, async route => {
      started();
      await pending;
      // Network boundary only. The browser may cancel the superseded image request.
      await route.fulfill({ contentType: "image/svg+xml", body: '<svg xmlns="http://www.w3.org/2000/svg" width="90" height="30"><rect width="90" height="30" fill="blue"/></svg>' }).catch(error => {
        if (!/Invalid InterceptionId|already handled|Target.*closed|Request.*cancel/i.test(String(error))) throw error;
      });
    });
    await page.getByLabel("Remote source").fill(new URL(path, page.url()).href);
    await page.getByRole("button", { name: "Set remote image", exact: true }).click();
    await requested;
    await expect(page.locator('[data-slot="image-cropper"]')).toHaveAttribute("data-state", "loading");
    await page.getByRole("button", { name: "Set owned image", exact: true }).click();
    await expect(image(page)).toBeVisible();
    await expect(page.getByLabel("Public events")).toContainText('load:{"width":80,"height":40}');
    const before = await page.getByLabel("Public events").textContent();
    release();
    await page.unrouteAll({ behavior: "wait" });
    expect((await failed).failure()?.errorText).toContain("ERR_ABORTED");
    await expect(page.getByLabel("Public events")).toHaveText(before!);
    await page.getByRole("button", { name: "Export image", exact: true }).click();
    await expect(page.getByLabel("Export result")).toContainText('"pixel":[255,0,0,255]');
});
