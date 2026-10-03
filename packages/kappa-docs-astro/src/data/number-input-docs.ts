export const barrelCode = `import {
  NumberInput,
  NumberInputControl,
  NumberInputDecrementTrigger,
  NumberInputIncrementTrigger,
  NumberInputInput,
  NumberInputLabel,
  NumberInputRoot,
  NumberInputScrubber,
  NumberInputScrubbableInput,
  NumberInputUnit,
  NumberInputValueText,
} from "@dicehub/kappa";`;

export const granularCode = `import {
  NumberInput,
  NumberInputControl,
  NumberInputDecrementTrigger,
  NumberInputIncrementTrigger,
  NumberInputInput,
  NumberInputLabel,
  NumberInputRoot,
  NumberInputScrubber,
  NumberInputScrubbableInput,
  NumberInputUnit,
  NumberInputValueText,
} from "@dicehub/kappa/components/number-input";`;

export const previewCode = `<script setup>
import { NumberInput } from "@dicehub/kappa/components/number-input";
</script>

<template>
  <NumberInput.Root
    default-value="0.8"
    :min="0"
    :max="5"
    :step="0.1"
    :format-options="{ minimumFractionDigits: 1, maximumFractionDigits: 1 }"
  >
    <NumberInput.Label>Maximum Courant number</NumberInput.Label>
    <NumberInput.Control>
      <NumberInput.ScrubbableInput />
    </NumberInput.Control>
  </NumberInput.Root>
</template>`;

export const usageCode = `<script setup>
import { NumberInput } from "@dicehub/kappa/components/number-input";
</script>

<template>
  <NumberInput.Root default-value="1" :min="0" :step="0.1" name="inlet-velocity">
    <NumberInput.Label>Inlet velocity (m/s)</NumberInput.Label>
    <NumberInput.Control>
      <NumberInput.DecrementTrigger aria-label="Decrease inlet velocity" />
      <NumberInput.Input />
      <NumberInput.Unit aria-hidden="true">m/s</NumberInput.Unit>
      <NumberInput.IncrementTrigger aria-label="Increase inlet velocity" />
    </NumberInput.Control>
  </NumberInput.Root>
</template>`;

export const basicCode = `<script setup>
import { NumberInput } from "@dicehub/kappa/components/number-input";
</script>

<template>
  <NumberInput.Root default-value="12" :min="1" :max="64">
    <NumberInput.Label>Solver processes</NumberInput.Label>
    <NumberInput.Control>
      <NumberInput.DecrementTrigger aria-label="Decrease solver processes" />
      <NumberInput.Input />
      <NumberInput.IncrementTrigger aria-label="Increase solver processes" />
    </NumberInput.Control>
  </NumberInput.Root>
</template>`;

export const scrubbableInputCode = `<script setup>
import { NumberInput } from "@dicehub/kappa/components/number-input";
</script>

<template>
  <NumberInput.Root
    default-value="0.35"
    :min="0"
    :max="1"
    :step="0.01"
    :small-step="0.001"
    :large-step="0.1"
  >
    <NumberInput.Label>Under-relaxation factor</NumberInput.Label>
    <NumberInput.Control>
      <NumberInput.ScrubbableInput :drag-threshold="10" />
    </NumberInput.Control>
  </NumberInput.Root>

  <NumberInput.Root
    default-value="12.5"
    :min="-100"
    :max="100"
    :step="0.5"
    :small-step="0.05"
    :large-step="5"
    :focus-input-on-change="false"
  >
    <NumberInput.Label>Clipping plane offset (mm)</NumberInput.Label>
    <NumberInput.Control>
      <NumberInput.DecrementTrigger aria-label="Decrease clipping plane offset" />
      <NumberInput.ScrubbableInput edit-alignment="center" />
      <NumberInput.IncrementTrigger aria-label="Increase clipping plane offset" />
    </NumberInput.Control>
  </NumberInput.Root>
</template>`;

export const scrubbingCode = `<script setup>
import { NumberInput } from "@dicehub/kappa/components/number-input";
</script>

<template>
  <NumberInput.Root default-value="0.35" :min="0" :max="1" :step="0.01">
    <div class="label-line">
      <NumberInput.Label>Under-relaxation factor</NumberInput.Label>
      <NumberInput.Scrubber title="Drag horizontally to adjust" />
    </div>
    <NumberInput.Control>
      <NumberInput.DecrementTrigger aria-label="Decrease under-relaxation factor" />
      <NumberInput.Input />
      <NumberInput.IncrementTrigger aria-label="Increase under-relaxation factor" />
    </NumberInput.Control>
  </NumberInput.Root>
</template>`;

export const rangeCode = `<script setup>
import { NumberInput } from "@dicehub/kappa/components/number-input";
</script>

<template>
  <NumberInput.Root default-value="300" :min="250" :max="400" :step="5">
    <NumberInput.Label>Inlet temperature (K)</NumberInput.Label>
    <NumberInput.Control>
      <NumberInput.DecrementTrigger aria-label="Decrease inlet temperature" />
      <NumberInput.Input />
      <NumberInput.Unit aria-hidden="true">K</NumberInput.Unit>
      <NumberInput.IncrementTrigger aria-label="Increase inlet temperature" />
    </NumberInput.Control>
  </NumberInput.Root>
</template>`;

export const precisionCode = `<script setup>
import { NumberInput } from "@dicehub/kappa/components/number-input";
</script>

<template>
  <NumberInput.Root
    default-value="0.0025"
    :min="0.0001"
    :step="0.0001"
    :format-options="{ minimumFractionDigits: 4, maximumFractionDigits: 4 }"
  >
    <NumberInput.Label>Time step (s)</NumberInput.Label>
    <NumberInput.Control>
      <NumberInput.Input />
      <NumberInput.Unit aria-hidden="true">s</NumberInput.Unit>
    </NumberInput.Control>
  </NumberInput.Root>
</template>`;

export const unitsCode = `<script setup>
import { NumberInput } from "@dicehub/kappa/components/number-input";
</script>

<template>
  <NumberInput.Root default-value="18.5" :step="0.5">
    <NumberInput.Label>Cell size (mm)</NumberInput.Label>
    <NumberInput.Control>
      <NumberInput.Input />
      <NumberInput.Unit aria-hidden="true">mm</NumberInput.Unit>
    </NumberInput.Control>
  </NumberInput.Root>

  <NumberInput.Root
    default-value="12.5"
    locale="en-GB"
    :format-options="{ style: 'unit', unit: 'liter-per-second' }"
  >
    <NumberInput.Label>Volume flow rate</NumberInput.Label>
    <NumberInput.Control><NumberInput.Input /></NumberInput.Control>
  </NumberInput.Root>
</template>`;

export const controlledCode = `<script setup>
import { ref } from "vue";
import { NumberInput } from "@dicehub/kappa/components/number-input";

const value = ref("0.005");
const committed = ref("0.005");
</script>

<template>
  <NumberInput.Root
    v-model="value"
    :min="0.0001"
    :max="0.1"
    :step="0.001"
    @value-commit="committed = $event.value"
  >
    <NumberInput.Label>Write interval (s)</NumberInput.Label>
    <NumberInput.Control>
      <NumberInput.DecrementTrigger aria-label="Decrease write interval" />
      <NumberInput.Input />
      <NumberInput.Unit aria-hidden="true">s</NumberInput.Unit>
      <NumberInput.IncrementTrigger aria-label="Increase write interval" />
    </NumberInput.Control>
  </NumberInput.Root>
  <output aria-live="polite">Committed: {{ committed }}</output>
</template>`;

export const statesCode = `<script setup>
import { NumberInput } from "@dicehub/kappa/components/number-input";
</script>

<template>
  <NumberInput.Root default-value="8" disabled>
    <NumberInput.Label>Disabled partitions</NumberInput.Label>
    <NumberInput.Control><NumberInput.Input /></NumberInput.Control>
  </NumberInput.Root>

  <NumberInput.Root default-value="24" read-only>
    <NumberInput.Label>Read-only partitions</NumberInput.Label>
    <NumberInput.Control>
      <NumberInput.Scrubber title="Read-only value" />
      <NumberInput.Input />
    </NumberInput.Control>
  </NumberInput.Root>

  <NumberInput.Root default-value="125" :max="100" invalid>
    <NumberInput.Label>Invalid load balance (%)</NumberInput.Label>
    <NumberInput.Control>
      <NumberInput.Input aria-describedby="load-balance-error" />
    </NumberInput.Control>
  </NumberInput.Root>
  <p id="load-balance-error">Enter a value from 0 to 100.</p>
</template>`;

export const sizesCode = `<script setup>
import { NumberInput } from "@dicehub/kappa/components/number-input";
</script>

<template>
  <NumberInput.Root v-for="size in ['xs', 'sm', 'default', 'lg']" :key="size" :size="size" default-value="32">
    <NumberInput.Label>{{ size }}</NumberInput.Label>
    <NumberInput.Control>
      <NumberInput.DecrementTrigger :aria-label="'Decrease ' + size + ' value'" />
      <NumberInput.Input />
      <NumberInput.IncrementTrigger :aria-label="'Increase ' + size + ' value'" />
    </NumberInput.Control>
  </NumberInput.Root>
</template>`;

export const localeCode = `<script setup>
import { NumberInput } from "@dicehub/kappa/components/number-input";
</script>

<template>
  <NumberInput.Root
    default-value="1234,5"
    locale="de-DE"
    :step="0.5"
    :format-options="{ minimumFractionDigits: 1, maximumFractionDigits: 2, useGrouping: true }"
  >
    <NumberInput.Label>Volumenstrom (m³/s)</NumberInput.Label>
    <NumberInput.Control>
      <NumberInput.Input />
      <NumberInput.Unit aria-hidden="true">m³/s</NumberInput.Unit>
    </NumberInput.Control>
  </NumberInput.Root>
</template>`;

export const mouseWheelCode = `<script setup>
import { NumberInput } from "@dicehub/kappa/components/number-input";
</script>

<template>
  <NumberInput.Root default-value="50" :step="5" allow-mouse-wheel>
    <NumberInput.Label>Mesh refinement (%)</NumberInput.Label>
    <NumberInput.Control><NumberInput.Input /></NumberInput.Control>
  </NumberInput.Root>
</template>`;

export const rtlCode = `<script setup>
import { NumberInput } from "@dicehub/kappa/components/number-input";
</script>

<template>
  <div dir="rtl">
    <NumberInput.Root dir="rtl" locale="ar-EG" default-value="24" :min="1" :max="128">
      <NumberInput.Label>عدد عمليات الحل</NumberInput.Label>
      <NumberInput.Control>
        <NumberInput.DecrementTrigger aria-label="تقليل عدد العمليات" />
        <NumberInput.Input />
        <NumberInput.IncrementTrigger aria-label="زيادة عدد العمليات" />
      </NumberInput.Control>
    </NumberInput.Root>

    <NumberInput.Root
      dir="rtl"
      locale="de-DE"
      default-value="1234,5"
      :step="0.5"
      :format-options="{ minimumFractionDigits: 1, maximumFractionDigits: 1, useGrouping: true }"
    >
      <NumberInput.Label>RTL layout, German number format</NumberInput.Label>
      <NumberInput.Control><NumberInput.Input /></NumberInput.Control>
    </NumberInput.Root>
  </div>
</template>`;

export const rootProps = [
  { name: "modelValue / defaultValue", type: "string", defaultValue: "—", description: "Controlled or initial string value. Strings preserve locale-specific text." },
  { name: "asChild", type: "boolean", defaultValue: "false", description: "Merges root behavior into the direct child element." },
  { name: "id / ids", type: "string / partial ID map", defaultValue: "generated", description: "Overrides the machine or part identifiers." },
  { name: "dir", type: '"ltr" | "rtl"', defaultValue: "locale direction", description: "Overrides layout and scrub direction without changing numeric formatting." },
  { name: "min / max", type: "number", defaultValue: "safe integer limits", description: "Allowed numeric range." },
  { name: "step", type: "number", defaultValue: "1", description: "Standard trigger, keyboard, wheel, and scrub increment." },
  { name: "smallStep / largeStep", type: "number", defaultValue: "step / 10; step × 10", description: "Alt+Arrow and Shift+Arrow increments." },
  { name: "size", type: '"xs" | "sm" | "default" | "lg"', defaultValue: '"default"', description: "Control height and spacing: 20, 28, 32, or 36px at a 16px root font size." },
  { name: "locale", type: "string", defaultValue: '"en-US"', description: "BCP 47 locale for parsing and formatting." },
  { name: "formatOptions", type: "Intl.NumberFormatOptions", defaultValue: "—", description: "Intl formatting, precision, unit, and currency options." },
  { name: "allowMouseWheel", type: "boolean", defaultValue: "false", description: "Changes a hovered or focused input with the mouse wheel." },
  { name: "allowOverflow", type: "boolean", defaultValue: "false", description: "Lets an edited value temporarily pass the range when enabled." },
  { name: "clampValueOnBlur", type: "boolean", defaultValue: "!allowOverflow", description: "Clamps an out-of-range value when focus leaves." },
  { name: "focusInputOnChange", type: "boolean", defaultValue: "true", description: "Moves focus to the input after a trigger or scrub change." },
  { name: "spinOnPress", type: "boolean", defaultValue: "true", description: "Repeats changes while a trigger stays pressed." },
  { name: "disabled / readOnly / invalid / required", type: "boolean", defaultValue: "false", description: "Field state passed to all Ark parts." },
  { name: "name / form", type: "string", defaultValue: "—", description: "Native form integration." },
  { name: "inputMode", type: '"text" | "tel" | "numeric" | "decimal"', defaultValue: '"decimal"', description: "Virtual-keyboard hint." },
  { name: "pattern", type: "string", defaultValue: "numeric pattern", description: "Native input validation pattern." },
  { name: "translations", type: "IntlTranslations", defaultValue: "Ark defaults", description: "Accessible trigger and value announcements." },
] as const;

export const scrubbableInputProps = [
  { name: "scrubSensitivity", type: "{ control?: number; shift?: number; alt?: number }", defaultValue: "—", description: "Opt-in pointer multipliers of Root.step. Priority: Control, Shift, Alt. Omitted keys use ×1. Without this object, the existing smallStep/largeStep behavior is unchanged. Keyboard steps are not affected." },
  { name: "dragThreshold", type: "number", defaultValue: "10", description: "Horizontal pixels required before a pointer gesture becomes a drag." },
  { name: "editAlignment", type: '"start" | "center"', defaultValue: '"start"', description: "Logical text alignment while the internal spinbutton is focused." },
  { name: "native input attributes", type: "InputHTMLAttributes", defaultValue: "—", description: "Attributes and listeners forwarded to the internal Ark spinbutton." },
  { name: "default slot", type: "{ value, valueAsNumber, editing, dragging }", defaultValue: "formatted value", description: "Customizes only the blurred display content." },
] as const;

export const events = [
  { name: "update:modelValue", payload: "string", description: "Updates v-model with the current string value." },
  { name: "valueChange", payload: "NumberInputValueChangeDetails", description: "Reports each value change and valueAsNumber." },
  { name: "valueCommit", payload: "NumberInputValueCommitDetails", description: "Reports a value committed by blur or Enter." },
  { name: "valueInvalid", payload: "NumberInputValueInvalidDetails", description: "Reports range overflow or underflow." },
  { name: "focusChange", payload: "NumberInputFocusChangeDetails", description: "Reports the focused state." },
] as const;

export const parts = [
  { name: "Label", element: "label", description: "Accessible label linked to the spinbutton." },
  { name: "Control", element: "div", description: "Groups the input, unit, and optional triggers." },
  { name: "Input", element: "input", description: "Locale-aware spinbutton and form control." },
  { name: "ValueText", element: "span", description: "Formatted value for custom readouts." },
  { name: "IncrementTrigger / DecrementTrigger", element: "button", description: "Step controls with press-and-hold behavior." },
  { name: "Scrubber", element: "div", description: "Horizontal pointer-lock drag target." },
  { name: "ScrubbableInput", element: "div + input", description: "Whole-field display, drag surface, and direct editor commonly used in 3D applications." },
  { name: "Unit", element: "span", description: "Visual suffix; put its meaning in the label or Intl formatting." },
] as const;

export const exportsList = [
  { name: "NumberInput", description: "Root component with all styled compound parts." },
  { name: "NumberInputRoot / NumberInputRootProvider", description: "Direct root and provider components." },
  { name: "NumberInputLabel / NumberInputControl / NumberInputInput", description: "Core field parts." },
  { name: "NumberInputIncrementTrigger / NumberInputDecrementTrigger", description: "Step trigger parts." },
  { name: "NumberInputScrubber / NumberInputScrubbableInput", description: "Separate-handle and whole-field scrub interactions." },
  { name: "NumberInputValueText / NumberInputUnit", description: "Formatted readout and visual suffix parts." },
  { name: "NumberInputContext / useNumberInput", description: "Renderless context and external machine composition APIs." },
  { name: "NUMBER_INPUT_SIZES / NUMBER_INPUT_DEFAULT_SIZE", description: "Readonly sizes and the public visual default." },
  { name: "NUMBER_INPUT_EDIT_ALIGNMENTS / NUMBER_INPUT_DEFAULT_EDIT_ALIGNMENT", description: "Readonly editor alignments and the public default." },
  { name: "isNumberInputEditAlignment / resolveNumberInputEditAlignment", description: "Runtime alignment guard and safe fallback resolver." },
  { name: "NumberInput*Props / NumberInput*Slots / NumberInput*Emits", description: "Public Vue contracts." },
  { name: "NumberInputFocusChangeDetails / NumberInputValueChangeDetails / NumberInputValueCommitDetails / NumberInputValueInvalidDetails", description: "Public event detail types." },
] as const;
