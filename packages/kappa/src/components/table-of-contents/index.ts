import { tocAnatomy, useToc, useTocContext } from "@ark-ui/vue/toc";
import TableOfContentsContent from "./TableOfContentsContent.vue";
import TableOfContentsContext from "./TableOfContentsContext.vue";
import TableOfContentsIndicator from "./TableOfContentsIndicator.vue";
import TableOfContentsItem from "./TableOfContentsItem.vue";
import TableOfContentsLink from "./TableOfContentsLink.vue";
import TableOfContentsList from "./TableOfContentsList.vue";
import TableOfContentsNav from "./TableOfContentsNav.vue";
import TableOfContentsRoot from "./TableOfContentsRoot.vue";
import TableOfContentsRootProvider from "./TableOfContentsRootProvider.vue";
import TableOfContentsTitle from "./TableOfContentsTitle.vue";

export const TableOfContents = Object.assign(TableOfContentsRoot, {
  Root: TableOfContentsRoot,
  Content: TableOfContentsContent,
  Nav: TableOfContentsNav,
  Title: TableOfContentsTitle,
  List: TableOfContentsList,
  Indicator: TableOfContentsIndicator,
  Item: TableOfContentsItem,
  Link: TableOfContentsLink,
  Context: TableOfContentsContext,
  RootProvider: TableOfContentsRootProvider,
});

export {
  TableOfContentsContent,
  TableOfContentsContext,
  TableOfContentsIndicator,
  TableOfContentsItem,
  TableOfContentsLink,
  TableOfContentsList,
  TableOfContentsNav,
  TableOfContentsRoot,
  TableOfContentsRootProvider,
  TableOfContentsTitle,
};

export type {
  TableOfContentsApi,
  TableOfContentsContentProps,
  TableOfContentsContentSlots,
  TableOfContentsContextProps,
  TableOfContentsContextSlots,
  TableOfContentsContextValue,
  TableOfContentsEmits,
  TableOfContentsIndicatorProps,
  TableOfContentsIndicatorSlots,
  TableOfContentsItemProps,
  TableOfContentsItemSlots,
  TableOfContentsLinkProps,
  TableOfContentsLinkSlots,
  TableOfContentsListProps,
  TableOfContentsListSlots,
  TableOfContentsNavProps,
  TableOfContentsNavSlots,
  TableOfContentsProps,
  TableOfContentsRootProps,
  TableOfContentsRootProviderProps,
  TableOfContentsRootProviderSlots,
  TableOfContentsRootSlots,
  TableOfContentsSlots,
  TableOfContentsTitleProps,
  TableOfContentsTitleSlots,
  TocActiveChangeDetails,
  TocItemData,
  UseTocContext,
  UseTocReturn,
} from "./table-of-contents";

export { tocAnatomy, useToc, useTocContext };
