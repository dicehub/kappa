<script setup lang="ts">
import { Fieldset as ArkFieldset } from "@ark-ui/vue/fieldset";
import { computed } from "vue";
import {
  FIELDSET_DEFAULT_ORIENTATION,
  resolveFieldsetOrientation,
  type FieldsetProps,
  type FieldsetSlots,
} from "./fieldset";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<FieldsetProps>(), {
  asChild: undefined,
  disabled: undefined,
  id: undefined,
  invalid: undefined,
  orientation: FIELDSET_DEFAULT_ORIENTATION,
});

defineSlots<FieldsetSlots>();

const resolvedOrientation = computed(() => resolveFieldsetOrientation(props.orientation));
</script>

<template>
  <ArkFieldset.Root
    v-bind="$attrs"
    class="kappa-fieldset"
    data-slot="fieldset"
    :data-orientation="resolvedOrientation"
    :as-child="props.asChild"
    :disabled="props.disabled"
    :id="props.id"
    :invalid="props.invalid"
  >
    <slot />
  </ArkFieldset.Root>
</template>

<style src="./fieldset.css"></style>
