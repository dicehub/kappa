<script setup lang="ts">
import { NumberInput as ArkNumberInput } from "@ark-ui/vue/number-input";
import { computed } from "vue";
import { provideNumberInputScrubSteps } from "./number-input-scrub-steps";
import {
  NUMBER_INPUT_DEFAULT_SIZE,
  resolveNumberInputSize,
  type NumberInputRootProviderProps,
  type NumberInputRootProviderSlots,
} from "./number-input";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<NumberInputRootProviderProps>(), {
  allowMouseWheel: undefined,
  asChild: undefined,
  largeStep: undefined,
  size: NUMBER_INPUT_DEFAULT_SIZE,
  smallStep: undefined,
  step: undefined,
});

defineSlots<NumberInputRootProviderSlots>();

const resolvedSize = computed(() => resolveNumberInputSize(props.size));
const inputProps = computed(() => props.value.getInputProps());

provideNumberInputScrubSteps(() => ({
  largeStep: props.largeStep,
  smallStep: props.smallStep,
  step: props.step,
}));

const handleWheel = (event: WheelEvent) => {
  if (
    !props.allowMouseWheel ||
    props.value.focused ||
    event.deltaY === 0 ||
    event.ctrlKey ||
    event.metaKey ||
    inputProps.value.disabled ||
    inputProps.value.readonly
  ) {
    return;
  }

  const target = event.target;
  if (
    !(target instanceof Element) ||
    !target.closest(
      '[data-slot="number-input-input"], [data-slot="number-input-scrubbable-input"]',
    )
  ) {
    return;
  }

  event.preventDefault();
  if (event.deltaY < 0) props.value.increment();
  else props.value.decrement();
};
</script>

<template>
  <ArkNumberInput.RootProvider
    v-bind="$attrs"
    class="kappa-number-input"
    data-slot="number-input"
    :as-child="props.asChild"
    :data-readonly="inputProps.readonly ? '' : undefined"
    :data-required="inputProps.required ? '' : undefined"
    :data-size="resolvedSize"
    :value="props.value"
    @wheel="handleWheel"
  >
    <slot />
  </ArkNumberInput.RootProvider>
</template>

<style src="./number-input.css"></style>
