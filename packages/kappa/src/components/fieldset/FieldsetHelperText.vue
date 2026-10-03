<script setup lang="ts">
import { Fieldset as ArkFieldset } from "@ark-ui/vue/fieldset";
import type { FieldsetHelperTextSlots } from "./fieldset";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<{ asChild?: boolean }>(), {
  asChild: undefined,
});

defineSlots<FieldsetHelperTextSlots>();
</script>

<template>
  <ArkFieldset.HelperText
    v-bind="$attrs"
    class="kappa-fieldset__helper-text"
    data-slot="fieldset-helper-text"
    :as-child="props.asChild"
  >
    <slot />
  </ArkFieldset.HelperText>
</template>
