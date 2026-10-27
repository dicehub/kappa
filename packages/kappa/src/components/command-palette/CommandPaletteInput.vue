<script setup lang="ts">
import { Combobox } from "@ark-ui/vue/combobox";
import { computed, nextTick, useAttrs } from "vue";
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

const preserveSelection = (event: Event) => {
  const input = event.target;
  if (!(input instanceof HTMLInputElement) || (event instanceof InputEvent && event.isComposing)) return;
  const { value, selectionStart, selectionEnd, selectionDirection } = input;
  if (selectionStart === null || selectionEnd === null) return;
  // Ark's query/collection synchronization can move the caret after a native edit.
  // Keep the browser's selection when the application accepts the same query.
  void nextTick(() => {
    if (!input.isConnected || input.ownerDocument.activeElement !== input || input.value !== value) return;
    input.setSelectionRange(selectionStart, selectionEnd, selectionDirection ?? undefined);
  });
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.defaultPrevented) return;
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
      @input="preserveSelection"
      @keydown.capture="handleKeydown"
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
