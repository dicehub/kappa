import { readFile } from "node:fs/promises";
import { expect, test, type Locator, type Page } from "@playwright/test";

async function matchesArtwork(page: Page, logo: Locator, reference: string) {
  const actual = await logo.evaluate(node => {
    const svg = node.cloneNode(true) as SVGSVGElement;
    svg.style.color = getComputedStyle(node).color;
    return new XMLSerializer().serializeToString(svg);
  });
  const differentPixels = await page.evaluate(async ({ actual, reference }) => {
    const parser = new DOMParser();
    const expected = parser.parseFromString(reference, "image/svg+xml").documentElement;
    expected.setAttribute("fill", "#333333");
    const viewBox = expected.getAttribute("viewBox")!.split(/\s+/).map(Number);
    const width = viewBox[2] * 4;
    const height = viewBox[3] * 4;
    async function pixels(source: string) {
      const svg = parser.parseFromString(source, "image/svg+xml").documentElement;
      svg.setAttribute("width", String(width));
      svg.setAttribute("height", String(height));
      const image = new Image();
      image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(svg))}`;
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d")!;
      context.drawImage(image, 0, 0, width, height);
      return context.getImageData(0, 0, width, height).data;
    }
    const [left, right] = await Promise.all([pixels(actual), pixels(new XMLSerializer().serializeToString(expected))]);
    return left.reduce((count, value, index) => count + Number(value !== right[index]), 0);
  }, { actual, reference });
  expect(differentPixels).toBe(0);
}

test.beforeEach(async ({ page }) => {
  await page.goto("/docs/components/dicehub-logo");
  await expect.poll(() => page.locator('[data-logo-demo="basic"]').evaluate(node => node.closest('astro-island')?.hasAttribute('ssr'))).toBe(false);
});

test("horizontal and vertical logos match the supplied SVG artwork without a font dependency", async ({ page }) => {
  for (const [variant, file] of [["basic", "horizontal"], ["vertical", "vertical"]]) {
    const logo = page.locator(`[data-logo-demo="${variant}"] .kappa-dicehub-logo`).first();
    const reference = await readFile(new URL(`./fixtures/dicehub-logo/${file}.svg`, import.meta.url), "utf8");
    await logo.evaluate(node => { node.style.fontFamily = "serif"; node.style.fontWeight = "100"; });
    await matchesArtwork(page, logo, reference);
    await expect(logo.locator("text")).toHaveCount(0);
  }
});

test("the original attribution text uses loaded Nunito ExtraBold only for dicehub", async ({ page }) => {
  const badge = page.locator('[data-logo-demo="powered-basic"] .kappa-powered-by-dicehub');
  await expect(badge).toHaveAccessibleName("Powered by dicehub");
  await expect(badge.locator('span')).toHaveText('Powered by dicehub');
  await expect(badge.locator('strong')).toHaveText('dicehub');
  await expect(badge.locator('strong')).toHaveCSS('font-family', /^"Kappa Nunito",/);
  await expect(badge.locator('strong')).toHaveCSS('font-weight', '800');
  await expect(badge.locator('span')).toHaveCSS('font-weight', '500');
  expect(await badge.locator('span').evaluate(node => getComputedStyle(node).fontFamily)).not.toContain('Kappa Nunito');
  const loaded = await page.evaluate(async () => {
    await document.fonts.load('800 14px "Kappa Nunito"', 'dicehub');
    return [...document.fonts].some(font =>
      font.family.replaceAll('"', '') === 'Kappa Nunito' && font.weight === '800' && font.status === 'loaded');
  });
  expect(loaded).toBe(true);
});

test("theme ink applies to every path while black and white stay fixed", async ({ page }) => {
  for (const mode of ["light", "dark"]) {
    await page.evaluate(mode => document.documentElement.dataset.kappaTheme = mode, mode);
    for (const variant of ["colors", "glyph-colors", "vertical"]) {
      const demo = page.locator(`[data-logo-demo="${variant}"]`);
      for (const [color, expected] of [["color", mode === "light" ? "rgb(51, 51, 51)" : "rgb(255, 255, 255)"], ["black", "rgb(0, 0, 0)"], ["white", "rgb(255, 255, 255)"]]) {
        const logo = demo.locator(`.kappa-dicehub-logo--${color}`);
        await expect(logo).toHaveCSS("color", expected);
        for (const path of await logo.locator("path").all()) await expect(path).toHaveCSS("fill", expected);
      }
    }
    await expect(page.locator('[data-logo-demo="powered-basic"] .kappa-powered-by-dicehub strong')).toHaveCSS("color", mode === "light" ? "rgb(51, 51, 51)" : "rgb(255, 255, 255)");
  }
  await page.locator('[data-logo-demo="vertical"]').evaluate(node => node.setAttribute('data-kappa-theme', 'light'));
  await expect(page.locator('[data-logo-demo="vertical"] .kappa-dicehub-logo--color')).toHaveCSS('color', 'rgb(51, 51, 51)');
});

test("vertical SVG copies and downloads preserve the source geometry and fit on mobile", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.setViewportSize({ width: 390, height: 844 });
  const example = page.locator('[data-logo-demo="copy"]');
  await example.locator('summary').click();
  await example.getByRole('button', { name: 'Copy vertical logo as SVG', exact: true }).click();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain('viewBox="0 0 95 137"');
  expect(copied).not.toMatch(/<text|<style|<script/);
  await expect(example.locator('summary')).toBeFocused();
  await example.locator('summary').click();
  const downloading = page.waitForEvent('download');
  await example.getByRole('button', { name: 'Download vertical logo', exact: true }).click();
  const download = await downloading;
  expect(download.suggestedFilename()).toBe('dicehub-logo-vertical.svg');
  expect(await readFile((await download.path())!, 'utf8')).toBe(copied);
  await expect(example.locator('summary')).toBeFocused();
  const reference = await readFile(new URL('./fixtures/dicehub-logo/vertical.svg', import.meta.url), 'utf8');
  const svg = await page.evaluateHandle(source => new DOMParser().parseFromString(source, 'image/svg+xml').documentElement, copied);
  const preview = page.locator('[data-logo-demo="vertical"]');
  await preview.evaluate((node, svg) => node.append(svg), svg);
  await matchesArtwork(page, preview.locator('svg').last(), reference);
  await svg.dispose();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("the fixed-light signup heading keeps readable ink in dark mode", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('theme', 'dark'));
  await page.goto('/examples/signup/complete');
  await expect(page.locator('.signup-block-demo')).toHaveCSS('background-color', 'rgb(244, 244, 244)');
  await expect(page.locator('.signup-block-demo__title')).toHaveCSS('color', 'rgb(51, 51, 51)');
});
