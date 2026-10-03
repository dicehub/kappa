import { nextTick, ref, watchEffect, type ComputedRef, type ObjectDirective, type ShallowRef } from "vue";
import type { DataGridMode } from "./data-grid";

interface DataGridFocusItem {
  id: string;
}

interface UseDataGridFocusOptions<T> {
  columns: ComputedRef<readonly DataGridFocusItem[]>;
  mode: ComputedRef<DataGridMode>;
  onCellActivate: (context: T) => void;
  rowHeight: ComputedRef<number>;
  renderedRowIndexes: ComputedRef<readonly number[]>;
  rows: ComputedRef<readonly DataGridFocusItem[]>;
  scrollToIndex: (index: number) => void;
  viewport: Readonly<ShallowRef<HTMLElement | null>>;
}

export const DATA_GRID_INTERACTIVE_SELECTOR =
  "button, a[href], input, select, textarea, [contenteditable='true'], [tabindex]";

const originalTabIndexes = new WeakMap<HTMLElement, string | null>();

export const isDataGridInteractiveTarget = (target: EventTarget | null) =>
  target instanceof Element && Boolean(target.closest(
    "button, a, input, select, textarea, label, [role='button'], [role='checkbox'], [role='radio'], [role='menuitemcheckbox'], [contenteditable='true']",
  ));

const disableDescendantTabStops = (element: HTMLElement) => {
  element.removeAttribute("data-grid-interaction");
  element.querySelectorAll<HTMLElement>(DATA_GRID_INTERACTIVE_SELECTOR).forEach((control) => {
    if (!originalTabIndexes.has(control)) {
      originalTabIndexes.set(control, control.getAttribute("tabindex"));
    }
    control.tabIndex = -1;
  });
};

const restoreDescendantTabStops = (element: HTMLElement) => {
  element.setAttribute("data-grid-interaction", "");
  return [...element.querySelectorAll<HTMLElement>(DATA_GRID_INTERACTIVE_SELECTOR)].filter((control) => {
    if (!originalTabIndexes.has(control)) {
      originalTabIndexes.set(control, control.getAttribute("tabindex"));
    }
    const original = originalTabIndexes.get(control);
    if (original === null) control.removeAttribute("tabindex");
    else if (original !== undefined) control.setAttribute("tabindex", original);
    return control.tabIndex >= 0;
  });
};

export const dataGridCellDirective: ObjectDirective<HTMLElement> = {
  mounted: disableDescendantTabStops,
  updated: (element) => {
    if (element.hasAttribute("data-grid-interaction")) restoreDescendantTabStops(element);
    else disableDescendantTabStops(element);
  },
};

export function useDataGridFocus<T>(options: UseDataGridFocusOptions<T>) {
  const focusedCell = ref<{ columnId?: string; rowValue?: string }>({});
  const pendingFocus = ref<{ columnIndex: number; rowIndex: number } | null>(null);
  let focusRevision = 0;

  const focusRenderedCell = async (rowIndex: number, columnIndex: number) => {
    focusRevision += 1;
    await nextTick();
    options.viewport.value
      ?.querySelector<HTMLElement>(
        `[data-grid-row-index="${rowIndex}"][data-grid-column-index="${columnIndex}"]`,
      )
      ?.focus();
  };

  watchEffect(() => {
    if (!options.rows.value.some((row) => row.id === focusedCell.value.rowValue)) {
      focusedCell.value.rowValue = options.rows.value[0]?.id;
    }
    if (!options.columns.value.some((column) => column.id === focusedCell.value.columnId)) {
      focusedCell.value.columnId = options.columns.value[0]?.id;
    }
    const pending = pendingFocus.value;
    if (pending) {
      if (options.renderedRowIndexes.value.includes(pending.rowIndex)) {
        pendingFocus.value = null;
        focusedCell.value = {
          columnId: options.columns.value[pending.columnIndex]?.id,
          rowValue: options.rows.value[pending.rowIndex]?.id,
        };
        void focusRenderedCell(pending.rowIndex, pending.columnIndex);
      }
      return;
    }
    if (options.mode.value === "virtual" && options.renderedRowIndexes.value.length > 0) {
      const focusedIndex = options.rows.value.findIndex((row) => row.id === focusedCell.value.rowValue);
      if (!options.renderedRowIndexes.value.includes(focusedIndex)) {
        focusedCell.value.rowValue = options.rows.value[options.renderedRowIndexes.value[0]!]?.id;
      }
    }
  });

  const focusCell = async (row: number, column: number, scroll = true) => {
    const rowIndex = Math.max(0, Math.min(Math.max(0, options.rows.value.length - 1), row));
    const columnIndex = Math.max(0, Math.min(Math.max(0, options.columns.value.length - 1), column));
    focusedCell.value = {
      columnId: options.columns.value[columnIndex]?.id,
      rowValue: options.rows.value[rowIndex]?.id,
    };
    const rendered = options.renderedRowIndexes.value.includes(rowIndex);
    if (options.mode.value === "virtual" && !rendered) {
      pendingFocus.value = { columnIndex, rowIndex };
      if (scroll) options.scrollToIndex(rowIndex);
      return;
    }
    if (options.mode.value === "virtual" && scroll) options.scrollToIndex(rowIndex);
    await focusRenderedCell(rowIndex, columnIndex);
  };

  const handleCellKeydown = (
    event: KeyboardEvent,
    rowIndex: number,
    columnIndex: number,
    context?: T,
  ) => {
    if (event.target !== event.currentTarget) {
      if (event.key === "Escape" && event.currentTarget instanceof HTMLElement) {
        disableDescendantTabStops(event.currentTarget);
        event.currentTarget.focus();
        event.preventDefault();
      }
      return;
    }

    const pageStep = Math.max(
      1,
      Math.floor((options.viewport.value?.clientHeight ?? options.rowHeight.value) / options.rowHeight.value),
    );
    let row = rowIndex;
    let column = columnIndex;
    if (event.key === "ArrowDown") row += 1;
    else if (event.key === "ArrowUp") row -= 1;
    else if (event.key === "ArrowRight") column += 1;
    else if (event.key === "ArrowLeft") column -= 1;
    else if (event.key === "Home") column = 0;
    else if (event.key === "End") column = options.columns.value.length - 1;
    else if (event.key === "PageDown") row += pageStep;
    else if (event.key === "PageUp") row -= pageStep;
    else if (event.key === "Enter" || event.key === "F2") {
      const interactive = restoreDescendantTabStops(event.currentTarget as HTMLElement)[0];
      if (interactive) interactive.focus();
      else if (context) options.onCellActivate(context);
      event.preventDefault();
      return;
    } else if (event.key === "Escape" && event.currentTarget instanceof HTMLElement) {
      event.currentTarget.focus();
      event.preventDefault();
      return;
    } else return;

    if (event.ctrlKey && event.key === "Home") row = 0;
    if (event.ctrlKey && event.key === "End") row = options.rows.value.length - 1;
    event.preventDefault();
    void focusCell(row, column);
  };

  const handleCellFocusin = (event: FocusEvent) => {
    if (event.target !== event.currentTarget && event.currentTarget instanceof HTMLElement) {
      restoreDescendantTabStops(event.currentTarget);
    }
  };

  const handleCellFocusout = (event: FocusEvent) => {
    if (!(event.currentTarget instanceof HTMLElement)) return;
    if (event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget)) return;
    disableDescendantTabStops(event.currentTarget);
  };

  const handleViewportScroll = () => {
    if (options.mode.value !== "virtual" || typeof document === "undefined") return;
    const active = document.activeElement;
    if (!(active instanceof HTMLElement)) return;
    const activeCell = active.closest<HTMLElement>("td[data-grid-row-index]");
    if (!activeCell) return;
    const columnIndex = Number(activeCell.dataset.gridColumnIndex ?? 0);
    const scheduledRevision = focusRevision;
    requestAnimationFrame(() => {
      const currentCell = document.activeElement instanceof HTMLElement
        ? document.activeElement.closest<HTMLElement>("td[data-grid-row-index]")
        : null;
      if (activeCell.isConnected || currentCell?.isConnected || scheduledRevision !== focusRevision) return;
      const firstVisible = Math.min(
        options.rows.value.length - 1,
        Math.max(0, Math.floor((options.viewport.value?.scrollTop ?? 0) / options.rowHeight.value)),
      );
      void focusCell(firstVisible, columnIndex, false);
    });
  };

  return {
    focusedCell,
    handleCellFocusin,
    handleCellFocusout,
    handleCellKeydown,
    handleViewportScroll,
  };
}
