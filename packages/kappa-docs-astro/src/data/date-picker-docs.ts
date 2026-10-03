export const barrelCode = `import {
  DatePicker,
  DatePickerRoot,
  DatePickerRootProvider,
  DatePickerLabel,
  DatePickerControl,
  DatePickerInput,
  DatePickerTrigger,
  DatePickerClearTrigger,
  DatePickerContent,
  DatePickerCalendar,
} from "@dicehub/kappa";`;

export const granularCode = `import {
  DatePicker,
  DatePickerRoot,
  DatePickerRootProvider,
  DatePickerLabel,
  DatePickerControl,
  DatePickerInput,
  DatePickerTrigger,
  DatePickerClearTrigger,
  DatePickerContent,
  DatePickerCalendar,
} from "@dicehub/kappa/components/date-picker";`;

export const previewCode = `<script setup>
import { ref } from "vue";
import { DatePicker } from "@dicehub/kappa/components/date-picker";

const value = ref([]);
</script>

<template>
  <DatePicker.Root v-model="value" name="target-date">
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
</template>`;

export const usageCode = `<script setup>
import { ref } from "vue";
import { DatePicker } from "@dicehub/kappa/components/date-picker";

const value = ref([]);
</script>

<template>
  <DatePicker.Root v-model="value" name="report-date">
    <DatePicker.Label>Report date</DatePicker.Label>
    <DatePicker.Control>
      <DatePicker.Input placeholder="YYYY-MM-DD" />
      <DatePicker.Trigger aria-label="Open calendar" />
    </DatePicker.Control>
    <DatePicker.Content>
      <DatePicker.Calendar />
    </DatePicker.Content>
  </DatePicker.Root>
</template>`;

export const compositionCode = `<script setup>
import {
  DatePickerRoot,
  DatePickerControl,
  DatePickerInput,
  DatePickerTrigger,
  DatePickerContent,
  DatePickerCalendar,
} from "@dicehub/kappa/components/date-picker";
</script>

<template>
  <DatePickerRoot>
    <DatePickerControl>
      <DatePickerInput placeholder="Pick a date" />
      <DatePickerTrigger aria-label="Open calendar" />
    </DatePickerControl>
    <DatePickerContent>
      <DatePickerCalendar />
    </DatePickerContent>
  </DatePickerRoot>
</template>`;

export const inlineCode = `<script setup>
import { ref } from "vue";
import { DatePicker } from "@dicehub/kappa/components/date-picker";

const value = ref([]);
</script>

<template>
  <DatePicker.Root v-model="value" inline>
    <DatePicker.Calendar />
  </DatePicker.Root>
</template>`;

export const rangeCode = `<script setup>
import { ref } from "vue";
import { DatePicker } from "@dicehub/kappa/components/date-picker";

const samplingWindow = ref([]);
</script>

<template>
  <DatePicker.Root v-model="samplingWindow" selection-mode="range" :num-of-months="2">
    <DatePicker.Label>Sampling window</DatePicker.Label>
    <DatePicker.Control>
      <DatePicker.Input placeholder="Start date" />
      <DatePicker.Trigger aria-label="Open calendar" />
    </DatePicker.Control>
    <DatePicker.Content>
      <DatePicker.Calendar />
    </DatePicker.Content>
  </DatePicker.Root>
</template>`;

export const rangeConstraintsCode = `<script setup>
import { today, getLocalTimeZone } from "@internationalized/date";
import { computed, ref } from "vue";
import { DatePicker } from "@dicehub/kappa/components/date-picker";

const RANGE_MIN_DAYS = 2;
const RANGE_MAX_DAYS = 6;

const value = ref([today(getLocalTimeZone()).add({ days: 2 }), today(getLocalTimeZone()).add({ days: 5 })]);

// A pending range start: the controlled value holds exactly one date.
const pendingStart = computed(() => (value.value.length === 1 ? value.value[0] : undefined));

const outsideRangeLimits = (date) => {
  if (!pendingStart.value) return false;
  const days = Math.abs(
    Math.round((date.toDate("UTC") - pendingStart.value.toDate("UTC")) / 86_400_000),
  );
  return days < RANGE_MIN_DAYS || days > RANGE_MAX_DAYS;
};
</script>

<template>
  <DatePicker.Root
    v-model="value"
    selection-mode="range"
    inline
    :num-of-months="2"
    :is-date-unavailable="outsideRangeLimits"
  >
    <DatePicker.Calendar />
  </DatePicker.Root>
</template>`;

export const presetsCode = `<script setup>
import { CalendarDate, today, getLocalTimeZone } from "@internationalized/date";
import { ref } from "vue";
import { DatePicker } from "@dicehub/kappa/components/date-picker";

const value = ref([today(getLocalTimeZone())]);
const inDays = (days) => today(getLocalTimeZone()).add({ days });
</script>

<template>
  <DatePicker.Root v-model="value">
    <DatePicker.Control>
      <DatePicker.Input placeholder="Pick a date" />
      <DatePicker.Trigger aria-label="Open calendar" />
    </DatePicker.Control>
    <DatePicker.Content>
      <DatePicker.Calendar />
      <div class="presets">
        <DatePicker.PresetTrigger :value="[inDays(0)]">Today</DatePicker.PresetTrigger>
        <DatePicker.PresetTrigger :value="[inDays(7)]">In a week</DatePicker.PresetTrigger>
      </div>
    </DatePicker.Content>
  </DatePicker.Root>
</template>`;

export const selectsCode = `<script setup>
import { ref } from "vue";
import { DatePicker } from "@dicehub/kappa/components/date-picker";

const value = ref([]);
</script>

<template>
  <DatePicker.Root v-model="value">
    <DatePicker.Control>
      <DatePicker.Input placeholder="Pick a date" />
      <DatePicker.Trigger aria-label="Open calendar" />
    </DatePicker.Control>
    <DatePicker.Content>
      <div class="selects">
        <DatePicker.MonthSelect aria-label="Month" />
        <DatePicker.YearSelect aria-label="Year" />
      </div>
      <DatePicker.Calendar />
    </DatePicker.Content>
  </DatePicker.Root>
</template>`;

export const minMaxCode = `<script setup>
import { today, getLocalTimeZone } from "@internationalized/date";
import { ref } from "vue";
import { DatePicker } from "@dicehub/kappa/components/date-picker";

const value = ref([]);
const now = today(getLocalTimeZone());
const weekendUnavailable = (date) => {
  const day = new Date(date.year, date.month - 1, date.day).getDay();
  return day === 0 || day === 6;
};
</script>

<template>
  <DatePicker.Root
    v-model="value"
    :min="now"
    :max="now.add({ days: 30 })"
    :is-date-unavailable="weekendUnavailable"
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
</template>`;

export const weekNumbersCode = `<script setup>
import { DatePicker } from "@dicehub/kappa/components/date-picker";
</script>

<template>
  <DatePicker.Root inline show-week-numbers>
    <DatePicker.Calendar />
  </DatePicker.Root>
</template>`;

export const localeCode = `<script setup>
import { ref } from "vue";
import { DatePicker } from "@dicehub/kappa/components/date-picker";

const value = ref([]);
</script>

<template>
  <DatePicker.Root v-model="value" locale="de-DE" name="abgabetermin">
    <DatePicker.Label>Abgabetermin</DatePicker.Label>
    <DatePicker.Control>
      <DatePicker.Input placeholder="Datum wählen" />
      <DatePicker.Trigger aria-label="Kalender öffnen" />
    </DatePicker.Control>
    <DatePicker.Content>
      <DatePicker.Calendar />
    </DatePicker.Content>
  </DatePicker.Root>
</template>`;

export const statesCode = `<script setup>
import { CalendarDate } from "@internationalized/date";
import { DatePicker } from "@dicehub/kappa/components/date-picker";
</script>

<template>
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
  <p id="milestone-error">Select a date before the review closes.</p>
</template>`;

export const rootProps = [
  { name: "modelValue", type: "DateValue[]", defaultValue: "-", description: "Controlled selected dates; supports v-model." },
  { name: "defaultValue", type: "DateValue[]", defaultValue: "[]", description: "Initially selected dates for uncontrolled use." },
  { name: "selectionMode", type: '"single" | "multiple" | "range"', defaultValue: '"single"', description: "Selects one date, many dates, or a contiguous range." },
  { name: "inline", type: "boolean", defaultValue: "false", description: "Renders the calendar inline instead of inside a popover." },
  { name: "numOfMonths", type: "number", defaultValue: "1", description: "Renders this many adjacent month grids." },
  { name: "startOfWeek", type: "number", defaultValue: "0", description: "First weekday column; 0 is Sunday, 1 is Monday." },
  { name: "showWeekNumbers", type: "boolean", defaultValue: "false", description: "Adds the ISO week-number column to the day view." },
  { name: "fixedWeeks", type: "boolean", defaultValue: "false", description: "Always renders six weeks to keep the grid height stable." },
  { name: "min", type: "DateValue", defaultValue: "-", description: "Earliest selectable date." },
  { name: "max", type: "DateValue", defaultValue: "-", description: "Latest selectable date." },
  { name: "isDateUnavailable", type: "(date, locale) => boolean", defaultValue: "-", description: "Marks specific dates unavailable, such as weekends or booked days." },
  { name: "locale", type: "string", defaultValue: '"en-US"', description: "BCP 47 tag driving month, weekday, and input formatting." },
  { name: "timeZone", type: "string", defaultValue: '"UTC"', description: "Time zone used for date math and the today marker." },
  { name: "format", type: "(date, details) => string", defaultValue: "localized", description: "Overrides how the input renders the selected date." },
  { name: "parse", type: "(value, details) => DateValue", defaultValue: "localized", description: "Overrides how typed text parses back into a date." },
  { name: "open / defaultOpen", type: "boolean", defaultValue: "false", description: "Controlled or initial popover open state; pair open with update:open." },
  { name: "openOnClick", type: "boolean", defaultValue: "false", description: "Opens the calendar when the input is clicked." },
  { name: "closeOnSelect", type: "boolean", defaultValue: "true", description: "Closes the popover after a completed selection." },
  { name: "positioning", type: "PositioningOptions", defaultValue: "bottom-start", description: "Floating placement, gutter, and viewport handling for the popover." },
  { name: "view / defaultView", type: '"day" | "month" | "year"', defaultValue: '"day"', description: "Controlled or initial calendar view." },
  { name: "disabled / readOnly / required / invalid", type: "boolean", defaultValue: "false", description: "Standard form states, exposed as data attributes." },
  { name: "name", type: "string", defaultValue: "-", description: "Form field name for the hidden value." },
  { name: "maxSelectedDates", type: "number", defaultValue: "-", description: "Caps selections in multiple mode." },
  { name: "createCalendar", type: "(identifier) => Calendar", defaultValue: "Gregorian", description: "Enables non-Gregorian calendars such as Persian or Buddhist." },
] as const;

export const parts = [
  { name: "Label", element: "label", description: "Names the field and focuses the input on click." },
  { name: "Control", element: "div", description: "Visual box grouping the input and icon triggers." },
  { name: "Input", element: "input", description: "Editable date text; parses on commit." },
  { name: "Trigger", element: "button", description: "Opens the popover; renders a calendar icon by default." },
  { name: "ClearTrigger", element: "button", description: "Clears the selection; renders an × icon by default." },
  { name: "Content", element: "div", description: "Teleported positioner and popover surface." },
  { name: "Calendar", element: "div", description: "Composed day-view calendar: navigation, month titles, weekday header, and day grid." },
  { name: "View / ViewControl / ViewTrigger", element: "div", description: "View switching primitives for day, month, and year grids." },
  { name: "PrevTrigger / NextTrigger", element: "button", description: "Step the visible range; render chevron icons by default." },
  { name: "Table … TableCellTrigger", element: "table", description: "Full grid anatomy for custom calendar layouts." },
  { name: "WeekNumberCell / WeekNumberHeaderCell", element: "td", description: "ISO week-number column cells." },
  { name: "ValueText", element: "div", description: "Formatted selected value outside the input." },
  { name: "RangeText", element: "div", description: "Formatted visible range text." },
  { name: "PresetTrigger", element: "button", description: "Applies a prepared value such as Today or Next week." },
  { name: "MonthSelect / YearSelect", element: "select", description: "Native month and year jump dropdowns." },
  { name: "Context", element: "renderless", description: "Exposes the date picker API to its slot." },
  { name: "RootProvider", element: "div", description: "Root driven by an external useDatePicker machine." },
] as const;

export const events = [
  { name: "update:modelValue", payload: "DateValue[]", description: "Emitted on selection changes; drives v-model." },
  { name: "valueChange", payload: "DatePickerValueChangeDetails", description: "Ark UI detail with value and valueAsString." },
  { name: "update:open", payload: "boolean", description: "Emitted when the popover opens or closes; drives v-model:open." },
  { name: "openChange", payload: "{ open: boolean }", description: "Ark UI detail for popover visibility." },
  { name: "focusChange", payload: "DatePickerFocusChangeDetails", description: "Emitted when the focused date moves." },
  { name: "viewChange", payload: "DatePickerViewChangeDetails", description: "Emitted when the calendar view changes." },
  { name: "visibleRangeChange", payload: "DatePickerVisibleRangeChangeDetails", description: "Emitted when the visible month range changes." },
] as const;

export const exportsList = [
  { name: "DatePicker", description: "Compound API exposing every named part." },
  { name: "DatePickerRoot", description: "Unaugmented root state machine host." },
  { name: "DatePickerCalendar", description: "Composed day-view calendar with navigation." },
  { name: "DatePickerContent", description: "Teleported popover surface." },
  { name: "DatePickerProps", description: "Public root props and Ark UI state contract." },
  { name: "DatePickerEmits", description: "Root event contract." },
  { name: "DateValue", description: "@internationalized/date value type used across the API." },
  { name: "DatePickerValueChangeDetails", description: "Payload for valueChange." },
  { name: "parseDate", description: "Ark UI helper parsing ISO strings into DateValue objects." },
  { name: "useDatePicker", description: "Ark UI machine hook for external state control." },
  { name: "datePickerAnatomy", description: "Ark UI part anatomy metadata." },
] as const;
