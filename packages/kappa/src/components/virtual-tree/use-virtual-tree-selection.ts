import { computed, ref, type ComputedRef, type ShallowRef } from "vue";
import type { IndexedVirtualTreeNode, VirtualTreeEngine } from "./virtual-tree-engine";
import type { VirtualTreeProps, VirtualTreeSelectionMode } from "./virtual-tree";

interface VirtualTreeSelectionOptions<T> {
  engine: ShallowRef<VirtualTreeEngine<T>>;
  onFocusChange: (value: string | null, node: T | null) => void;
  onSelectionChange: (value: string[], record: IndexedVirtualTreeNode<T>) => void;
  props: Pick<
    VirtualTreeProps<T>,
    | "defaultFocusedValue"
    | "defaultSelectedValue"
    | "focusedValue"
    | "selectedValue"
  >;
  selectionMode: ComputedRef<VirtualTreeSelectionMode>;
  visibleIndex: Map<string, number>;
  visibleRows: ShallowRef<IndexedVirtualTreeNode<T>[]>;
}

export function useVirtualTreeSelection<T>(options: VirtualTreeSelectionOptions<T>) {
  const internalFocusedValue = ref<string | null>(options.props.defaultFocusedValue ?? null);
  const internalSelectedValue = ref([...(options.props.defaultSelectedValue ?? [])]);
  const focusedValue = computed(
    () => options.props.focusedValue ?? internalFocusedValue.value,
  );
  const selectedValue = computed(
    () => options.props.selectedValue ?? internalSelectedValue.value,
  );
  const selectedSet = computed(() => new Set(selectedValue.value));

  const commitFocus = (value: string | null) => {
    if (options.props.focusedValue === undefined) internalFocusedValue.value = value;
    options.onFocusChange(
      value,
      value === null ? null : (options.engine.value.getNode(value) ?? null),
    );
  };

  let selectionAnchor: string | null = selectedValue.value[0] ?? null;
  const commitSelection = (nextValue: string[], record: IndexedVirtualTreeNode<T>) => {
    if (options.props.selectedValue === undefined) internalSelectedValue.value = nextValue;
    options.onSelectionChange(nextValue, record);
  };

  const select = (
    record: IndexedVirtualTreeNode<T>,
    modifiers: { additive?: boolean; range?: boolean } = {},
  ) => {
    if (record.disabled) return;
    if (options.selectionMode.value === "single") {
      selectionAnchor = record.value;
      commitSelection([record.value], record);
      return;
    }

    if (modifiers.range && selectionAnchor) {
      const anchorIndex = options.visibleIndex.get(selectionAnchor);
      const targetIndex = options.visibleIndex.get(record.value);
      if (anchorIndex !== undefined && targetIndex !== undefined) {
        const start = Math.min(anchorIndex, targetIndex);
        const end = Math.max(anchorIndex, targetIndex);
        const range = options.visibleRows.value
          .slice(start, end + 1)
          .filter((item) => !item.disabled)
          .map((item) => item.value);
        const nextValue = modifiers.additive
          ? [...new Set([...selectedValue.value, ...range])]
          : range;
        commitSelection(nextValue, record);
        return;
      }
    }

    selectionAnchor = record.value;
    if (modifiers.additive) {
      const next = new Set(selectedValue.value);
      if (next.has(record.value)) next.delete(record.value);
      else next.add(record.value);
      commitSelection([...next], record);
    } else {
      commitSelection([record.value], record);
    }
  };

  return {
    commitFocus,
    commitSelection,
    focusedValue,
    select,
    selectedSet,
    selectedValue,
  };
}
