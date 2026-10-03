<script setup lang="ts">
import { Field as ArkField } from "@ark-ui/vue/field";
import { computed, useAttrs } from "vue";
import {
  INPUT_AREA_DEFAULT_SIZE,
  resolveInputAreaSize,
  type InputAreaEmits,
  type InputAreaModelValue,
  type InputAreaSize,
  type InputAreaSlots,
} from "./input-area";

defineOptions({ inheritAttrs: false });

interface InputAreaComponentProps {
  asChild?: boolean;
  autoresize?: boolean;
  invalid?: boolean;
  modelValue?: InputAreaModelValue;
  size?: InputAreaSize;
}

const props = withDefaults(defineProps<InputAreaComponentProps>(), {
  asChild: undefined,
  autoresize: false,
  invalid: false,
  modelValue: undefined,
  size: INPUT_AREA_DEFAULT_SIZE,
});

const emit = defineEmits<InputAreaEmits>();
defineSlots<InputAreaSlots>();

const attrs = useAttrs();
const resolvedSize = computed(() => resolveInputAreaSize(props.size));
const resolvedInvalid = computed(
  () =>
    props.invalid === true ||
    attrs["aria-invalid"] === "true" ||
    attrs["aria-invalid"] === true ||
    (attrs["data-invalid"] !== undefined && attrs["data-invalid"] !== false),
);
const textareaAttrs = computed<Record<string, unknown>>(() => ({
  ...attrs,
  ...(props.invalid ? { "aria-invalid": true } : {}),
}));
</script>

<template>
  <ArkField.Textarea
    v-bind="textareaAttrs"
    class="kappa-input-area"
    data-slot="input-area"
    :data-autoresize="props.autoresize ? '' : undefined"
    :data-invalid="resolvedInvalid ? '' : undefined"
    :data-size="resolvedSize"
    :as-child="props.asChild"
    :autoresize="props.autoresize"
    :model-value="props.modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <slot />
  </ArkField.Textarea>
</template>

<style src="./input-area.css"></style>
