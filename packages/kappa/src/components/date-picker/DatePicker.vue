<script setup lang="ts">
import { DatePicker as ArkDatePicker } from "@ark-ui/vue/date-picker";
import { computed } from "vue";
import {
  resolveDatePickerTranslations,
  type DatePickerEmits,
  type DatePickerProps,
  type DatePickerSlots,
} from "./date-picker";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DatePickerProps>(), {
  asChild: undefined,
  closeOnSelect: undefined,
  createCalendar: undefined,
  defaultFocusedValue: undefined,
  defaultOpen: undefined,
  defaultValue: undefined,
  defaultView: undefined,
  disabled: undefined,
  fixedWeeks: undefined,
  focusedValue: undefined,
  format: undefined,
  id: undefined,
  ids: undefined,
  inline: undefined,
  invalid: undefined,
  isDateUnavailable: undefined,
  lazyMount: undefined,
  locale: undefined,
  max: undefined,
  maxSelectedDates: undefined,
  maxView: undefined,
  min: undefined,
  minView: undefined,
  modelValue: undefined,
  name: undefined,
  numOfMonths: undefined,
  open: undefined,
  openOnClick: undefined,
  outsideDaySelectable: undefined,
  parse: undefined,
  placeholder: undefined,
  positioning: () => ({ gutter: 4, overflowPadding: 8, placement: "bottom-start" }),
  readOnly: undefined,
  required: undefined,
  selectionMode: undefined,
  showWeekNumbers: undefined,
  startOfWeek: undefined,
  timeZone: undefined,
  translations: undefined,
  unmountOnExit: undefined,
  view: undefined,
});

const emit = defineEmits<DatePickerEmits>();
defineSlots<DatePickerSlots>();

const mergedTranslations = computed(() => resolveDatePickerTranslations(props.translations));
</script>

<template>
  <ArkDatePicker.Root
    v-bind="$attrs"
    class="kappa-date-picker"
    data-slot="date-picker"
    :as-child="props.asChild"
    :close-on-select="props.closeOnSelect"
    :create-calendar="props.createCalendar"
    :default-focused-value="props.defaultFocusedValue"
    :default-open="props.defaultOpen"
    :default-value="props.defaultValue"
    :default-view="props.defaultView"
    :disabled="props.disabled"
    :fixed-weeks="props.fixedWeeks"
    :focused-value="props.focusedValue"
    :format="props.format"
    :id="props.id"
    :ids="props.ids"
    :inline="props.inline"
    :invalid="props.invalid"
    :is-date-unavailable="props.isDateUnavailable"
    :lazy-mount="props.lazyMount"
    :locale="props.locale"
    :max="props.max"
    :max-selected-dates="props.maxSelectedDates"
    :max-view="props.maxView"
    :min="props.min"
    :min-view="props.minView"
    :model-value="props.modelValue"
    :name="props.name"
    :num-of-months="props.numOfMonths"
    :open="props.open"
    :open-on-click="props.openOnClick"
    :outside-day-selectable="props.outsideDaySelectable"
    :parse="props.parse"
    :placeholder="props.placeholder"
    :positioning="props.positioning"
    :read-only="props.readOnly"
    :required="props.required"
    :selection-mode="props.selectionMode"
    :show-week-numbers="props.showWeekNumbers"
    :start-of-week="props.startOfWeek"
    :time-zone="props.timeZone"
    :translations="mergedTranslations"
    :unmount-on-exit="props.unmountOnExit"
    :view="props.view"
    @exit-complete="emit('exitComplete')"
    @focus-change="emit('focusChange', $event)"
    @open-change="emit('openChange', $event)"
    @update:focused-value="emit('update:focusedValue', $event)"
    @update:model-value="emit('update:modelValue', $event)"
    @update:open="emit('update:open', $event)"
    @update:view="emit('update:view', $event)"
    @value-change="emit('valueChange', $event)"
    @view-change="emit('viewChange', $event)"
    @visible-range-change="emit('visibleRangeChange', $event)"
  >
    <slot />
  </ArkDatePicker.Root>
</template>

<style src="./date-picker.css"></style>
