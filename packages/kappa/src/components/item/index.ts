import ItemRoot from "./Item.vue";
import ItemActions from "./ItemActions.vue";
import ItemContent from "./ItemContent.vue";
import ItemDescription from "./ItemDescription.vue";
import ItemFooter from "./ItemFooter.vue";
import ItemGroup from "./ItemGroup.vue";
import ItemHeader from "./ItemHeader.vue";
import ItemMedia from "./ItemMedia.vue";
import ItemSeparator from "./ItemSeparator.vue";
import ItemTitle from "./ItemTitle.vue";

export const Item = Object.assign(ItemRoot, {
  Root: ItemRoot,
  Group: ItemGroup,
  Separator: ItemSeparator,
  Media: ItemMedia,
  Content: ItemContent,
  Title: ItemTitle,
  Description: ItemDescription,
  Actions: ItemActions,
  Header: ItemHeader,
  Footer: ItemFooter,
});

export {
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemRoot,
  ItemSeparator,
  ItemTitle,
};

export {
  ITEM_DEFAULT_SIZE,
  ITEM_DEFAULT_VARIANT,
  ITEM_MEDIA_DEFAULT_VARIANT,
  ITEM_MEDIA_VARIANTS,
  ITEM_ROOT_DEFAULT_ELEMENT,
  ITEM_ROOT_ELEMENTS,
  ITEM_SIZES,
  ITEM_TITLE_DEFAULT_ELEMENT,
  ITEM_TITLE_ELEMENTS,
  ITEM_VARIANTS,
  isItemMediaVariant,
  isItemRootElement,
  isItemSize,
  isItemTitleElement,
  isItemVariant,
  resolveItemMediaVariant,
  resolveItemRootElement,
  resolveItemSize,
  resolveItemTitleElement,
  resolveItemVariant,
  type ItemActionsProps,
  type ItemActionsSlots,
  type ItemContentProps,
  type ItemContentSlots,
  type ItemDescriptionProps,
  type ItemDescriptionSlots,
  type ItemFooterProps,
  type ItemFooterSlots,
  type ItemGroupProps,
  type ItemGroupSlots,
  type ItemMediaProps,
  type ItemMediaSlots,
  type ItemMediaVariant,
  type ItemPartSlots,
  type ItemProps,
  type ItemRootElement,
  type ItemRootProps,
  type ItemRootSlots,
  type ItemSeparatorProps,
  type ItemSize,
  type ItemSlots,
  type ItemTitleElement,
  type ItemTitleProps,
  type ItemTitleSlots,
  type ItemVariant,
  type ItemHeaderProps,
  type ItemHeaderSlots,
} from "./item";
