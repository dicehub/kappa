import DatePickerRoot from "./DatePicker.vue";
import DatePickerCalendar from "./DatePickerCalendar.vue";
import DatePickerClearTrigger from "./DatePickerClearTrigger.vue";
import DatePickerContent from "./DatePickerContent.vue";
import DatePickerContext from "./DatePickerContext.vue";
import DatePickerControl from "./DatePickerControl.vue";
import DatePickerInput from "./DatePickerInput.vue";
import DatePickerLabel from "./DatePickerLabel.vue";
import DatePickerMonthSelect from "./DatePickerMonthSelect.vue";
import DatePickerNextTrigger from "./DatePickerNextTrigger.vue";
import DatePickerPresetTrigger from "./DatePickerPresetTrigger.vue";
import DatePickerPrevTrigger from "./DatePickerPrevTrigger.vue";
import DatePickerRangeText from "./DatePickerRangeText.vue";
import DatePickerRootProvider from "./DatePickerRootProvider.vue";
import DatePickerTable from "./DatePickerTable.vue";
import DatePickerTableBody from "./DatePickerTableBody.vue";
import DatePickerTableCell from "./DatePickerTableCell.vue";
import DatePickerTableCellTrigger from "./DatePickerTableCellTrigger.vue";
import DatePickerTableHead from "./DatePickerTableHead.vue";
import DatePickerTableHeader from "./DatePickerTableHeader.vue";
import DatePickerTableRow from "./DatePickerTableRow.vue";
import DatePickerTrigger from "./DatePickerTrigger.vue";
import DatePickerValueText from "./DatePickerValueText.vue";
import DatePickerView from "./DatePickerView.vue";
import DatePickerViewControl from "./DatePickerViewControl.vue";
import DatePickerViewTrigger from "./DatePickerViewTrigger.vue";
import DatePickerWeekNumberCell from "./DatePickerWeekNumberCell.vue";
import DatePickerWeekNumberHeaderCell from "./DatePickerWeekNumberHeaderCell.vue";
import DatePickerYearSelect from "./DatePickerYearSelect.vue";

export const DatePicker = Object.assign(DatePickerRoot, {
  Root: DatePickerRoot,
  RootProvider: DatePickerRootProvider,
  Label: DatePickerLabel,
  Control: DatePickerControl,
  Input: DatePickerInput,
  Trigger: DatePickerTrigger,
  ClearTrigger: DatePickerClearTrigger,
  Content: DatePickerContent,
  Calendar: DatePickerCalendar,
  View: DatePickerView,
  ViewControl: DatePickerViewControl,
  ViewTrigger: DatePickerViewTrigger,
  PrevTrigger: DatePickerPrevTrigger,
  NextTrigger: DatePickerNextTrigger,
  Table: DatePickerTable,
  TableHead: DatePickerTableHead,
  TableHeader: DatePickerTableHeader,
  TableBody: DatePickerTableBody,
  TableRow: DatePickerTableRow,
  TableCell: DatePickerTableCell,
  TableCellTrigger: DatePickerTableCellTrigger,
  WeekNumberCell: DatePickerWeekNumberCell,
  WeekNumberHeaderCell: DatePickerWeekNumberHeaderCell,
  ValueText: DatePickerValueText,
  RangeText: DatePickerRangeText,
  PresetTrigger: DatePickerPresetTrigger,
  MonthSelect: DatePickerMonthSelect,
  YearSelect: DatePickerYearSelect,
  Context: DatePickerContext,
});

export {
  DatePickerCalendar,
  DatePickerClearTrigger,
  DatePickerContent,
  DatePickerContext,
  DatePickerControl,
  DatePickerInput,
  DatePickerLabel,
  DatePickerMonthSelect,
  DatePickerNextTrigger,
  DatePickerPresetTrigger,
  DatePickerPrevTrigger,
  DatePickerRangeText,
  DatePickerRoot,
  DatePickerRootProvider,
  DatePickerTable,
  DatePickerTableBody,
  DatePickerTableCell,
  DatePickerTableCellTrigger,
  DatePickerTableHead,
  DatePickerTableHeader,
  DatePickerTableRow,
  DatePickerTrigger,
  DatePickerValueText,
  DatePickerView,
  DatePickerViewControl,
  DatePickerViewTrigger,
  DatePickerWeekNumberCell,
  DatePickerWeekNumberHeaderCell,
  DatePickerYearSelect,
};

export type {
  DatePickerApi,
  DatePickerCalendarProps,
  DatePickerCalendarSlots,
  DatePickerClearTriggerProps,
  DatePickerClearTriggerSlots,
  DatePickerContentProps,
  DatePickerContentSlots,
  DatePickerContextSlots,
  DatePickerContextValue,
  DatePickerControlProps,
  DatePickerControlSlots,
  DatePickerDateRangePreset,
  DatePickerDateView,
  DatePickerEmits,
  DatePickerFocusChangeDetails,
  DatePickerInputProps,
  DatePickerInputSlots,
  DatePickerLabelProps,
  DatePickerLabelSlots,
  DatePickerMonthSelectProps,
  DatePickerMonthSelectSlots,
  DatePickerNextTriggerProps,
  DatePickerNextTriggerSlots,
  DatePickerOpenChangeDetails,
  DatePickerPartProps,
  DatePickerPresetTriggerProps,
  DatePickerPresetTriggerSlots,
  DatePickerPrevTriggerProps,
  DatePickerPrevTriggerSlots,
  DatePickerProps,
  DatePickerRangeTextProps,
  DatePickerRangeTextSlots,
  DatePickerRootProps,
  DatePickerRootProviderProps,
  DatePickerRootProviderSlots,
  DatePickerRootSlots,
  DatePickerSelectionMode,
  DatePickerSlots,
  DatePickerTableBodyProps,
  DatePickerTableBodySlots,
  DatePickerTableCellProps,
  DatePickerTableCellSlots,
  DatePickerTableCellTriggerProps,
  DatePickerTableCellTriggerSlots,
  DatePickerTableHeadProps,
  DatePickerTableHeadSlots,
  DatePickerTableHeaderProps,
  DatePickerTableHeaderSlots,
  DatePickerTableProps,
  DatePickerTableRowProps,
  DatePickerTableRowSlots,
  DatePickerTableSlots,
  DatePickerTriggerProps,
  DatePickerTriggerSlots,
  DatePickerValueChangeDetails,
  DatePickerValueTextProps,
  DatePickerValueTextSlots,
  DatePickerViewChangeDetails,
  DatePickerViewControlProps,
  DatePickerViewControlSlots,
  DatePickerViewProps,
  DatePickerViewSlots,
  DatePickerViewTriggerProps,
  DatePickerViewTriggerSlots,
  DatePickerVisibleRangeChangeDetails,
  DatePickerWeekNumberCellProps,
  DatePickerWeekNumberCellSlots,
  DatePickerWeekNumberHeaderCellProps,
  DatePickerWeekNumberHeaderCellSlots,
  DatePickerYearSelectProps,
  DatePickerYearSelectSlots,
  DateValue,
} from "./date-picker";

export {
  datePickerAnatomy,
  parseDate,
  useDatePicker,
  useDatePickerContext,
  type UseDatePickerProps,
  type UseDatePickerReturn,
} from "@ark-ui/vue/date-picker";
