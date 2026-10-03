<script setup lang="ts">
import { Slider as ArkSlider } from "@ark-ui/vue/slider";
import { computed } from "vue";
import {
  SLIDER_DEFAULT_SIZE,
  resolveSliderSize,
  type SliderEmits,
  type SliderRootSlots,
  type SliderProps,
} from "./slider";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<SliderProps>(), {
  "aria-label": undefined,
  "aria-labelledby": undefined,
  asChild: undefined,
  defaultValue: undefined,
  dir: undefined,
  disabled: undefined,
  form: undefined,
  getAriaValueText: undefined,
  getRootNode: undefined,
  id: undefined,
  ids: undefined,
  invalid: undefined,
  largeStep: undefined,
  max: undefined,
  min: undefined,
  minStepsBetweenThumbs: undefined,
  modelValue: undefined,
  name: undefined,
  orientation: undefined,
  origin: undefined,
  readOnly: undefined,
  size: SLIDER_DEFAULT_SIZE,
  step: undefined,
  thumbAlignment: undefined,
  thumbCollisionBehavior: undefined,
  thumbSize: undefined,
});

const emit = defineEmits<SliderEmits>();
defineSlots<SliderRootSlots>();

const resolvedSize = computed(() => resolveSliderSize(props.size));
</script>

<template>
  <ArkSlider.Root
    v-bind="$attrs"
    class="kappa-slider"
    data-slot="slider"
    :data-readonly="props.readOnly ? '' : undefined"
    :data-size="resolvedSize"
    :aria-label="props['aria-label']"
    :aria-labelledby="props['aria-labelledby']"
    :as-child="props.asChild"
    :default-value="props.defaultValue"
    :dir="props.dir"
    :disabled="props.disabled"
    :form="props.form"
    :get-aria-value-text="props.getAriaValueText"
    :get-root-node="props.getRootNode"
    :id="props.id"
    :ids="props.ids"
    :invalid="props.invalid"
    :large-step="props.largeStep"
    :max="props.max"
    :min="props.min"
    :min-steps-between-thumbs="props.minStepsBetweenThumbs"
    :model-value="props.modelValue"
    :name="props.name"
    :orientation="props.orientation"
    :origin="props.origin"
    :read-only="props.readOnly"
    :step="props.step"
    :thumb-alignment="props.thumbAlignment"
    :thumb-collision-behavior="props.thumbCollisionBehavior"
    :thumb-size="props.thumbSize"
    @focus-change="emit('focusChange', $event)"
    @update:model-value="emit('update:modelValue', $event)"
    @value-change="emit('valueChange', $event)"
    @value-change-end="emit('valueChangeEnd', $event)"
  >
    <slot />
  </ArkSlider.Root>
</template>

<style src="./slider.css"></style>
