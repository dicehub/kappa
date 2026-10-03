<script setup lang="ts">
import { Fieldset as ArkFieldset } from "@ark-ui/vue/fieldset";
import { computed } from "vue";
import {
  FIELDSET_DEFAULT_ORIENTATION,
  resolveFieldsetOrientation,
  type FieldsetRootProviderProps,
  type FieldsetRootProviderSlots,
} from "./fieldset";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<FieldsetRootProviderProps>(), {
  asChild: undefined,
  orientation: FIELDSET_DEFAULT_ORIENTATION,
});

defineSlots<FieldsetRootProviderSlots>();

const resolvedOrientation = computed(() => resolveFieldsetOrientation(props.orientation));
</script>

<template>
  <ArkFieldset.RootProvider
    v-bind="$attrs"
    class="kappa-fieldset"
    data-slot="fieldset"
    :data-orientation="resolvedOrientation"
    :as-child="props.asChild"
    :value="props.value"
  >
    <slot />
  </ArkFieldset.RootProvider>
</template>

<style src="./fieldset.css"></style>
