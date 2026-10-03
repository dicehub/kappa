import { onBeforeUnmount, type ComputedRef, type Ref, type ShallowRef } from "vue";
import type { IndexedVirtualTreeNode, VirtualTreeEngine } from "./virtual-tree-engine";
import type { VirtualTreeSelectionMode } from "./virtual-tree";

interface VirtualTreeKeyboardOptions<T> {
  collapse: (value: string) => boolean;
  commitSelection: (values: string[], record: IndexedVirtualTreeNode<T>) => void;
  disabled: () => boolean;
  engine: ShallowRef<VirtualTreeEngine<T>>;
  expand: (value: string) => Promise<boolean>;
  expandSiblings: (record: IndexedVirtualTreeNode<T>) => void;
  focus: (value: string) => boolean;
  focusedValue: ComputedRef<string | null>;
  isExpanded: (value: string) => boolean;
  moveFocus: (index: number, extendSelection?: boolean) => void;
  rowHeight: ComputedRef<number>;
  select: (
    record: IndexedVirtualTreeNode<T>,
    modifiers?: { additive?: boolean; range?: boolean },
  ) => void;
  selectionMode: ComputedRef<VirtualTreeSelectionMode>;
  toggle: (record: IndexedVirtualTreeNode<T>) => Promise<boolean>;
  typeahead: () => boolean;
  viewportHeight: Ref<number> | ComputedRef<number>;
  visibleIndex: Map<string, number>;
  visibleRows: ShallowRef<IndexedVirtualTreeNode<T>[]>;
}

export function useVirtualTreeKeyboard<T>(options: VirtualTreeKeyboardOptions<T>) {
  let typeahead = "";
  let typeaheadTimer: ReturnType<typeof setTimeout> | undefined;

  const moveByTypeahead = (key: string) => {
    if (options.visibleRows.value.length === 0) return;
    typeahead += key.toLocaleLowerCase();
    clearTimeout(typeaheadTimer);
    typeaheadTimer = setTimeout(() => (typeahead = ""), 500);
    const start = options.visibleIndex.get(options.focusedValue.value ?? "") ?? -1;
    for (let offset = 1; offset <= options.visibleRows.value.length; offset += 1) {
      const index = (start + offset) % options.visibleRows.value.length;
      const record = options.visibleRows.value[index]!;
      if (!record.disabled && record.label.toLocaleLowerCase().startsWith(typeahead)) {
        options.moveFocus(index);
        break;
      }
    }
  };

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.defaultPrevented || event.target !== event.currentTarget || options.disabled()) return;
    const currentIndex = options.visibleIndex.get(options.focusedValue.value ?? "") ?? -1;
    const current = options.visibleRows.value[currentIndex];
    const pageSize = Math.max(
      1,
      Math.floor(options.viewportHeight.value / options.rowHeight.value),
    );
    const handled = () => {
      event.preventDefault();
      event.stopPropagation();
    };

    if (event.key === "ArrowDown") {
      handled();
      options.moveFocus(currentIndex + 1, event.shiftKey);
    } else if (event.key === "ArrowUp") {
      handled();
      options.moveFocus(currentIndex < 0 ? 0 : currentIndex - 1, event.shiftKey);
    } else if (event.key === "Home") {
      handled();
      options.moveFocus(0, event.shiftKey);
    } else if (event.key === "End") {
      handled();
      options.moveFocus(options.visibleRows.value.length - 1, event.shiftKey);
    } else if (event.key === "PageDown") {
      handled();
      options.moveFocus(currentIndex + pageSize, event.shiftKey);
    } else if (event.key === "PageUp") {
      handled();
      options.moveFocus(currentIndex - pageSize, event.shiftKey);
    } else if (event.key === "ArrowRight" && current?.hasChildren) {
      handled();
      if (!options.focusedValue.value || current.value !== options.focusedValue.value) return;
      if (options.isExpanded(current.value)) {
        options.moveFocus(currentIndex + 1);
      } else void options.expand(current.value);
    } else if (event.key === "ArrowLeft" && current) {
      handled();
      if (current.hasChildren && options.isExpanded(current.value)) {
        options.collapse(current.value);
      } else if (current.parentValue) options.focus(current.parentValue);
    } else if (event.key === "*" && current) {
      handled();
      options.expandSiblings(current);
    } else if ((event.key === " " || event.key === "Enter") && current) {
      handled();
      if (event.key === "Enter" && current.hasChildren) void options.toggle(current);
      options.select(current, {
        additive: options.selectionMode.value === "multiple",
        range: event.shiftKey,
      });
    } else if (
      event.key.toLocaleLowerCase() === "a" &&
      (event.ctrlKey || event.metaKey) &&
      options.selectionMode.value === "multiple"
    ) {
      handled();
      const values = options.visibleRows.value
        .filter((item) => !item.disabled)
        .map((item) => item.value);
      const record = current ?? options.visibleRows.value[0];
      if (record) options.commitSelection(values, record);
    } else if (
      options.typeahead() &&
      event.key.length === 1 &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey
    ) {
      handled();
      moveByTypeahead(event.key);
    }
  };

  onBeforeUnmount(() => clearTimeout(typeaheadTimer));
  return { handleKeydown };
}
