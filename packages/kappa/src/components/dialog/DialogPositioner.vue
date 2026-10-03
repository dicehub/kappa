<script setup lang="ts">
import { Dialog as ArkDialog } from "@ark-ui/vue/dialog";
import type { DialogPositionerProps, DialogPositionerSlots } from "./dialog";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DialogPositionerProps>(), {
  asChild: undefined,
});

defineSlots<DialogPositionerSlots>();
</script>

<template>
  <ArkDialog.Positioner
    v-bind="$attrs"
    class="kappa-dialog__positioner"
    data-slot="dialog-positioner"
    :as-child="props.asChild"
  >
    <slot />
  </ArkDialog.Positioner>
</template>

<style src="./dialog.css"></style>
