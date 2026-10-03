<script setup lang="ts">
import { Editable as ArkEditable } from "@ark-ui/vue/editable";
import type { EditableAreaProps, EditableAreaSlots } from "./editable";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<EditableAreaProps>(), {
  asChild: undefined,
});

defineSlots<EditableAreaSlots>();
</script>

<template>
  <ArkEditable.Area
    v-bind="$attrs"
    class="kappa-editable__area"
    data-slot="editable-area"
    :as-child="props.asChild"
  >
    <slot />
  </ArkEditable.Area>
</template>
