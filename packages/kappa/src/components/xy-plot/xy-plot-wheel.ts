import type uPlot from "uplot";

const WHEEL_ZOOM_BASE = 1.24;

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(maximum, Math.max(minimum, value));

const transform = (scale: uPlot.Scale, value: number) =>
  scale.distr === 3 ? Math.log(value) / Math.log(scale.log ?? 10) : value;

const untransform = (scale: uPlot.Scale, value: number) =>
  scale.distr === 3 ? Math.pow(scale.log ?? 10, value) : value;

export const zoomXYPlotScale = (
  plot: uPlot,
  scaleKey: string,
  cursorPosition: number,
  factor: number,
) => {
  const scale = plot.scales[scaleKey];
  if (!scale || scale.min === undefined || scale.max === undefined) return false;

  const currentMin = transform(scale, scale.min);
  const currentMax = transform(scale, scale.max);
  const cursorValue = transform(scale, plot.posToVal(cursorPosition, scaleKey));
  if (![currentMin, currentMax, cursorValue].every(Number.isFinite)) return false;

  const currentRange = currentMax - currentMin;
  if (currentRange <= 0) return false;
  const ratio = clamp((cursorValue - currentMin) / currentRange, 0, 1);
  const nextRange = currentRange * factor;
  const nextMin = cursorValue - nextRange * ratio;
  const nextMax = nextMin + nextRange;
  const min = untransform(scale, nextMin);
  const max = untransform(scale, nextMax);
  if (!Number.isFinite(min) || !Number.isFinite(max) || min >= max) return false;

  plot.setScale(scaleKey, { min, max });
  return true;
};

export const createXYPlotWheelPlugin = (zoom: "x" | "xy"): uPlot.Plugin => {
  let wheelHandler: ((event: WheelEvent) => void) | undefined;

  return {
    hooks: {
      ready: [
        (plot) => {
          wheelHandler = (event) => {
            const bounds = plot.over.getBoundingClientRect();
            const inlinePosition = event.clientX - bounds.left;
            const blockPosition = event.clientY - bounds.top;
            const scaleKey = zoom === "xy" && event.shiftKey ? "y" : "x";
            const position = scaleKey === "x" ? inlinePosition : blockPosition;
            const factor = Math.pow(
              WHEEL_ZOOM_BASE,
              clamp(event.deltaY / 100, -1, 1),
            );
            if (zoomXYPlotScale(plot, scaleKey, position, factor)) event.preventDefault();
          };
          plot.over.addEventListener("wheel", wheelHandler, { passive: false });
        },
      ],
      destroy: [
        (plot) => {
          if (wheelHandler) plot.over.removeEventListener("wheel", wheelHandler);
          wheelHandler = undefined;
        },
      ],
    },
  };
};
