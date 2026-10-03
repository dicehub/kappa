<script setup lang="ts">
import { Dialog as ArkDialog } from "@ark-ui/vue/dialog";
import type { DialogDescriptionProps, DialogDescriptionSlots } from "./dialog";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DialogDescriptionProps>(), {
  asChild: undefined,
});

defineSlots<DialogDescriptionSlots>();
</script>

<template>
  <ArkDialog.Description
    v-bind="$attrs"
    class="kappa-dialog__description"
    data-slot="dialog-description"
    :as-child="props.asChild"
  >
    <slot />
  </ArkDialog.Description>
</template>

<style src="./dialog.css"></style>
