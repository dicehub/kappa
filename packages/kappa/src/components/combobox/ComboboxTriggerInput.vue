<script setup lang="ts">
import { Combobox, useComboboxContext } from "@ark-ui/vue/combobox";
import { computed, useAttrs } from "vue";
import type { ComboboxTriggerInputProps } from "./combobox";
import ComboboxClearTrigger from "./ComboboxClearTrigger.vue";
import ComboboxControl from "./ComboboxControl.vue";
import ComboboxInput from "./ComboboxInput.vue";

defineOptions({ inheritAttrs: false });

defineSlots<{
  clear?: () => unknown;
  default?: () => unknown;
  trigger?: () => unknown;
}>();

const props = withDefaults(defineProps<ComboboxTriggerInputProps>(), {
  asChild: false,
  clearable: true,
  showTrigger: true,
});
const attrs = useAttrs();
const combobox = useComboboxContext();
const hasValue = computed(
  () => Boolean(combobox.value.inputValue) || combobox.value.value.length > 0,
);
const inputAttributes = computed(() => ({ ...attrs, ...props.inputAttrs }));
</script>

<template>
  <Combobox.Input
    v-if="asChild"
    v-bind="inputAttributes"
    as-child
    :placeholder="placeholder"
    data-slot="combobox-trigger-input"
  >
    <slot />
  </Combobox.Input>

  <ComboboxControl v-else :size="size" data-slot="combobox-trigger-input">
    <ComboboxInput v-bind="inputAttributes" :placeholder="placeholder" />
    <ComboboxClearTrigger
      v-if="clearable && hasValue"
      aria-label="Clear selection"
      class="kappa-combobox__icon-button"
    >
      <slot name="clear">
        <span class="kappa-combobox__clear-icon" aria-hidden="true"></span>
      </slot>
    </ComboboxClearTrigger>
    <Combobox.Trigger
      v-if="showTrigger"
      aria-label="Toggle options"
      class="kappa-combobox__icon-button"
    >
      <slot name="trigger">
        <span class="kappa-combobox__caret-icon" aria-hidden="true"></span>
      </slot>
    </Combobox.Trigger>
  </ComboboxControl>
</template>
