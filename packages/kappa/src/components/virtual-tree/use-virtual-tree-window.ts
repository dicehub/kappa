import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  type ComputedRef,
  type CSSProperties,
  type Ref,
  type ShallowRef,
} from "vue";
import type { IndexedVirtualTreeNode } from "./virtual-tree-engine";
import type { VirtualTreeScrollAlign } from "./virtual-tree";

interface VirtualTreeWindowOptions<T> {
  overscan: ComputedRef<number>;
  pinnedIndex?: ComputedRef<number | undefined>;
  rootElement: Ref<HTMLElement | undefined>;
  rowHeight: ComputedRef<number>;
  visibleRows: ShallowRef<IndexedVirtualTreeNode<T>[]>;
}

export function useVirtualTreeWindow<T>(options: VirtualTreeWindowOptions<T>) {
  const viewportHeight = ref(0);
  const scrollTop = ref(0);
  const renderedRange = computed(() => {
    const first = Math.floor(scrollTop.value / options.rowHeight.value);
    const count = Math.max(1, Math.ceil(viewportHeight.value / options.rowHeight.value));
    return {
      end: Math.min(
        options.visibleRows.value.length,
        first + count + options.overscan.value,
      ),
      start: Math.max(0, first - options.overscan.value),
    };
  });
  const renderedRows = computed(() => {
    const range = renderedRange.value;
    const rows = options.visibleRows.value
      .slice(range.start, range.end)
      .map((record, offset) => ({
        index: range.start + offset,
        record,
      }));
    const pinnedIndex = options.pinnedIndex?.value;
    if (pinnedIndex === undefined || (pinnedIndex >= range.start && pinnedIndex < range.end)) {
      return rows;
    }
    const pinnedRecord = options.visibleRows.value[pinnedIndex];
    if (!pinnedRecord) return rows;
    return [...rows, { index: pinnedIndex, record: pinnedRecord }]
      .sort((left, right) => left.index - right.index);
  });
  const contentStyle = computed<CSSProperties>(() => ({
    height: `${options.visibleRows.value.length * options.rowHeight.value}px`,
  }));
  const rowStyle = (record: IndexedVirtualTreeNode<T>, index: number): CSSProperties => ({
    "--kappa-virtual-tree-depth": record.depth,
    transform: `translateY(${index * options.rowHeight.value}px)`,
  });

  const scrollToIndex = (index: number, align: VirtualTreeScrollAlign = "auto") => {
    const element = options.rootElement.value;
    if (!element || index < 0 || index >= options.visibleRows.value.length) return false;
    const top = index * options.rowHeight.value;
    const bottom = top + options.rowHeight.value;
    let nextTop = element.scrollTop;
    if (align === "start") nextTop = top;
    else if (align === "center") {
      nextTop = top - (element.clientHeight - options.rowHeight.value) / 2;
    } else if (align === "end") nextTop = bottom - element.clientHeight;
    else if (top < element.scrollTop) nextTop = top;
    else if (bottom > element.scrollTop + element.clientHeight) {
      nextTop = bottom - element.clientHeight;
    }
    element.scrollTop = Math.max(0, nextTop);
    scrollTop.value = element.scrollTop;
    return true;
  };

  let resizeObserver: ResizeObserver | undefined;
  const measure = () => {
    viewportHeight.value = options.rootElement.value?.clientHeight ?? 0;
  };
  const handleScroll = (event: Event) => {
    scrollTop.value = (event.currentTarget as HTMLElement).scrollTop;
  };

  onMounted(() => {
    measure();
    resizeObserver = new ResizeObserver(measure);
    if (options.rootElement.value) resizeObserver.observe(options.rootElement.value);
  });
  onBeforeUnmount(() => {
    resizeObserver?.disconnect();
  });

  return {
    contentStyle,
    handleScroll,
    renderedRows,
    rowStyle,
    scrollToIndex,
    viewportHeight,
  };
}
