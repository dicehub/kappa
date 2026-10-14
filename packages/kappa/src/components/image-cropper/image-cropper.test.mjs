import assert from "node:assert/strict";
import { test } from "node:test";

import { getImageCropperOutputSize, getImageCropperSourceRect } from "./image-cropper-geometry.ts";

test("fractional viewports keep square output and crop pixels inside the source", () => {
  const viewport = { width: 290.734375, height: 193.8125 };
  const base = { naturalSize: { width: 960, height: 640 }, viewportRect: viewport,
    crop: { x: (viewport.width - viewport.height) / 2, y: 0, width: viewport.height, height: viewport.height },
    offset: { x: 0, y: 0 }, zoom: 1 };
  const square = getImageCropperSourceRect(base, 1);
  assert.ok(square);
  assert.equal(square.width, square.height);
  assert.ok(square.y >= 0 && square.y + square.height <= 640);
  assert.deepEqual(getImageCropperOutputSize(square, { width: 512, height: 512 }), { width: 512, height: 512 });
  for (const offset of [{ x: -1000, y: -1000 }, { x: 1000, y: 1000 }]) {
    const moved = getImageCropperSourceRect({ ...base, offset, zoom: 5 }, 1);
    assert.ok(moved.x >= 0 && moved.x + moved.width <= 960);
    assert.ok(moved.y >= 0 && moved.y + moved.height <= 640);
  }
  assert.equal(getImageCropperSourceRect({ ...base, viewportRect: { width: 0, height: 0 } }, 1), null);
  assert.deepEqual(getImageCropperOutputSize({ ...square, width: 100, height: 100 }, { width: 512, height: 512 }), { width: 100, height: 100 });
});

test("keeps free crop width and height independent", () => {
  const crop = getImageCropperSourceRect({
    naturalSize: { width: 1000, height: 500 }, viewportRect: { width: 400, height: 200 },
    crop: { x: 80, y: 20, width: 240, height: 120 }, offset: { x: 0, y: 0 }, zoom: 1,
  });
  assert.ok(crop);
  assert.equal(crop.width, 600);
  assert.equal(crop.height, 300);
  assert.equal(crop.width / crop.height, 2);
});
