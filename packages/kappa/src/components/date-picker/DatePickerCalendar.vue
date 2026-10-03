<script setup lang="ts">
import { DatePicker as ArkDatePicker } from "@ark-ui/vue/date-picker";
import DatePickerNextTrigger from "./DatePickerNextTrigger.vue";
import DatePickerPrevTrigger from "./DatePickerPrevTrigger.vue";
import DatePickerTable from "./DatePickerTable.vue";
import DatePickerTableBody from "./DatePickerTableBody.vue";
import DatePickerTableCell from "./DatePickerTableCell.vue";
import DatePickerTableCellTrigger from "./DatePickerTableCellTrigger.vue";
import DatePickerTableHead from "./DatePickerTableHead.vue";
import DatePickerTableHeader from "./DatePickerTableHeader.vue";
import DatePickerTableRow from "./DatePickerTableRow.vue";
import DatePickerView from "./DatePickerView.vue";
import DatePickerWeekNumberCell from "./DatePickerWeekNumberCell.vue";
import DatePickerWeekNumberHeaderCell from "./DatePickerWeekNumberHeaderCell.vue";
import type { DatePickerCalendarProps, DatePickerCalendarSlots } from "./date-picker";

withDefaults(defineProps<DatePickerCalendarProps>(), {
  weekdayFormat: "narrow",
});

defineSlots<DatePickerCalendarSlots>();

const monthOffset = (index: number) => ({ months: index });
const weekdayLabel = (day: { long: string; short: string; narrow: string }, format: "narrow" | "short") =>
  format === "narrow" ? day.narrow : day.short.slice(0, 2);
</script>

<template>
  <ArkDatePicker.Context v-slot="datePicker">
    <div class="kappa-date-picker__calendar" data-slot="date-picker-calendar">
      <DatePickerView view="day">
        <div class="kappa-date-picker__nav">
          <slot name="navigation">
            <DatePickerPrevTrigger aria-label="Previous month" />
            <DatePickerNextTrigger aria-label="Next month" />
          </slot>
        </div>

        <div class="kappa-date-picker__months" :data-month-count="datePicker.numOfMonths">
          <section
            v-for="monthIndex in datePicker.numOfMonths"
            :key="monthIndex"
            class="kappa-date-picker__month"
          >
            <div class="kappa-date-picker__month-title" role="status" aria-live="polite">
              {{
                datePicker.format(datePicker.getOffset(monthOffset(monthIndex - 1)).visibleRange.start, {
                  month: "long",
                  year: "numeric",
                })
              }}
            </div>
            <DatePickerTable view="day">
              <DatePickerTableHead>
                <DatePickerTableRow>
                  <DatePickerWeekNumberHeaderCell v-if="datePicker.showWeekNumbers">
                    wk
                  </DatePickerWeekNumberHeaderCell>
                  <DatePickerTableHeader
                    v-for="day in datePicker.weekDays"
                    :key="day.long"
                    :aria-label="day.long"
                  >
                    {{ weekdayLabel(day, weekdayFormat) }}
                  </DatePickerTableHeader>
                </DatePickerTableRow>
              </DatePickerTableHead>
              <DatePickerTableBody>
                <DatePickerTableRow
                  v-for="(week, weekIndex) in datePicker.getOffset(monthOffset(monthIndex - 1)).weeks"
                  :key="week.map((day) => day.toString()).join('-')"
                >
                  <DatePickerWeekNumberCell
                    v-if="datePicker.showWeekNumbers"
                    :week="week"
                    :week-index="weekIndex"
                  >
                    {{ datePicker.getWeekNumber(week) }}
                  </DatePickerWeekNumberCell>
                  <DatePickerTableCell
                    v-for="day in week"
                    :key="day.toString()"
                    :value="day"
                    :visible-range="datePicker.getOffset(monthOffset(monthIndex - 1)).visibleRange"
                  >
                    <DatePickerTableCellTrigger>{{ day.day }}</DatePickerTableCellTrigger>
                  </DatePickerTableCell>
                </DatePickerTableRow>
              </DatePickerTableBody>
            </DatePickerTable>
          </section>
        </div>
      </DatePickerView>
    </div>
  </ArkDatePicker.Context>
</template>

<style src="./date-picker.css"></style>
