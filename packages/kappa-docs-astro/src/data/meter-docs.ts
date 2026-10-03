export const barrelCode = `import { Meter } from "@dicehub/kappa";`;

export const granularCode = `import { Meter } from "@dicehub/kappa/components/meter";`;

export const previewCode = `<script setup>
import { Meter } from "@dicehub/kappa/components/meter";
</script>

<template>
  <Meter label="Storage used" :value="65" />
</template>`;

export const usageCode = previewCode;

export const customRangeCode = `<script setup>
import { Meter } from "@dicehub/kappa/components/meter";
</script>

<template>
  <Meter
    label="API request quota"
    :value="750"
    :max="1000"
    value-text="750 / 1,000 requests"
  />
</template>`;

export const sizesCode = `<script setup>
import { Meter, type MeterSize } from "@dicehub/kappa/components/meter";

const sizes = [
  { label: "Small meter", size: "sm", value: 24 },
  { label: "Default meter", size: "base", value: 56 },
  { label: "Large meter", size: "lg", value: 82 },
] satisfies Array<{ label: string; size: MeterSize; value: number }>;
</script>

<template>
  <Meter
    v-for="item in sizes"
    :key="item.size"
    :label="item.label"
    :size="item.size"
    :value="item.value"
  />
</template>`;

export const tonesCode = `<script setup>
import { Meter, type MeterTone } from "@dicehub/kappa/components/meter";

const readings = [
  { label: "Accent", tone: "accent", value: 62 },
  { label: "Neutral", tone: "neutral", value: 52 },
  { label: "Healthy capacity", tone: "success", value: 38 },
  { label: "Capacity warning", tone: "warning", value: 78 },
  { label: "Capacity critical", tone: "danger", value: 94 },
] satisfies Array<{ label: string; tone: MeterTone; value: number }>;
</script>

<template>
  <Meter
    v-for="reading in readings"
    :key="reading.tone"
    :label="reading.label"
    :tone="reading.tone"
    :value="reading.value"
  />
</template>`;

export const hiddenValueCode = `<script setup>
import { Meter } from "@dicehub/kappa/components/meter";
</script>

<template>
  <Meter label="Battery charge" :value="48" :show-value="false" />
</template>`;

export const meterProps = [
  {
    name: "label*",
    type: "string",
    defaultValue: "—",
    description: "Visible label and accessible name for the measurement.",
  },
  {
    name: "value*",
    type: "number",
    defaultValue: "—",
    description: "Current measurement. Values outside the range are clamped.",
  },
  {
    name: "min",
    type: "number",
    defaultValue: "0",
    description: "Lowest value in the known range.",
  },
  {
    name: "max",
    type: "number",
    defaultValue: "100",
    description: "Highest value in the known range. It must be greater than min.",
  },
  {
    name: "valueText",
    type: "string",
    defaultValue: "percentage",
    description: "Human-readable visible and assistive value text.",
  },
  {
    name: "showValue",
    type: "boolean",
    defaultValue: "true",
    description: "Shows the formatted value beside the label.",
  },
  {
    name: "size",
    type: '"sm" | "base" | "lg"',
    defaultValue: '"base"',
    description: "Controls text and track density.",
  },
  {
    name: "tone",
    type: '"accent" | "neutral" | "success" | "warning" | "danger"',
    defaultValue: '"accent"',
    description: "Applies a consumer-selected semantic indicator color.",
  },
] as const;

export const dataSlots = [
  { name: "meter", element: "div", description: "Labelled meter root." },
  { name: "meter-header", element: "div", description: "Label and visible value row." },
  { name: "meter-label", element: "span", description: "Visible accessible name." },
  { name: "meter-value", element: "span", description: "Optional visible value text." },
  { name: "meter-track", element: "div", description: "Visual representation of the complete range." },
  { name: "meter-indicator", element: "div", description: "Filled portion of the range." },
] as const;

export const dataAttributes = [
  { name: "data-size", value: '"sm" | "base" | "lg"', description: "Resolved density." },
  { name: "data-tone", value: '"accent" | "neutral" | "success" | "warning" | "danger"', description: "Resolved indicator tone." },
  { name: "data-value-state", value: '"empty" | "partial" | "full"', description: "Clamped position in the range." },
] as const;

export const exportsList = [
  { name: "Meter", description: "Labelled scalar measurement component." },
  { name: "MeterProps", description: "Public prop contract." },
  { name: "MeterSize / MeterTone / MeterValueState", description: "Public visual and value-state types." },
  { name: "METER_SIZES / METER_TONES", description: "Supported size and tone lists." },
  { name: "METER_DEFAULT_*", description: "Public default values." },
  { name: "clampMeterValue / getMeterPercentage / formatMeterValue", description: "Range and formatting helpers." },
  { name: "resolveMeter*", description: "Safe range, value, label, size, and tone resolvers." },
] as const;
