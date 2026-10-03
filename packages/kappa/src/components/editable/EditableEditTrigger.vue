<script setup lang="ts">
import { Editable as ArkEditable } from "@ark-ui/vue/editable";
import type { EditableEditTriggerProps, EditableEditTriggerSlots } from "./editable";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<EditableEditTriggerProps>(), {
  asChild: undefined,
});

defineSlots<EditableEditTriggerSlots>();
</script>

<template>
  <ArkEditable.EditTrigger
    v-bind="$attrs"
    class="kappa-editable__trigger kappa-editable__trigger--edit"
    data-slot="editable-edit-trigger"
    :as-child="props.asChild"
  >
    <slot />
  </ArkEditable.EditTrigger>
</template>
