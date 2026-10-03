<script setup lang="ts">
import { computed, useAttrs } from "vue";
import {
  resolveInputSize,
  type InputEmits,
  type InputProps,
} from "./input";

defineOptions({ inheritAttrs: false });

type InputComponentProps = Pick<
  InputProps,
  "invalid" | "modelValue" | "passwordManagerIgnore" | "size"
>;

const props = defineProps<InputComponentProps>();

const emit = defineEmits<InputEmits>();
const attrs = useAttrs();

const resolvedSize = computed(() => resolveInputSize(props.size));
const resolvedInvalid = computed(
  () =>
    props.invalid === true ||
    attrs["aria-invalid"] === "true" ||
    attrs["aria-invalid"] === true ||
    (attrs["data-invalid"] !== undefined && attrs["data-invalid"] !== false),
);
const inputAttrs = computed<Record<string, unknown>>(() => ({
  ...attrs,
  ...(props.modelValue !== undefined ? { value: props.modelValue } : {}),
  ...(props.invalid === true ? { "aria-invalid": true } : {}),
  ...(props.passwordManagerIgnore
    ? {
        "data-1p-ignore": "true",
        "data-bwignore": "true",
        "data-form-type": "other",
        "data-lpignore": "true",
      }
    : {}),
}));

const handleInput = (event: Event) => {
  emit("update:modelValue", (event.target as HTMLInputElement).value);
};
</script>

<template>
  <input
    v-bind="inputAttrs"
    class="kappa-input"
    :class="{ 'keeper-ignore': props.passwordManagerIgnore }"
    data-slot="input"
    :data-invalid="resolvedInvalid ? '' : undefined"
    :data-size="resolvedSize"
    @input="handleInput"
  />
</template>

<style src="./input.css"></style>
