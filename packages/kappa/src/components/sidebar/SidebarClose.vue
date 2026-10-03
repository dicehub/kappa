<script setup lang="ts">
import { Drawer as ArkDrawer } from "@ark-ui/vue/drawer";
import type { SidebarCloseProps, SidebarSlots } from "./sidebar";
import { useSidebarContext } from "./sidebar-context";
defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<SidebarCloseProps>(), { asChild: false, label: "Close sidebar" });
defineSlots<SidebarSlots>();
const sidebar = useSidebarContext();
</script>

<template>
  <ArkDrawer.CloseTrigger
    v-if="sidebar.isMobile.value"
    :aria-label="$slots.default ? undefined : props.label"
    v-bind="$attrs"
    :as-child="props.asChild"
    class="kappa-sidebar__close"
    data-slot="sidebar-close"
    type="button"
  >
    <slot><svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false"><path d="m4 4 8 8M12 4l-8 8" /></svg></slot>
  </ArkDrawer.CloseTrigger>
</template>

<style src="./sidebar.css"></style>
