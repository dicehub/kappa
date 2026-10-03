<script setup lang="ts">
import { Combobox } from "@ark-ui/vue/combobox";
import type { CommandPaletteItemProps } from "./command-palette";
import { useCommandPaletteContext } from "./command-palette-context";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<CommandPaletteItemProps>(), {
  disabled: false,
});
const emit = defineEmits<{ select: [value: unknown, event: MouseEvent] }>();
const context = useCommandPaletteContext("CommandPalette.Item");

const handlePointerMove = () => context.noteHighlightReason("pointer");
const handleClickCapture = (event: MouseEvent) => {
  if (props.disabled) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }
  if (event.metaKey || event.ctrlKey) {
    event.preventDefault();
    event.stopImmediatePropagation();
    emit("select", props.value, event);
    context.selectItem(props.value, { event, newTab: true });
  }
};
</script>

<template>
  <Combobox.Item
    v-bind="$attrs"
    :aria-disabled="props.disabled ? 'true' : undefined"
    class="kappa-command-palette__item"
    :data-disabled="props.disabled ? '' : undefined"
    :item="props.value"
    @click.capture="handleClickCapture"
    @click="emit('select', props.value, $event)"
    @pointermove="handlePointerMove"
  >
    <Combobox.ItemText class="kappa-command-palette__item-text">
      <slot />
    </Combobox.ItemText>
  </Combobox.Item>
</template>

<style src="./command-palette.css"></style>
