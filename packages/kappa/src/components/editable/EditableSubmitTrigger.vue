<script setup lang="ts">
import { Editable as ArkEditable } from "@ark-ui/vue/editable";
import type { EditableSubmitTriggerProps, EditableSubmitTriggerSlots } from "./editable";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<EditableSubmitTriggerProps>(), {
  asChild: undefined,
});

defineSlots<EditableSubmitTriggerSlots>();
</script>

<template>
  <ArkEditable.SubmitTrigger
    v-bind="$attrs"
    class="kappa-editable__trigger kappa-editable__trigger--submit"
    data-slot="editable-submit-trigger"
    :as-child="props.asChild"
  >
    <slot />
  </ArkEditable.SubmitTrigger>
</template>
