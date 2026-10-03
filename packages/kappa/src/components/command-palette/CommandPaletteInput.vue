<script setup lang="ts">
import { Combobox } from "@ark-ui/vue/combobox";
import { computed, useAttrs } from "vue";
import type { CommandPaletteInputProps } from "./command-palette";
import { useCommandPaletteContext } from "./command-palette-context";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<CommandPaletteInputProps>(), {
  ariaLabel: "Search commands",
  autoFocus: true,
  placeholder: "Type a command or search...",
});
const attrs = useAttrs();
const context = useCommandPaletteContext("CommandPalette.Input");
const accessibleName = computed(() => String(attrs["aria-label"] ?? props.ariaLabel));

const handleKeydown = (event: KeyboardEvent) => {
  if (["ArrowDown", "ArrowUp", "End", "Home", "PageDown", "PageUp"].includes(event.key)) {
    context.noteHighlightReason("keyboard");
  }
  if (event.isComposing) return;
  if (event.key === "Enter") {
    event.preventDefault();
    context.selectHighlightedItem({ event, newTab: event.metaKey || event.ctrlKey });
  } else if (event.key === "Escape") {
    event.preventDefault();
    context.close();
  }
};
</script>

<template>
  <Combobox.Control class="kappa-command-palette__input-header">
    <slot name="leading">
      <span class="kappa-command-palette__search-icon" aria-hidden="true" />
    </slot>
    <Combobox.Input
      v-bind="attrs"
      :aria-label="accessibleName"
      autocomplete="off"
      autocapitalize="none"
      autocorrect="off"
      class="kappa-command-palette__input"
      :data-kappa-command-palette-autofocus="props.autoFocus ? '' : undefined"
      :placeholder="props.placeholder"
      spellcheck="false"
      @keydown="handleKeydown"
    />
    <slot name="trailing">
      <button
        class="kappa-command-palette__close-trigger"
        type="button"
        aria-label="Close command palette"
        @click="context.close"
      >
        <span aria-hidden="true" />
      </button>
    </slot>
  </Combobox.Control>
</template>

<style src="./command-palette.css"></style>
