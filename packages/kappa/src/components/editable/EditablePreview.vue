<script setup lang="ts">
import { Editable as ArkEditable } from "@ark-ui/vue/editable";
import type { EditablePreviewProps, EditablePreviewSlots } from "./editable";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<EditablePreviewProps>(), {
  asChild: undefined,
});

defineSlots<EditablePreviewSlots>();
</script>

<template>
  <ArkEditable.Preview
    v-bind="$attrs"
    class="kappa-editable__preview"
    data-slot="editable-preview"
    :as-child="props.asChild"
  >
    <slot />
  </ArkEditable.Preview>
</template>
