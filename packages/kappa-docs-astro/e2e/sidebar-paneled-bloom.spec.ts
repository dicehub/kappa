import { expect, test } from "@playwright/test";

const examplePath = "/examples/appshell/paneled-workspace";
const selector = '[data-sidebar-block="paneled-workspace"] .kappa-app-shell';

test("paneled bloom images load with original dimensions and transparent edges", async ({ page }) => {
  await page.goto(examplePath);
  const assets = [
    { pseudo: "::before", width: 350, height: 600 },
    { pseudo: "::after", width: 1200, height: 400 },
  ];
  for (const asset of assets) {
    const result = await page.locator(selector).evaluate(async (node, { pseudo }) => {
      const image = new Image();
      image.src = getComputedStyle(node, pseudo).backgroundImage.slice(5, -2);
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext("2d")!;
      context.drawImage(image, 0, 0);
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
      let transparent = 0, maxAlpha = 0;
      const alphaLevels = new Set<number>();
      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) transparent++;
        maxAlpha = Math.max(maxAlpha, pixels[i]);
        alphaLevels.add(pixels[i]);
      }
      return {
        width: image.naturalWidth, height: image.naturalHeight,
        topLeftAlpha: pixels[3], transparent, maxAlpha, alphaLevels: alphaLevels.size,
      };
    }, asset);
    expect(result.width).toBe(asset.width);
    expect(result.height).toBe(asset.height);
    expect(result.topLeftAlpha).toBe(0);
    expect(result.transparent).toBeGreaterThan(0);
    expect(result.transparent).toBeLessThan(asset.width * asset.height);
    expect(result.maxAlpha).toBeGreaterThan(0);
    expect(result.maxAlpha).toBeLessThan(128);
    expect(result.alphaLevels).toBeGreaterThan(8);
  }
});

test("paneled bloom uses the reference placement, 992px breakpoint, and panel crossfade", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(examplePath);
  const shell = page.locator(selector);
  await expect.poll(() => shell.evaluate(node => node.closest("astro-island")?.hasAttribute("ssr"))).toBe(false);
  const layer = (pseudo: "::before" | "::after") => shell.evaluate((node, part) => {
    const style = getComputedStyle(node, part);
    return {
      image: style.backgroundImage, size: style.backgroundSize, position: style.backgroundPosition,
      opacity: style.opacity, repeat: style.backgroundRepeat, pointerEvents: style.pointerEvents,
      transition: style.transitionDuration,
    };
  }, pseudo);
  expect(await layer("::before")).toMatchObject({
    image: expect.stringMatching(/(?:paneled-side|data:image\/png)/), size: "350px 600px",
    position: "100% 0%", repeat: "no-repeat", opacity: "1", pointerEvents: "none", transition: "0s",
  });
  await page.setViewportSize({ width: 991, height: 1000 });
  await expect.poll(async () => (await layer("::before")).opacity).toBe("0");
  await page.setViewportSize({ width: 992, height: 1000 });
  await expect.poll(async () => (await layer("::before")).opacity).toBe("1");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.evaluate(() => document.documentElement.setAttribute("data-kappa-theme", "dark"));
  await shell.getByRole("button", { name: "Activity", exact: true }).click();
  await expect.poll(async () => (await layer("::before")).opacity).toBe("0");
  await expect.poll(async () => (await layer("::after")).opacity).toBe("1");
  expect(await layer("::after")).toMatchObject({
    image: expect.stringMatching(/(?:paneled-bottom|data:image\/png)/), size: "1200px 400px",
    position: "calc(100% + 300px) 100%", pointerEvents: "none", transition: "0s",
  });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect.poll(async () => (await layer("::after")).transition).toBe("0.6s");
});
