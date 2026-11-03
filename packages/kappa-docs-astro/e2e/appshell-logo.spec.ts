import { expect, test, type Locator } from "@playwright/test";

const path = "/examples/appshell/paneled-workspace";
const fills = (logo: Locator) => logo.locator("path").evaluateAll(paths =>
  paths.map(path => getComputedStyle(path).fill),
);

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(path);
  await expect.poll(() => page.locator("astro-island").evaluate(node => node.hasAttribute("ssr"))).toBe(false);
});

test("cube and wordmark share one Dashboard link and fit narrow headers", async ({ page }) => {
  const home = page.getByRole("link", { name: "dicehub home", exact: true });
  for (const target of [".kappa-dicehub-logo--glyph", ".kappa-app-shell__wordmark"]) {
    await page.goto(`${path}?view=Wind+Aero+Study&project=WA-01`);
    await expect.poll(() => page.locator("astro-island").evaluate(node => node.hasAttribute("ssr"))).toBe(false);
    await expect(home).toHaveCount(1);
    await expect(home).toHaveAttribute("href", "?view=Dashboard");
    await home.locator(target).click();
    await expect(page).toHaveURL(/\?view=Dashboard$/);
    await expect(page.getByRole("heading", { name: "Dashboard", exact: true })).toBeVisible();
  }
  for (const width of [320, 375, 384, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await expect(home.locator(".kappa-dicehub-logo--glyph")).toBeVisible();
    if (width < 384) await expect(home.locator(".kappa-app-shell__wordmark")).toBeHidden();
    else await expect(home.locator(".kappa-app-shell__wordmark")).toBeVisible();
    const brand = (await home.boundingBox())!;
    const toggle = (await page.getByRole("button", { name: "Open sidebar", exact: true }).boundingBox())!;
    expect(toggle.x).toBeGreaterThanOrEqual(brand.x + brand.width);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
  }
});

test("corner logo is 24px high on desktop and mobile without distorting the artwork", async ({ page }) => {
  const logo = page.getByRole("link", { name: "dicehub home", exact: true }).locator(".kappa-dicehub-logo--glyph");
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    const size = await logo.evaluate(node => {
      const svg = node as SVGSVGElement;
      const matrix = svg.getScreenCTM()!;
      return { height: svg.getBBox().height * matrix.d, scaleX: matrix.a, scaleY: matrix.d };
    });
    expect(size.height).toBeCloseTo(24, 2);
    expect(size.scaleX).toBe(size.scaleY);
  }
});

test("corner logo keeps each face highlighted across its cutouts and gaps", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const home = page.getByRole("link", { name: "dicehub home", exact: true });
  const logo = home.locator(".kappa-dicehub-logo--glyph");
  const original = await fills(logo);
  for (const face of [
    { paths: [0, 1], points: [[16, 3], [12.2, 8.5], [16, 17.2]] },
    { paths: [2], points: [[28, 17], [26.32, 18.7], [16.8, 25]] },
    { paths: [3, 4], points: [[3, 17], [6.5, 20], [15.6, 25]] },
  ]) {
    for (const [x, y] of face.points) {
      const point = await logo.evaluate((node, { x, y }) => {
        const svg = node as SVGSVGElement;
        const p = new DOMPoint(x, y).matrixTransform(svg.getScreenCTM()!);
        return { x: p.x, y: p.y };
      }, { x, y });
      await page.mouse.move(point.x, point.y, { steps: 10 });
      await expect.poll(async () => (await fills(logo)).map((fill, index) => fill !== original[index]))
        .toEqual(original.map((_, index) => face.paths.includes(index)));
    }
    await page.mouse.move(500, 300);
    await expect.poll(() => fills(logo)).toEqual(original);
  }
  // The transparent part of a face is still part of the native home link.
  const point = await logo.evaluate(node => {
    const p = new DOMPoint(26.32, 18.7).matrixTransform((node as SVGSVGElement).getScreenCTM()!);
    return { x: p.x, y: p.y };
  });
  await page.mouse.click(point.x, point.y);
  await expect(page.getByRole("heading", { name: "Dashboard", exact: true })).toBeVisible();
});

for (const theme of ["light", "dark"]) {
  test(`corner logo highlights individual faces and returns to its ${theme} ink`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.evaluate(theme => document.documentElement.setAttribute("data-kappa-theme", theme), theme);
    const home = page.getByRole("link", { name: "dicehub home", exact: true });
    const logo = home.locator(".kappa-dicehub-logo--glyph");
    await page.mouse.move(500, 300);
    const original = await fills(logo);

    for (const face of [
      { x: 16, y: 3, paths: [0, 1] },
      { x: 28, y: 17, paths: [2] },
      { x: 3, y: 17, paths: [3, 4] },
    ]) {
      const point = await logo.evaluate((node, face) => {
        const svg = node as SVGSVGElement;
        const point = new DOMPoint(face.x, face.y).matrixTransform(svg.getScreenCTM()!);
        return { x: point.x, y: point.y };
      }, face);
      await page.mouse.move(point.x, point.y);
      await expect.poll(async () => (await fills(logo)).map((fill, index) => fill !== original[index]))
        .toEqual(original.map((_, index) => face.paths.includes(index)));
      await expect(logo.locator("path").nth(face.paths[0])).toHaveCSS("transition-duration", "0.25s");
      await page.mouse.move(500, 300);
      await expect(logo.locator("path").nth(face.paths[0])).toHaveCSS("transition-duration", "0.8s");
      await expect.poll(() => fills(logo)).toEqual(original);
    }

    await page.keyboard.press("Tab");
    await expect(home).toBeFocused();
    await expect.poll(async () => (await fills(logo)).every((fill, index) => fill !== original[index])).toBe(true);
    await expect(home).toHaveCSS("outline-style", "solid");
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const part of await logo.locator("path").all()) await expect(part).toHaveCSS("transition-duration", "0s");
    await page.keyboard.press("Enter");
    await expect(page.getByRole("heading", { name: "Dashboard", exact: true })).toBeVisible();
  });
}
