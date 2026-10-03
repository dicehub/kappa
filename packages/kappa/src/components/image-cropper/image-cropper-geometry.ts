import type { ImageCropperCrop } from "./image-cropper.ts";

interface Geometry {
  naturalSize: { width: number; height: number };
  viewportRect: { width: number; height: number };
  crop: { x: number; y: number; width: number; height: number };
  offset: { x: number; y: number };
  zoom: number;
}

/** Rectangular exports use fractional viewport measurements, not integer offsetWidth. */
export function getImageCropperSourceRect(value: Geometry, aspectRatio?: number): ImageCropperCrop | null {
  const { naturalSize, viewportRect, crop, offset, zoom } = value;
  if (![naturalSize.width, naturalSize.height, viewportRect.width, viewportRect.height, crop.width, crop.height, zoom]
    .every(dimension => Number.isFinite(dimension) && dimension > 0)) return null;
  const scale = Math.max(viewportRect.width / naturalSize.width, viewportRect.height / naturalSize.height) * zoom;
  const ratio = typeof aspectRatio === "number" && Number.isFinite(aspectRatio) && aspectRatio > 0
    ? aspectRatio : crop.width / crop.height;
  const width = Math.min(crop.width / scale, crop.height / scale * ratio, naturalSize.width, naturalSize.height * ratio);
  const height = width / ratio;
  const x = (crop.x - viewportRect.width / 2 - offset.x) / scale + naturalSize.width / 2;
  const y = (crop.y - viewportRect.height / 2 - offset.y) / scale + naturalSize.height / 2;
  return {
    x: Math.max(0, Math.min(naturalSize.width - width, x)),
    y: Math.max(0, Math.min(naturalSize.height - height, y)), width, height, zoom,
    naturalWidth: naturalSize.width, naturalHeight: naturalSize.height,
  };
}

export function getImageCropperOutputSize(crop: ImageCropperCrop, maxSize: { width: number; height: number }) {
  const scale = Math.min(1, maxSize.width / crop.width, maxSize.height / crop.height);
  return { width: Math.max(1, Math.round(crop.width * scale)), height: Math.max(1, Math.round(crop.height * scale)) };
}
