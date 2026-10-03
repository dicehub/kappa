import type { DataGridDirection } from "./data-grid";

interface DataGridKeyboardResizeOptions {
  currentSize: number;
  direction: DataGridDirection;
  event: KeyboardEvent;
  maximum?: number;
  minimum: number;
  reset: () => void;
  setSize: (size: number) => void;
}

export const handleDataGridResizeKeydown = ({
  currentSize,
  direction,
  event,
  maximum,
  minimum,
  reset,
  setSize,
}: DataGridKeyboardResizeOptions) => {
  let size: number | undefined;
  if (event.key === "Enter" || event.key === " ") reset();
  else if (event.key === "Home") size = minimum;
  else if (event.key === "End" && maximum !== undefined) size = maximum;
  else if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    const logicalDelta = event.key === "ArrowRight" ? 1 : -1;
    const directionDelta = direction === "rtl" ? -logicalDelta : logicalDelta;
    size = currentSize + directionDelta * (event.shiftKey ? 32 : 8);
  } else return;

  if (size !== undefined) {
    setSize(Math.max(minimum, Math.min(maximum ?? Number.MAX_SAFE_INTEGER, size)));
  }
  event.preventDefault();
};
