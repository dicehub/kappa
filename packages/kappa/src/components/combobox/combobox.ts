import type {
  CollectionItem,
  ComboboxFocusOutsideEvent,
  ComboboxHighlightChangeDetails,
  ComboboxInputValueChangeDetails,
  ComboboxInteractOutsideEvent,
  ComboboxOpenChangeDetails,
  ComboboxPointerDownOutsideEvent,
  ComboboxRootProps as ArkComboboxRootProps,
  ComboboxSelectionDetails,
  ComboboxValueChangeDetails,
  ListCollection,
} from "@ark-ui/vue/combobox";
import type { InputHTMLAttributes, TeleportProps, VNodeChild } from "vue";

export const COMBOBOX_SIZES = ["xs", "sm", "base", "lg"] as const;

export type ComboboxSize = (typeof COMBOBOX_SIZES)[number];
export type ComboboxCollection<T extends CollectionItem = CollectionItem> = ListCollection<T>;
export type ComboboxItemMapper<T> = (item: T) => string;
export type ComboboxItemDisabled<T> = (item: T) => boolean;
export type ComboboxFilter<T> = false | ((item: T, query: string) => boolean);
export type ComboboxInputAttributes = Omit<InputHTMLAttributes, "size">;
export type ComboboxPositioningOptions = NonNullable<
  ArkComboboxRootProps<CollectionItem>["positioning"]
>;

export interface ComboboxProps<T extends CollectionItem = CollectionItem> {
  allowCustomValue?: ArkComboboxRootProps<T>["allowCustomValue"];
  alwaysSubmitOnEnter?: ArkComboboxRootProps<T>["alwaysSubmitOnEnter"];
  ariaDescribedby?: string;
  ariaLabel?: string;
  asChild?: ArkComboboxRootProps<T>["asChild"];
  autoFocus?: ArkComboboxRootProps<T>["autoFocus"];
  clearable?: boolean;
  closeOnSelect?: ArkComboboxRootProps<T>["closeOnSelect"];
  collection?: ListCollection<T>;
  composite?: ArkComboboxRootProps<T>["composite"];
  defaultHighlightedValue?: ArkComboboxRootProps<T>["defaultHighlightedValue"];
  defaultInputValue?: ArkComboboxRootProps<T>["defaultInputValue"];
  defaultOpen?: ArkComboboxRootProps<T>["defaultOpen"];
  defaultValue?: ArkComboboxRootProps<T>["defaultValue"];
  description?: string;
  disableLayer?: ArkComboboxRootProps<T>["disableLayer"];
  disabled?: ArkComboboxRootProps<T>["disabled"];
  emptyText?: string;
  error?: string;
  filter?: ComboboxFilter<T>;
  form?: ArkComboboxRootProps<T>["form"];
  highlightedValue?: ArkComboboxRootProps<T>["highlightedValue"];
  id?: ArkComboboxRootProps<T>["id"];
  ids?: ArkComboboxRootProps<T>["ids"];
  inputAttrs?: ComboboxInputAttributes;
  inputBehavior?: ArkComboboxRootProps<T>["inputBehavior"];
  inputValue?: ArkComboboxRootProps<T>["inputValue"];
  invalid?: ArkComboboxRootProps<T>["invalid"];
  isItemDisabled?: ComboboxItemDisabled<T>;
  itemToString?: ComboboxItemMapper<T>;
  itemToValue?: ComboboxItemMapper<T>;
  items?: readonly T[];
  label?: string;
  lazyMount?: ArkComboboxRootProps<T>["lazyMount"];
  loopFocus?: ArkComboboxRootProps<T>["loopFocus"];
  modelValue?: ArkComboboxRootProps<T>["modelValue"];
  multiple?: ArkComboboxRootProps<T>["multiple"];
  name?: ArkComboboxRootProps<T>["name"];
  navigate?: ArkComboboxRootProps<T>["navigate"];
  open?: ArkComboboxRootProps<T>["open"];
  openOnChange?: ArkComboboxRootProps<T>["openOnChange"];
  openOnClick?: ArkComboboxRootProps<T>["openOnClick"];
  openOnKeyPress?: ArkComboboxRootProps<T>["openOnKeyPress"];
  placeholder?: string;
  positioning?: ArkComboboxRootProps<T>["positioning"];
  readOnly?: ArkComboboxRootProps<T>["readOnly"];
  required?: ArkComboboxRootProps<T>["required"];
  scrollToIndexFn?: ArkComboboxRootProps<T>["scrollToIndexFn"];
  selectionBehavior?: ArkComboboxRootProps<T>["selectionBehavior"];
  showOnEmpty?: boolean;
  size?: ComboboxSize;
  translations?: ArkComboboxRootProps<T>["translations"];
  unmountOnExit?: ArkComboboxRootProps<T>["unmountOnExit"];
}

export type ComboboxRootProps<T extends CollectionItem = CollectionItem> = ComboboxProps<T>;

export type ComboboxEmits<T extends CollectionItem = CollectionItem> = {
  exitComplete: [];
  focusOutside: [event: ComboboxFocusOutsideEvent];
  highlightChange: [details: ComboboxHighlightChangeDetails<T>];
  inputValueChange: [details: ComboboxInputValueChangeDetails];
  interactOutside: [event: ComboboxInteractOutsideEvent];
  openChange: [details: ComboboxOpenChangeDetails];
  pointerDownOutside: [event: ComboboxPointerDownOutsideEvent];
  select: [details: ComboboxSelectionDetails];
  valueChange: [details: ComboboxValueChangeDetails<T>];
  "update:highlightedValue": [value: string | null];
  "update:inputValue": [value: string];
  "update:modelValue": [value: string[]];
  "update:open": [value: boolean];
};

export interface ComboboxSlots<T extends CollectionItem = CollectionItem> {
  default?: (props: { collection: ListCollection<T>; items: T[] }) => VNodeChild;
  item?: (props: { item: T }) => VNodeChild;
}

export const COMBOBOX_POSITIONING_KEYS = [
  "applyStyles",
  "arrowPadding",
  "boundary",
  "fitViewport",
  "flip",
  "getAnchorElement",
  "getAnchorRect",
  "gutter",
  "hideWhenDetached",
  "listeners",
  "offset",
  "onComplete",
  "onPositioned",
  "overflowPadding",
  "overlap",
  "placement",
  "restoreStyles",
  "sameWidth",
  "shift",
  "sizeMiddleware",
  "slide",
  "strategy",
  "updatePosition",
] as const satisfies readonly (keyof ComboboxPositioningOptions)[];

type AssertNoPositioningKeys<T extends never> = T;
type MissingPositioningKeys = Exclude<
  keyof ComboboxPositioningOptions,
  (typeof COMBOBOX_POSITIONING_KEYS)[number]
>;
type ExtraPositioningKeys = Exclude<
  (typeof COMBOBOX_POSITIONING_KEYS)[number],
  keyof ComboboxPositioningOptions
>;

export type ComboboxPositioningCoverage = [
  AssertNoPositioningKeys<MissingPositioningKeys>,
  AssertNoPositioningKeys<ExtraPositioningKeys>,
];

export type ComboboxContentProps = ComboboxPositioningOptions & {
  /** Keep the popup in the component DOM tree when false. */
  teleport?: boolean;
  /** Target for the popup teleport. */
  teleportTo?: TeleportProps["to"];
};

export interface ComboboxControlProps {
  size?: ComboboxSize;
}

export interface ComboboxInputProps {
  asChild?: boolean;
}

export interface ComboboxTriggerInputProps {
  asChild?: boolean;
  clearable?: boolean;
  inputAttrs?: ComboboxInputAttributes;
  placeholder?: string;
  showTrigger?: boolean;
  size?: ComboboxSize;
}

export interface ComboboxTriggerValueProps {
  asChild?: boolean;
  placeholder?: string;
  size?: ComboboxSize;
}

export interface ComboboxTriggerMultipleWithInputProps {
  clearable?: boolean;
  inputAttrs?: ComboboxInputAttributes;
  inputSide?: "right" | "top";
  placeholder?: string;
  showTrigger?: boolean;
  size?: ComboboxSize;
}

export interface ComboboxItemProps<T = unknown> {
  item?: T;
  value?: T;
}

export interface ComboboxListProps<T = unknown> {
  items?: readonly T[];
  renderItems?: boolean;
}

export interface ComboboxChipProps<T = unknown> {
  item?: T;
  removable?: boolean;
  value?: string;
}

export interface ComboboxValueProps {
  placeholder?: string;
}

export const isComboboxRecord = (item: unknown): item is Record<string, unknown> =>
  typeof item === "object" && item !== null && !Array.isArray(item);

export const getComboboxItemString = <T>(item: T, mapper?: ComboboxItemMapper<T>) => {
  if (mapper) return mapper(item);
  if (isComboboxRecord(item) && "label" in item) return String(item.label ?? "");
  return String(item ?? "");
};

export const getComboboxItemValue = <T>(
  item: T,
  mapper?: ComboboxItemMapper<T>,
  stringMapper?: ComboboxItemMapper<T>,
) => {
  if (mapper) return mapper(item);
  if (isComboboxRecord(item) && "value" in item && item.value != null) return String(item.value);
  return getComboboxItemString(item, stringMapper);
};

export const getComboboxItemDisabled = <T>(item: T, mapper?: ComboboxItemDisabled<T>) => {
  if (mapper) return mapper(item);
  return isComboboxRecord(item) && item.disabled === true;
};

export const matchesComboboxItem = <T>({
  contains,
  filter,
  item,
  itemToString,
  query,
  showOnEmpty,
}: {
  contains: (value: string, query: string) => boolean;
  filter?: ComboboxFilter<T>;
  item: T;
  itemToString?: ComboboxItemMapper<T>;
  query: string;
  showOnEmpty: boolean;
}) => {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) return showOnEmpty;
  if (filter === false) return true;
  if (typeof filter === "function") return filter(item, normalizedQuery);
  return contains(getComboboxItemString(item, itemToString), normalizedQuery);
};

export const getComboboxContentPositioning = (props: ComboboxContentProps): ComboboxPositioningOptions => {
  const positioning: ComboboxPositioningOptions = {};

  for (const key of COMBOBOX_POSITIONING_KEYS) {
    const value = props[key];
    if (value !== undefined) (positioning as Record<string, unknown>)[key] = value;
  }

  return positioning;
};

export const mergeComboboxPositioning = (
  root?: ComboboxPositioningOptions,
  content?: ComboboxPositioningOptions,
): ComboboxPositioningOptions => ({ ...root, ...content });
