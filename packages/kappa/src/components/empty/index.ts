import EmptyRoot from "./Empty.vue";
import EmptyContent from "./EmptyContent.vue";
import EmptyDescription from "./EmptyDescription.vue";
import EmptyHeader from "./EmptyHeader.vue";
import EmptyMedia from "./EmptyMedia.vue";
import EmptyTitle from "./EmptyTitle.vue";

export const Empty = Object.assign(EmptyRoot, {
  Root: EmptyRoot,
  Header: EmptyHeader,
  Media: EmptyMedia,
  Title: EmptyTitle,
  Description: EmptyDescription,
  Content: EmptyContent,
});

export {
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyRoot,
  EmptyTitle,
};

export {
  EMPTY_DEFAULT_SIZE,
  EMPTY_MEDIA_DEFAULT_VARIANT,
  EMPTY_MEDIA_VARIANTS,
  EMPTY_SIZES,
  EMPTY_TITLE_DEFAULT_ELEMENT,
  EMPTY_TITLE_ELEMENTS,
  isEmptyMediaVariant,
  isEmptySize,
  isEmptyTitleElement,
  resolveEmptyMediaVariant,
  resolveEmptySize,
  resolveEmptyTitleElement,
  type EmptyContentSlots,
  type EmptyDescriptionSlots,
  type EmptyHeaderSlots,
  type EmptyMediaProps,
  type EmptyMediaSlots,
  type EmptyMediaVariant,
  type EmptyProps,
  type EmptyRootProps,
  type EmptyRootSlots,
  type EmptySize,
  type EmptySlots,
  type EmptyTitleElement,
  type EmptyTitleProps,
  type EmptyTitleSlots,
} from "./empty";
