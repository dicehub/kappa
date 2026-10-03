import * as maplibre from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?url";

maplibre.setWorkerUrl(workerUrl);

export { maplibre };
