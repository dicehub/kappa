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
  type ToggleGroupEmits,
  type ToggleGroupProps,
  type ToggleGroupRootSlots,
} from "./toggle-group";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ToggleGroupProps>(), {
  asChild: undefined,
  defaultValue: undefined,
  deselectable: undefined,
  disabled: undefined,
  id: undefined,
  ids: undefined,
  loopFocus: undefined,
  modelValue: undefined,
  multiple: undefined,
  orientation: undefined,
  rovingFocus: undefined,
  size: TOGGLE_GROUP_DEFAULT_SIZE,
  spacing: TOGGLE_GROUP_DEFAULT_SPACING,
  variant: TOGGLE_GROUP_DEFAULT_VARIANT,
});

const emit = defineEmits<ToggleGroupEmits>();
defineSlots<ToggleGroupRootSlots>();

const resolvedSize = computed(() => resolveToggleGroupSize(props.size));
const resolvedSpacing = computed(() => resolveToggleGroupSpacing(props.spacing));
const resolvedVariant = computed(() => resolveToggleGroupVariant(props.variant));
</script>

<template>
  <ArkToggleGroup.Root
    v-bind="$attrs"
    class="kappa-toggle-group"
    data-slot="toggle-group"
    :data-size="resolvedSize"
    :data-spacing="resolvedSpacing"
    :data-variant="resolvedVariant"
    :as-child="props.asChild"
    :default-value="props.defaultValue"
    :deselectable="props.deselectable"
    :disabled="props.disabled"
    :id="props.id"
    :ids="props.ids"
    :loop-focus="props.loopFocus"
    :model-value="props.modelValue"
    :multiple="props.multiple"
    :orientation="props.orientation"
    :roving-focus="props.rovingFocus"
    @update:model-value="emit('update:modelValue', $event)"
    @value-change="emit('valueChange', $event)"
  >
    <slot />
  </ArkToggleGroup.Root>
</template>

<style src="./toggle-group.css"></style>
