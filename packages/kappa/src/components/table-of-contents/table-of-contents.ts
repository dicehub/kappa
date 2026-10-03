import type {
  TocActiveChangeDetails,
  TocContentProps as ArkTocContentProps,
  TocContextProps as ArkTocContextProps,
  TocIndicatorProps as ArkTocIndicatorProps,
  TocItemData,
  TocItemProps as ArkTocItemProps,
  TocLinkProps as ArkTocLinkProps,
  TocListProps as ArkTocListProps,
  TocNavProps as ArkTocNavProps,
  TocRootProps as ArkTocRootProps,
  TocRootProviderProps as ArkTocRootProviderProps,
  TocTitleProps as ArkTocTitleProps,
  UseTocContext,
  UseTocReturn,
} from "@ark-ui/vue/toc";
import type { UnwrapRef, VNodeChild } from "vue";

export type TableOfContentsApi = UnwrapRef<UseTocReturn>;
export type TableOfContentsContextValue = UnwrapRef<UseTocContext>;

export type TableOfContentsRootProps = ArkTocRootProps;
export type TableOfContentsContentProps = ArkTocContentProps;
export type TableOfContentsNavProps = ArkTocNavProps;
export type TableOfContentsTitleProps = ArkTocTitleProps;
export type TableOfContentsListProps = ArkTocListProps;
export type TableOfContentsIndicatorProps = ArkTocIndicatorProps;
export type TableOfContentsItemProps = ArkTocItemProps;
export type TableOfContentsLinkProps = ArkTocLinkProps;
export type TableOfContentsContextProps = ArkTocContextProps;
export type TableOfContentsRootProviderProps = ArkTocRootProviderProps;

export type TableOfContentsProps = TableOfContentsRootProps;
export type TableOfContentsEmits = {
  activeChange: [details: TocActiveChangeDetails];
};

export interface TableOfContentsSlots {
  default?: () => VNodeChild;
}

export type TableOfContentsRootSlots = TableOfContentsSlots;
export type TableOfContentsContentSlots = TableOfContentsSlots;
export type TableOfContentsNavSlots = TableOfContentsSlots;
export type TableOfContentsTitleSlots = TableOfContentsSlots;
export type TableOfContentsListSlots = TableOfContentsSlots;
export type TableOfContentsIndicatorSlots = TableOfContentsSlots;
export type TableOfContentsItemSlots = TableOfContentsSlots;
export type TableOfContentsLinkSlots = TableOfContentsSlots;
export type TableOfContentsRootProviderSlots = TableOfContentsSlots;

export interface TableOfContentsContextSlots {
  default?: (context: TableOfContentsContextValue) => VNodeChild;
}

export type { TocActiveChangeDetails, TocItemData, UseTocContext, UseTocReturn };
