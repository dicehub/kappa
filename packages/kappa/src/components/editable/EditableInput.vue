<script setup lang="ts">
import { Editable as ArkEditable } from "@ark-ui/vue/editable";
import type { EditableInputProps, EditableInputSlots } from "./editable";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<EditableInputProps>(), {
  asChild: undefined,
});

defineSlots<EditableInputSlots>();
</script>

<template>
  <ArkEditable.Input
    v-bind="$attrs"
    class="kappa-editable__input"
    data-slot="editable-input"
    :as-child="props.asChild"
  >
    <slot />
  </ArkEditable.Input>
</template>
