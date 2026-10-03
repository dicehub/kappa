<script setup lang="ts">
import { NumberInput as ArkNumberInput } from "@ark-ui/vue/number-input";
import { computed, ref, useAttrs } from "vue";
import type {
  NumberInputEditAlignment,
  NumberInputScrubSensitivity,
  NumberInputScrubbableInputSlots,
} from "./number-input";
import { resolveNumberInputEditAlignment } from "./number-input";
import { useScrubbableNumberInput } from "./use-scrubbable-number-input";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<{
  dragThreshold?: number;
  editAlignment?: NumberInputEditAlignment;
  scrubSensitivity?: NumberInputScrubSensitivity;
}>(), {
  dragThreshold: 10,
  editAlignment: undefined,
});

defineSlots<NumberInputScrubbableInputSlots>();

const attrs = useAttrs();
const root = ref<HTMLElement | null>(null);
const dragThreshold = computed(() =>
  Number.isFinite(props.dragThreshold) && props.dragThreshold >= 0
    ? props.dragThreshold
    : 10,
);
const editAlignment = computed(() => resolveNumberInputEditAlignment(props.editAlignment));
const {
  displayValue,
  dragging,
  editing,
  handleInputBlur,
  handleInputFocus,
  handlePointerDown,
  inputProps,
  numberInput,
} = useScrubbableNumberInput({ dragThreshold, root, scrubSensitivity: computed(() => props.scrubSensitivity) });
const visibleValue = computed(() => {
  if (displayValue.value !== "") return displayValue.value;
  return typeof attrs.placeholder === "string" ? attrs.placeholder : "";
});
</script>

<template>
  <div
    ref="root"
    class="kappa-number-input__scrubbable-input"
    data-slot="number-input-scrubbable-input"
    :data-edit-alignment="editAlignment"
    :data-dragging="dragging ? '' : undefined"
    :data-disabled="inputProps.disabled ? '' : undefined"
    :data-editing="editing ? '' : undefined"
    :data-readonly="inputProps.readonly ? '' : undefined"
    @pointerdown="handlePointerDown"
  >
    <ArkNumberInput.Input
      v-bind="$attrs"
      class="kappa-number-input__input kappa-number-input__scrubbable-editor"
      data-slot="number-input-input"
      @blur="handleInputBlur"
      @focus="handleInputFocus"
    />
    <span
      aria-hidden="true"
      class="kappa-number-input__scrubbable-display"
      data-slot="number-input-scrubbable-display"
    >
      <slot
        :dragging="dragging"
        :editing="editing"
        :value="numberInput.value"
        :value-as-number="numberInput.valueAsNumber"
      >
        {{ visibleValue }}
      </slot>
    </span>
  </div>
</template>
