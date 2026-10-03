<script setup lang="ts">
import { computed, getCurrentInstance, ref, useAttrs, watch } from "vue";
import CommandPaletteDialog from "./CommandPaletteDialog.vue";
import CommandPalettePanel from "./CommandPalettePanel.vue";
import type {
  CommandPaletteEmits,
  CommandPaletteHighlightDetails,
  CommandPaletteProps,
  CommandPaletteSelectOptions,
  CommandPaletteSlots,
} from "./command-palette";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<CommandPaletteProps>(), {
  ariaLabel: "Command palette",
  closeOnEscape: true,
  closeOnInteractOutside: true,
  filter: undefined,
  items: () => [],
  lazyMount: true,
  modal: true,
  preventScroll: true,
  restoreFocus: true,
  trapFocus: true,
  unmountOnExit: true,
});
const emit = defineEmits<CommandPaletteEmits>();
defineSlots<CommandPaletteSlots>();

const attrs = useAttrs();
const vnodeProps = getCurrentInstance()?.vnode.props ?? {};
const hasOpenProp = Object.prototype.hasOwnProperty.call(vnodeProps, "open");
const hasValueProp = Object.prototype.hasOwnProperty.call(vnodeProps, "value");
const internalOpen = ref(props.open ?? props.defaultOpen ?? false);
const resolvedOpen = computed(() => (hasOpenProp ? props.open ?? false : internalOpen.value));
const panelBindings = computed(() => ({
  ...attrs,
  ...(hasValueProp ? { value: props.value } : {}),
}));

const setOpen = (open: boolean) => {
  if (open === resolvedOpen.value) return;
  if (!hasOpenProp) internalOpen.value = open;
  emit("update:open", open);
  emit("openChange", open);
  if (!open) emit("close");
};

watch(
  () => props.open,
  (open) => {
    if (hasOpenProp && open !== undefined) internalOpen.value = open;
  },
);
</script>

<template>
  <CommandPaletteDialog
    :aria-label="ariaLabel"
    :close-on-escape="closeOnEscape"
    :close-on-interact-outside="closeOnInteractOutside"
    :lazy-mount="lazyMount"
    :modal="modal"
    :open="resolvedOpen"
    :prevent-scroll="preventScroll"
    :restore-focus="restoreFocus"
    :trap-focus="trapFocus"
    :unmount-on-exit="unmountOnExit"
    @open-change="setOpen"
  >
    <CommandPalettePanel
      v-bind="panelBindings"
      :default-value="defaultValue"
      :filter="filter"
      :get-selectable-items="getSelectableItems"
      :is-item-disabled="isItemDisabled"
      :item-to-string-value="itemToStringValue"
      :item-to-value="itemToValue"
      :items="items"
      :open="resolvedOpen"
      @close="setOpen(false)"
      @item-highlighted="
        (item: unknown, details: CommandPaletteHighlightDetails) =>
          emit('itemHighlighted', item, details)
      "
      @select="
        (item: unknown, options: CommandPaletteSelectOptions) => emit('select', item, options)
      "
      @update:value="emit('update:value', $event)"
      @value-change="emit('valueChange', $event)"
    >
      <template #default="slotProps">
        <slot v-bind="slotProps" />
      </template>
    </CommandPalettePanel>
  </CommandPaletteDialog>
</template>

<style src="./command-palette.css"></style>
