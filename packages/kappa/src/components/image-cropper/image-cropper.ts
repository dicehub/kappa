export const IMAGE_CROPPER_DEFAULT_ASPECT_RATIO = 1;
export const IMAGE_CROPPER_DEFAULT_MAX_ZOOM = 5;

export type ImageCropperSource = string | Blob | null;
export type ImageCropperStatus = "empty" | "loading" | "ready" | "error";
export type ImageCropperAspectRatio = number | "free";

export interface ImageCropperCrop {
  /** Crop coordinates in original image pixels. */
  x: number;
  y: number;
  width: number;
  height: number;
  zoom: number;
  naturalWidth: number;
  naturalHeight: number;
}

export interface ImageCropperExportOptions {
  /** Browser-supported image MIME type. Defaults to image/png. */
  type?: "image/png" | "image/jpeg" | "image/webp";
  /** Encoding quality from 0 to 1 for JPEG and WebP. */
  quality?: number;
  /** Proportional output limit. Defaults to 2048 × 2048 pixels. */
  maxSize?: { width: number; height: number };
}

export interface ImageCropperLabels {
  region: string;
  selection: string;
  instructions: string;
  zoom: string;
  reset: string;
  preview: string;
  empty: string;
  loading: string;
  error: string;
}

export const IMAGE_CROPPER_LABELS: ImageCropperLabels = {
  region: "Image cropper",
  selection: "Crop position",
  instructions: "Drag the crop area to move it. Drag an edge or corner to resize it. Use arrow keys to move, Alt plus an arrow to resize, and plus or minus to zoom.",
  zoom: "Zoom",
  reset: "Reset crop",
  preview: "Crop preview",
  empty: "Choose an image to start.",
  loading: "Loading image…",
  error: "The image could not be loaded.",
};

export interface ImageCropperProps {
  /** A URL or local Blob/File. Selection and upload belong to the application. */
  src?: ImageCropperSource;
  /** Crop width divided by height, or `free` for independent width and height. Invalid values fall back to 1. */
  aspectRatio?: ImageCropperAspectRatio;
  /** Maximum zoom, from 1 to 20. */
  maxZoom?: number;
  disabled?: boolean;
  readOnly?: boolean;
  /** Show the live, rectangular preview. */
  showPreview?: boolean;
  /** Remote images must permit CORS before they can be exported. */
  crossOrigin?: "anonymous" | "use-credentials";
  /** Replace visible and assistive labels for localization. */
  labels?: Partial<ImageCropperLabels>;
}

export interface ImageCropperApi {
  reset: () => void;
  setZoom: (value: number) => void;
  getCrop: () => ImageCropperCrop | null;
  /** Rejects if unavailable, canvas export fails, or the source changes. */
  exportBlob: (options?: ImageCropperExportOptions) => Promise<Blob>;
}

export interface ImageCropperErrorDetails {
  phase: "load" | "export";
  error: Error;
}

export type ImageCropperEmits = {
  change: [crop: ImageCropperCrop];
  load: [details: { width: number; height: number }];
  error: [details: ImageCropperErrorDetails];
  statusChange: [status: ImageCropperStatus];
};

export function resolveImageCropperAspectRatio(value: unknown): number | undefined {
  if (value === "free") return undefined;
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? value : IMAGE_CROPPER_DEFAULT_ASPECT_RATIO;
}

export function resolveImageCropperMaxZoom(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.min(20, Math.max(1, value)) : IMAGE_CROPPER_DEFAULT_MAX_ZOOM;
}

export function resolveImageCropperExportOptions(options: ImageCropperExportOptions = {}) {
  const { width = 2048, height = 2048 } = options.maxSize ?? {};
  if (![width, height].every(value => Number.isFinite(value) && value >= 1 && value <= 8192)) {
    throw new RangeError("Image export dimensions must be between 1 and 8192 pixels.");
  }
  if (options.quality !== undefined && (!Number.isFinite(options.quality) || options.quality < 0 || options.quality > 1)) {
    throw new RangeError("Image export quality must be between 0 and 1.");
  }
  return { type: options.type ?? "image/png", quality: options.quality ?? 0.92,
    maxSize: { width: Math.floor(width), height: Math.floor(height) }, output: "blob" as const };
}
