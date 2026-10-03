import { expect, test, type Locator, type Page } from "@playwright/test";

const root = (page: Page, variant = "preview") => page.locator(`[data-image-cropper-demo="${variant}"]`);
async function geometry(demo: Locator) {
  return demo.locator("[data-crop-geometry]").evaluate(element => ({
    x: Number(element.getAttribute("data-x")), y: Number(element.getAttribute("data-y")),
    width: Number(element.getAttribute("data-width")), height: Number(element.getAttribute("data-height")),
    zoom: Number(element.getAttribute("data-zoom")),
    naturalWidth: Number(element.getAttribute("data-natural-width")), naturalHeight: Number(element.getAttribute("data-natural-height")),
  }));
}
async function bounded(demo: Locator) {
  const crop = await geometry(demo);
  expect(crop.x).toBeGreaterThanOrEqual(-1);
  expect(crop.y).toBeGreaterThanOrEqual(-1);
  expect(crop.x + crop.width).toBeLessThanOrEqual(crop.naturalWidth + 1);
  expect(crop.y + crop.height).toBeLessThanOrEqual(crop.naturalHeight + 1);
}

test.beforeEach(async ({ page }) => {
  await page.goto("/docs/components/image-cropper");
  await expect(root(page).locator('[data-slot="image-cropper"]')).toHaveAttribute("data-state", "ready");
  await expect(root(page).locator("[data-crop-geometry]")).toBeVisible();
});

test("the crop moves over a fixed image; zoom, ratio, and reset keep proportions", async ({ page }) => {
  const demo = root(page);
  const selection = demo.getByRole("slider", { name: "Crop position" });
  const image = demo.locator('[data-part="image"]');
  const original = await geometry(demo);
  expect(original.width / original.height).toBeCloseTo(1, 2);
  await selection.focus();
  await selection.press("+");
  await expect.poll(async () => (await geometry(demo)).zoom).toBeCloseTo(1.1, 2);
  await selection.press("Shift+ArrowRight");
  expect((await geometry(demo)).x).not.toBe(original.x);
  await selection.press("Control+ArrowDown");
  await bounded(demo);

  const imageTransform = await image.evaluate(element => getComputedStyle(element).transform);
  const box = (await selection.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + 1800, box.y + 1800, { steps: 3 });
  await page.mouse.up();
  await bounded(demo);
  expect(await image.evaluate(element => getComputedStyle(element).transform)).toBe(imageTransform);
  await demo.getByRole("button", { name: "Reset crop" }).click();
  await expect.poll(() => geometry(demo)).toEqual(original);

  const viewport = demo.locator('[data-part="viewport"]');
  const viewportBox = (await viewport.boundingBox())!;
  const beforeBackgroundDrag = await geometry(demo);
  await page.mouse.move(viewportBox.x + 4, viewportBox.y + 4);
  await page.mouse.down();
  await page.mouse.move(viewportBox.x + 44, viewportBox.y + 44, { steps: 3 });
  await page.mouse.up();
  expect(await geometry(demo)).toEqual(beforeBackgroundDrag);

  const zoom = demo.getByRole("slider", { name: "Zoom", exact: true });
  await zoom.focus();
  await zoom.press("End");
  await expect(zoom).toHaveAttribute("aria-valuenow", "5");
  await bounded(demo);
  await demo.getByRole("combobox", { name: "Crop ratio" }).selectOption("1.7777777777777777");
  await expect.poll(async () => (await geometry(demo)).zoom).toBe(1);
  const wide = await geometry(demo);
  expect(wide.width / wide.height).toBeCloseTo(16 / 9, 2);
  await bounded(demo);
});

test("free mode exposes edge and corner handles with independent resizing", async ({ page }) => {
  const demo = root(page, "free");
  const selection = demo.getByRole("slider", { name: "Crop position" });
  await selection.scrollIntoViewIfNeeded();
  const handles = demo.locator('[data-part="handle"]');
  await expect(handles).toHaveCount(8);
  expect((await handles.evaluateAll(elements => elements.map(element => element.getAttribute("data-position")).sort())))
    .toEqual(["e", "n", "ne", "nw", "s", "se", "sw", "w"]);
  const before = (await selection.boundingBox())!;

  const east = demo.locator('[data-part="handle"][data-position="e"]');
  const eastBox = (await east.boundingBox())!;
  await page.mouse.move(eastBox.x + eastBox.width / 2, eastBox.y + eastBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(eastBox.x + eastBox.width / 2 + 36, eastBox.y + eastBox.height / 2, { steps: 4 });
  await page.mouse.up();
  const afterEast = (await selection.boundingBox())!;
  expect(afterEast.width).toBeGreaterThan(before.width + 20);
  expect(afterEast.height).toBeCloseTo(before.height, 0);

  const north = demo.locator('[data-part="handle"][data-position="n"]');
  const northBox = (await north.boundingBox())!;
  await page.mouse.move(northBox.x + northBox.width / 2, northBox.y + northBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(northBox.x + northBox.width / 2, northBox.y + northBox.height / 2 - 24, { steps: 4 });
  await page.mouse.up();
  const afterNorth = (await selection.boundingBox())!;
  expect(afterNorth.height).toBeGreaterThan(afterEast.height + 12);
  expect(afterNorth.width).toBeCloseTo(afterEast.width, 0);
  await bounded(demo);

  await demo.getByRole("button", { name: "Reset crop" }).click();
  await selection.scrollIntoViewIfNeeded();
  const beforeCorner = (await selection.boundingBox())!;
  const southeast = demo.locator('[data-part="handle"][data-position="se"]');
  const southeastBox = (await southeast.boundingBox())!;
  await page.mouse.move(southeastBox.x + southeastBox.width / 2, southeastBox.y + southeastBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(southeastBox.x + southeastBox.width / 2 + 20, southeastBox.y + southeastBox.height / 2 + 20, { steps: 4 });
  await page.mouse.up();
  const afterCorner = (await selection.boundingBox())!;
  expect(afterCorner.width).toBeGreaterThan(beforeCorner.width + 10);
  expect(afterCorner.height).toBeGreaterThan(beforeCorner.height + 10);
});

test("exports real crop pixels and scales down to the requested size", async ({ page }) => {
  const demo = root(page);
  await demo.getByRole("button", { name: "Export PNG" }).click();
  const result = demo.getByRole("img", { name: "Exported crop" });
  await expect(result).toBeVisible();
  await expect.poll(() => result.evaluate((image: HTMLImageElement) => [image.naturalWidth, image.naturalHeight])).toEqual([512, 512]);
  const pixels = await result.evaluate(async (image: HTMLImageElement) => {
    const blob = await (await fetch(image.src)).blob();
    const canvas = document.createElement("canvas"); canvas.width = 512; canvas.height = 512;
    const context = canvas.getContext("2d")!;
    context.drawImage(image, 0, 0);
    return { type: blob.type, size: blob.size, center: [...context.getImageData(256, 256, 1, 1).data], corner: [...context.getImageData(0, 0, 1, 1).data] };
  });
  expect(pixels.type).toBe("image/png");
  expect(pixels.size).toBeGreaterThan(1000);
  expect(pixels.center[3]).toBe(255);
  expect(pixels.corner[3]).toBe(255);
  expect(pixels.center).not.toEqual(pixels.corner);
  const download = page.waitForEvent("download");
  await demo.getByRole("link", { name: "Download crop" }).click();
  expect((await download).suggestedFilename()).toBe("image-crop.png");
});

test("local files, invalid images, clear, and replacement recover cleanly", async ({ page }) => {
  const demo = root(page);
  const file = demo.locator('input[type="file"]');
  await file.setInputFiles({ name: "invalid.png", mimeType: "image/png", buffer: Buffer.from("invalid") });
  await expect(demo.locator('[data-slot="image-cropper"]')).toHaveAttribute("data-state", "error");
  await expect(demo.getByRole("alert")).toContainText("could not be loaded");
  await expect(demo.getByRole("button", { name: "Export PNG" })).toBeDisabled();
  await file.setInputFiles({ name: "portrait.svg", mimeType: "image/svg+xml", buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="320" height="640"><rect width="320" height="640" fill="#247ab7"/></svg>') });
  await expect(demo.locator('[data-slot="image-cropper"]')).toHaveAttribute("data-state", "ready");
  await expect.poll(async () => (await geometry(demo)).naturalHeight).toBe(640);
  expect((await geometry(demo)).naturalWidth).toBe(320);
  await bounded(demo);
  await demo.getByRole("button", { name: "Clear image" }).click();
  await expect(demo.locator('[data-slot="image-cropper"]')).toHaveAttribute("data-state", "empty");
  await expect(demo.getByRole("button", { name: "Export PNG" })).toBeDisabled();
  await demo.getByRole("button", { name: "Use sample" }).click();
  await expect.poll(async () => (await geometry(demo)).naturalWidth).toBe(960);
});

test("read only and disabled states block pointer, wheel, and keyboard changes", async ({ page }) => {
  const demo = root(page, "states");
  await expect(demo.locator("[data-crop-geometry]")).toBeVisible();
  const original = await geometry(demo);
  const selection = demo.getByRole("slider", { name: "Crop position" });
  await demo.getByRole("combobox", { name: "Cropper state" }).selectOption("readonly");
  await expect(selection).toHaveAttribute("aria-readonly", "true");
  await selection.focus(); await selection.press("+"); await selection.press("ArrowRight");
  await selection.hover(); await page.mouse.wheel(0, -100);
  expect(await geometry(demo)).toEqual(original);
  await expect(demo.getByRole("button", { name: "Reset crop" })).toBeDisabled();
  await expect(demo.getByRole("button", { name: "Export PNG" })).toBeEnabled();
  await selection.focus();
  await page.keyboard.press("Tab");
  await expect(selection).not.toBeFocused();
  await demo.getByRole("combobox", { name: "Cropper state" }).selectOption("disabled");
  await expect(selection).toHaveAttribute("tabindex", "-1");
  await expect(demo.getByRole("button", { name: "Export PNG" })).toBeDisabled();
  expect(await geometry(demo)).toEqual(original);
});

test("narrow, dark, and reduced-motion layouts keep the crop accessible", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.evaluate(() => document.documentElement.setAttribute("data-kappa-theme", "dark"));
  const demo = root(page);
  await expect.poll(() => demo.evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
  await bounded(demo);
  await expect(demo.getByRole("img", { name: "Crop preview" })).toBeVisible();
  const selection = demo.getByRole("slider", { name: "Crop position" });
  await selection.focus();
  await expect(selection).toBeFocused();
  expect(await selection.evaluate(element => getComputedStyle(element).outlineStyle)).not.toBe("none");
  // The docs shell also applies a 0.01 ms reduced-motion override.
  expect(await demo.locator(".kappa-image-cropper__grid").first().evaluate(element => Number.parseFloat(getComputedStyle(element).transitionDuration))).toBeLessThanOrEqual(0.001);
});
