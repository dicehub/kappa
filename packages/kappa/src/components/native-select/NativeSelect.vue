<script setup lang="ts">
import { computed, onMounted, onUpdated, ref, useAttrs } from "vue";
import {
  resolveNativeSelectSize,
  type NativeSelectEmits,
  type NativeSelectModelValue,
  type NativeSelectProps,
  type NativeSelectSlots,
} from "./native-select";

defineOptions({ inheritAttrs: false });

type NativeSelectComponentProps = Pick<
  NativeSelectProps,
  "invalid" | "modelValue" | "size"
>;

const props = defineProps<NativeSelectComponentProps>();
const emit = defineEmits<NativeSelectEmits>();
defineSlots<NativeSelectSlots>();

const attrs = useAttrs();
const control = ref<HTMLSelectElement | null>(null);

const resolvedSize = computed(() => resolveNativeSelectSize(props.size));
const isPresentBooleanAttribute = (value: unknown) =>
  value !== undefined && value !== null && value !== false;
const resolvedDisabled = computed(() => isPresentBooleanAttribute(attrs.disabled));
const resolvedMultiple = computed(() => isPresentBooleanAttribute(attrs.multiple));
const resolvedInvalid = computed(
  () =>
    props.invalid === true ||
    attrs["aria-invalid"] === "true" ||
    attrs["aria-invalid"] === true ||
    (attrs["data-invalid"] !== undefined && attrs["data-invalid"] !== false),
);
const selectAttrs = computed<Record<string, unknown>>(() => ({
  ...attrs,
  ...(props.modelValue !== undefined ? { value: props.modelValue } : {}),
  ...(props.invalid === true ? { "aria-invalid": true } : {}),
}));

const syncControlledValue = () => {
  const element = control.value;
  const modelValue = props.modelValue;
  if (!element || modelValue === undefined) return;

  const values = new Set(
    (Array.isArray(modelValue) ? modelValue : [modelValue]).map(String),
  );

  if (element.multiple) {
    for (const option of element.options) {
      option.selected = values.has(option.value);
    }
    return;
  }

  element.value = String(modelValue as Exclude<NativeSelectModelValue, readonly unknown[]>);
};

const handleChange = (event: Event) => {
  const element = event.target as HTMLSelectElement;
  const value = element.multiple
    ? Array.from(element.selectedOptions, (option) => option.value)
    : element.value;
  emit("update:modelValue", value);
};

onMounted(syncControlledValue);
onUpdated(syncControlledValue);
</script>

<template>
  <span
    class="kappa-native-select"
    data-slot="native-select-wrapper"
    :data-disabled="resolvedDisabled ? '' : undefined"
    :data-multiple="resolvedMultiple ? '' : undefined"
    :data-size="resolvedSize"
  >
    <select
      ref="control"
      v-bind="selectAttrs"
      class="kappa-native-select__control"
      data-slot="native-select"
      :data-invalid="resolvedInvalid ? '' : undefined"
      :data-size="resolvedSize"
      @change="handleChange"
    >
      <slot />
    </select>
    <svg
      class="kappa-native-select__icon"
      data-slot="native-select-icon"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="m4 6 4 4 4-4"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </span>
</template>

<style src="./native-select.css"></style>
