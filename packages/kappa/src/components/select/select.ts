import type {
  CollectionItem,
  ListCollection,
  SelectClearTriggerProps as ArkSelectClearTriggerProps,
  SelectContentProps as ArkSelectContentProps,
  SelectControlProps as ArkSelectControlProps,
  SelectHiddenSelectProps as ArkSelectHiddenSelectProps,
  SelectIndicatorProps as ArkSelectIndicatorProps,
  SelectItemGroupLabelProps as ArkSelectItemGroupLabelProps,
  SelectItemGroupProps as ArkSelectItemGroupProps,
  SelectItemIndicatorProps as ArkSelectItemIndicatorProps,
  SelectItemProps as ArkSelectItemProps,
  SelectItemTextProps as ArkSelectItemTextProps,
  SelectLabelProps as ArkSelectLabelProps,
  SelectListProps as ArkSelectListProps,
  SelectPositionerProps as ArkSelectPositionerProps,
  SelectRootProps as ArkSelectRootProps,
  SelectRootProviderProps as ArkSelectRootProviderProps,
  SelectRootEmits as ArkSelectRootEmits,
  SelectTriggerProps as ArkSelectTriggerProps,
  SelectValueTextProps as ArkSelectValueTextProps,
  UseSelectContext,
  UseSelectItemContext,
  UseSelectReturn,
} from "@ark-ui/vue/select";
import type { TeleportProps, UnwrapRef, VNodeChild } from "vue";

export const SELECT_SIZES = ["xs", "sm", "base", "lg"] as const;
export const SELECT_DEFAULT_SIZE = "base" satisfies SelectSize;

export type SelectSize = (typeof SELECT_SIZES)[number];
export type SelectDirection = "ltr" | "rtl";
export type SelectCollection<T extends CollectionItem = CollectionItem> = ListCollection<T>;
export type SelectItemMapper<T = unknown> = (item: T) => string;
export type SelectItemDisabled<T = unknown> = (item: T) => boolean;
export type SelectPositioningOptions = NonNullable<
  ArkSelectRootProps<CollectionItem>["positioning"]
>;
export type SelectApi<T extends CollectionItem = CollectionItem> = UnwrapRef<UseSelectReturn<T>>;
export type SelectContextValue<T extends CollectionItem = CollectionItem> = UnwrapRef<
  UseSelectContext<T>
>;
export type SelectItemContextValue = UnwrapRef<UseSelectItemContext>;

export interface SelectProps<T extends CollectionItem = CollectionItem> {
  /** Align the selected option's center with the trigger when viewport space permits. */
  alignItemWithTrigger?: boolean;
  asChild?: ArkSelectRootProps<T>["asChild"];
  autoComplete?: ArkSelectRootProps<T>["autoComplete"];
  ariaDescribedby?: string;
  ariaLabel?: string;
  closeOnSelect?: ArkSelectRootProps<T>["closeOnSelect"];
  collection?: ListCollection<T>;
  composite?: ArkSelectRootProps<T>["composite"];
  defaultHighlightedValue?: ArkSelectRootProps<T>["defaultHighlightedValue"];
  defaultOpen?: ArkSelectRootProps<T>["defaultOpen"];
  defaultValue?: ArkSelectRootProps<T>["defaultValue"];
  description?: string;
  deselectable?: ArkSelectRootProps<T>["deselectable"];
  dir?: SelectDirection;
  disabled?: ArkSelectRootProps<T>["disabled"];
  error?: string;
  form?: ArkSelectRootProps<T>["form"];
  highlightedValue?: ArkSelectRootProps<T>["highlightedValue"];
  id?: ArkSelectRootProps<T>["id"];
  ids?: ArkSelectRootProps<T>["ids"];
  invalid?: ArkSelectRootProps<T>["invalid"];
  isItemDisabled?: SelectItemDisabled<T>;
  itemToString?: SelectItemMapper<T>;
  itemToValue?: SelectItemMapper<T>;
  items?: readonly T[];
  label?: string;
  lazyMount?: ArkSelectRootProps<T>["lazyMount"];
  loopFocus?: ArkSelectRootProps<T>["loopFocus"];
  modelValue?: ArkSelectRootProps<T>["modelValue"];
  multiple?: ArkSelectRootProps<T>["multiple"];
  name?: ArkSelectRootProps<T>["name"];
  open?: ArkSelectRootProps<T>["open"];
  placeholder?: string;
  positioning?: ArkSelectRootProps<T>["positioning"];
  readOnly?: ArkSelectRootProps<T>["readOnly"];
  required?: ArkSelectRootProps<T>["required"];
  scrollToIndexFn?: ArkSelectRootProps<T>["scrollToIndexFn"];
  size?: SelectSize;
  translations?: ArkSelectRootProps<T>["translations"];
  unmountOnExit?: ArkSelectRootProps<T>["unmountOnExit"];
}

export type SelectRootProps<T extends CollectionItem = CollectionItem> = SelectProps<T>;

/** Typed payload emitted with the Ark-backed `select` event. */
export type SelectSelectionDetails<T extends CollectionItem = CollectionItem> =
  ArkSelectRootEmits<T>["select"][0];

export type SelectEmits<T extends CollectionItem = CollectionItem> = {
  exitComplete: ArkSelectRootEmits<T>["exitComplete"];
  focusOutside: ArkSelectRootEmits<T>["focusOutside"];
  highlightChange: ArkSelectRootEmits<T>["highlightChange"];
  interactOutside: ArkSelectRootEmits<T>["interactOutside"];
  openChange: ArkSelectRootEmits<T>["openChange"];
  pointerDownOutside: ArkSelectRootEmits<T>["pointerDownOutside"];
  select: ArkSelectRootEmits<T>["select"];
  valueChange: ArkSelectRootEmits<T>["valueChange"];
  "update:highlightedValue": ArkSelectRootEmits<T>["update:highlightedValue"];
  "update:modelValue": ArkSelectRootEmits<T>["update:modelValue"];
  "update:open": ArkSelectRootEmits<T>["update:open"];
};

export interface SelectSlots<T extends CollectionItem = CollectionItem> {
  default?: (props: { collection: ListCollection<T>; items: T[] }) => VNodeChild;
  description?: () => VNodeChild;
  error?: () => VNodeChild;
  item?: (props: { item: T }) => VNodeChild;
  label?: () => VNodeChild;
}

export type SelectRootSlots<T extends CollectionItem = CollectionItem> = SelectSlots<T>;

export interface SelectRootProviderProps<T extends CollectionItem = CollectionItem> {
  value: SelectApi<T>;
  asChild?: ArkSelectRootProviderProps<T>["asChild"];
  lazyMount?: ArkSelectRootProviderProps<T>["lazyMount"];
  unmountOnExit?: ArkSelectRootProviderProps<T>["unmountOnExit"];
}

export type SelectRootProviderEmits = { exitComplete: [] };
export interface SelectRootProviderSlots {
  default?: () => VNodeChild;
}

export interface SelectPartProps {
  asChild?: boolean;
}

export type SelectClearTriggerProps = ArkSelectClearTriggerProps;
export type SelectControlProps = ArkSelectControlProps;
export type SelectHiddenSelectProps = ArkSelectHiddenSelectProps;
export type SelectIndicatorProps = ArkSelectIndicatorProps;
export type SelectLabelProps = ArkSelectLabelProps;
export type SelectTriggerProps = ArkSelectTriggerProps;
export type SelectValueTextProps = ArkSelectValueTextProps;
export type SelectItemTextProps = ArkSelectItemTextProps;
export type SelectItemIndicatorProps = ArkSelectItemIndicatorProps;
export type SelectContentProps = ArkSelectContentProps;
export type SelectListProps<T extends CollectionItem = CollectionItem> = ArkSelectListProps & {
  items?: readonly T[];
  renderItems?: boolean;
};
export type SelectPositionerPrimitiveProps = ArkSelectPositionerProps;
export type SelectPositionerProps = ArkSelectPositionerProps & {
  /** Keep the popup in the component DOM tree when false. */
  teleport?: boolean;
  /** Target for the popup teleport. */
  teleportTo?: TeleportProps["to"];
};

export interface SelectGroupProps extends ArkSelectItemGroupProps {
  id?: string;
}

export type SelectGroupLabelProps = ArkSelectItemGroupLabelProps;

export interface SelectItemProps<T = unknown> extends Omit<ArkSelectItemProps, "item"> {
  /** Collection item. Prefer this prop when using object collections. */
  item?: T;
  /** Collection value. Resolved through the nearest Select collection when possible. */
  value?: T;
}

export interface SelectItemSlots {
  after?: () => VNodeChild;
  before?: () => VNodeChild;
  default?: () => VNodeChild;
  indicator?: () => VNodeChild;
  text?: () => VNodeChild;
}

export interface SelectItemTextSlots {
  default?: () => VNodeChild;
}

export interface SelectItemIndicatorSlots {
  default?: () => VNodeChild;
}

export interface SelectSeparatorProps {
  orientation?: "horizontal" | "vertical";
}

export type SelectSeparatorSlots = SelectPartSlots;

export interface SelectValueTextSlots {
  default?: () => VNodeChild;
}

export interface SelectPartSlots {
  default?: () => VNodeChild;
}

export type SelectClearTriggerSlots = SelectPartSlots;
export type SelectContentSlots = SelectPartSlots;
export type SelectControlSlots = SelectPartSlots;
export type SelectGroupLabelSlots = SelectPartSlots;
export type SelectGroupSlots = SelectPartSlots;
export type SelectHiddenSelectSlots = SelectPartSlots;
export type SelectIndicatorSlots = SelectPartSlots;
export type SelectLabelSlots = SelectPartSlots;
export type SelectListSlots<T extends CollectionItem = CollectionItem> = {
  default?: (props: { item?: T }) => VNodeChild;
};
export type SelectPositionerSlots = SelectPartSlots;
export type SelectTriggerSlots = SelectPartSlots;

export interface SelectContextSlots<T extends CollectionItem = CollectionItem> {
  default?: (context: SelectContextValue<T>) => VNodeChild;
}

export interface SelectItemContextSlots {
  default?: (context: SelectItemContextValue) => VNodeChild;
}

export const isSelectRecord = (item: unknown): item is Record<string, unknown> =>
  typeof item === "object" && item !== null && !Array.isArray(item);

export const getSelectItemString = <T>(item: T, mapper?: SelectItemMapper<T>): string => {
  if (mapper) return mapper(item);
  if (isSelectRecord(item) && "label" in item) return String(item.label ?? "");
  return String(item ?? "");
};

export const getSelectItemValue = <T>(
  item: T,
  mapper?: SelectItemMapper<T>,
  stringMapper?: SelectItemMapper<T>,
): string => {
  if (mapper) return mapper(item);
  if (isSelectRecord(item) && "value" in item && item.value != null) return String(item.value);
  return getSelectItemString(item, stringMapper);
};

export const getSelectItemDisabled = <T>(item: T, mapper?: SelectItemDisabled<T>): boolean => {
  if (mapper) return mapper(item);
  return isSelectRecord(item) && item.disabled === true;
};

export const getSelectContentLabel = (value: unknown, fallback = "Select an option"): string =>
  value == null || value === "" ? fallback : String(value);
