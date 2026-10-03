<script setup lang="ts">
import { Drawer as ArkDrawer } from "@ark-ui/vue/drawer";
import { computed, useAttrs, useId, useSlots } from "vue";
import type { DrawerCloseProps, DrawerCloseSlots } from "./drawer";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DrawerCloseProps>(), {
  asChild: false,
  label: "Close drawer",
});

defineSlots<DrawerCloseSlots>();

const attrs = useAttrs();
const slots = useSlots();
const generatedId = useId();
const hasDefaultSlot = computed(() => Boolean(slots.default));
const closeId = computed(() => {
  const id = attrs.id;
  return typeof id === "string" && id ? id : `kappa-drawer-close-${generatedId}`;
});
const closeAttrs = computed(() => ({ ...attrs, id: closeId.value }));
const ariaLabel = computed(() => {
  const label = attrs["aria-label"];
  return typeof label === "string" && label ? label : props.label;
});
</script>

<template>
  <ArkDrawer.CloseTrigger
    v-if="hasDefaultSlot"
    v-bind="closeAttrs"
    class="kappa-drawer__close-trigger"
    data-slot="drawer-close"
    :as-child="props.asChild"
  >
    <slot />
  </ArkDrawer.CloseTrigger>
  <ArkDrawer.CloseTrigger
    v-else
    v-bind="closeAttrs"
    :aria-label="ariaLabel"
    class="kappa-drawer__close"
    data-slot="drawer-close"
    type="button"
  >
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
    </svg>
  </ArkDrawer.CloseTrigger>
</template>

<style src="./drawer.css"></style>
