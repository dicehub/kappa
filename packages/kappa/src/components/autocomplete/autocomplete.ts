import type {
  CollectionItem,
  ComboboxFocusOutsideEvent,
  ComboboxHighlightChangeDetails,
  ComboboxInputValueChangeDetails,
  ComboboxInteractOutsideEvent,
  ComboboxOpenChangeDetails,
  ComboboxPointerDownOutsideEvent,
  ComboboxRootProps,
  ComboboxSelectionDetails,
  ComboboxValueChangeDetails,
  ListCollection,
} from "@ark-ui/vue/combobox";
import type { InputHTMLAttributes, TeleportProps, VNodeChild } from "vue";

export const AUTOCOMPLETE_SIZES = ["xs", "sm", "base", "lg"] as const;

export type AutocompleteSize = (typeof AUTOCOMPLETE_SIZES)[number];
export type AutocompleteCollection<T extends CollectionItem = CollectionItem> = ListCollection<T>;
export type AutocompletePositioningOptions<T extends CollectionItem = CollectionItem> = NonNullable<
  ComboboxRootProps<T>["positioning"]
>;
export type AutocompleteFilter<T = unknown> = false | ((item: T, inputValue: string) => boolean);
export type AutocompleteItemMapper<T = unknown> = (item: T) => string;
export type AutocompleteItemDisabled<T = unknown> = (item: T) => boolean;
export type AutocompleteInputAttributes = InputHTMLAttributes & {
  "aria-describedby"?: string;
  "aria-label"?: string;
};

export interface AutocompleteProps<T extends CollectionItem = CollectionItem> {
  allowCustomValue?: ComboboxRootProps<T>["allowCustomValue"];
  alwaysSubmitOnEnter?: ComboboxRootProps<T>["alwaysSubmitOnEnter"];
  ariaDescribedby?: string;
  ariaLabel?: string;
  asChild?: ComboboxRootProps<T>["asChild"];
  autoFocus?: ComboboxRootProps<T>["autoFocus"];
  clearable?: boolean;
  closeOnSelect?: ComboboxRootProps<T>["closeOnSelect"];
  collection?: ListCollection<T>;
  composite?: ComboboxRootProps<T>["composite"];
  defaultHighlightedValue?: ComboboxRootProps<T>["defaultHighlightedValue"];
  defaultInputValue?: ComboboxRootProps<T>["defaultInputValue"];
  defaultOpen?: ComboboxRootProps<T>["defaultOpen"];
  defaultValue?: ComboboxRootProps<T>["defaultValue"];
  disableLayer?: ComboboxRootProps<T>["disableLayer"];
  disabled?: ComboboxRootProps<T>["disabled"];
  emptyText?: string;
  filter?: AutocompleteFilter<T>;
  form?: ComboboxRootProps<T>["form"];
  highlightedValue?: ComboboxRootProps<T>["highlightedValue"];
  id?: ComboboxRootProps<T>["id"];
  ids?: ComboboxRootProps<T>["ids"];
  inputBehavior?: ComboboxRootProps<T>["inputBehavior"];
  inputAttrs?: AutocompleteInputAttributes;
  inputValue?: ComboboxRootProps<T>["inputValue"];
  invalid?: ComboboxRootProps<T>["invalid"];
  isItemDisabled?: AutocompleteItemDisabled<T>;
  itemToString?: AutocompleteItemMapper<T>;
  itemToValue?: AutocompleteItemMapper<T>;
  items?: readonly T[];
  label?: string;
  lazyMount?: ComboboxRootProps<T>["lazyMount"];
  loopFocus?: ComboboxRootProps<T>["loopFocus"];
  modelValue?: ComboboxRootProps<T>["modelValue"];
  name?: ComboboxRootProps<T>["name"];
  navigate?: ComboboxRootProps<T>["navigate"];
  open?: ComboboxRootProps<T>["open"];
  openOnChange?: ComboboxRootProps<T>["openOnChange"];
  openOnClick?: ComboboxRootProps<T>["openOnClick"];
  openOnKeyPress?: ComboboxRootProps<T>["openOnKeyPress"];
  placeholder?: string;
  positioning?: ComboboxRootProps<T>["positioning"];
  readOnly?: ComboboxRootProps<T>["readOnly"];
  required?: ComboboxRootProps<T>["required"];
  scrollToIndexFn?: ComboboxRootProps<T>["scrollToIndexFn"];
  selectionBehavior?: ComboboxRootProps<T>["selectionBehavior"];
  showOnEmpty?: boolean;
  showTrigger?: boolean;
  size?: AutocompleteSize;
  translations?: ComboboxRootProps<T>["translations"];
  unmountOnExit?: ComboboxRootProps<T>["unmountOnExit"];
}

export type AutocompleteRootProps<T extends CollectionItem = CollectionItem> = AutocompleteProps<T>;

export type AutocompleteEmits<T extends CollectionItem = CollectionItem> = {
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

export interface AutocompleteSlots<T extends CollectionItem = CollectionItem> {
  default?: (props: { collection: ListCollection<T>; items: T[] }) => VNodeChild;
  item?: (props: { item: T }) => VNodeChild;
}

export interface AutocompleteContentProps {
  /** Set to false to keep the popup in the component's DOM tree. */
  teleport?: boolean;
  /** Teleport target used for the popup. Defaults to `body`. */
  teleportTo?: TeleportProps["to"];
}

export interface AutocompleteInputGroupProps {
  clearable?: boolean;
  inputAttrs?: AutocompleteInputAttributes;
  placeholder?: string;
  showTrigger?: boolean;
  size?: AutocompleteSize;
}

export interface AutocompleteItemProps<T = unknown> {
  item?: T;
  value?: T;
}

export interface AutocompleteListProps<T = unknown> {
  items?: readonly T[];
  renderItems?: boolean;
}

export const isAutocompleteRecord = (item: unknown): item is Record<string, unknown> =>
  typeof item === "object" && item !== null && !Array.isArray(item);

export const getAutocompleteItemString = <T>(item: T, itemToString?: AutocompleteItemMapper<T>) => {
  if (itemToString) return itemToString(item);
  if (isAutocompleteRecord(item) && "label" in item) return String(item.label ?? "");
  return String(item ?? "");
};

export const getAutocompleteItemValue = <T>(
  item: T,
  itemToValue?: AutocompleteItemMapper<T>,
  itemToString?: AutocompleteItemMapper<T>,
) => {
  if (itemToValue) return itemToValue(item);
  if (isAutocompleteRecord(item) && "value" in item && item.value != null) return String(item.value);
  return getAutocompleteItemString(item, itemToString);
};

export const matchesAutocompleteItem = <T>({
  contains,
  filter,
  inputValue,
  item,
  itemToString,
  showOnEmpty,
}: {
  contains: (value: string, query: string) => boolean;
  filter?: AutocompleteFilter<T>;
  inputValue: string;
  item: T;
  itemToString?: AutocompleteItemMapper<T>;
  showOnEmpty: boolean;
}) => {
  const query = inputValue.trim();

  if (!query) return showOnEmpty;
  if (filter === false) return true;
  if (typeof filter === "function") return filter(item, query);
  return contains(getAutocompleteItemString(item, itemToString), query);
};
