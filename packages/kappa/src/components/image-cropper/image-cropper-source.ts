import type { ImageCropperSource, ImageCropperStatus } from "./image-cropper.ts";

export interface ImageCropperLoadedSource {
  url: string;
  width: number;
  height: number;
  revision: number;
}

interface SourceCallbacks {
  status: (status: ImageCropperStatus) => void;
  load: (source: ImageCropperLoadedSource) => void;
  error: (error: Error) => void;
}

/** Own only URLs created here. Superseded image callbacks cannot publish state. */
export function createImageCropperSourceLoader(callbacks: SourceCallbacks) {
  let revision = 0;
  let disposed = false;
  let image: HTMLImageElement | undefined;
  let ownedUrl: string | undefined;

  function clear() {
    revision += 1;
    if (image) {
      image.onload = null;
      image.onerror = null;
      image.removeAttribute("src");
      image = undefined;
    }
    if (ownedUrl) URL.revokeObjectURL(ownedUrl);
    ownedUrl = undefined;
  }

  function load(source: ImageCropperSource | undefined, crossOrigin: "anonymous" | "use-credentials") {
    if (disposed) return;
    clear();
    if (!source) { callbacks.status("empty"); return; }
    callbacks.status("loading");
    const request = revision;
    const current = () => !disposed && request === revision;
    function fail() {
      if (!current()) return;
      clear();
      callbacks.status("error");
      callbacks.error(new Error("The image could not be loaded. Check its format and cross-origin access."));
    }
    try {
      const url = typeof source === "string" ? source : (ownedUrl = URL.createObjectURL(source));
      const pending = new Image();
      image = pending;
      pending.crossOrigin = crossOrigin;
      pending.onload = () => {
        if (!current()) return;
        if (!(pending.naturalWidth > 0 && pending.naturalHeight > 0)) { fail(); return; }
        callbacks.load({ url, width: pending.naturalWidth, height: pending.naturalHeight, revision: request });
        callbacks.status("ready");
      };
      pending.onerror = fail;
      pending.src = url;
    } catch { fail(); }
  }

  return { load, dispose() { disposed = true; clear(); } };
}
