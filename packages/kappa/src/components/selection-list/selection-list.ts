import type {
  CollectionItem,
  ListCollection,
  ListboxContentProps as ArkSelectionListContentProps,
  ListboxContextProps as ArkSelectionListContextProps,
  ListboxEmptyProps as ArkSelectionListEmptyProps,
  ListboxHighlightChangeDetails,
  ListboxInputProps as ArkSelectionListInputProps,
  ListboxItemContextProps as ArkSelectionListItemContextProps,
  ListboxItemGroupLabelProps as ArkSelectionListItemGroupLabelProps,
  ListboxItemGroupProps as ArkSelectionListItemGroupProps,
  ListboxItemIndicatorProps as ArkSelectionListItemIndicatorProps,
  ListboxItemProps as ArkSelectionListItemProps,
  ListboxItemTextProps as ArkSelectionListItemTextProps,
  ListboxLabelProps as ArkSelectionListLabelProps,
  ListboxRootProps as ArkSelectionListRootProps,
  ListboxRootProviderProps as ArkSelectionListRootProviderProps,
  ListboxSelectionDetails,
  ListboxSelectionMode,
  ListboxValueChangeDetails,
  ListboxValueTextProps as ArkSelectionListValueTextProps,
  UseListboxContext,
  UseListboxItemContext,
  UseListboxReturn,
} from "@ark-ui/vue/listbox";
import type { HTMLAttributes, UnwrapRef, VNodeChild } from "vue";

export const SELECTION_LIST_SIZES = ["sm", "base"] as const;
export const SELECTION_LIST_DEFAULT_SIZE = "base" satisfies SelectionListSize;

export type SelectionListSize = (typeof SELECTION_LIST_SIZES)[number];
export type SelectionListCollection<T extends CollectionItem = CollectionItem> =
  ListCollection<T>;
export type SelectionListApi<T extends CollectionItem = CollectionItem> = UnwrapRef<
  UseListboxReturn<T>
>;
export type SelectionListContextValue<T extends CollectionItem = CollectionItem> =
  UnwrapRef<UseListboxContext<T>>;
export type SelectionListItemContextValue = UnwrapRef<UseListboxItemContext>;

export type SelectionListProps<T extends CollectionItem = CollectionItem> = Omit<
  ArkSelectionListRootProps<T>,
  "size"
> & {
  /** Visual density for the list and its items. */
  size?: SelectionListSize;
};
export type SelectionListRootProps<T extends CollectionItem = CollectionItem> =
  SelectionListProps<T>;
export type SelectionListRootProviderProps<T extends CollectionItem = CollectionItem> =
  Omit<ArkSelectionListRootProviderProps<T>, "size" | "value"> & {
    size?: SelectionListSize;
    value: SelectionListApi<T>;
  };

export type SelectionListEmits<T extends CollectionItem = CollectionItem> = {
  highlightChange: [details: ListboxHighlightChangeDetails<T>];
  select: [details: ListboxSelectionDetails];
  valueChange: [details: ListboxValueChangeDetails<T>];
  "update:highlightedValue": [value: string | null];
  "update:modelValue": [value: string[]];
};

export interface SelectionListSlots {
  default?: () => VNodeChild;
}

export type SelectionListRootSlots = SelectionListSlots;
export type SelectionListRootProviderSlots = SelectionListSlots;
export type SelectionListLabelProps = ArkSelectionListLabelProps;
export type SelectionListLabelSlots = SelectionListSlots;
export type SelectionListInputProps = ArkSelectionListInputProps;
export type SelectionListInputSlots = SelectionListSlots;
export type SelectionListContentProps = ArkSelectionListContentProps;
export type SelectionListContentSlots = SelectionListSlots;
export type SelectionListEmptyProps = ArkSelectionListEmptyProps;
export type SelectionListEmptySlots = SelectionListSlots;
export type SelectionListItemGroupProps = ArkSelectionListItemGroupProps;
export type SelectionListItemGroupSlots = SelectionListSlots;
export type SelectionListItemGroupLabelProps = ArkSelectionListItemGroupLabelProps;
export type SelectionListItemGroupLabelSlots = SelectionListSlots;
export type SelectionListItemProps = ArkSelectionListItemProps;
export type SelectionListItemSlots = SelectionListSlots;
export type SelectionListItemTextProps = ArkSelectionListItemTextProps;
export type SelectionListItemTextSlots = SelectionListSlots;
export type SelectionListItemIndicatorProps = ArkSelectionListItemIndicatorProps;
export type SelectionListItemIndicatorSlots = SelectionListSlots;
export type SelectionListValueTextProps = ArkSelectionListValueTextProps;
export type SelectionListValueTextSlots = SelectionListSlots;
export type SelectionListContextProps<T extends CollectionItem = CollectionItem> =
  ArkSelectionListContextProps<T>;
export type SelectionListItemContextProps = ArkSelectionListItemContextProps;

export interface SelectionListItemLayoutProps extends /* @vue-ignore */ HTMLAttributes {}
export type SelectionListItemMediaProps = SelectionListItemLayoutProps;
export type SelectionListItemContentProps = SelectionListItemLayoutProps;
export type SelectionListItemDescriptionProps = SelectionListItemLayoutProps;
export type SelectionListItemMetaProps = SelectionListItemLayoutProps;
export type SelectionListItemLayoutSlots = SelectionListSlots;

export interface SelectionListContextSlots<T extends CollectionItem = CollectionItem> {
  default?: (context: SelectionListContextValue<T>) => VNodeChild;
}

export interface SelectionListItemContextSlots {
  default?: (context: SelectionListItemContextValue) => VNodeChild;
}

export const isSelectionListSize = (value: unknown): value is SelectionListSize =>
  typeof value === "string" && SELECTION_LIST_SIZES.includes(value as SelectionListSize);

export const resolveSelectionListSize = (value: unknown): SelectionListSize =>
  isSelectionListSize(value) ? value : SELECTION_LIST_DEFAULT_SIZE;

export type {
  CollectionItem,
  ListCollection,
  ListboxHighlightChangeDetails as SelectionListHighlightChangeDetails,
  ListboxSelectionDetails as SelectionListSelectionDetails,
  ListboxSelectionMode as SelectionListSelectionMode,
  ListboxValueChangeDetails as SelectionListValueChangeDetails,
  UseListboxContext,
  UseListboxItemContext,
  UseListboxReturn,
};
