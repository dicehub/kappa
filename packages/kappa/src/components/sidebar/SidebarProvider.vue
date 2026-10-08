<script setup lang="ts">
import { Drawer as ArkDrawer } from "@ark-ui/vue/drawer";
import { computed, nextTick, onMounted, provide, ref, useId, watch, watchEffect } from "vue";
import {
  SIDEBAR_DEFAULTS, resolveSidebarBreakpoint,
  type SidebarProviderEmits, type SidebarProviderProps, type SidebarProviderSlots,
} from "./sidebar";
import { sidebarContextKey, type SidebarContext } from "./sidebar-context";
import { useSidebarResize } from "./sidebar-resize";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<SidebarProviderProps>(), {
  ...SIDEBAR_DEFAULTS, open: undefined, mobileOpen: undefined,
});
const emit = defineEmits<SidebarProviderEmits>();
defineSlots<SidebarProviderSlots>();
const generatedId = useId();
const id = computed(() => props.id ?? `kappa-sidebar-${generatedId}`);
const navId = computed(() => `${id.value}-nav`);
const contentId = computed(() => `${id.value}-dialog`);
const mounted = ref(false);
const narrowViewport = ref(false);
const internalOpen = ref(props.defaultOpen);
const internalMobileOpen = ref(props.defaultMobileOpen);
const lastTriggerId = ref<string>();
const layout = ref<HTMLElement>();
let mobileReturnTarget: HTMLElement | null = null;
const open = computed(() => props.collapsible === "none" || (props.open ?? internalOpen.value));
const mobileOpen = computed(() => props.mobileOpen ?? internalMobileOpen.value);
const isMobile = computed(() => narrowViewport.value);
const peekInteraction = ref(false);
const resize = useSidebarResize(props, {
  layout, id, navId, open, isMobile, setOpen,
  onResize: (width) => { emit("update:resizeWidth", width); emit("resize", { width }); },
  onResizeEnd: (width) => emit("resizeEnd", { width }),
});
const isPeeking = computed(() => props.peekable && !isMobile.value && !open.value && props.collapsible !== "none" && peekInteraction.value && !resize.isResizing.value);
const iconCollapsed = computed(() => !isMobile.value && !open.value && !isPeeking.value && props.collapsible === "icon");
const state = computed(() => isPeeking.value ? "peeking" : (isMobile.value ? mobileOpen.value : open.value) ? "expanded" : "collapsed");
const dimensions = computed(() => ({
  "--kappa-sidebar-width": props.resizable ? `${resize.width.value}px` : props.width,
  "--kappa-sidebar-collapsed-width": props.collapsedWidth,
  "--kappa-sidebar-mobile-width": props.mobileWidth,
}));

function setOpen(value: boolean) {
  if (props.collapsible === "none" || value === open.value) return;
  if (props.open === undefined) internalOpen.value = value;
  emit("update:open", value);
  emit("openChange", { open: value });
}
function setMobileOpen(value: boolean) {
  if (value === mobileOpen.value) return;
  if (props.mobileOpen === undefined) internalMobileOpen.value = value;
  emit("update:mobileOpen", value);
  emit("mobileOpenChange", { open: value });
}
function finalFocusEl() {
  const visible = (node: HTMLElement | null | undefined) =>
    node?.isConnected && node !== document.body && !node.closest('[inert], [hidden]') && node.getClientRects().length;
  if (visible(mobileReturnTarget)) return mobileReturnTarget;
  const trigger = lastTriggerId.value ? document.getElementById(lastTriggerId.value) : null;
  if (visible(trigger)) return trigger;
  return Array.from(layout.value?.querySelectorAll<HTMLElement>('[data-slot="sidebar-trigger"]') ?? [])
    .find(node => visible(node) && [navId.value, contentId.value].includes(node.getAttribute("aria-controls") ?? "")) ?? null;
}

onMounted(() => { mounted.value = true; });
watchEffect((onCleanup) => {
  if (!mounted.value) return;
  const breakpoint = resolveSidebarBreakpoint(props.mobileBreakpoint);
  const media = window.matchMedia(`(width < ${breakpoint}px)`);
  const update = () => { narrowViewport.value = media.matches; };
  update();
  media.addEventListener("change", update);
  onCleanup(() => media.removeEventListener("change", update));
});

// Include openings requested directly by a controlled parent.
watch(() => isMobile.value && mobileOpen.value, (visible) => {
  if (visible) mobileReturnTarget = document.activeElement instanceof HTMLElement ? document.activeElement : null;
});
// A closed mobile drawer must not reopen after a desktop round trip.
watch(isMobile, (mobile, previous) => {
  if (!mobile && previous) setMobileOpen(false);
});
// When an external control hides a focused descendant, leave focus on a visible control.
watch(open, async (expanded) => {
  if (expanded || isMobile.value || !mounted.value) return;
  mobileReturnTarget = null;
  const nav = document.getElementById(navId.value);
  const active = document.activeElement;
  if (!(active instanceof HTMLElement) || !nav?.contains(active)) return;
  const section = active.closest('[data-slot="sidebar-collapsible"]');
  await nextTick();
  const sectionTrigger = section?.querySelector<HTMLElement>('[data-part="trigger"]');
  const target = props.collapsible === "icon" ? sectionTrigger ?? active : finalFocusEl();
  if (target?.isConnected && target.getClientRects().length) target.focus();
  else finalFocusEl()?.focus({ preventScroll: true });
});

const context: SidebarContext = {
  open, mobileOpen, isMobile, state, iconCollapsed, navId, contentId, dimensions,
  peekable: computed(() => props.peekable), isPeeking,
  resizable: computed(() => props.resizable), isResizing: resize.isResizing,
  width: resize.width, setWidth: resize.setWidth,
  setPeekInteraction: (value) => { peekInteraction.value = value; },
  collapsible: computed(() => props.collapsible),
  side: computed(() => props.side),
  compact: computed(() => props.compact),
  setOpen, setMobileOpen,
  toggle: () => isMobile.value ? setMobileOpen(!mobileOpen.value) : setOpen(!open.value),
  rememberTrigger: (value) => { lastTriggerId.value = value; },
  focusTrigger: () => { finalFocusEl()?.focus({ preventScroll: true }); },
};
provide(sidebarContextKey, context);
</script>

<template>
  <ArkDrawer.Root
    :id="id"
    :ids="{ content: contentId }"
    :open="isMobile && mobileOpen"
    :swipe-direction="props.side"
    :final-focus-el="finalFocusEl"
    :lazy-mount="true"
    :unmount-on-exit="false"
    @update:open="setMobileOpen"
  >
    <div
      ref="layout"
      v-bind="$attrs"
      class="kappa-sidebar-provider"
      :id="`${id}-layout`"
      data-slot="sidebar-provider"
      :data-state="state"
      :data-mobile="isMobile ? '' : undefined"
      :data-peekable="props.peekable ? '' : undefined"
      :data-collapsible="props.collapsible"
      :data-resizing="resize.isResizing.value ? '' : undefined"
      :style="dimensions"
    >
      <span class="kappa-sidebar__width-measure" data-slot="sidebar-width-measure" aria-hidden="true" />
      <slot />
    </div>
  </ArkDrawer.Root>
</template>

<style src="./sidebar.css"></style>
