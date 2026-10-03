export const barrelCode = `import {
  Progress,
  ProgressLabel,
  ProgressRange,
  ProgressRoot,
  ProgressTrack,
  ProgressValueText,
} from "@dicehub/kappa";`;

export const granularCode = `import {
  Progress,
  ProgressLabel,
  ProgressRange,
  ProgressRoot,
  ProgressTrack,
  ProgressValueText,
} from "@dicehub/kappa/components/progress";`;

export const previewCode = `<script setup>
import { Progress } from "@dicehub/kappa/components/progress";
</script>

<template>
  <Progress.Root :default-value="68">
    <Progress.Label>Uploading simulation results</Progress.Label>
    <Progress.ValueText />
    <Progress.Track aria-label="Uploading simulation results">
      <Progress.Range />
    </Progress.Track>
  </Progress.Root>
</template>`;

export const usageCode = previewCode;

export const customRangeCode = `<script setup>
import { Progress } from "@dicehub/kappa/components/progress";
</script>

<template>
  <Progress.Root :default-value="5" :min="0" :max="8">
    <Progress.Label>Result files</Progress.Label>
    <Progress.ValueText>5 / 8</Progress.ValueText>
    <Progress.Track aria-label="Result files">
      <Progress.Range />
    </Progress.Track>
  </Progress.Root>
</template>`;

export const indeterminateCode = `<script setup>
import { Progress } from "@dicehub/kappa/components/progress";
</script>

<template>
  <Progress.Root :model-value="null">
    <Progress.Label>Preparing mesh</Progress.Label>
    <Progress.ValueText>Working…</Progress.ValueText>
    <Progress.Track aria-label="Preparing mesh">
      <Progress.Range />
    </Progress.Track>
  </Progress.Root>
</template>`;

export const controlledCode = `<script setup>
import { Progress } from "@dicehub/kappa/components/progress";
import { ref } from "vue";

const value = ref(36);
</script>

<template>
  <Progress.Root v-model="value">
    <Progress.Label>Solver progress</Progress.Label>
    <Progress.ValueText />
    <Progress.Track aria-label="Solver progress">
      <Progress.Range />
    </Progress.Track>
  </Progress.Root>

  <label>
    Set progress
    <input v-model.number="value" type="range" min="0" max="100" />
  </label>
</template>`;

export const rootProps = [
  { name: "modelValue / defaultValue", type: "number | null", defaultValue: "50", description: "Controlled value or initial value. Null selects the indeterminate state." },
  { name: "min / max", type: "number", defaultValue: "0 / 100", description: "Numeric range used for value and percentage calculation." },
  { name: "orientation", type: '"horizontal" | "vertical"', defaultValue: '"horizontal"', description: "Direction used by the Ark progress machine and range geometry." },
  { name: "formatOptions", type: "Intl.NumberFormatOptions", defaultValue: "percent", description: "Formats the default ValueText output." },
  { name: "locale", type: "string", defaultValue: '"en-US"', description: "Locale used to format the value." },
  { name: "translations", type: "IntlTranslations", defaultValue: "Ark defaults", description: "Customizes the assistive value description." },
  { name: "id / ids", type: "string / partial ID map", defaultValue: "generated", description: "Overrides the machine and part identifiers." },
  { name: "asChild", type: "boolean", defaultValue: "false", description: "Merges root behavior into the direct child." },
] as const;

export const events = [
  { name: "update:modelValue", payload: "number | null", description: "Updates v-model when the Ark machine value changes." },
  { name: "valueChange", payload: "ProgressValueChangeDetails", description: "Reports each value change." },
] as const;

export const parts = [
  { name: "Label", element: "label", description: "Visible progress label." },
  { name: "ValueText", element: "span", description: "Formatted value or custom status text." },
  { name: "Track", element: "div", description: "Progressbar element and complete range." },
  { name: "Range", element: "div", description: "Determinate fill or indeterminate indicator." },
  { name: "View", element: "div", description: "Content shown for loading, complete, or indeterminate state." },
  { name: "Context", element: "renderless", description: "Exposes the Ark progress context to a slot." },
] as const;

export const exportsList = [
  { name: "Progress", description: "Styled compound component with all linear parts." },
  { name: "ProgressRoot / ProgressRootProvider", description: "Direct root and external-machine provider components." },
  { name: "ProgressLabel / ProgressValueText / ProgressTrack / ProgressRange", description: "Granular styled linear parts." },
  { name: "ProgressView / ProgressContext", description: "State view and renderless context parts." },
  { name: "useProgress / useProgressContext", description: "Ark UI composition functions." },
  { name: "Progress*Props / Progress*Slots / ProgressValueChangeDetails", description: "Public TypeScript contracts." },
] as const;
