<script setup lang="ts">
import { ToggleGroup as ArkToggleGroup } from "@ark-ui/vue/toggle-group";
import { computed } from "vue";
import {
  TOGGLE_GROUP_DEFAULT_SIZE,
  TOGGLE_GROUP_DEFAULT_SPACING,
  TOGGLE_GROUP_DEFAULT_VARIANT,
  resolveToggleGroupSize,
  resolveToggleGroupSpacing,
  resolveToggleGroupVariant,
  type ToggleGroupRootProviderProps,
  type ToggleGroupRootProviderSlots,
} from "./toggle-group";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ToggleGroupRootProviderProps>(), {
  asChild: undefined,
  size: TOGGLE_GROUP_DEFAULT_SIZE,
  spacing: TOGGLE_GROUP_DEFAULT_SPACING,
  variant: TOGGLE_GROUP_DEFAULT_VARIANT,
});

defineSlots<ToggleGroupRootProviderSlots>();

const resolvedSize = computed(() => resolveToggleGroupSize(props.size));
const resolvedSpacing = computed(() => resolveToggleGroupSpacing(props.spacing));
const resolvedVariant = computed(() => resolveToggleGroupVariant(props.variant));
</script>

<template>
  <ArkToggleGroup.RootProvider
    v-bind="$attrs"
    class="kappa-toggle-group"
    data-slot="toggle-group"
    :data-size="resolvedSize"
    :data-spacing="resolvedSpacing"
    :data-variant="resolvedVariant"
    :as-child="props.asChild"
    :value="props.value"
  >
    <slot />
  </ArkToggleGroup.RootProvider>
</template>

<style src="./toggle-group.css"></style>
