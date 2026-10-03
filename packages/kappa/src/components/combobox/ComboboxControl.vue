<script setup lang="ts">
import { Combobox } from "@ark-ui/vue/combobox";
import { computed } from "vue";
import type { ComboboxControlProps } from "./combobox";
import { useKappaComboboxContext } from "./combobox-context";

defineOptions({ inheritAttrs: false });

const props = defineProps<ComboboxControlProps>();
const context = useKappaComboboxContext();
const resolvedSize = computed(() => props.size ?? context.size.value);
</script>

<template>
  <Combobox.Control
    v-bind="$attrs"
    class="kappa-combobox__control"
    :class="`kappa-combobox__control--${resolvedSize}`"
    :data-invalid="context.invalid.value ? '' : undefined"
    data-slot="combobox-control"
  >
    <slot />
  </Combobox.Control>
</template>
