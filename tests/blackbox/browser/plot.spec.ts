import { test, expect, visitConsumer } from "./fixtures";

test("each supported series path produces a distinct visible plot with the real engine", async ({ page }) => {
  await visitConsumer(page, "/test-consumer/plot");
  await expect.poll(async () => (await page.getByLabel("Ready plots").textContent())?.split(", ").sort())
    .toEqual(["bars", "line", "points", "spline", "stepped"]);
  await expect(page.getByRole("alert")).toHaveCount(0);
  const images: string[] = [];
  for (const path of ["line", "bars", "points", "spline", "stepped"]) {
    const plot = page.getByRole("region", { name: `${path} series`, exact: true });
    await expect(plot.getByRole("img", { name: `${path} series plot` })).toBeVisible();
    const canvas = plot.locator("canvas");
    await expect.poll(() => canvas.evaluate((element: HTMLCanvasElement) => {
      const pixels = element.getContext("2d")!.getImageData(0, 0, element.width, element.height).data;
      return pixels.some((value, index) => index % 4 === 3 && value > 0);
    })).toBe(true);
    images.push(await canvas.evaluate((element: HTMLCanvasElement) => element.toDataURL()));
  }
  expect(new Set(images).size, "Distinct series paths must not all fall back to one renderer.").toBe(5);

  for (const path of ["bars", "points"]) {
    const plot = page.getByRole("region", { name: `${path} series`, exact: true });
    const samples = await plot.evaluate(element => {
      const canvas = element.querySelector("canvas")!;
      const canvasBox = canvas.getBoundingClientRect();
      const plotBox = element.querySelector(".u-over")!.getBoundingClientRect();
      const scaleX = canvas.width / canvasBox.width;
      const scaleY = canvas.height / canvasBox.height;
      const y = Math.floor((plotBox.y - canvasBox.y + plotBox.height * 0.9) * scaleY);
      const x = Math.ceil((plotBox.x - canvasBox.x + plotBox.width * 0.25) * scaleX);
      const width = Math.floor(plotBox.width * 0.5 * scaleX);
      const pixels = canvas.getContext("2d")!.getImageData(x, y, width, 1).data;
      return Array.from({ length: width }, (_, index) => pixels[index * 4 + 3]! > 0);
    });
    if (path === "bars") {
      expect(samples.some(Boolean), "Bars must paint the signal above zero.").toBe(true);
      expect(samples.some(painted => !painted), "Adjacent bars must have clear gaps; a filled line area is not a bar plot.").toBe(true);
    } else {
      expect(samples.some(Boolean), "A points series must not fill the area below the samples.").toBe(false);
    }
  }
});
