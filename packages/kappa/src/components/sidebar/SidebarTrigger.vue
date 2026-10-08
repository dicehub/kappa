<script setup lang="ts">
import { ark } from "@ark-ui/vue/factory";
import { computed, useAttrs, useId } from "vue";
import type { SidebarSlots, SidebarTriggerProps } from "./sidebar";
import { useSidebarContext } from "./sidebar-context";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<SidebarTriggerProps>(), {
  asChild: false, disabled: false, peek: false,
  expandLabel: "Expand sidebar", collapseLabel: "Collapse sidebar",
  openLabel: "Open sidebar", closeLabel: "Close sidebar",
});
defineSlots<SidebarSlots>();
const sidebar = useSidebarContext();
const attrs = useAttrs();
const generatedId = useId();
const id = computed(() => String(attrs.id ?? `kappa-sidebar-trigger-${generatedId}`));
const expanded = computed(() => sidebar.isMobile.value ? sidebar.mobileOpen.value : sidebar.open.value);
const visible = computed(() => expanded.value || (props.peek && sidebar.isPeeking.value));
const label = computed(() => sidebar.isMobile.value
  ? expanded.value ? props.closeLabel : props.openLabel
  : expanded.value ? props.collapseLabel : props.expandLabel);
function onClick(event: MouseEvent) {
  if (event.defaultPrevented || props.disabled) return;
  sidebar.rememberTrigger(id.value);
  sidebar.toggle();
}
</script>

<template>
  <ark.button
    :aria-label="$slots.default ? undefined : label"
    v-bind="$attrs"
    :id="id"
    :as-child="props.asChild"
    class="kappa-sidebar__trigger"
    data-slot="sidebar-trigger"
    :data-peek="props.peek && !props.disabled && sidebar.peekable.value && sidebar.collapsible.value === 'offcanvas' && !sidebar.isMobile.value ? '' : undefined"
    type="button"
    :disabled="props.disabled || (!sidebar.isMobile.value && sidebar.collapsible.value === 'none')"
    :aria-expanded="visible"
    :aria-controls="sidebar.isMobile.value ? sidebar.contentId.value : sidebar.navId.value"
    :aria-haspopup="sidebar.isMobile.value ? 'dialog' : undefined"
    @click="onClick"
  >
    <slot>
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
        <rect x="2" y="2.5" width="12" height="11" rx="1.5" />
        <path d="M6 2.5v11" />
      </svg>
    </slot>
  </ark.button>
</template>

<style src="./sidebar.css"></style>
