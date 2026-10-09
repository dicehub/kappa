import type { UseSplitterProps } from "@ark-ui/vue/splitter";
import { DEFAULT_LOCALE, useLocaleContext } from "@ark-ui/vue/locale";
import { computed, inject, onMounted, onScopeDispose, provide, ref, type ComputedRef, type InjectionKey, type Ref } from "vue";
import { clampSidebarWidth, resolveSidebarWidthBounds, type SidebarProviderProps } from "./sidebar";

interface ResizeOptions {
  layout: Ref<HTMLElement | undefined>;
  id: ComputedRef<string>;
  navId: ComputedRef<string>;
  open: ComputedRef<boolean>;
  isMobile: ComputedRef<boolean>;
  setOpen: (open: boolean) => void;
  onResize: (width: number) => void;
  onResizeEnd: (width: number) => void;
}
interface ResizeContext {
  props: ComputedRef<UseSplitterProps>;
  handleId: ComputedRef<"navigation:remainder" | "remainder:navigation">;
  range: ComputedRef<{ min: number; max: number; collapsed: number }>;
  canCollapse: ComputedRef<boolean>;
  setIsResizing: (value: boolean) => void;
}
const resizeKey: InjectionKey<ResizeContext> = Symbol("KappaSidebarResize");
export const useSidebarResizeContext = () => inject(resizeKey)!;

/** Adapt Ark's two-panel size model to Sidebar's pixel width and ordinary flex remainder.
 * The separator controls only the real navigation element; no extra application wrapper is required.
 * Ark retains pointer capture, keyboard handling, collapse thresholds, and drag cleanup.
 * Use physical left/right panel order in an LTR resize scope: the installed Splitter
 * flips RTL keys but not pointer deltas. Navigation keeps the application's locale.
 */
export function useSidebarResize(props: Required<Pick<SidebarProviderProps, "defaultWidth" | "minWidth" | "maxWidth" | "collapsedWidth">> & SidebarProviderProps, options: ResizeOptions) {
  const internalWidth = ref(props.defaultWidth);
  const locale = useLocaleContext(DEFAULT_LOCALE);
  const resizing = ref(false);
  const groupWidth = ref(0);
  const bounds = computed(() => resolveSidebarWidthBounds(props.minWidth, props.maxWidth));
  const width = computed(() => Math.min(groupWidth.value || Infinity, clampSidebarWidth(props.resizeWidth ?? internalWidth.value, bounds.value.minWidth, bounds.value.maxWidth)));
  const enabled = computed(() => !!props.resizable && !options.isMobile.value);
  const canCollapse = computed(() => props.collapseOnResize !== false && props.collapsible !== "none");
  const sidebarIndex = computed(() => (props.side === "end") !== (locale.value.dir === "rtl") ? 1 : 0);
  const handleId = computed(() => sidebarIndex.value ? "remainder:navigation" as const : "navigation:remainder" as const);
  const collapsedPixels = ref(52);
  const range = computed(() => {
    const collapsed = props.collapsible === "offcanvas" ? 0 : Math.min(collapsedPixels.value, bounds.value.minWidth);
    return { min: canCollapse.value ? collapsed : bounds.value.minWidth, max: Math.min(groupWidth.value || Infinity, bounds.value.maxWidth), collapsed };
  });
  let observer: ResizeObserver | undefined;

  function measure() {
    const root = options.layout.value;
    if (!root) return;
    groupWidth.value = root.getBoundingClientRect().width;
    // Resolve arbitrary CSS rail lengths through layout, not a second CSS parser.
    const ruler = root.querySelector<HTMLElement>('[data-slot="sidebar-width-measure"]');
    if (ruler) collapsedPixels.value = ruler.getBoundingClientRect().width;
  }
  onMounted(() => {
    measure();
    observer = new ResizeObserver(measure);
    if (options.layout.value) observer.observe(options.layout.value);
    const ruler = options.layout.value?.querySelector('[data-slot="sidebar-width-measure"]');
    if (ruler) observer.observe(ruler);
  });
  onScopeDispose(() => observer?.disconnect());

  function setWidth(value: number) {
    const next = clampSidebarWidth(value, bounds.value.minWidth, bounds.value.maxWidth);
    if (Math.abs(next - width.value) < 0.01) return;
    if (props.resizeWidth === undefined) internalWidth.value = next;
    options.onResize(next);
  }

  const splitterProps = computed<UseSplitterProps>(() => {
    const collapsed = props.collapsible === "offcanvas" ? 0 : Math.min(collapsedPixels.value, bounds.value.minWidth);
    const current = options.open.value ? width.value : collapsed;
    const percentage = groupWidth.value > 0 ? Math.min(100, current / groupWidth.value * 100) : 25;
    const navigation = {
      id: "navigation", minSize: `${bounds.value.minWidth}px`, maxSize: `${bounds.value.maxWidth}px`,
      collapsible: canCollapse.value, collapsedSize: `${collapsed}px`, resizeBehavior: "preserve-pixel-size" as const,
    };
    return {
      id: `${options.id.value}-resize`,
      ids: { root: `${options.id.value}-layout`, panel: (id) => id === "navigation" ? options.navId.value : `${options.id.value}-remainder` },
      panels: sidebarIndex.value ? [{ id: "remainder", minSize: 0 }, navigation] : [navigation, { id: "remainder", minSize: 0 }],
      size: sidebarIndex.value ? [100 - percentage, percentage] : [percentage, 100 - percentage],
      keyboardResizeBy: 1,
      onResize: ({ size }: { size: number[] }) => {
        if (!enabled.value || groupWidth.value <= 0) return;
        const next = (size[sidebarIndex.value] ?? 0) / 100 * groupWidth.value;
        const isCollapsed = canCollapse.value && next <= collapsed + 0.5;
        options.setOpen(!isCollapsed);
        if (!isCollapsed) setWidth(next);
      },
      onResizeEnd: () => { if (enabled.value) options.onResizeEnd(width.value); },
    };
  });
  provide(resizeKey, { props: splitterProps, handleId, range, canCollapse, setIsResizing: (value) => { resizing.value = value; } });
  return { width, setWidth, isResizing: computed(() => enabled.value && resizing.value) };
}
