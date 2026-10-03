<script setup lang="ts">
import { Combobox, useComboboxContext } from "@ark-ui/vue/combobox";
import { computed, useAttrs } from "vue";
import type { ComboboxInputProps } from "./combobox";
import { useKappaComboboxContext } from "./combobox-context";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ComboboxInputProps>(), {
  asChild: false,
});
const attrs = useAttrs();
const context = useKappaComboboxContext();
const combobox = useComboboxContext();
const inputAttributes = computed(() => ({
  autocomplete: "off",
  autocapitalize: "none",
  autocorrect: "off",
  spellcheck: false,
  ...attrs,
}));

const handleEscape = () => {
  if (combobox.value.open) combobox.value.setOpen(false, "escape-key");
};
</script>

<template>
  <Combobox.Input
    v-bind="inputAttributes"
    class="kappa-combobox__input"
    :aria-describedby="context.describedBy.value"
    :as-child="props.asChild"
    data-slot="combobox-input"
    @keydown.esc="handleEscape"
  >
    <slot />
  </Combobox.Input>
</template>
