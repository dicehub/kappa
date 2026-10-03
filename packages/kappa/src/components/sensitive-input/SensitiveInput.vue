<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  ref,
  useAttrs,
  useId,
  useSlots,
  watch,
} from "vue";
import {
  SENSITIVE_INPUT_DEFAULT_SIZE,
  resolveSensitiveInputSize,
  type SensitiveInputEmits,
  type SensitiveInputMode,
  type SensitiveInputModelValue,
  type SensitiveInputSize,
  type SensitiveInputSlots,
} from "./sensitive-input";

defineOptions({ inheritAttrs: false });

interface SensitiveInputComponentProps {
  defaultValue?: SensitiveInputModelValue;
  description?: string;
  disabled?: boolean;
  error?: string;
  id?: string;
  invalid?: boolean;
  label?: string;
  modelValue?: SensitiveInputModelValue;
  readOnly?: boolean;
  size?: SensitiveInputSize;
}

const props = withDefaults(defineProps<SensitiveInputComponentProps>(), {
  defaultValue: undefined,
  disabled: undefined,
  error: undefined,
  invalid: undefined,
  label: undefined,
  description: undefined,
  modelValue: undefined,
  readOnly: undefined,
  size: SENSITIVE_INPUT_DEFAULT_SIZE,
});

const emit = defineEmits<SensitiveInputEmits>();
defineSlots<SensitiveInputSlots>();

const attrs = useAttrs();
const slots = useSlots();
const inputRef = ref<HTMLInputElement | null>(null);
const controlRef = ref<HTMLDivElement | null>(null);
const generatedId = `kappa-sensitive-input-${useId()}`;
const inputId = computed(() =>
  typeof props.id === "string"
    ? props.id
    : typeof attrs.id === "string"
      ? attrs.id
      : generatedId,
);
const initialValue =
  props.defaultValue ??
  (typeof attrs.value === "string" || typeof attrs.value === "number"
    ? attrs.value
    : "");
const internalValue = ref(String(initialValue));
const copied = ref(false);
const currentValue = computed(() =>
  props.modelValue === undefined
    ? internalValue.value
    : String(props.modelValue),
);
const hasValue = computed(() => currentValue.value.length > 0);
const mode = ref<SensitiveInputMode>(hasValue.value ? "masked" : "empty");
const resolvedSize = computed(() => resolveSensitiveInputSize(props.size));
const componentInvalid = computed(
  () =>
    props.invalid === true ||
    Boolean(props.error || slots.error) ||
    (attrs["data-invalid"] !== undefined && attrs["data-invalid"] !== false),
);
const resolvedInvalid = computed(
  () =>
    componentInvalid.value ||
    attrs["aria-invalid"] === true ||
    attrs["aria-invalid"] === "true" ||
    attrs["aria-invalid"] === "grammar" ||
    attrs["aria-invalid"] === "spelling",
);
const hasLabel = computed(() => Boolean(props.label || slots.label));
const hasDescription = computed(() =>
  Boolean(props.description || slots.description),
);
const hasErrorMessage = computed(() => Boolean(props.error || slots.error));
const hasAriaLabel = computed(() => typeof attrs["aria-label"] === "string");
const isMasked = computed(() => mode.value === "masked" && hasValue.value);
const isRevealed = computed(() => mode.value === "revealed");
const inputType = computed(() => (isRevealed.value ? "text" : "password"));
const labelId = computed(() => `${inputId.value}-label`);
const descriptionId = computed(() => `${inputId.value}-description`);
const errorId = computed(() => `${inputId.value}-error`);
const instructionId = computed(() => `${inputId.value}-masked-instruction`);
const liveRegionId = computed(() => `${inputId.value}-live`);
const visibleLabel = computed(() => {
  if (typeof attrs["aria-label"] === "string") return attrs["aria-label"];
  if (props.label) return props.label;
  return "Sensitive value";
});
const ariaInvalid = computed<
  "true" | "false" | "grammar" | "spelling" | undefined
>(() => {
  if (componentInvalid.value) return "true";
  const value = attrs["aria-invalid"];
  if (value === true || value === "true") return "true";
  if (value === false || value === "false") return "false";
  if (value === "grammar" || value === "spelling") return value;
  return undefined;
});
const ariaLabelledBy = computed<string | undefined>(() =>
  typeof attrs["aria-labelledby"] === "string"
    ? attrs["aria-labelledby"]
    : undefined,
);
const labelledBy = computed(() =>
  [hasLabel.value ? labelId.value : undefined, ariaLabelledBy.value]
    .filter(Boolean)
    .join(" ") || undefined,
);
const describedBy = computed(() => {
  const ids = [
    typeof attrs["aria-describedby"] === "string"
      ? attrs["aria-describedby"]
      : undefined,
    isMasked.value ? instructionId.value : undefined,
    hasErrorMessage.value
      ? errorId.value
      : hasDescription.value
        ? descriptionId.value
        : undefined,
    liveRegionId.value,
  ];
  return ids.filter(Boolean).join(" ") || undefined;
});

const inputAttrs = computed<Record<string, unknown>>(() => {
  const {
    class: _class,
    style: _style,
    id: _id,
    value: _value,
    type: _type,
    disabled: _disabled,
    readonly: _readonly,
    "aria-describedby": _describedBy,
    "aria-invalid": _ariaInvalid,
    ...rest
  } = attrs;
  return rest;
});

let copiedTimer: ReturnType<typeof setTimeout> | undefined;

watch(hasValue, (value) => {
  if (!value) {
    const wasRevealed = isRevealed.value;
    mode.value = "empty";
    if (wasRevealed) emit("visibilityChange", false);
  } else if (mode.value === "empty") {
    mode.value = "masked";
  }
});

watch(copied, (value) => {
  if (copiedTimer) clearTimeout(copiedTimer);
  if (value) {
    copiedTimer = setTimeout(() => {
      copied.value = false;
    }, 2000);
  }
});

onBeforeUnmount(() => {
  if (copiedTimer) clearTimeout(copiedTimer);
});

const setValue = (value: string) => {
  if (props.modelValue === undefined) internalValue.value = value;
  emit("update:modelValue", value);
  emit("valueChange", value);
};

const reveal = () => {
  if (props.disabled || !hasValue.value) return;
  mode.value = "revealed";
  emit("visibilityChange", true);
  inputRef.value?.focus();
};

const mask = () => {
  if (!hasValue.value || !isRevealed.value) return;
  mode.value = "masked";
  emit("visibilityChange", false);
};

const toggleVisibility = (event?: MouseEvent) => {
  event?.stopPropagation();
  if (props.disabled) return;
  if (isRevealed.value) mask();
  else reveal();
};

const handleInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  if (mode.value === "empty" && value.length > 0) {
    mode.value = "revealed";
    emit("visibilityChange", true);
  }
  setValue(value);
};

const handleControlClick = (event: MouseEvent) => {
  if (!isMasked.value || props.disabled) return;
  if (event.target instanceof HTMLElement && event.target.closest("button")) return;
  reveal();
};

const handleKeydown = (event: KeyboardEvent) => {
  if (props.disabled) return;
  if (isMasked.value && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    reveal();
    return;
  }
  if (isRevealed.value && event.key === "Escape") {
    event.preventDefault();
    mask();
  }
};

const handleBlur = (event: FocusEvent) => {
  const nextTarget = event.relatedTarget;
  if (nextTarget instanceof Node && controlRef.value?.contains(nextTarget)) return;
  mask();
};

const handleControlFocusOut = (event: FocusEvent) => {
  const nextTarget = event.relatedTarget;
  if (nextTarget instanceof Node && controlRef.value?.contains(nextTarget)) return;
  mask();
};

const handleActionKeydown = (event: KeyboardEvent) => {
  if (event.key !== "Escape") return;
  event.preventDefault();
  mask();
};

const fallbackCopy = (value: string) => {
  if (typeof document === "undefined") return false;
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.insetInlineStart = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  let copiedValue = false;
  try {
    copiedValue = document.execCommand("copy");
  } catch {
    copiedValue = false;
  } finally {
    document.body.removeChild(textarea);
  }
  return copiedValue;
};

const copyValue = async (event: MouseEvent) => {
  event.stopPropagation();
  if (!hasValue.value || props.disabled) return;
  let didCopy = false;
  try {
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.clipboard?.writeText === "function"
    ) {
      await navigator.clipboard.writeText(currentValue.value);
      didCopy = true;
    }
  } catch {
    didCopy = false;
  }
  if (!didCopy) didCopy = fallbackCopy(currentValue.value);
  if (didCopy) {
    copied.value = true;
    emit("copy");
  }
};
</script>

<template>
  <div
    class="kappa-sensitive-input"
    :class="attrs.class"
    :style="attrs.style"
    data-slot="sensitive-input"
    :data-size="resolvedSize"
    :data-invalid="resolvedInvalid ? '' : undefined"
    :data-disabled="props.disabled ? '' : undefined"
    :data-readonly="props.readOnly ? '' : undefined"
  >
    <label
      v-if="hasLabel"
      :id="labelId"
      class="kappa-sensitive-input__label"
      :for="inputId"
      data-slot="sensitive-input-label"
    >
      <slot name="label">{{ props.label }}</slot>
    </label>

    <div
      ref="controlRef"
      class="kappa-sensitive-input__control"
      data-slot="sensitive-input-control"
      :data-state="mode"
      :data-masked="isMasked ? '' : undefined"
      :data-invalid="resolvedInvalid ? '' : undefined"
      :data-disabled="props.disabled ? '' : undefined"
      :data-readonly="props.readOnly ? '' : undefined"
      @click="handleControlClick"
      @focusout="handleControlFocusOut"
    >
      <input
        ref="inputRef"
        v-bind="inputAttrs"
        class="kappa-sensitive-input__input"
        data-slot="sensitive-input-input"
        :id="inputId"
        :value="currentValue"
        :type="inputType"
        :disabled="props.disabled"
        :readonly="props.readOnly || isMasked"
        :aria-describedby="describedBy"
        :aria-label="
          hasAriaLabel || (!hasLabel && !ariaLabelledBy) ? visibleLabel : undefined
        "
        :aria-invalid="ariaInvalid"
        :aria-labelledby="labelledBy"
        @blur="handleBlur"
        @input="handleInput"
        @keydown="handleKeydown"
      />

      <span
        v-if="isMasked"
        class="kappa-sensitive-input__mask"
        data-slot="sensitive-input-mask"
        aria-hidden="true"
      >
        <span class="kappa-sensitive-input__mask-stack">
          <span class="kappa-sensitive-input__mask-bullets">••••••••</span>
          <span class="kappa-sensitive-input__mask-reveal">Click to reveal</span>
        </span>
      </span>

      <button
        v-if="hasValue && !props.disabled"
        type="button"
        class="kappa-sensitive-input__copy"
        data-slot="sensitive-input-copy"
        :aria-label="copied ? 'Copied!' : 'Copy to clipboard'"
        @click="copyValue"
        @keydown.stop="handleActionKeydown"
      >
        <span aria-hidden="true">{{ copied ? "Copied!" : "Copy" }}</span>
      </button>

      <button
        v-if="hasValue && !props.disabled"
        type="button"
        class="kappa-sensitive-input__action kappa-sensitive-input__toggle"
        data-slot="sensitive-input-toggle"
        :aria-label="isRevealed ? 'Hide value' : 'Reveal value'"
        @click="toggleVisibility"
        @keydown.stop="handleActionKeydown"
      >
        <svg
          v-if="isRevealed"
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path d="m3 3 14 14M8.2 8.2a2.55 2.55 0 0 0 3.6 3.6" />
          <path d="M6.4 5.6C4 6.8 2.5 9 2.5 10s3.1 5.3 7.5 5.3c1.4 0 2.7-.4 3.8-.9M9.3 4.7c.2 0 .5-.1.7-.1 4.4 0 7.5 4.3 7.5 5.4 0 .5-.7 1.7-1.9 2.8" />
        </svg>
        <svg
          v-else
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path d="M2.5 10S5.6 4.7 10 4.7s7.5 5.3 7.5 5.3-3.1 5.3-7.5 5.3S2.5 10 2.5 10Z" />
          <circle cx="10" cy="10" r="2.5" />
        </svg>
      </button>
    </div>

    <p v-if="hasErrorMessage" :id="errorId" class="kappa-sensitive-input__message kappa-sensitive-input__error">
      <slot name="error">{{ props.error || "Enter a valid value." }}</slot>
    </p>
    <p v-else-if="hasDescription" :id="descriptionId" class="kappa-sensitive-input__message">
      <slot name="description">{{ props.description }}</slot>
    </p>
    <span v-if="isMasked" :id="instructionId" class="kappa-visually-hidden">
      Press Enter or choose Reveal value to show the value.
    </span>
    <span :id="liveRegionId" class="kappa-visually-hidden" aria-live="polite">
      {{ copied ? "Copied to clipboard." : isMasked ? "Value hidden." : "" }}
    </span>
  </div>
</template>

<style src="./sensitive-input.css"></style>
