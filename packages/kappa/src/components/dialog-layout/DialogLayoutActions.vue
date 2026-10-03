<script setup lang="ts">
import Button from "../button/Button.vue";
import DialogClose from "../dialog/DialogClose.vue";
import type {
  DialogLayoutActionsProps,
  DialogLayoutActionsSlots,
} from "./dialog-layout";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DialogLayoutActionsProps>(), {
  dismissDisabled: false,
  dismissLabel: "Close",
});

defineSlots<DialogLayoutActionsSlots>();
</script>

<template>
  <footer
    v-bind="$attrs"
    class="kappa-dialog-layout__actions"
    data-slot="dialog-layout-actions"
  >
    <DialogClose as-child>
      <Button
        :disabled="props.dismissDisabled"
        size="sm"
        type="button"
        variant="ghost"
      >
        {{ props.dismissLabel }}
      </Button>
    </DialogClose>
    <div class="kappa-dialog-layout__primary" data-slot="dialog-layout-primary-slot">
      <slot />
    </div>
  </footer>
</template>

<style src="./dialog-layout.css"></style>
