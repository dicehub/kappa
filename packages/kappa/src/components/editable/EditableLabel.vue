<script setup lang="ts">
import { Editable as ArkEditable } from "@ark-ui/vue/editable";
import type { EditableLabelProps, EditableLabelSlots } from "./editable";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<EditableLabelProps>(), {
  asChild: undefined,
});

defineSlots<EditableLabelSlots>();
</script>

<template>
  <ArkEditable.Label
    v-bind="$attrs"
    class="kappa-editable__label"
    data-slot="editable-label"
    :as-child="props.asChild"
  >
    <slot />
  </ArkEditable.Label>
</template>
