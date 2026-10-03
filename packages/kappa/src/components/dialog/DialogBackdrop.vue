<script setup lang="ts">
import { Dialog as ArkDialog } from "@ark-ui/vue/dialog";
import type { DialogBackdropProps, DialogBackdropSlots } from "./dialog";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DialogBackdropProps>(), {
  asChild: undefined,
});

defineSlots<DialogBackdropSlots>();
</script>

<template>
  <ArkDialog.Backdrop
    v-bind="$attrs"
    class="kappa-dialog__backdrop"
    data-slot="dialog-backdrop"
    :as-child="props.asChild"
  >
    <slot />
  </ArkDialog.Backdrop>
</template>

<style src="./dialog.css"></style>
