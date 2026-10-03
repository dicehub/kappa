<script setup lang="ts">
import { computed, useId } from "vue";
import {
  METER_DEFAULT_MAX,
  METER_DEFAULT_MIN,
  METER_DEFAULT_SIZE,
  METER_DEFAULT_TONE,
  clampMeterValue,
  getMeterPercentage,
  resolveMeterLabel,
  resolveMeterRange,
  resolveMeterSize,
  resolveMeterTone,
  resolveMeterValueState,
  resolveMeterValueText,
  type MeterProps,
} from "./meter";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<MeterProps>(), {
  max: METER_DEFAULT_MAX,
  min: METER_DEFAULT_MIN,
  showValue: true,
  size: METER_DEFAULT_SIZE,
  tone: METER_DEFAULT_TONE,
  valueText: undefined,
});

const labelId = `kappa-meter-label-${useId()}`;
const range = computed(() => resolveMeterRange(props.min, props.max));
const resolvedLabel = computed(() => resolveMeterLabel(props.label));
const resolvedSize = computed(() => resolveMeterSize(props.size));
const resolvedTone = computed(() => resolveMeterTone(props.tone));
const resolvedValue = computed(() =>
  clampMeterValue(props.value, range.value.min, range.value.max),
);
const percentage = computed(() =>
  getMeterPercentage(resolvedValue.value, range.value.min, range.value.max),
);
const displayValue = computed(() =>
  resolveMeterValueText(
    props.valueText,
    resolvedValue.value,
    range.value.min,
    range.value.max,
  ),
);
const valueState = computed(() => resolveMeterValueState(percentage.value));
const meterStyle = computed(() => ({
  "--kappa-meter-value": `${percentage.value}%`,
}));
</script>

<template>
  <div
    v-bind="$attrs"
    class="kappa-meter"
    :style="meterStyle"
    data-slot="meter"
    :data-size="resolvedSize"
    :data-tone="resolvedTone"
    :data-value-state="valueState"
    role="meter"
    :aria-labelledby="labelId"
    :aria-valuemax="range.max"
    :aria-valuemin="range.min"
    :aria-valuenow="resolvedValue"
    :aria-valuetext="displayValue"
  >
    <div class="kappa-meter__header" data-slot="meter-header">
      <span :id="labelId" class="kappa-meter__label" data-slot="meter-label">
        {{ resolvedLabel }}
      </span>
      <span
        v-if="props.showValue"
        class="kappa-meter__value"
        data-slot="meter-value"
      >
        {{ displayValue }}
      </span>
    </div>
    <div class="kappa-meter__track" data-slot="meter-track" aria-hidden="true">
      <div class="kappa-meter__indicator" data-slot="meter-indicator" />
    </div>
  </div>
</template>

<style src="./meter.css"></style>
