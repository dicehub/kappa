<script setup lang="ts">
import { Dialog as ArkDialog } from "@ark-ui/vue/dialog";
import { computed, onMounted, ref, Teleport } from "vue";
import DialogBackdrop from "./DialogBackdrop.vue";
import DialogClose from "./DialogClose.vue";
import DialogPositioner from "./DialogPositioner.vue";
import {
  DIALOG_DEFAULT_SIZE,
  resolveDialogSize,
  type DialogContentProps,
  type DialogContentSlots,
} from "./dialog";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DialogContentProps>(), {
  closeLabel: "Close dialog",
  showBackdrop: true,
  showCloseButton: true,
  size: DIALOG_DEFAULT_SIZE,
  teleport: true,
  teleportTo: "body",
});

defineSlots<DialogContentSlots>();

const isMounted = ref(false);
const resolvedSize = computed(() => resolveDialogSize(props.size));

onMounted(() => {
  isMounted.value = true;
});
</script>

<template>
  <Teleport :disabled="!props.teleport || !isMounted" :to="props.teleportTo">
    <DialogBackdrop v-if="props.showBackdrop" />
    <DialogPositioner>
      <ArkDialog.Content
        v-bind="$attrs"
        class="kappa-dialog__content"
        data-slot="dialog-content"
        :data-close-button="props.showCloseButton ? '' : undefined"
        :data-size="resolvedSize"
      >
        <slot />
        <slot v-if="props.showCloseButton" name="close">
          <DialogClose :label="props.closeLabel" />
        </slot>
      </ArkDialog.Content>
    </DialogPositioner>
  </Teleport>
</template>

<style src="./dialog.css"></style>
