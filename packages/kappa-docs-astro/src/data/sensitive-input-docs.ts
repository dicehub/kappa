export const barrelCode = `import { SensitiveInput } from "@dicehub/kappa";`;

export const granularCode = `import { SensitiveInput } from "@dicehub/kappa/components/sensitive-input";`;

export const previewCode = `<script setup>
import { ref } from "vue";
import { SensitiveInput } from "@dicehub/kappa/components/sensitive-input";

const token = ref("");
</script>

<template>
  <SensitiveInput
    id="access-token"
    v-model="token"
    label="Access token"
    autocomplete="off"
    placeholder="dh_live_…"
    description="Stored encrypted and shown only when you choose to reveal it."
  />
</template>`;

export const usageCode = `<script setup>
import { SensitiveInput } from "@dicehub/kappa/components/sensitive-input";
</script>

<template>
  <SensitiveInput
    aria-label="Webhook signing secret"
    default-value="whsec_7f29b1d0"
    name="webhook-secret"
    autocomplete="off"
  />
</template>`;

export const sizesCode = `<script setup>
import { SensitiveInput } from "@dicehub/kappa/components/sensitive-input";
</script>

<template>
  <SensitiveInput size="xs" aria-label="Extra-small secret" default-value="xs-secret" />
  <SensitiveInput size="sm" aria-label="Small secret" default-value="sm-secret" />
  <SensitiveInput size="base" aria-label="Base secret" default-value="base-secret" />
  <SensitiveInput size="lg" aria-label="Large secret" default-value="lg-secret" />
</template>`;

export const controlledCode = `<script setup>
import { ref } from "vue";
import { SensitiveInput } from "@dicehub/kappa/components/sensitive-input";

const secret = ref("dh_secret_4b8f2c");
</script>

<template>
  <SensitiveInput v-model="secret" label="Controlled secret" />
  <output>Current value: {{ secret }}</output>
</template>`;

export const statesCode = `<script setup>
import { SensitiveInput } from "@dicehub/kappa/components/sensitive-input";
</script>

<template>
  <SensitiveInput
    label="Invalid token"
    default-value="bad_token"
    error="This token is not valid for the selected workspace."
    invalid
  />
  <SensitiveInput label="Disabled token" default-value="archived_secret" disabled />
  <SensitiveInput label="Read-only token" default-value="view_only_secret" read-only />
</template>`;

export const interactionCode = `<script setup>
import { ref } from "vue";
import { SensitiveInput } from "@dicehub/kappa/components/sensitive-input";

const copied = ref(false);
</script>

<template>
  <SensitiveInput
    aria-label="Signing secret"
    default-value="signing_secret_89ac"
    @copy="copied = true"
  />
  <p v-if="copied" role="status">Secret copied to the clipboard.</p>
</template>`;

export const rootProps = [
  {
    name: "modelValue / v-model",
    type: "string | number",
    defaultValue: "—",
    description: "Controlled value. Updates emit the current value as a string.",
  },
  {
    name: "defaultValue",
    type: "string | number",
    defaultValue: '""',
    description: "Initial value for uncontrolled use. Native value is also forwarded.",
  },
  {
    name: "label",
    type: "string",
    defaultValue: "—",
    description: "Optional visible label connected to the input.",
  },
  {
    name: "description",
    type: "string",
    defaultValue: "—",
    description: "Optional help text connected with aria-describedby.",
  },
  {
    name: "error",
    type: "string",
    defaultValue: "—",
    description: "Optional validation message. It also marks the field invalid.",
  },
  {
    name: "invalid",
    type: "boolean",
    defaultValue: "false",
    description: "Marks the control invalid and sets aria-invalid=true.",
  },
  {
    name: "disabled",
    type: "boolean",
    defaultValue: "false",
    description: "Disables the native input and reveal/copy actions.",
  },
  {
    name: "readOnly",
    type: "boolean",
    defaultValue: "false",
    description: "Prevents edits while still allowing reveal and copy.",
  },
  {
    name: "size",
    type: '"xs" | "sm" | "base" | "lg"',
    defaultValue: '"base"',
    description: "Sets visual control density.",
  },
] as const;

export const events = [
  {
    name: "update:modelValue",
    payload: "string",
    description: "Emitted for Vue v-model on every input event.",
  },
  {
    name: "valueChange",
    payload: "string",
    description: "Emitted with the current value after an input event.",
  },
  {
    name: "copy",
    payload: "—",
    description: "Emitted after a successful clipboard copy.",
  },
  {
    name: "visibilityChange",
    payload: "boolean",
    description: "Emitted when the value changes between masked and revealed.",
  },
  {
    name: "input / change / blur",
    payload: "Event",
    description: "Native listeners pass through to the input element.",
  },
] as const;

export const parts = [
  { name: "SensitiveInput", element: "div", description: "Root wrapper with size and state data attributes." },
  { name: "SensitiveInput label", element: "label", description: "Optional native label for the input." },
  { name: "SensitiveInput control", element: "div", description: "Control surface containing the input and actions." },
  { name: "SensitiveInput input", element: "input", description: "Native input receiving forwarded attributes and listeners." },
  { name: "SensitiveInput copy", element: "button", description: "Copies the unmasked value and announces success." },
  { name: "SensitiveInput toggle", element: "button", description: "Reveals or masks the value." },
] as const;

export const dataAttributes = [
  { name: "data-slot", value: '"sensitive-input" / "sensitive-input-control" / …', description: "Stable selectors for the root and named parts." },
  { name: "data-size", value: '"xs" | "sm" | "base" | "lg"', description: "Resolved visual density on the root." },
  { name: "data-state", value: '"empty" | "masked" | "revealed"', description: "Current visibility state on the control." },
  { name: "data-invalid", value: '""', description: "Present on the root and control when invalid." },
  { name: "data-disabled / data-readonly", value: '""', description: "Present when the matching state is active." },
] as const;

export const exportsList = [
  { name: "SensitiveInput", description: "Masked, revealable, copyable native input." },
  { name: "SensitiveInputProps / SensitiveInputEmits", description: "Public props and Vue event contracts." },
  { name: "SensitiveInputMode / SensitiveInputModelValue", description: "Visibility state and controlled-value types." },
  { name: "SENSITIVE_INPUT_SIZES", description: "Supported density values." },
  { name: "SENSITIVE_INPUT_DEFAULT_SIZE", description: "Default base density." },
  { name: "isSensitiveInputSize / resolveSensitiveInputSize", description: "Safe density guard and resolver." },
] as const;
