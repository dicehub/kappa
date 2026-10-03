<script setup lang="ts">
import { Editable as ArkEditable } from "@ark-ui/vue/editable";
import { computed } from "vue";
import {
  EDITABLE_DEFAULT_SIZE,
  resolveEditableSize,
  type EditableRootProviderProps,
  type EditableRootProviderSlots,
} from "./editable";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<EditableRootProviderProps>(), {
  asChild: undefined,
  size: EDITABLE_DEFAULT_SIZE,
});

defineSlots<EditableRootProviderSlots>();

const resolvedSize = computed(() => resolveEditableSize(props.size));
</script>

<template>
  <ArkEditable.RootProvider
    v-bind="$attrs"
    class="kappa-editable"
    data-slot="editable"
    :data-size="resolvedSize"
    :as-child="props.asChild"
    :value="props.value"
  >
    <slot />
  </ArkEditable.RootProvider>
</template>

<style src="./editable.css"></style>
