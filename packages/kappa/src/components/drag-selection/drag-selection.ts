import type { HTMLAttributes, VNodeChild } from "vue";

export interface DragSelectionItem {
  /** Stable, unique identifier. */
  value: string;
  label: string;
  disabled?: boolean;
}

export interface DragSelectionProps extends /* @vue-ignore */ HTMLAttributes {
  items: DragSelectionItem[];
  /** Accessible name of the collection. */
  label: string;
  modelValue?: string[];
  defaultValue?: string[];
  /** Column count used by both layout and keyboard navigation. */
  columns?: number;
  disabled?: boolean;
  /** Disable rectangle selection while keeping click and keyboard selection. */
  dragDisabled?: boolean;
  autoScroll?: boolean;
  /** Pointer travel in CSS pixels before a rectangle starts. */
  threshold?: number;
  emptyLabel?: string;
}

export type DragSelectionEmits = {
  "update:modelValue": [value: string[]];
  valueChange: [details: { value: string[] }];
  dragStart: [];
  dragEnd: [details: { value: string[]; canceled: boolean }];
};

export interface DragSelectionSlots {
  /** Presentational content; keep action buttons outside the listbox. */
  item?: (props: { item: DragSelectionItem; selected: boolean }) => VNodeChild;
  empty?: () => VNodeChild;
}

export const DRAG_SELECTION_DEFAULT_COLUMNS = 3;
export const DRAG_SELECTION_DEFAULT_THRESHOLD = 6;

export interface SelectionPoint { x: number; y: number }
export interface SelectionRectangle extends SelectionPoint { width: number; height: number }

export const selectionRectangle = (a: SelectionPoint, b: SelectionPoint): SelectionRectangle => ({
  x: Math.min(a.x, b.x), y: Math.min(a.y, b.y),
  width: Math.abs(a.x - b.x), height: Math.abs(a.y - b.y),
});

export const intersectsSelection = (a: SelectionRectangle, b: SelectionRectangle) =>
  a.x < b.x + b.width && a.x + a.width > b.x &&
  a.y < b.y + b.height && a.y + a.height > b.y;

/** Add to the gesture's starting selection, never its previous frame. */
export const mergeDragSelection = (initial: string[], hits: string[], additive: boolean): string[] =>
  [...new Set(additive ? [...initial, ...hits] : hits)];

export const resolveDragSelectionColumns = (value: number | undefined) =>
  Number.isFinite(value) ? Math.max(1, Math.floor(value!)) : DRAG_SELECTION_DEFAULT_COLUMNS;

/** Ark's select-all includes disabled values. Do not newly select them. */
export function filterDisabledSelection(value: string[], items: DragSelectionItem[], previous: string[]) {
  const disabled = new Set(items.filter(item => item.disabled).map(item => item.value));
  const selected = new Set(previous);
  return value.filter(id => !disabled.has(id) || selected.has(id));
}
