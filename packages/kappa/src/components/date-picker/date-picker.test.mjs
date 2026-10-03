import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const readSource = (name) => readFileSync(new URL(name, import.meta.url), "utf8");

const rootSource = readSource("./DatePicker.vue");
const rootProviderSource = readSource("./DatePickerRootProvider.vue");
const calendarSource = readSource("./DatePickerCalendar.vue");
const contentSource = readSource("./DatePickerContent.vue");
const triggerSource = readSource("./DatePickerTrigger.vue");
const clearTriggerSource = readSource("./DatePickerClearTrigger.vue");
const prevTriggerSource = readSource("./DatePickerPrevTrigger.vue");
const tableCellSource = readSource("./DatePickerTableCell.vue");
const typesSource = readSource("./date-picker.ts");
const styles = readSource("./date-picker.css");
const moduleBarrel = readSource("./index.ts");

test("forwards the exact Ark root prop and event contract", () => {
  assert.match(rootSource, /from "@ark-ui\/vue\/date-picker"/);
  assert.match(rootSource, /v-bind="\$attrs"/);
  assert.match(rootSource, /data-slot="date-picker"/);

  for (const binding of [
    "close-on-select",
    "default-focused-value",
    "default-open",
    "default-value",
    "default-view",
    "disabled",
    "fixed-weeks",
    "focused-value",
    "format",
    "inline",
    "invalid",
    "is-date-unavailable",
    "lazy-mount",
    "locale",
    "max",
    "max-selected-dates",
    "max-view",
    "min",
    "min-view",
    "model-value",
    "name",
    "num-of-months",
    "open",
    "open-on-click",
    "outside-day-selectable",
    "parse",
    "placeholder",
    "positioning",
    "read-only",
    "required",
    "selection-mode",
    "show-week-numbers",
    "start-of-week",
    "time-zone",
    "translations",
    "unmount-on-exit",
    "view",
  ]) {
    assert.match(rootSource, new RegExp(`:${binding}=`));
  }

  assert.match(rootSource, /positioning: \(\) => \(\{/);
  assert.match(rootSource, /placement: "bottom-start"/);
  assert.match(rootSource, /:translations="mergedTranslations"/);
  assert.match(rootSource, /resolveDatePickerTranslations\(props\.translations\)/);
  assert.match(typesSource, /resolveDatePickerTranslations/);
  assert.match(typesSource, /partial\?\.presetTrigger \?\? resolveDatePickerPresetTriggerLabel/);
  assert.match(typesSource, /resolveDatePickerPresetTriggerLabel/);
  assert.match(typesSource, /\`select \$\{valueAsString\[0\]\}\`/);

  for (const event of [
    "exitComplete",
    "focusChange",
    "openChange",
    "update:focusedValue",
    "update:modelValue",
    "update:open",
    "update:view",
    "valueChange",
    "viewChange",
    "visibleRangeChange",
  ]) {
    assert.match(rootSource, new RegExp(`emit\\('${event}'`));
  }
  assert.match(typesSource, /"update:modelValue": \[value: DateValue\[\]\]/);
  assert.match(typesSource, /"update:open": \[open: boolean\]/);
});

test("ships a composed day-view calendar with offsets and week numbers", () => {
  assert.match(calendarSource, /<ArkDatePicker\.Context v-slot="datePicker">/);
  assert.match(calendarSource, /data-slot="date-picker-calendar"/);
  assert.match(calendarSource, /<DatePickerView view="day">/);
  assert.match(calendarSource, /datePicker\.getOffset/);
  assert.match(calendarSource, /datePicker\.numOfMonths/);
  assert.match(calendarSource, /datePicker\.weekDays/);
  assert.match(calendarSource, /datePicker\.showWeekNumbers/);
  assert.match(calendarSource, /datePicker\.getWeekNumber\(week\)/);
  assert.match(calendarSource, /role="status" aria-live="polite"/);
  assert.match(calendarSource, /aria-label="Previous month"/);
  assert.match(calendarSource, /aria-label="Next month"/);
  assert.match(calendarSource, /:visible-range=/);
  assert.match(calendarSource, /{{ day\.day }}/);
});

test("provides default icons for trigger, clear, and navigation parts", () => {
  for (const source of [triggerSource, clearTriggerSource, prevTriggerSource]) {
    assert.match(source, /<svg/);
    assert.match(source, /viewBox="0 0 16 16"/);
    assert.match(source, /stroke="currentColor"/);
    assert.match(source, /aria-hidden="true"/);
  }
  assert.match(triggerSource, /data-slot="date-picker-trigger"/);
  assert.match(clearTriggerSource, /data-slot="date-picker-clear-trigger"/);
});

test("teleports the popover content through a positioner", () => {
  assert.match(contentSource, /<Teleport/);
  assert.match(contentSource, /:disabled="!teleport || !isMounted"/);
  assert.match(contentSource, /<ArkDatePicker\.Positioner/);
  assert.match(contentSource, /<ArkDatePicker\.Content/);
  assert.match(contentSource, /data-slot="date-picker-content"/);
  assert.match(typesSource, /teleport\?: boolean/);
  assert.match(typesSource, /teleportTo\?: string \| HTMLElement/);
});

test("keeps table cells typed on Ark DateValue contracts", () => {
  assert.match(tableCellSource, /:value="value"/);
  assert.match(tableCellSource, /:visible-range="visibleRange"/);
  assert.match(typesSource, /value: DateValue/);
  assert.match(rootProviderSource, /:value="value"/);
});

test("exports named parts, the compound API, and Ark hooks", () => {
  for (const part of [
    "Root",
    "RootProvider",
    "Label",
    "Control",
    "Input",
    "Trigger",
    "ClearTrigger",
    "Content",
    "Calendar",
    "View",
    "ViewControl",
    "ViewTrigger",
    "PrevTrigger",
    "NextTrigger",
    "Table",
    "TableHead",
    "TableHeader",
    "TableBody",
    "TableRow",
    "TableCell",
    "TableCellTrigger",
    "WeekNumberCell",
    "WeekNumberHeaderCell",
    "ValueText",
    "RangeText",
    "PresetTrigger",
    "MonthSelect",
    "YearSelect",
    "Context",
  ]) {
    assert.match(moduleBarrel, new RegExp(`${part}: DatePicker${part}`));
  }
  assert.match(moduleBarrel, /DatePickerProps/);
  assert.match(moduleBarrel, /DatePickerEmits/);
  assert.match(moduleBarrel, /DatePickerValueChangeDetails/);
  assert.match(moduleBarrel, /datePickerAnatomy/);
  assert.match(moduleBarrel, /parseDate/);
  assert.match(moduleBarrel, /useDatePicker/);
});

test("uses state-attribute-driven Kappa styling", () => {
  assert.match(styles, /\.kappa-date-picker__control \{/);
  assert.match(styles, /min-block-size: 2rem/);
  assert.match(styles, /var\(--kappa-line/);
  assert.match(styles, /var\(--kappa-selected/);
  assert.match(styles, /var\(--kappa-base/);
  assert.match(styles, /var\(--kappa-danger/);
  assert.match(styles, /var\(--kappa-date-picker-z-index, 1000\)/);
  assert.match(styles, /\[data-selected\]/);
  assert.match(styles, /\[data-range-start\]/);
  assert.match(styles, /\[data-range-end\]/);
  assert.match(styles, /\[data-in-range\]/);
  assert.match(styles, /\[data-in-hover-range\]/);
  assert.match(styles, /\[data-today\]/);
  assert.match(styles, /:has\(\.kappa-date-picker__input\[data-invalid\]\)/);
  assert.match(styles, /\[data-unavailable\]/);
  assert.match(styles, /\[data-outside-range\]/);
  assert.match(styles, /:focus-visible/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-)[a-z][\w-]*/);
  assert.doesNotMatch(
    styles,
    /(?:margin|padding|border)-(?:left|right)|text-align:\s*(?:left|right)/,
  );
  assert.doesNotMatch(styles, /#[\da-f]{3,8}(?![^\n]*\))/i);
});
