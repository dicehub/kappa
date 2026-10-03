export const barrelCode = `import { InputOtp } from "@dicehub/kappa";`;

export const granularCode = `import { InputOtp } from "@dicehub/kappa/components/input-otp";`;

export const previewCode = `<script setup>
import { InputOtp } from "@dicehub/kappa/components/input-otp";
</script>

<template>
  <InputOtp.Root aria-label="Verification code" :count="6" otp>
    <InputOtp.Label>Verification code</InputOtp.Label>
    <InputOtp.Control>
      <InputOtp.Input v-for="index in 6" :key="index" :index="index - 1" />
    </InputOtp.Control>
    <InputOtp.HiddenInput name="verification-code" />
  </InputOtp.Root>
</template>`;

export const usageCode = `<script setup>
import { InputOtp } from "@dicehub/kappa/components/input-otp";
</script>

<template>
  <InputOtp.Root
    aria-label="Deploy confirmation code"
    :count="6"
    otp
    placeholder="·"
  >
    <InputOtp.Label>Deploy confirmation code</InputOtp.Label>
    <InputOtp.Control>
      <InputOtp.Input v-for="index in 6" :key="index" :index="index - 1" />
    </InputOtp.Control>
    <InputOtp.HiddenInput name="deploy-code" />
  </InputOtp.Root>
</template>`;

export const patternCode = `<script setup>
import { ref } from "vue";
import { InputOtp } from "@dicehub/kappa/components/input-otp";

const code = ref<string[]>([]);
</script>

<template>
  <InputOtp.Root
    v-model="code"
    aria-label="Numeric code"
    :count="6"
    pattern="[0-9]"
    placeholder="○"
    type="numeric"
  >
    <InputOtp.Label>Numeric code</InputOtp.Label>
    <InputOtp.Control>
      <InputOtp.Input v-for="index in 6" :key="index" :index="index - 1" />
    </InputOtp.Control>
    <InputOtp.HiddenInput name="numeric-code" />
  </InputOtp.Root>
</template>`;

export const maskCode = `<script setup>
import { InputOtp } from "@dicehub/kappa/components/input-otp";
</script>

<template>
  <InputOtp.Root aria-label="Masked access code" :count="6" mask otp>
    <InputOtp.Label>Masked access code</InputOtp.Label>
    <InputOtp.Control>
      <InputOtp.Input v-for="index in 6" :key="index" :index="index - 1" />
    </InputOtp.Control>
    <InputOtp.HiddenInput name="masked-code" />
  </InputOtp.Root>
</template>`;

export const statesCode = `<script setup>
import { InputOtp } from "@dicehub/kappa/components/input-otp";
</script>

<template>
  <InputOtp.Root aria-label="Invalid code" :count="6" invalid>
    <InputOtp.Label>Invalid code</InputOtp.Label>
    <InputOtp.Control>
      <InputOtp.Input v-for="index in 6" :key="index" :index="index - 1" />
    </InputOtp.Control>
    <InputOtp.HiddenInput name="invalid-code" />
  </InputOtp.Root>

  <InputOtp.Root
    aria-label="Disabled code"
    :count="6"
    :default-value="['4', '0', '2', '8', '1', '6']"
    disabled
  >
    <InputOtp.Label>Disabled code</InputOtp.Label>
    <InputOtp.Control>
      <InputOtp.Input v-for="index in 6" :key="index" :index="index - 1" />
    </InputOtp.Control>
    <InputOtp.HiddenInput name="disabled-code" />
  </InputOtp.Root>
</template>`;

export const blurCode = `<script setup>
import { ref } from "vue";
import { InputOtp } from "@dicehub/kappa/components/input-otp";

const completed = ref("");
</script>

<template>
  <InputOtp.Root
    aria-label="Auto-submit code"
    :count="6"
    blur-on-complete
    @value-complete="completed = $event.valueAsString"
  >
    <InputOtp.Label>Auto-submit code</InputOtp.Label>
    <InputOtp.Control>
      <InputOtp.Input v-for="index in 6" :key="index" :index="index - 1" />
    </InputOtp.Control>
    <InputOtp.HiddenInput name="auto-submit-code" />
  </InputOtp.Root>
  <output>{{ completed }}</output>
</template>`;

export const controlledCode = `<script setup>
import { ref } from "vue";
import { InputOtp } from "@dicehub/kappa/components/input-otp";

const code = ref(["4", "0", "2", "8", "1", "6"]);
</script>

<template>
  <InputOtp.Root v-model="code" aria-label="Controlled code" :count="6">
    <InputOtp.Label>Controlled code</InputOtp.Label>
    <InputOtp.Control>
      <InputOtp.Input v-for="index in 6" :key="index" :index="index - 1" />
    </InputOtp.Control>
    <InputOtp.HiddenInput name="controlled-code" />
  </InputOtp.Root>
  <output>Value: {{ code.join("") }}</output>
</template>`;

export const providerCode = `<script setup>
import { InputOtp, usePinInput } from "@dicehub/kappa/components/input-otp";

const pinInput = usePinInput({ count: 6, otp: true });
</script>

<template>
  <InputOtp.RootProvider :value="pinInput">
    <InputOtp.Label>Provider-owned code</InputOtp.Label>
    <InputOtp.Control>
      <InputOtp.Input v-for="index in 6" :key="index" :index="index - 1" />
    </InputOtp.Control>
    <InputOtp.HiddenInput name="provider-code" />
  </InputOtp.RootProvider>
</template>`;

export const rootProps = [
  { name: "count", type: "number", defaultValue: "—", description: "Number of input cells. Pass it for stable SSR output." },
  { name: "modelValue / v-model", type: "string[]", defaultValue: "—", description: "Controlled array of cell values." },
  { name: "defaultValue", type: "string[]", defaultValue: "[]", description: "Initial array for uncontrolled use." },
  { name: "type", type: '"numeric" | "alphabetic" | "alphanumeric"', defaultValue: '"numeric"', description: "Restricts entered values." },
  { name: "pattern", type: "string", defaultValue: "—", description: "Regular expression checked for each entered value and paste." },
  { name: "placeholder", type: "string", defaultValue: '"○"', description: "Placeholder shown in an empty cell." },
  { name: "mask", type: "boolean", defaultValue: "false", description: "Uses password-style masking for entered cells." },
  { name: "otp", type: "boolean", defaultValue: "false", description: "Adds one-time-code autocomplete to the cells." },
  { name: "blurOnComplete", type: "boolean", defaultValue: "false", description: "Blurs the active cell after all cells are valid." },
  { name: "autoFocus / autoSubmit", type: "boolean", defaultValue: "false", description: "Focuses the first cell or submits the owning form when complete." },
  { name: "disabled / readOnly / required / invalid", type: "boolean", defaultValue: "false", description: "Native and validation states passed to Ark UI." },
  { name: "size", type: '"sm" | "base" | "lg"', defaultValue: '"base"', description: "Kappa visual density for each cell." },
] as const;

export const parts = [
  { name: "Root", element: "div", description: "Owns the Ark pin-input machine and root state attributes." },
  { name: "RootProvider", element: "div", description: "Uses an externally created usePinInput machine." },
  { name: "Label", element: "label", description: "Names the OTP control and focuses its first cell when clicked." },
  { name: "Control", element: "div", description: "Layout wrapper for the individual cells." },
  { name: "Input", element: "input", description: "One indexed OTP cell. Render one for each count value." },
  { name: "HiddenInput", element: "input", description: "Visually hidden native form input managed by Ark UI." },
  { name: "Context", element: "slot", description: "Exposes the current Ark input API to a scoped slot." },
] as const;

export const events = [
  { name: "update:modelValue", payload: "string[]", description: "Emitted as the controlled value changes." },
  { name: "valueChange", payload: "{ value, valueAsString }", description: "Emitted for each valid value change." },
  { name: "valueComplete", payload: "{ value, valueAsString }", description: "Emitted when every cell is filled with a valid value." },
  { name: "valueInvalid", payload: "{ value, index }", description: "Emitted when a value fails type or pattern validation." },
] as const;

export const dataAttributes = [
  { name: "data-slot", value: '"input-otp" / "input-otp-control" / …', description: "Stable Kappa selectors for named parts." },
  { name: "data-size", value: '"sm" | "base" | "lg"', description: "Resolved Kappa density on the root." },
  { name: "data-filled", value: '""', description: "Present on a cell with a value (from Ark UI)." },
  { name: "data-invalid / data-disabled", value: '""', description: "Present on invalid or disabled roots and cells." },
  { name: "data-complete", value: '""', description: "Present when all cells are filled." },
] as const;

export const exportsList = [
  { name: "InputOtp", description: "Object.assign compound namespace and root component." },
  { name: "InputOtp.Root / RootProvider", description: "Machine-owned and provider-owned roots." },
  { name: "InputOtp.Label / Control / Input / HiddenInput / Context", description: "Named compound parts." },
  { name: "InputOtpProps / InputOtpEmits", description: "Kappa root props and Vue event contracts." },
  { name: "InputOtpApi / InputOtpContextValue", description: "Provider and context API types." },
  { name: "usePinInput / usePinInputContext / pinInputAnatomy", description: "Ark UI hooks and anatomy re-exports." },
  { name: "INPUT_OTP_SIZES / INPUT_OTP_DEFAULT_SIZE", description: "Kappa density values and default." },
] as const;
