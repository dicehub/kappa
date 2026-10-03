<script setup lang="ts">
import { Dialog as ArkDialog } from "@ark-ui/vue/dialog";
import { computed, useAttrs, useId, useSlots } from "vue";
import type { DialogCloseProps, DialogCloseSlots } from "./dialog";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DialogCloseProps>(), {
  asChild: false,
  label: "Close dialog",
});

defineSlots<DialogCloseSlots>();

const attrs = useAttrs();
const slots = useSlots();
const generatedId = useId();
const hasDefaultSlot = computed(() => Boolean(slots.default));
const closeId = computed(() => {
  const id = attrs.id;
  return typeof id === "string" && id ? id : `kappa-dialog-close-${generatedId}`;
});
const closeAttrs = computed(() => ({ ...attrs, id: closeId.value }));
const ariaLabel = computed(() => {
  const label = attrs["aria-label"];
  return typeof label === "string" && label ? label : props.label;
});
</script>

<template>
  <ArkDialog.CloseTrigger
    v-if="hasDefaultSlot"
    v-bind="closeAttrs"
    class="kappa-dialog__close-trigger"
    data-slot="dialog-close"
    :as-child="props.asChild"
  >
    <slot />
  </ArkDialog.CloseTrigger>
  <ArkDialog.CloseTrigger
    v-else
    v-bind="closeAttrs"
    :aria-label="ariaLabel"
    class="kappa-dialog__close"
    data-slot="dialog-close"
    type="button"
  >
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
    </svg>
  </ArkDialog.CloseTrigger>
</template>

<style src="./dialog.css"></style>
