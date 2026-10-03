import assert from "node:assert/strict";
import { test } from "node:test";
import { createImageCropperSourceLoader } from "./image-cropper-source.ts";
import { resolveImageCropperAspectRatio, resolveImageCropperExportOptions, resolveImageCropperMaxZoom } from "./image-cropper.ts";
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

function setup() {
  const images = [], loads = [], errors = [], states = [], revoked = [];
  let nextUrl = 0;
  const loader = createImageCropperSourceLoader({
    load: value => loads.push(value), error: value => errors.push(value), status: value => states.push(value),
  }, {
    createImage: () => {
      const image = { naturalWidth: 960, naturalHeight: 640, removeAttribute() {} };
      images.push(image);
      return image;
    },
    createObjectURL: () => `blob:owned-${++nextUrl}`,
    revokeObjectURL: value => revoked.push(value),
  });
  return { loader, images, loads, errors, states, revoked };
}

test("validates export bounds and quality before a canvas allocation", () => {
  assert.deepEqual(resolveImageCropperExportOptions(), {
    type: "image/png", quality: 0.92, maxSize: { width: 2048, height: 2048 }, output: "blob",
  });
  for (const value of [0, -1, Infinity, NaN, 8193]) {
    assert.throws(() => resolveImageCropperExportOptions({ maxSize: { width: value, height: 256 } }), RangeError);
  }
  for (const quality of [-1, 1.1, Infinity, NaN]) {
    assert.throws(() => resolveImageCropperExportOptions({ quality }), RangeError);
  }
  assert.equal(resolveImageCropperExportOptions({ quality: 0 }).quality, 0);
  assert.deepEqual(resolveImageCropperExportOptions({ maxSize: { width: 320.5, height: 180.5 } }).maxSize, { width: 320, height: 180 });
});

test("keeps aspect and zoom geometry finite", () => {
  for (const value of [undefined, 0, -1, NaN, Infinity, "2"]) assert.equal(resolveImageCropperAspectRatio(value), 1);
  assert.equal(resolveImageCropperAspectRatio(16 / 9), 16 / 9);
  assert.equal(resolveImageCropperAspectRatio("free"), undefined);
  assert.equal(resolveImageCropperMaxZoom(0), 1);
  assert.equal(resolveImageCropperMaxZoom(1000), 20);
  assert.equal(resolveImageCropperMaxZoom(NaN), 5);
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

test("ignores superseded loads and releases only owned Blob URLs", () => {
  const s = setup();
  s.loader.load(new Blob(["first"]), "anonymous");
  const oldLoad = s.images[0].onload, oldError = s.images[0].onerror;
  s.loader.load(new Blob(["second"]), "anonymous");
  oldLoad(); oldError();
  assert.deepEqual(s.loads, []);
  assert.deepEqual(s.errors, []);
  assert.deepEqual(s.revoked, ["blob:owned-1"]);
  s.images[1].onload();
  assert.equal(s.loads[0].url, "blob:owned-2");
  assert.equal(s.states.at(-1), "ready");
  s.loader.load("blob:consumer-owned", "use-credentials");
  assert.equal(s.images[2].crossOrigin, "use-credentials");
  s.images[2].onload();
  s.loader.dispose();
  assert.deepEqual(s.revoked, ["blob:owned-1", "blob:owned-2"]);
});

test("load failure releases the source and allows recovery", () => {
  const s = setup();
  s.loader.load(new Blob(["bad"]), "anonymous");
  s.images[0].onerror();
  assert.equal(s.states.at(-1), "error");
  assert.equal(s.errors.length, 1);
  assert.deepEqual(s.revoked, ["blob:owned-1"]);
  s.loader.load("/valid.png", "anonymous");
  s.images[1].onload();
  assert.equal(s.states.at(-1), "ready");
  assert.equal(s.loads[0].width, 960);
  s.loader.load(null, "anonymous");
  assert.equal(s.states.at(-1), "empty");
});

test("disposal rejects pending callbacks and future work", () => {
  const s = setup();
  s.loader.load(new Blob(["pending"]), "anonymous");
  const done = s.images[0].onload;
  s.loader.dispose(); done();
  s.loader.load("/ignored.png", "anonymous");
  assert.equal(s.loads.length, 0);
  assert.equal(s.images.length, 1);
  assert.deepEqual(s.revoked, ["blob:owned-1"]);
});

test("zero-sized decoded images fail instead of publishing invalid geometry", () => {
  const s = setup();
  s.loader.load("/empty.svg", "anonymous");
  s.images[0].naturalWidth = 0;
  s.images[0].onload();
  assert.equal(s.states.at(-1), "error");
  assert.equal(s.loads.length, 0);
});
