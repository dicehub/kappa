import type {
  DatePickerDateRangePreset,
  DatePickerFocusChangeDetails,
  DatePickerOpenChangeDetails,
  DatePickerRootProps as ArkDatePickerRootProps,
  DatePickerValueChangeDetails,
  DatePickerViewChangeDetails,
  DatePickerVisibleRangeChangeDetails,
  DateValue,
  UseDatePickerContext,
  UseDatePickerReturn,
} from "@ark-ui/vue/date-picker";
import type { UnwrapRef, VNodeChild } from "vue";

export type {
  DatePickerDateRangePreset,
  DatePickerDateView,
  DatePickerFocusChangeDetails,
  DatePickerOpenChangeDetails,
  DatePickerSelectionMode,
  DatePickerValueChangeDetails,
  DatePickerViewChangeDetails,
  DatePickerVisibleRangeChangeDetails,
  DateValue,
} from "@ark-ui/vue/date-picker";

export type DatePickerContextValue = UnwrapRef<UseDatePickerContext>;
export type DatePickerApi = UnwrapRef<UseDatePickerReturn>;

// Zag formats preset labels as `select ${start} to ${end}`, which leaves a dangling "to" for
// single-date presets. Kappa ships a corrected default; consumer translations still win.
export const resolveDatePickerPresetTriggerLabel = (valueAsString: string[]): string =>
  valueAsString.length > 1
    ? `select ${valueAsString[0]} to ${valueAsString[valueAsString.length - 1]}`
    : `select ${valueAsString[0]}`;

type DatePickerIntlTranslations = NonNullable<ArkDatePickerRootProps["translations"]>;

export const resolveDatePickerTranslations = (
  translations: ArkDatePickerRootProps["translations"],
): DatePickerIntlTranslations => {
  const partial = translations as Partial<DatePickerIntlTranslations> | undefined;
  return {
    ...partial,
    presetTrigger: partial?.presetTrigger ?? resolveDatePickerPresetTriggerLabel,
  } as DatePickerIntlTranslations;
};

export interface DatePickerProps {
  asChild?: ArkDatePickerRootProps["asChild"];
  closeOnSelect?: ArkDatePickerRootProps["closeOnSelect"];
  createCalendar?: ArkDatePickerRootProps["createCalendar"];
  defaultFocusedValue?: ArkDatePickerRootProps["defaultFocusedValue"];
  defaultOpen?: ArkDatePickerRootProps["defaultOpen"];
  defaultValue?: ArkDatePickerRootProps["defaultValue"];
  defaultView?: ArkDatePickerRootProps["defaultView"];
  disabled?: ArkDatePickerRootProps["disabled"];
  fixedWeeks?: ArkDatePickerRootProps["fixedWeeks"];
  focusedValue?: ArkDatePickerRootProps["focusedValue"];
  format?: ArkDatePickerRootProps["format"];
  id?: ArkDatePickerRootProps["id"];
  ids?: ArkDatePickerRootProps["ids"];
  inline?: ArkDatePickerRootProps["inline"];
  invalid?: ArkDatePickerRootProps["invalid"];
  isDateUnavailable?: ArkDatePickerRootProps["isDateUnavailable"];
  lazyMount?: ArkDatePickerRootProps["lazyMount"];
  locale?: ArkDatePickerRootProps["locale"];
  max?: ArkDatePickerRootProps["max"];
  maxSelectedDates?: ArkDatePickerRootProps["maxSelectedDates"];
  maxView?: ArkDatePickerRootProps["maxView"];
  min?: ArkDatePickerRootProps["min"];
  minView?: ArkDatePickerRootProps["minView"];
  modelValue?: ArkDatePickerRootProps["modelValue"];
  name?: ArkDatePickerRootProps["name"];
  numOfMonths?: ArkDatePickerRootProps["numOfMonths"];
  open?: ArkDatePickerRootProps["open"];
  openOnClick?: ArkDatePickerRootProps["openOnClick"];
  outsideDaySelectable?: ArkDatePickerRootProps["outsideDaySelectable"];
  parse?: ArkDatePickerRootProps["parse"];
  placeholder?: ArkDatePickerRootProps["placeholder"];
  positioning?: ArkDatePickerRootProps["positioning"];
  readOnly?: ArkDatePickerRootProps["readOnly"];
  required?: ArkDatePickerRootProps["required"];
  selectionMode?: ArkDatePickerRootProps["selectionMode"];
  showWeekNumbers?: ArkDatePickerRootProps["showWeekNumbers"];
  startOfWeek?: ArkDatePickerRootProps["startOfWeek"];
  timeZone?: ArkDatePickerRootProps["timeZone"];
  translations?: ArkDatePickerRootProps["translations"];
  unmountOnExit?: ArkDatePickerRootProps["unmountOnExit"];
  view?: ArkDatePickerRootProps["view"];
}

export type DatePickerRootProps = DatePickerProps;

export type DatePickerEmits = {
  exitComplete: [];
  focusChange: [details: DatePickerFocusChangeDetails];
  openChange: [details: DatePickerOpenChangeDetails];
  "update:focusedValue": [focusedValue: DateValue];
  "update:modelValue": [value: DateValue[]];
  "update:open": [open: boolean];
  "update:view": [view: ArkDatePickerRootProps["view"]];
  valueChange: [details: DatePickerValueChangeDetails];
  viewChange: [details: DatePickerViewChangeDetails];
  visibleRangeChange: [details: DatePickerVisibleRangeChangeDetails];
};

export interface DatePickerSlots {
  default?: () => VNodeChild;
}

export type DatePickerRootSlots = DatePickerSlots;

export interface DatePickerRootProviderProps {
  value: DatePickerApi;
  asChild?: boolean;
}

export interface DatePickerRootProviderSlots {
  default?: () => VNodeChild;
}

export interface DatePickerPartProps {
  asChild?: boolean;
}

export type DatePickerLabelProps = DatePickerPartProps;
export type DatePickerControlProps = DatePickerPartProps;
export type DatePickerTriggerProps = DatePickerPartProps;
export type DatePickerClearTriggerProps = DatePickerPartProps;
export type DatePickerViewControlProps = DatePickerPartProps;
export type DatePickerViewTriggerProps = DatePickerPartProps;
export type DatePickerPrevTriggerProps = DatePickerPartProps;
export type DatePickerNextTriggerProps = DatePickerPartProps;
export type DatePickerRangeTextProps = DatePickerPartProps;
export type DatePickerPresetTriggerBaseProps = DatePickerPartProps;
export type DatePickerMonthSelectProps = DatePickerPartProps;
export type DatePickerYearSelectProps = DatePickerPartProps;
export type DatePickerTableHeadProps = DatePickerPartProps;
export type DatePickerTableHeaderProps = DatePickerPartProps;
export type DatePickerTableBodyProps = DatePickerPartProps;
export type DatePickerTableRowProps = DatePickerPartProps;
export type DatePickerTableCellTriggerProps = DatePickerPartProps;
export type DatePickerWeekNumberHeaderCellProps = DatePickerPartProps;

export interface DatePickerInputProps extends DatePickerPartProps {
  index?: number;
}

export interface DatePickerViewProps extends DatePickerPartProps {
  view: "day" | "month" | "year";
}

export interface DatePickerTableProps extends DatePickerPartProps {
  view?: "day" | "month" | "year";
  columns?: number;
}

export interface DatePickerTableCellProps extends DatePickerPartProps {
  value: DateValue;
  disabled?: boolean;
  visibleRange?: { start: DateValue; end: DateValue };
}

export interface DatePickerWeekNumberCellProps extends DatePickerPartProps {
  week: DateValue[];
  weekIndex: number;
}

export interface DatePickerValueTextProps extends DatePickerPartProps {
  placeholder?: string;
}

export interface DatePickerPresetTriggerProps extends DatePickerPartProps {
  value: DateValue[] | DatePickerDateRangePreset;
}

export interface DatePickerContentProps {
  asChild?: boolean;
  teleport?: boolean;
  teleportTo?: string | HTMLElement;
}

export interface DatePickerCalendarProps {
  weekdayFormat?: "narrow" | "short";
}

export interface DatePickerLabelSlots {
  default?: () => VNodeChild;
}

export interface DatePickerControlSlots {
  default?: () => VNodeChild;
}

export interface DatePickerInputSlots {
  default?: () => VNodeChild;
}

export interface DatePickerTriggerSlots {
  default?: () => VNodeChild;
}

export interface DatePickerClearTriggerSlots {
  default?: () => VNodeChild;
}

export interface DatePickerContentSlots {
  default?: () => VNodeChild;
}

export interface DatePickerViewSlots {
  default?: () => VNodeChild;
}

export interface DatePickerViewControlSlots {
  default?: () => VNodeChild;
}

export interface DatePickerViewTriggerSlots {
  default?: () => VNodeChild;
}

export interface DatePickerPrevTriggerSlots {
  default?: () => VNodeChild;
}

export interface DatePickerNextTriggerSlots {
  default?: () => VNodeChild;
}

export interface DatePickerTableSlots {
  default?: () => VNodeChild;
}

export interface DatePickerTableHeadSlots {
  default?: () => VNodeChild;
}

export interface DatePickerTableHeaderSlots {
  default?: () => VNodeChild;
}

export interface DatePickerTableBodySlots {
  default?: () => VNodeChild;
}

export interface DatePickerTableRowSlots {
  default?: () => VNodeChild;
}

export interface DatePickerTableCellSlots {
  default?: () => VNodeChild;
}

export interface DatePickerTableCellTriggerSlots {
  default?: () => VNodeChild;
}

export interface DatePickerWeekNumberCellSlots {
  default?: () => VNodeChild;
}

export interface DatePickerWeekNumberHeaderCellSlots {
  default?: () => VNodeChild;
}

export interface DatePickerValueTextSlots {
  default?: (props: {
    value: DateValue;
    index: number;
    valueAsString: string;
    remove: () => void;
  }) => VNodeChild;
}

export interface DatePickerRangeTextSlots {
  default?: () => VNodeChild;
}

export interface DatePickerPresetTriggerSlots {
  default?: () => VNodeChild;
}

export interface DatePickerMonthSelectSlots {
  default?: () => VNodeChild;
}

export interface DatePickerYearSelectSlots {
  default?: () => VNodeChild;
}

export interface DatePickerCalendarSlots {
  default?: () => VNodeChild;
  navigation?: () => VNodeChild;
}

export interface DatePickerContextSlots {
  default?: (context: DatePickerContextValue) => VNodeChild;
}
