<script setup lang="ts">
import { computed } from "vue";
import DialogContent from "../dialog/DialogContent.vue";
import {
  DIALOG_LAYOUT_DEFAULT_VERTICAL_ALIGN,
  resolveDialogLayoutVerticalAlign,
  type DialogLayoutContentProps,
  type DialogLayoutContentSlots,
} from "./dialog-layout";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DialogLayoutContentProps>(), {
  closeLabel: "Close dialog",
  showBackdrop: true,
  showCloseButton: true,
  size: "base",
  teleport: true,
  teleportTo: "body",
  verticalAlign: DIALOG_LAYOUT_DEFAULT_VERTICAL_ALIGN,
});

defineSlots<DialogLayoutContentSlots>();

const resolvedVerticalAlign = computed(() =>
  resolveDialogLayoutVerticalAlign(props.verticalAlign),
);
</script>

<template>
  <DialogContent
    v-bind="$attrs"
    class="kappa-dialog-layout__content"
    data-slot="dialog-layout-content"
    :data-vertical-align="resolvedVerticalAlign"
    :close-label="props.closeLabel"
    :show-backdrop="props.showBackdrop"
    :show-close-button="props.showCloseButton"
    :size="props.size"
    :teleport="props.teleport"
    :teleport-to="props.teleportTo"
  >
    <slot />
  </DialogContent>
</template>

<style src="./dialog-layout.css"></style>
