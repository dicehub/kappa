<script setup lang="ts">
import { Dialog } from "@ark-ui/vue/dialog";
import { onMounted, ref, Teleport, watch } from "vue";
import type { CommandPaletteDialogProps } from "./command-palette";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<CommandPaletteDialogProps>(), {
  ariaLabel: "Command palette",
  closeOnEscape: true,
  closeOnInteractOutside: true,
  lazyMount: true,
  modal: true,
  open: false,
  preventScroll: true,
  restoreFocus: true,
  trapFocus: true,
  unmountOnExit: true,
});
const emit = defineEmits<{
  openChange: [open: boolean];
  "update:open": [open: boolean];
}>();

const isMounted = ref(false);
const content = ref<HTMLElement | null>(null);
const returnFocus = ref<HTMLElement | null>(null);
const getInitialFocus = () =>
  content.value?.querySelector<HTMLElement>("[data-kappa-command-palette-autofocus]") ?? null;
const getFinalFocus = () => returnFocus.value;

onMounted(() => {
  isMounted.value = true;
});

watch(
  () => props.open,
  (open, wasOpen) => {
    if (open && !wasOpen && document.activeElement instanceof HTMLElement) {
      returnFocus.value = document.activeElement;
    }
  },
  { flush: "sync" },
);

const handleOpenChange = (details: { open: boolean }) => {
  emit("update:open", details.open);
  emit("openChange", details.open);
};
</script>

<template>
  <Dialog.Root
    :close-on-escape="props.closeOnEscape"
    :close-on-interact-outside="props.closeOnInteractOutside"
    :final-focus-el="getFinalFocus"
    :initial-focus-el="getInitialFocus"
    :lazy-mount="props.lazyMount"
    :modal="props.modal"
    :open="props.open"
    :prevent-scroll="props.preventScroll"
    :restore-focus="props.restoreFocus"
    :trap-focus="props.trapFocus"
    :unmount-on-exit="props.unmountOnExit"
    @open-change="handleOpenChange"
  >
    <Teleport v-if="isMounted" to="body">
      <Dialog.Backdrop class="kappa-command-palette__backdrop" />
      <Dialog.Positioner class="kappa-command-palette__positioner">
        <Dialog.Content
          ref="content"
          v-bind="$attrs"
          :aria-label="props.ariaLabel"
          class="kappa-command-palette__content"
        >
          <slot />
        </Dialog.Content>
      </Dialog.Positioner>
    </Teleport>
  </Dialog.Root>
</template>

<style src="./command-palette.css"></style>
