<script setup lang="ts">
import { Field as ArkField } from "@ark-ui/vue/field";
import { computed } from "vue";
import {
  FIELD_DEFAULT_ORIENTATION,
  resolveFieldOrientation,
  type FieldRootProviderProps,
  type FieldRootProviderSlots,
} from "./field";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<FieldRootProviderProps>(), {
  asChild: undefined,
  orientation: FIELD_DEFAULT_ORIENTATION,
});

defineSlots<FieldRootProviderSlots>();

const resolvedOrientation = computed(() => resolveFieldOrientation(props.orientation));
</script>

<template>
  <ArkField.RootProvider
    v-bind="$attrs"
    class="kappa-field"
    data-slot="field"
    :data-orientation="resolvedOrientation"
    :data-required="props.value.required ? '' : undefined"
    :as-child="props.asChild"
    :value="props.value"
  >
    <slot />
  </ArkField.RootProvider>
</template>

<style src="./field.css"></style>
