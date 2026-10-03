<script setup lang="ts">
import { computed, useAttrs } from "vue";
import {
  INPUT_GROUP_DEFAULT_SIZE,
  isInputGroupInvalid,
  resolveInputGroupAriaBoolean,
  resolveInputGroupSize,
  type InputGroupControlEmits,
  type InputGroupTextareaProps,
} from "./input-group";
import { useInputGroupContext } from "./context";

defineOptions({ inheritAttrs: false });

type InputGroupTextareaComponentProps = Pick<
  InputGroupTextareaProps,
  "defaultValue" | "disabled" | "invalid" | "modelValue" | "size"
>;

const props = withDefaults(defineProps<InputGroupTextareaComponentProps>(), {
  defaultValue: undefined,
  disabled: undefined,
  invalid: undefined,
  modelValue: undefined,
  size: undefined,
});

const emit = defineEmits<InputGroupControlEmits>();

const attrs = useAttrs();
const context = useInputGroupContext();
const resolvedSize = computed(() =>
  resolveInputGroupSize(props.size ?? context?.size.value ?? INPUT_GROUP_DEFAULT_SIZE),
);
const resolvedDisabled = computed(
  () => props.disabled === true || context?.disabled.value === true,
);
const resolvedInvalid = computed(
  () =>
    props.invalid === true ||
    context?.invalid.value === true ||
    isInputGroupInvalid(attrs),
);
const textareaAttrs = computed<Record<string, unknown>>(() => ({
  ...attrs,
  ...(props.modelValue !== undefined
    ? { value: props.modelValue }
    : props.defaultValue !== undefined
      ? { defaultValue: props.defaultValue }
      : {}),
  "aria-invalid": resolvedInvalid.value
    ? "true"
    : attrs["aria-invalid"],
  disabled: resolvedDisabled.value,
  "data-disabled": resolvedDisabled.value ? "" : undefined,
  "data-invalid": resolvedInvalid.value ? "" : undefined,
  "data-size": resolvedSize.value,
  "data-slot": "input-group-control",
}));
const resolvedAriaDisabled = computed(() =>
  resolveInputGroupAriaBoolean(attrs["aria-disabled"]),
);

const handleInput = (event: Event) => {
  const value = (event.target as HTMLTextAreaElement | null)?.value ?? "";
  emit("update:modelValue", value);
  emit("valueChange", value);
};
</script>

<template>
  <textarea
    v-bind="textareaAttrs"
    class="kappa-input-group__control kappa-input-group__control--textarea"
    :aria-disabled="resolvedDisabled ? 'true' : resolvedAriaDisabled"
    @input="handleInput"
  />
</template>
