<script setup lang="ts">
import { Popover as ArkPopover } from "@ark-ui/vue/popover";
import { onMounted, ref } from "vue";
import PopoverArrow from "./PopoverArrow.vue";
import type { PopoverContentProps, PopoverContentSlots } from "./popover";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<PopoverContentProps>(), {
  asChild: undefined,
  showArrow: true,
  teleport: true,
  teleportTo: "body",
});

defineSlots<PopoverContentSlots>();

const isMounted = ref(false);

onMounted(() => {
  isMounted.value = true;
});
</script>

<template>
  <Teleport :disabled="!props.teleport || !isMounted" :to="props.teleportTo">
    <ArkPopover.Positioner
      class="kappa-popover__positioner"
      data-slot="popover-positioner"
    >
      <slot v-if="props.showArrow" name="arrow"><PopoverArrow /></slot>
      <ArkPopover.Content
        v-bind="$attrs"
        class="kappa-popover__content"
        data-slot="popover-content"
        :as-child="props.asChild"
      >
        <slot />
      </ArkPopover.Content>
    </ArkPopover.Positioner>
  </Teleport>
</template>

<style src="./popover.css"></style>
