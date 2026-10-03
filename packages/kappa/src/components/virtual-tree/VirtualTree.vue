<script setup lang="ts" generic="T">
import {
  computed,
  markRaw,
  ref,
  shallowRef,
  useId,
  watch,
  type CSSProperties,
} from "vue";
import VirtualTreeIndicator from "./VirtualTreeIndicator.vue";
import { VirtualTreeEngine, type IndexedVirtualTreeNode } from "./virtual-tree-engine";
import { useVirtualTreeKeyboard } from "./use-virtual-tree-keyboard";
import { useVirtualTreeSelection } from "./use-virtual-tree-selection";
import { useVirtualTreeWindow } from "./use-virtual-tree-window";
import {
  VIRTUAL_TREE_DEFAULTS,
  defaultVirtualTreeIsNodeDisabled,
  defaultVirtualTreeNodeToChildren,
  defaultVirtualTreeNodeToChildrenCount,
  defaultVirtualTreeNodeToString,
  defaultVirtualTreeNodeToValue,
  resolveVirtualTreeOverscan,
  resolveVirtualTreePositiveNumber,
  type VirtualTreeApi,
  type VirtualTreeEmits,
  type VirtualTreeProps,
  type VirtualTreeRowContext,
  type VirtualTreeScrollAlign,
  type VirtualTreeSlots,
} from "./virtual-tree";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<VirtualTreeProps<T>>(), {
  expandOnClick: true,
  typeahead: true,
});
const emit = defineEmits<VirtualTreeEmits<T>>();
const slots = defineSlots<VirtualTreeSlots<T>>();

const rootElement = ref<HTMLElement>();
const generatedId = useId();
const rootId = computed(() => props.id ?? `kappa-virtual-tree-${generatedId}`);
const rowHeight = computed(() =>
  resolveVirtualTreePositiveNumber(props.rowHeight, VIRTUAL_TREE_DEFAULTS.rowHeight),
);
const indent = computed(() =>
  resolveVirtualTreePositiveNumber(props.indent, VIRTUAL_TREE_DEFAULTS.indent),
);
const overscan = computed(() => resolveVirtualTreeOverscan(props.overscan));
const selectionMode = computed(() => props.selectionMode ?? "single");

const nodeToValue = (node: T) =>
  props.nodeToValue?.(node) ?? defaultVirtualTreeNodeToValue(node);
const nodeToString = (node: T) =>
  props.nodeToString?.(node) ?? defaultVirtualTreeNodeToString(node);
const nodeToChildren = (node: T) =>
  props.nodeToChildren?.(node) ??
  (defaultVirtualTreeNodeToChildren(node) as readonly T[] | undefined);
const nodeToChildrenCount = (node: T) =>
  props.nodeToChildrenCount?.(node) ?? defaultVirtualTreeNodeToChildrenCount(node);
const isNodeDisabled = (node: T) =>
  props.isNodeDisabled?.(node) ?? defaultVirtualTreeIsNodeDisabled(node);

const createEngine = () =>
  markRaw(
    new VirtualTreeEngine(props.items, {
      isNodeDisabled,
      nodeToChildren,
      nodeToChildrenCount,
      nodeToString,
      nodeToValue,
    }),
  );

const engine = shallowRef(createEngine());
const internalExpandedValue = ref([...(props.defaultExpandedValue ?? [])]);
let appliedExpanded = new Set(props.expandedValue ?? internalExpandedValue.value);
let engineRevision = 0;

const expandedValue = computed(() => props.expandedValue ?? internalExpandedValue.value);
const expandedSet = computed(() => new Set(expandedValue.value));

const visibleRows = shallowRef(engine.value.getVisible(appliedExpanded));
const visibleIndex = new Map<string, number>();
const rebuildVisibleIndex = (start = 0) => {
  for (let index = start; index < visibleRows.value.length; index += 1) {
    visibleIndex.set(visibleRows.value[index]!.value, index);
  }
};
rebuildVisibleIndex();

const rebuildVisibleRows = (nextExpanded: ReadonlySet<string>) => {
  visibleRows.value = engine.value.getVisible(nextExpanded);
  visibleIndex.clear();
  rebuildVisibleIndex();
};

const applySingleExpansion = (
  value: string,
  expanded: boolean,
  nextExpanded: ReadonlySet<string>,
) => {
  const index = visibleIndex.get(value);
  if (index === undefined) return;
  const rows = visibleRows.value.slice();
  if (expanded) {
    const additions = engine.value.getVisibleDescendants(value, nextExpanded);
    rows.splice(index + 1, 0, ...additions);
    visibleRows.value = rows;
    rebuildVisibleIndex(index + 1);
    return;
  }

  const depth = rows[index]!.depth;
  let end = index + 1;
  while (end < rows.length && rows[end]!.depth > depth) end += 1;
  for (const removed of rows.slice(index + 1, end)) visibleIndex.delete(removed.value);
  rows.splice(index + 1, end - index - 1);
  visibleRows.value = rows;
  rebuildVisibleIndex(index + 1);
};

const applyExpandedValue = (values: readonly string[]) => {
  const next = new Set(values);
  const changes = [
    ...[...next].filter((value) => !appliedExpanded.has(value)),
    ...[...appliedExpanded].filter((value) => !next.has(value)),
  ];
  if (changes.length === 1) {
    applySingleExpansion(changes[0]!, next.has(changes[0]!), next);
  } else if (changes.length > 1) {
    rebuildVisibleRows(next);
  }
  appliedExpanded = next;
};

watch(
  () => props.expandedValue,
  (value) => applyExpandedValue(value ?? internalExpandedValue.value),
);

watch(
  [
    () => props.items,
    () => props.nodeToValue,
    () => props.nodeToString,
    () => props.nodeToChildren,
    () => props.nodeToChildrenCount,
    () => props.isNodeDisabled,
  ],
  () => {
    engineRevision += 1;
    pendingLoads.clear();
    loadingValues.value = new Set();
    engine.value = createEngine();
    appliedExpanded = new Set(expandedValue.value);
    rebuildVisibleRows(appliedExpanded);
  },
);

const loadingValues = ref(new Set<string>());
const pendingLoads = new Map<string, Promise<boolean>>();
const ensureChildren = async (record: IndexedVirtualTreeNode<T>) => {
  if (record.children?.length || !record.hasChildren || !props.loadChildren) return true;
  const existing = pendingLoads.get(record.value);
  if (existing) return existing;

  const revision = engineRevision;
  let pending!: Promise<boolean>;
  pending = (async () => {
    loadingValues.value = new Set(loadingValues.value).add(record.value);
    try {
      const children = await props.loadChildren!({ node: record.node, value: record.value });
      if (revision !== engineRevision) return false;
      engine.value.insertChildren(record.value, children);
      emit("loadChildrenComplete", { children, node: record.node, value: record.value });
      return true;
    } catch (error) {
      if (revision === engineRevision) {
        emit("loadChildrenError", { error, node: record.node, value: record.value });
      }
      return false;
    } finally {
      if (pendingLoads.get(record.value) === pending) {
        const next = new Set(loadingValues.value);
        next.delete(record.value);
        loadingValues.value = next;
        pendingLoads.delete(record.value);
      }
    }
  })();
  pendingLoads.set(record.value, pending);
  return pending;
};

const commitExpanded = (
  nextValue: string[],
  record: IndexedVirtualTreeNode<T>,
  expanded: boolean,
) => {
  if (props.expandedValue === undefined) {
    internalExpandedValue.value = nextValue;
    applyExpandedValue(nextValue);
  }
  emit("update:expandedValue", nextValue);
  emit("expandedChange", {
    expanded,
    expandedValue: nextValue,
    node: record.node,
    value: record.value,
  });
};

const expand = async (value: string, recursive = false) => {
  const record = engine.value.get(value);
  if (!record || record.disabled || !record.hasChildren) return false;
  if (!(await ensureChildren(record))) return false;
  const next = new Set(expandedValue.value);
  next.add(value);
  if (recursive) {
    for (const descendant of engine.value.getDescendantValues(value)) {
      if (engine.value.get(descendant)?.hasChildren) next.add(descendant);
    }
  }
  commitExpanded([...next], record, true);
  return true;
};

const collapse = (value: string, recursive = false) => {
  const record = engine.value.get(value);
  if (!record || record.disabled || !record.hasChildren) return false;
  const next = new Set(expandedValue.value);
  next.delete(value);
  if (recursive) {
    for (const descendant of engine.value.getDescendantValues(value)) next.delete(descendant);
  }
  commitExpanded([...next], record, false);
  return true;
};

const toggle = async (record: IndexedVirtualTreeNode<T>) =>
  expandedSet.value.has(record.value)
    ? collapse(record.value)
    : expand(record.value);

const { commitFocus, commitSelection, focusedValue, select, selectedSet, selectedValue } =
  useVirtualTreeSelection({
    engine,
    onFocusChange: (value, node) => {
      emit("update:focusedValue", value);
      emit("focusChange", { focusedValue: value, node });
    },
    onSelectionChange: (value, record) => {
      emit("update:selectedValue", value);
      emit("selectionChange", {
        node: record.node,
        selectedValue: value,
        value: record.value,
      });
    },
    props,
    selectionMode,
    visibleIndex,
    visibleRows,
  });

watch(visibleRows, (rows) => {
  const value = focusedValue.value;
  if (!value || visibleIndex.has(value)) return;
  const ancestor = engine.value
    .getAncestors(value)
    .reverse()
    .find((record) => visibleIndex.has(record.value) && !record.disabled);
  const fallback = ancestor ?? rows.find((record) => !record.disabled);
  commitFocus(fallback?.value ?? null);
});
const pinnedIndex = computed(() => {
  const value = focusedValue.value;
  return value ? visibleIndex.get(value) : undefined;
});

const rootStyle = computed<CSSProperties>(() => ({
  "--kappa-virtual-tree-indent": `${indent.value}px`,
  "--kappa-virtual-tree-row-height": `${rowHeight.value}px`,
  height: props.height ?? VIRTUAL_TREE_DEFAULTS.height,
}));
const {
  contentStyle,
  handleScroll,
  renderedRows,
  rowStyle,
  scrollToIndex,
  viewportHeight,
} = useVirtualTreeWindow({ overscan, pinnedIndex, rootElement, rowHeight, visibleRows });

const rowId = (value: string) =>
  `${rootId.value}-node-${encodeURIComponent(value).replaceAll("%", "_")}`;
const activeDescendant = computed(() => {
  const value = focusedValue.value;
  return value && renderedRows.value.some(({ record }) => record.value === value)
    ? rowId(value)
    : undefined;
});

const scrollToValue = (value: string, align: VirtualTreeScrollAlign = "auto") => {
  if (!engine.value.get(value)) return false;
  const ancestors = engine.value.getAncestors(value);
  const missing = ancestors.filter((item) => !expandedSet.value.has(item.value));
  if (missing.length > 0) {
    const next = new Set(expandedValue.value);
    for (const ancestor of missing) next.add(ancestor.value);
    if (props.expandedValue === undefined) {
      internalExpandedValue.value = [...next];
      applyExpandedValue([...next]);
    }
    emit("update:expandedValue", [...next]);
  }
  const index = visibleIndex.get(value);
  return index === undefined ? false : scrollToIndex(index, align);
};

const focus = (value: string) => {
  const record = engine.value.get(value);
  if (!record || record.disabled || !scrollToValue(value)) return false;
  commitFocus(value);
  rootElement.value?.focus({ preventScroll: true });
  return true;
};

const moveFocus = (index: number, extendSelection = false) => {
  let nextIndex = Math.min(visibleRows.value.length - 1, Math.max(0, index));
  const direction = nextIndex >= (visibleIndex.get(focusedValue.value ?? "") ?? 0) ? 1 : -1;
  while (visibleRows.value[nextIndex]?.disabled) {
    nextIndex += direction;
    if (nextIndex < 0 || nextIndex >= visibleRows.value.length) return;
  }
  const record = visibleRows.value[nextIndex];
  if (!record) return;
  scrollToIndex(nextIndex);
  commitFocus(record.value);
  if (extendSelection && selectionMode.value === "multiple") {
    select(record, { range: true });
  }
};

const expandSiblings = (record: IndexedVirtualTreeNode<T>) => {
  const next = new Set(expandedValue.value);
  for (const sibling of engine.value.getSiblings(record.value)) {
    if (sibling.hasChildren && !sibling.disabled) next.add(sibling.value);
  }
  if (props.expandedValue === undefined) {
    internalExpandedValue.value = [...next];
    applyExpandedValue([...next]);
  }
  emit("update:expandedValue", [...next]);
};

const { handleKeydown } = useVirtualTreeKeyboard({
  collapse,
  commitSelection,
  disabled: () => Boolean(props.disabled),
  engine,
  expand,
  expandSiblings,
  focus,
  focusedValue,
  isExpanded: (value) => expandedSet.value.has(value),
  moveFocus,
  rowHeight,
  select,
  selectionMode,
  toggle,
  typeahead: () => props.typeahead !== false,
  viewportHeight,
  visibleIndex,
  visibleRows,
});

const isInteractiveTarget = (target: EventTarget | null) =>
  target instanceof Element &&
  Boolean(target.closest("button, a, input, select, textarea, [contenteditable], [data-kappa-tree-interactive]"));

const handleRowClick = async (
  event: MouseEvent,
  record: IndexedVirtualTreeNode<T>,
) => {
  if (record.disabled || props.disabled || isInteractiveTarget(event.target)) return;
  rootElement.value?.focus({ preventScroll: true });
  commitFocus(record.value);
  select(record, {
    additive: event.ctrlKey || event.metaKey,
    range: event.shiftKey,
  });
  if (record.hasChildren && props.expandOnClick !== false) await toggle(record);
};

const rowContext = (record: IndexedVirtualTreeNode<T>): VirtualTreeRowContext<T> => ({
  collapse: () => collapse(record.value),
  depth: record.depth,
  expand: () => void expand(record.value),
  expanded: expandedSet.value.has(record.value),
  focused: focusedValue.value === record.value,
  hasChildren: record.hasChildren,
  loading: loadingValues.value.has(record.value),
  node: record.node,
  select: () => select(record),
  selected: selectedSet.value.has(record.value),
  toggle: () => void toggle(record),
  value: record.value,
});

const handleRootFocus = () => {
  if (!props.disabled && !focusedValue.value) moveFocus(0);
};

defineExpose<VirtualTreeApi<T>>({
  collapse,
  expand,
  focus,
  getNode: (value) => engine.value.getNode(value),
  scrollToValue,
});
</script>

<template>
  <div
    :id="rootId"
    ref="rootElement"
    v-bind="$attrs"
    class="kappa-virtual-tree"
    data-slot="virtual-tree"
    role="tree"
    tabindex="0"
    :aria-activedescendant="activeDescendant"
    :aria-busy="loadingValues.size > 0 || undefined"
    :aria-disabled="props.disabled || undefined"
    :aria-label="props.ariaLabel ?? 'Tree'"
    :aria-multiselectable="selectionMode === 'multiple' || undefined"
    :style="rootStyle"
    @focus="handleRootFocus"
    @keydown="handleKeydown"
    @scroll.passive="handleScroll"
  >
    <div
      v-if="visibleRows.length > 0"
      class="kappa-virtual-tree__content"
      data-slot="virtual-tree-content"
      :style="contentStyle"
    >
      <div
        v-for="{ record, index } in renderedRows"
        :id="rowId(record.value)"
        :key="record.value"
        class="kappa-virtual-tree__row"
        data-slot="virtual-tree-row"
        role="treeitem"
        :aria-busy="loadingValues.has(record.value) || undefined"
        :aria-disabled="record.disabled || undefined"
        :aria-expanded="record.hasChildren ? expandedSet.has(record.value) : undefined"
        :aria-level="record.depth"
        :aria-posinset="record.position"
        :aria-selected="selectedSet.has(record.value)"
        :aria-setsize="record.setSize"
        :data-disabled="record.disabled || undefined"
        :data-expanded="record.hasChildren ? expandedSet.has(record.value) : undefined"
        :data-focus="focusedValue === record.value || undefined"
        :data-selected="selectedSet.has(record.value) || undefined"
        :style="rowStyle(record, index)"
        @click="handleRowClick($event, record)"
      >
        <span
          class="kappa-virtual-tree__indicator"
          data-slot="virtual-tree-indicator"
          aria-hidden="true"
          :data-visible="record.hasChildren || undefined"
        >
          <slot name="indicator" v-bind="rowContext(record)">
            <VirtualTreeIndicator
              :has-children="record.hasChildren"
              :loading="loadingValues.has(record.value)"
            />
          </slot>
        </span>
        <div class="kappa-virtual-tree__row-content" data-slot="virtual-tree-row-content">
          <slot v-bind="rowContext(record)">{{ record.label }}</slot>
        </div>
      </div>
    </div>
    <div v-else class="kappa-virtual-tree__empty" data-slot="virtual-tree-empty">
      <slot name="empty">No items</slot>
    </div>
  </div>
</template>

<style src="./virtual-tree.css"></style>
