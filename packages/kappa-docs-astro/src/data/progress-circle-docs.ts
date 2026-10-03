export const barrelCode = `import {
  ProgressCircle,
  ProgressCircleGraphic,
  ProgressCircleRange,
  ProgressCircleRoot,
  ProgressCircleTrack,
  ProgressCircleValueText,
} from "@dicehub/kappa";`;

export const granularCode = `import {
  ProgressCircle,
  ProgressCircleGraphic,
  ProgressCircleRange,
  ProgressCircleRoot,
  ProgressCircleTrack,
  ProgressCircleValueText,
} from "@dicehub/kappa/components/progress-circle";`;

export const previewCode = `<script setup>
import { ProgressCircle } from "@dicehub/kappa/components/progress-circle";
</script>

<template>
  <ProgressCircle.Root :default-value="72">
    <ProgressCircle.Circle aria-label="Simulation progress">
      <ProgressCircle.CircleTrack />
      <ProgressCircle.CircleRange />
    </ProgressCircle.Circle>
    <ProgressCircle.ValueText />
    <ProgressCircle.Label>Simulation</ProgressCircle.Label>
  </ProgressCircle.Root>
</template>`;

export const usageCode = previewCode;

export const sizesCode = `<script setup>
import { ProgressCircle } from "@dicehub/kappa/components/progress-circle";

const items = [
  { label: "Small", size: "3rem", thickness: "0.25rem", value: 28 },
  { label: "Default", size: "4.5rem", thickness: "0.375rem", value: 62 },
  { label: "Large", size: "6rem", thickness: "0.5rem", value: 84 },
];
</script>

<template>
  <ProgressCircle.Root
    v-for="item in items"
    :key="item.label"
    :default-value="item.value"
    :style="{
      '--kappa-progress-circle-size': item.size,
      '--kappa-progress-circle-thickness': item.thickness,
    }"
  >
    <ProgressCircle.Circle :aria-label="item.label + ' progress'">
      <ProgressCircle.CircleTrack />
      <ProgressCircle.CircleRange />
    </ProgressCircle.Circle>
    <ProgressCircle.ValueText />
    <ProgressCircle.Label>{{ item.label }}</ProgressCircle.Label>
  </ProgressCircle.Root>
</template>`;

export const indeterminateCode = `<script setup>
import { ProgressCircle } from "@dicehub/kappa/components/progress-circle";
</script>

<template>
  <ProgressCircle.Root :model-value="null">
    <ProgressCircle.Circle aria-label="Preparing results">
      <ProgressCircle.CircleTrack />
      <ProgressCircle.CircleRange />
    </ProgressCircle.Circle>
    <ProgressCircle.ValueText>•••</ProgressCircle.ValueText>
    <ProgressCircle.Label>Preparing results</ProgressCircle.Label>
  </ProgressCircle.Root>
</template>`;

export const controlledCode = `<script setup>
import { ProgressCircle } from "@dicehub/kappa/components/progress-circle";
import { ref } from "vue";

const value = ref(42);
</script>

<template>
  <ProgressCircle.Root v-model="value">
    <ProgressCircle.Circle aria-label="Export progress">
      <ProgressCircle.CircleTrack />
      <ProgressCircle.CircleRange />
    </ProgressCircle.Circle>
    <ProgressCircle.ValueText />
    <ProgressCircle.Label>Export</ProgressCircle.Label>
  </ProgressCircle.Root>

  <label>
    Set progress
    <input v-model.number="value" type="range" min="0" max="100" />
  </label>
</template>`;

export const rootProps = [
  { name: "modelValue / defaultValue", type: "number | null", defaultValue: "50", description: "Controlled value or initial value. Null selects the indeterminate state." },
  { name: "min / max", type: "number", defaultValue: "0 / 100", description: "Numeric range used for arc geometry and value text." },
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
  { name: "ValueText", element: "span", description: "Formatted value centered over the circle." },
  { name: "Circle", element: "svg", description: "Progressbar element and circular coordinate space." },
  { name: "CircleTrack", element: "circle", description: "Complete circular range." },
  { name: "CircleRange", element: "circle", description: "Determinate arc or indeterminate sweep." },
  { name: "View", element: "div", description: "Content shown for loading, complete, or indeterminate state." },
  { name: "Context", element: "renderless", description: "Exposes the Ark progress context to a slot." },
] as const;

export const cssVariables = [
  { name: "--kappa-progress-circle-size", defaultValue: "4.5rem", description: "SVG width and height." },
  { name: "--kappa-progress-circle-thickness", defaultValue: "0.375rem", description: "Track and range stroke width." },
  { name: "--kappa-progress-circle-range-color", defaultValue: "accent solid", description: "Range stroke color." },
] as const;

export const exportsList = [
  { name: "ProgressCircle", description: "Styled compound component with all circular parts." },
  { name: "ProgressCircleRoot / ProgressCircleRootProvider", description: "Direct root and external-machine provider components." },
  { name: "ProgressCircleGraphic / ProgressCircleTrack / ProgressCircleRange", description: "Granular styled SVG parts." },
  { name: "ProgressCircleLabel / ProgressCircleValueText", description: "Visible label and formatted value parts." },
  { name: "ProgressCircleView / ProgressCircleContext", description: "State view and renderless context parts." },
  { name: "useProgress / useProgressContext", description: "Ark UI composition functions." },
  { name: "ProgressCircle*Props / ProgressCircle*Slots", description: "Public TypeScript contracts." },
] as const;
