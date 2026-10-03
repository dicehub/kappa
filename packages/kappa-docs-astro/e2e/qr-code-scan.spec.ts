import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";
import { expectQrImage, expectQrQuietZone } from "./helpers/qr-code";

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/docs/components/qr-code");
  await expect(page.locator('[data-qr-code-demo="preview"]').locator("xpath=ancestor::astro-island[1]")).not.toHaveAttribute("ssr");
});

for (const mode of ["light", "dark", "mobile"] as const) {
  test(`decodes every displayed example in ${mode} mode`, async ({ page }) => {
    const examples = {
      preview: "https://example.com/start",
      usage: "https://example.com/events/meetup",
      controlled: "https://example.com/guide",
      overlay: "https://example.com/account",
      download: "https://example.com/contact",
    };
    if (mode !== "light") {
      await page.getByRole("button", { name: "Toggle theme" }).filter({ visible: true }).click();
      await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
    }
    if (mode === "mobile") await page.setViewportSize({ width: 390, height: 844 });
    for (const [variant, value] of Object.entries(examples)) {
      const frame = page.locator(`[data-qr-code-demo="${variant}"] [data-slot="qr-code-frame"]`);
      // Keep the docs' fixed header outside the pixels being scanned.
      await frame.evaluate(element => element.scrollIntoView({ block: "center" }));
      await expectQrImage(page, await frame.screenshot(), value);
    }
  });
}

test("encodes four clear modules by default and preserves controlled destinations", async ({ page }) => {
  const frames = page.locator('[data-slot="qr-code-frame"]');
  for (const frame of await frames.all()) {
    const margin = await frame.evaluate((element) => {
      const svg = element as SVGSVGElement;
      const path = svg.querySelector("path")!;
      const box = path.getBBox();
      const module = Number(path.getAttribute("d")!.match(/h([\d.]+)/)![1]);
      return [box.x, box.y, svg.viewBox.baseVal.width - box.x - box.width,
        svg.viewBox.baseVal.height - box.y - box.height].map(value => value / module);
    });
    expect(margin).toEqual([4, 4, 4, 4]);
  }
  const controlled = page.locator('[data-qr-code-demo="controlled"]');
  const input = controlled.getByRole("textbox", { name: "Destination" });
  const frame = controlled.locator('[data-slot="qr-code-frame"]');
  const value = "https://example.com/search?q=mesh%20size&units=mm";
  await input.fill(value);
  await expect.poll(async () => {
    await expectQrImage(page, await frame.screenshot(), value);
    return true;
  }).toBe(true);
  await controlled.getByRole("button", { name: "Use support link" }).click();
  await expect(input).toHaveValue("https://example.com/support");
  await expectQrImage(page, await frame.screenshot(), "https://example.com/support");
});

test.describe("high-density image export", () => {
  test.use({ deviceScaleFactor: 2 });

  test("downloads an opaque PNG with a quiet zone in both themes", async ({ page }) => {
    for (const theme of ["light", "dark"]) {
      if (theme === "dark") {
        await page.getByRole("button", { name: "Toggle theme" }).filter({ visible: true }).click();
        await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
      }
      const downloaded = page.waitForEvent("download");
      await page.locator('[data-qr-code-demo="download"]').getByRole("button", { name: "Download PNG" }).click();
      const download = await downloaded;
      expect(download.suggestedFilename()).toBe("contact-link.png");
      const pixels = await expectQrImage(page, await readFile((await download.path())!), "https://example.com/contact");
      expect(pixels.width).toBe(pixels.height);
      expect(pixels.data.filter((_, index) => index % 4 === 3).every(alpha => alpha === 255)).toBe(true);
      expectQrQuietZone(pixels);
    }
  });
});
