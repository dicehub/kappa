<script setup lang="ts">
import { Combobox, useComboboxContext } from "@ark-ui/vue/combobox";
import { computed, useAttrs } from "vue";
import type { AutocompleteInputGroupProps } from "./autocomplete";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<AutocompleteInputGroupProps>(), {
  clearable: false,
  showTrigger: false,
  size: "base",
});

const attrs = useAttrs();
const combobox = useComboboxContext();
const hasInputValue = computed(() => Boolean(combobox.value.inputValue));
const inputAttributes = computed(() => ({
  autocomplete: "off",
  autocapitalize: "none",
  autocorrect: "off",
  spellcheck: false,
  ...attrs,
  ...props.inputAttrs,
  ...(props.placeholder === undefined ? {} : { placeholder: props.placeholder }),
}));

const handleEscape = () => {
  // Zag 1.43 does not close an open suggestion state from its input Escape event.
  if (combobox.value.open) combobox.value.setOpen(false, "escape-key");
};
</script>

<template>
  <Combobox.Control
    class="kappa-autocomplete__control"
    :class="`kappa-autocomplete__control--${size}`"
  >
    <Combobox.Input
      v-bind="inputAttributes"
      class="kappa-autocomplete__input"
      @keydown.esc="handleEscape"
    />
    <Combobox.ClearTrigger
      v-if="clearable && hasInputValue"
      aria-label="Clear input"
      class="kappa-autocomplete__clear-trigger"
      :hidden="false"
    >
      <slot name="clear">
        <span class="kappa-autocomplete__clear-icon" aria-hidden="true"></span>
      </slot>
    </Combobox.ClearTrigger>
    <Combobox.Trigger
      v-if="showTrigger"
      aria-label="Toggle suggestions"
      class="kappa-autocomplete__trigger"
    >
      <slot name="trigger">
        <span class="kappa-autocomplete__trigger-icon" aria-hidden="true"></span>
      </slot>
    </Combobox.Trigger>
  </Combobox.Control>
</template>
