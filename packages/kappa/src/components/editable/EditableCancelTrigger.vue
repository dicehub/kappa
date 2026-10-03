<script setup lang="ts">
import { Editable as ArkEditable } from "@ark-ui/vue/editable";
import type { EditableCancelTriggerProps, EditableCancelTriggerSlots } from "./editable";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<EditableCancelTriggerProps>(), {
  asChild: undefined,
});

defineSlots<EditableCancelTriggerSlots>();
</script>

<template>
  <ArkEditable.CancelTrigger
    v-bind="$attrs"
    class="kappa-editable__trigger kappa-editable__trigger--cancel"
    data-slot="editable-cancel-trigger"
    :as-child="props.asChild"
  >
    <slot />
  </ArkEditable.CancelTrigger>
</template>
