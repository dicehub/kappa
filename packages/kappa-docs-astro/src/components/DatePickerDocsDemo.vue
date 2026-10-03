<script setup lang="ts">
import { CalendarDate, today, getLocalTimeZone } from "@internationalized/date";
import { computed, ref } from "vue";
import { DatePicker, type DateValue } from "@dicehub/kappa/components/date-picker";

type DemoVariant =
  | "preview"
  | "usage"
  | "inline"
  | "range"
  | "range-constraints"
  | "presets"
  | "week-numbers"
  | "selects"
  | "min-max"
  | "locale"
  | "states";

withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const timeZone = getLocalTimeZone();
const now = today(timeZone);
const inDays = (days: number) => now.add({ days });

const previewValue = ref<DateValue[]>([now]);
const usageValue = ref<DateValue[]>([]);
const inlineValue = ref<DateValue[]>([now]);
const rangeValue = ref<DateValue[]>([inDays(3), inDays(10)]);
const presetValue = ref<DateValue[]>([now]);
const selectsValue = ref<DateValue[]>([now]);
const minMaxValue = ref<DateValue[]>([]);
const localeValue = ref<DateValue[]>([now]);

const rangeSummary = computed(() => {
  if (rangeValue.value.length < 2) return "Pick a start and an end date.";
  const [start, end] = rangeValue.value;
  return `${start.toString()} → ${end.toString()}`;
});

const RANGE_MIN_DAYS = 2;
const RANGE_MAX_DAYS = 6;
const constrainedRange = ref<DateValue[]>([inDays(2), inDays(5)]);
const pendingRangeStart = computed(() =>
  constrainedRange.value.length === 1 ? constrainedRange.value[0] : undefined,
);
const rangeDistance = (date: DateValue, start: DateValue) =>
  Math.abs(Math.round((date.toDate("UTC").getTime() - start.toDate("UTC").getTime()) / 86_400_000));
const outsideRangeLimits = (date: DateValue) => {
  if (!pendingRangeStart.value) return false;
  const days = rangeDistance(date, pendingRangeStart.value);
  return days < RANGE_MIN_DAYS || days > RANGE_MAX_DAYS;
};

const presets = [
  { label: "Today", offset: 0 },
  { label: "In 3 days", offset: 3 },
  { label: "In a week", offset: 7 },
  { label: "In 2 weeks", offset: 14 },
];

const weekendUnavailable = (date: DateValue) => {
  const day = new Date(date.year, date.month - 1, date.day).getDay();
  return day === 0 || day === 6;
};
</script>

<template>
  <div class="date-picker-demo" :data-date-picker-demo="variant">
    <section v-if="variant === 'preview'" class="date-picker-demo__stack">
      <DatePicker.Root v-model="previewValue" name="target-date">
        <DatePicker.Label>Target completion date</DatePicker.Label>
        <DatePicker.Control>
          <DatePicker.Input placeholder="Pick a date" />
          <DatePicker.ClearTrigger aria-label="Clear date" />
          <DatePicker.Trigger aria-label="Open calendar" />
        </DatePicker.Control>
        <DatePicker.Content>
          <DatePicker.Calendar />
        </DatePicker.Content>
      </DatePicker.Root>
      <span class="date-picker-demo__hint">
        Selected: <strong>{{ previewValue[0]?.toString() ?? "none" }}</strong>
      </span>
    </section>

    <DatePicker.Root v-else-if="variant === 'usage'" v-model="usageValue" name="report-date">
      <DatePicker.Label>Report date</DatePicker.Label>
      <DatePicker.Control>
        <DatePicker.Input placeholder="YYYY-MM-DD" />
        <DatePicker.Trigger aria-label="Open calendar" />
      </DatePicker.Control>
      <DatePicker.Content>
        <DatePicker.Calendar />
      </DatePicker.Content>
    </DatePicker.Root>

    <DatePicker.Root v-else-if="variant === 'inline'" v-model="inlineValue" inline>
      <DatePicker.Calendar />
    </DatePicker.Root>

    <section v-else-if="variant === 'range'" class="date-picker-demo__stack">
      <DatePicker.Root v-model="rangeValue" selection-mode="range" :num-of-months="2" name="sampling-window">
        <DatePicker.Label>Sampling window</DatePicker.Label>
        <DatePicker.Control>
          <DatePicker.Input placeholder="Start date" />
          <DatePicker.Trigger aria-label="Open calendar" />
        </DatePicker.Control>
        <DatePicker.Content>
          <DatePicker.Calendar />
        </DatePicker.Content>
      </DatePicker.Root>
      <output class="date-picker-demo__readout" aria-live="polite">{{ rangeSummary }}</output>
    </section>

    <section v-else-if="variant === 'range-constraints'" class="date-picker-demo__stack date-picker-demo__stack--calendar">
      <DatePicker.Root
        v-model="constrainedRange"
        selection-mode="range"
        inline
        :num-of-months="2"
        :is-date-unavailable="outsideRangeLimits"
      >
        <DatePicker.Calendar />
      </DatePicker.Root>
      <span class="date-picker-demo__hint">
        Ranges must span {{ RANGE_MIN_DAYS }}–{{ RANGE_MAX_DAYS }} days. Pick a start date, and days
        outside the limit become unavailable.
      </span>
    </section>

    <section v-else-if="variant === 'presets'" class="date-picker-demo__stack">
      <DatePicker.Root v-model="presetValue">
        <DatePicker.Control>
          <DatePicker.Input placeholder="Pick a date" />
          <DatePicker.Trigger aria-label="Open calendar" />
        </DatePicker.Control>
        <DatePicker.Content>
          <DatePicker.Calendar />
          <div class="date-picker-demo__presets">
            <DatePicker.PresetTrigger
              v-for="preset in presets"
              :key="preset.label"
              :value="[inDays(preset.offset)]"
            >
              {{ preset.label }}
            </DatePicker.PresetTrigger>
          </div>
        </DatePicker.Content>
      </DatePicker.Root>
      <span class="date-picker-demo__hint">
        Selected: <strong>{{ presetValue[0]?.toString() ?? "none" }}</strong>
      </span>
    </section>

    <DatePicker.Root v-else-if="variant === 'week-numbers'" inline show-week-numbers>
      <DatePicker.Calendar />
    </DatePicker.Root>

    <DatePicker.Root v-else-if="variant === 'selects'" v-model="selectsValue">
      <DatePicker.Control>
        <DatePicker.Input placeholder="Pick a date" />
        <DatePicker.Trigger aria-label="Open calendar" />
      </DatePicker.Control>
      <DatePicker.Content>
        <div class="date-picker-demo__selects">
          <DatePicker.MonthSelect aria-label="Month" />
          <DatePicker.YearSelect aria-label="Year" />
        </div>
        <DatePicker.Calendar />
      </DatePicker.Content>
    </DatePicker.Root>

    <section v-else-if="variant === 'min-max'" class="date-picker-demo__stack">
      <DatePicker.Root
        v-model="minMaxValue"
        :min="now"
        :max="inDays(30)"
        :is-date-unavailable="weekendUnavailable"
        name="submission-date"
      >
        <DatePicker.Label>Submission date</DatePicker.Label>
        <DatePicker.Control>
          <DatePicker.Input placeholder="Next 30 days, weekdays" />
          <DatePicker.Trigger aria-label="Open calendar" />
        </DatePicker.Control>
        <DatePicker.Content>
          <DatePicker.Calendar />
        </DatePicker.Content>
      </DatePicker.Root>
      <span class="date-picker-demo__hint">Weekdays only, within the next 30 days.</span>
    </section>

    <DatePicker.Root v-else-if="variant === 'locale'" v-model="localeValue" locale="de-DE" name="abgabetermin">
      <DatePicker.Label>Abgabetermin</DatePicker.Label>
      <DatePicker.Control>
        <DatePicker.Input placeholder="Datum wählen" />
        <DatePicker.Trigger aria-label="Kalender öffnen" />
      </DatePicker.Control>
      <DatePicker.Content>
        <DatePicker.Calendar />
      </DatePicker.Content>
    </DatePicker.Root>

    <div v-else class="date-picker-demo__states">
      <DatePicker.Root disabled :default-value="[new CalendarDate(2026, 8, 1)]">
        <DatePicker.Label>Disabled start date</DatePicker.Label>
        <DatePicker.Control>
          <DatePicker.Input placeholder="Unavailable" />
          <DatePicker.Trigger aria-label="Open calendar" />
        </DatePicker.Control>
      </DatePicker.Root>
      <DatePicker.Root invalid>
        <DatePicker.Label>Invalid milestone date</DatePicker.Label>
        <DatePicker.Control>
          <DatePicker.Input placeholder="Required" aria-describedby="milestone-error" />
          <DatePicker.Trigger aria-label="Open calendar" />
        </DatePicker.Control>
      </DatePicker.Root>
      <p id="milestone-error" class="date-picker-demo__error">Select a date before the review closes.</p>
    </div>
  </div>
</template>

<style scoped>
.date-picker-demo {
  display: grid;
  width: min(100%, 40rem);
  min-width: 0;
  min-height: 8rem;
  place-items: center;
  color: var(--docs-default);
  font-family: var(--docs-font-sans, "Geist", sans-serif);
}

.date-picker-demo__stack {
  display: grid;
  width: min(100%, 20rem);
  gap: 0.625rem;
}

.date-picker-demo__stack--calendar {
  width: max-content;
  max-inline-size: 100%;
}

.date-picker-demo__stack > :deep(.kappa-date-picker) {
  width: 100%;
}

.date-picker-demo__hint,
.date-picker-demo__readout {
  margin: 0;
  color: var(--docs-subtle);
  font-size: 0.75rem;
}

.date-picker-demo__hint strong {
  color: var(--docs-default);
  font-variant-numeric: tabular-nums;
}

.date-picker-demo__readout {
  font-variant-numeric: tabular-nums;
}

.date-picker-demo__presets {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-block-start: 0.625rem;
}

.date-picker-demo__selects {
  display: flex;
  justify-content: flex-end;
  gap: 0.375rem;
  margin-block-end: 0.5rem;
}

.date-picker-demo__states {
  display: grid;
  width: min(100%, 22rem);
  gap: 0.75rem;
}

.date-picker-demo__error {
  margin: -0.375rem 0 0;
  color: var(--kappa-danger-text, #b42318);
  font-size: 0.75rem;
}
</style>
