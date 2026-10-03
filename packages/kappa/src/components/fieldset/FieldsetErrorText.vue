<script setup lang="ts">
import { Fieldset as ArkFieldset } from "@ark-ui/vue/fieldset";
import type { FieldsetErrorTextSlots } from "./fieldset";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<{ asChild?: boolean }>(), {
  asChild: undefined,
});

defineSlots<FieldsetErrorTextSlots>();
</script>

<template>
  <ArkFieldset.ErrorText
    v-bind="$attrs"
    class="kappa-fieldset__error-text"
    data-slot="fieldset-error-text"
    :as-child="props.asChild"
  >
    <slot />
  </ArkFieldset.ErrorText>
</template>
