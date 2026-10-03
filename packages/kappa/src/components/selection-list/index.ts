import SelectionListRoot from "./SelectionList.vue";
import SelectionListContent from "./SelectionListContent.vue";
import SelectionListContext from "./SelectionListContext.vue";
import SelectionListEmpty from "./SelectionListEmpty.vue";
import SelectionListInput from "./SelectionListInput.vue";
import SelectionListItem from "./SelectionListItem.vue";
import SelectionListItemContent from "./SelectionListItemContent.vue";
import SelectionListItemContext from "./SelectionListItemContext.vue";
import SelectionListItemDescription from "./SelectionListItemDescription.vue";
import SelectionListItemGroup from "./SelectionListItemGroup.vue";
import SelectionListItemGroupLabel from "./SelectionListItemGroupLabel.vue";
import SelectionListItemIndicator from "./SelectionListItemIndicator.vue";
import SelectionListItemMedia from "./SelectionListItemMedia.vue";
import SelectionListItemMeta from "./SelectionListItemMeta.vue";
import SelectionListItemText from "./SelectionListItemText.vue";
import SelectionListLabel from "./SelectionListLabel.vue";
import SelectionListRootProvider from "./SelectionListRootProvider.vue";
import SelectionListValueText from "./SelectionListValueText.vue";

export const SelectionList = Object.assign(SelectionListRoot, {
  Root: SelectionListRoot,
  RootProvider: SelectionListRootProvider,
  Label: SelectionListLabel,
  Input: SelectionListInput,
  Content: SelectionListContent,
  Empty: SelectionListEmpty,
  ItemGroup: SelectionListItemGroup,
  ItemGroupLabel: SelectionListItemGroupLabel,
  Item: SelectionListItem,
  ItemMedia: SelectionListItemMedia,
  ItemContent: SelectionListItemContent,
  ItemText: SelectionListItemText,
  ItemDescription: SelectionListItemDescription,
  ItemMeta: SelectionListItemMeta,
  ItemIndicator: SelectionListItemIndicator,
  ValueText: SelectionListValueText,
  Context: SelectionListContext,
  ItemContext: SelectionListItemContext,
});

export {
  SelectionListContent,
  SelectionListContext,
  SelectionListEmpty,
  SelectionListInput,
  SelectionListItem,
  SelectionListItemContent,
  SelectionListItemContext,
  SelectionListItemDescription,
  SelectionListItemGroup,
  SelectionListItemGroupLabel,
  SelectionListItemIndicator,
  SelectionListItemMedia,
  SelectionListItemMeta,
  SelectionListItemText,
  SelectionListLabel,
  SelectionListRoot,
  SelectionListRootProvider,
  SelectionListValueText,
};

export * from "./selection-list";

export {
  createListCollection as createSelectionListCollection,
  listboxAnatomy as selectionListAnatomy,
  useListbox as useSelectionList,
  useListboxContext as useSelectionListContext,
  useListboxItemContext as useSelectionListItemContext,
  type UseListboxProps as UseSelectionListProps,
} from "@ark-ui/vue/listbox";
