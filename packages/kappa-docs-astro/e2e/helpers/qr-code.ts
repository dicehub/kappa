import { expect, type Page } from "@playwright/test";
import jsQR from "jsqr";

// Use the browser only to unpack PNG pixels. Decode with an independent QR reader.
export async function readQrImage(page: Page, image: Buffer) {
  return page.evaluate(async (base64) => {
    const image = new Image();
    image.src = `data:image/png;base64,${base64}`;
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext("2d")!;
    context.drawImage(image, 0, 0);
    return {
      width: canvas.width,
      height: canvas.height,
      data: Array.from(context.getImageData(0, 0, canvas.width, canvas.height).data),
    };
  }, image.toString("base64"));
}

export async function expectQrImage(page: Page, image: Buffer, value: string) {
  const pixels = await readQrImage(page, image);
  const decoded = jsQR(new Uint8ClampedArray(pixels.data), pixels.width, pixels.height, {
    inversionAttempts: "dontInvert",
  });
  expect(decoded?.data, "The rendered pixels must decode to the exact destination").toBe(value);
  return { ...pixels, version: decoded!.version };
}

export function expectQrQuietZone(pixels: Awaited<ReturnType<typeof expectQrImage>>) {
  let minX = pixels.width, minY = pixels.height, maxX = 0, maxY = 0;
  for (let y = 0; y < pixels.height; y++) {
    for (let x = 0; x < pixels.width; x++) {
      const index = (y * pixels.width + x) * 4;
      if (pixels.data[index] < 128 && pixels.data[index + 1] < 128 && pixels.data[index + 2] < 128) {
        minX = Math.min(minX, x); minY = Math.min(minY, y);
        maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
      }
    }
  }
  const modules = 21 + 4 * (pixels.version - 1);
  const moduleSize = (maxX - minX + 1) / modules;
  // Allow one raster pixel for edge rounding, not a smaller encoded border.
  for (const margin of [minX, minY, pixels.width - maxX - 1, pixels.height - maxY - 1]) {
    expect(margin, "Export must retain four clear modules on each side").toBeGreaterThanOrEqual(4 * moduleSize - 1);
  }
}
