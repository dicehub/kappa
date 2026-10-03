<script setup lang="ts">
import { useSplitter } from "@ark-ui/vue/splitter";
import { computed, onScopeDispose, watch } from "vue";
import type { SidebarResizeHandleProps } from "./sidebar";
import { useSidebarContext } from "./sidebar-context";
import { useSidebarResizeContext } from "./sidebar-resize";

defineOptions({ inheritAttrs: false });
const props = defineProps<SidebarResizeHandleProps>();
const sidebar = useSidebarContext();
const resize = useSidebarResizeContext();
const api = useSplitter(resize.props);
const handleProps = computed(() => api.value.getResizeTriggerProps({ id: resize.handleId.value, disabled: props.disabled }));
function toggleTrailingPanel(event: KeyboardEvent) {
  if (event.defaultPrevented || props.disabled || event.key !== "Enter" || resize.handleId.value !== "remainder:navigation") return;
  // Ark's Enter shortcut targets the leading panel. Our controlled panel can trail it.
  event.preventDefault();
  if (sidebar.open.value) api.value.collapsePanel("navigation");
  else api.value.expandPanel("navigation");
}
watch(() => api.value.dragging, resize.setIsResizing);
onScopeDispose(() => resize.setIsResizing(false));
</script>

<template>
  <div
    v-bind="{ ...handleProps, ...$attrs }"
    class="kappa-sidebar__resize-handle"
    data-slot="sidebar-resize-handle"
    :aria-label="props.label"
    aria-orientation="vertical"
    :aria-controls="sidebar.navId.value"
    :aria-valuemin="resize.range.value.min"
    :aria-valuemax="resize.range.value.max"
    :aria-valuenow="Math.round(sidebar.open.value ? sidebar.width.value : resize.range.value.collapsed)"
    :aria-valuetext="sidebar.open.value ? `${Math.round(sidebar.width.value)} pixels` : 'Collapsed'"
    :aria-disabled="props.disabled || undefined"
    @keydown.capture="toggleTrailingPanel"
  />
</template>

<style src="./sidebar.css"></style>
