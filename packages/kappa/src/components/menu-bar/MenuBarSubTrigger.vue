<script setup lang="ts">
import { useMenuContext } from "@ark-ui/vue/menu";
import { Dropdown, type DropdownSubTriggerProps, type DropdownSubTriggerSlots } from "../dropdown";

defineOptions({ inheritAttrs: false });
const props = defineProps<DropdownSubTriggerProps>();
defineSlots<DropdownSubTriggerSlots>();
const menu = useMenuContext();

const openWithPointer = () => {
  if (!props.disabled) menu.value.setOpen(true);
};

const openOnHover = (event: PointerEvent) => {
  if (event.pointerType === "mouse") openWithPointer();
};

const keepOpenAcrossPortal = (event: PointerEvent) => {
  // Keep the portalled child reachable; parent item navigation still dismisses it.
  if (menu.value.open) event.stopImmediatePropagation();
};
</script>

<template>
  <Dropdown.SubTrigger
    v-bind="{ ...$attrs, ...props }"
    @pointerenter="openOnHover"
    @pointerleave.capture="keepOpenAcrossPortal"
    @click="openWithPointer"
  >
    <slot />
    <template v-if="$slots.icon" #icon><slot name="icon" /></template>
    <template v-if="$slots.end" #end><slot name="end" /></template>
  </Dropdown.SubTrigger>
</template>
