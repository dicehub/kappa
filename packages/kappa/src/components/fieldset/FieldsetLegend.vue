<script setup lang="ts">
import { Fieldset as ArkFieldset } from "@ark-ui/vue/fieldset";
import type { FieldsetLegendSlots } from "./fieldset";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<{ asChild?: boolean }>(), {
  asChild: undefined,
});

defineSlots<FieldsetLegendSlots>();
</script>

<template>
  <ArkFieldset.Legend
    v-bind="$attrs"
    class="kappa-fieldset__legend"
    data-slot="fieldset-legend"
    :as-child="props.asChild"
  >
    <slot />
  </ArkFieldset.Legend>
</template>
