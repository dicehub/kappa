<script setup lang="ts">
import {
  Meter,
  type MeterSize,
  type MeterTone,
} from "@dicehub/kappa/components/meter";

type DemoVariant =
  | "preview"
  | "usage"
  | "custom-range"
  | "sizes"
  | "tones"
  | "hidden-value";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const sizes = [
  { label: "Small meter", size: "sm", value: 24 },
  { label: "Default meter", size: "base", value: 56 },
  { label: "Large meter", size: "lg", value: 82 },
] as const satisfies ReadonlyArray<{
  label: string;
  size: MeterSize;
  value: number;
}>;

const tones = [
  { label: "Accent", tone: "accent", value: 62 },
  { label: "Neutral", tone: "neutral", value: 52 },
  { label: "Healthy capacity", tone: "success", value: 38 },
  { label: "Capacity warning", tone: "warning", value: 78 },
  { label: "Capacity critical", tone: "danger", value: 94 },
] as const satisfies ReadonlyArray<{
  label: string;
  tone: MeterTone;
  value: number;
}>;
</script>

<template>
  <div class="meter-demo" :data-meter-demo="props.variant">
    <Meter
      v-if="props.variant === 'preview' || props.variant === 'usage'"
      label="Storage used"
      :value="65"
    />

    <Meter
      v-else-if="props.variant === 'custom-range'"
      label="API request quota"
      :value="750"
      :max="1000"
      value-text="750 / 1,000 requests"
    />

    <div v-else-if="props.variant === 'sizes'" class="meter-demo__stack">
      <Meter
        v-for="item in sizes"
        :key="item.size"
        :label="item.label"
        :size="item.size"
        :value="item.value"
      />
    </div>

    <div v-else-if="props.variant === 'tones'" class="meter-demo__stack">
      <Meter
        v-for="item in tones"
        :key="item.tone"
        :label="item.label"
        :tone="item.tone"
        :value="item.value"
      />
    </div>

    <div v-else class="meter-demo__stack meter-demo__hidden-value">
      <Meter label="Battery charge" :value="48" :show-value="false" />
      <p>The numeric value remains available to assistive technology.</p>
    </div>
  </div>
</template>

<style scoped>
.meter-demo {
  display: flex;
  inline-size: 100%;
  min-inline-size: 0;
  min-block-size: 10rem;
  align-items: center;
  justify-content: center;
  color: var(--kappa-default, #17191f);
  font-family: var(--kappa-font-sans, inherit);
}

.meter-demo > .kappa-meter,
.meter-demo__stack {
  inline-size: min(100%, 28rem);
}

.meter-demo__stack {
  display: grid;
  gap: 1.125rem;
}

.meter-demo__hidden-value {
  gap: 0.75rem;
}

.meter-demo__hidden-value p {
  margin: 0;
  color: var(--kappa-subtle, #6c7480);
  font-size: 0.75rem;
  line-height: 1.125rem;
}
</style>
