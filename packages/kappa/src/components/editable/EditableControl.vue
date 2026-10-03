<script setup lang="ts">
import { Editable as ArkEditable } from "@ark-ui/vue/editable";
import type { EditableControlProps, EditableControlSlots } from "./editable";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<EditableControlProps>(), {
  asChild: undefined,
});

defineSlots<EditableControlSlots>();
</script>

<template>
  <ArkEditable.Control
    v-bind="$attrs"
    class="kappa-editable__control"
    data-slot="editable-control"
    :as-child="props.asChild"
  >
    <slot />
  </ArkEditable.Control>
</template>
