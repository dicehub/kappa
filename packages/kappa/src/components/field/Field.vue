<script setup lang="ts">
import { Field as ArkField } from "@ark-ui/vue/field";
import { computed } from "vue";
import {
  FIELD_DEFAULT_ORIENTATION,
  resolveFieldOrientation,
  type FieldProps,
  type FieldSlots,
} from "./field";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<FieldProps>(), {
  asChild: undefined,
  disabled: undefined,
  id: undefined,
  ids: undefined,
  invalid: undefined,
  orientation: FIELD_DEFAULT_ORIENTATION,
  readOnly: undefined,
  required: undefined,
  target: undefined,
});

defineSlots<FieldSlots>();

const resolvedOrientation = computed(() => resolveFieldOrientation(props.orientation));
</script>

<template>
  <ArkField.Root
    v-bind="$attrs"
    class="kappa-field"
    data-slot="field"
    :data-orientation="resolvedOrientation"
    :data-required="props.required ? '' : undefined"
    :as-child="props.asChild"
    :disabled="props.disabled"
    :id="props.id"
    :ids="props.ids"
    :invalid="props.invalid"
    :read-only="props.readOnly"
    :required="props.required"
    :target="props.target"
  >
    <slot />
  </ArkField.Root>
</template>

<style src="./field.css"></style>
