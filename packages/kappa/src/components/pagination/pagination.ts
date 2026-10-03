import type {
  PaginationContextProps as ArkPaginationContextProps,
  PaginationEllipsisProps as ArkPaginationEllipsisProps,
  PaginationFirstTriggerProps as ArkPaginationFirstTriggerProps,
  PaginationItemProps as ArkPaginationItemProps,
  PaginationLastTriggerProps as ArkPaginationLastTriggerProps,
  PaginationNextTriggerProps as ArkPaginationNextTriggerProps,
  PaginationPrevTriggerProps as ArkPaginationPrevTriggerProps,
  PaginationRootProps as ArkPaginationRootProps,
  PaginationRootProviderProps as ArkPaginationRootProviderProps,
  PaginationPageChangeDetails,
  PaginationPageSizeChangeDetails,
  PaginationPageUrlDetails,
  UsePaginationContext,
  UsePaginationReturn,
} from "@ark-ui/vue/pagination";
import type { UnwrapRef, VNodeChild } from "vue";

export type PaginationApi = UnwrapRef<UsePaginationReturn>;
export type PaginationContextValue = UnwrapRef<UsePaginationContext>;

/** Shorten Ark's default visible labels without changing custom translations. */
export const resolvePaginationControlLabel = (label: string | undefined) => {
  switch (label) {
    case "first page": return "First";
    case "previous page": return "Previous";
    case "next page": return "Next";
    case "last page": return "Last";
    default: return label;
  }
};

export interface PaginationProps {
  asChild?: ArkPaginationRootProps["asChild"];
  count?: ArkPaginationRootProps["count"];
  defaultPage?: ArkPaginationRootProps["defaultPage"];
  defaultPageSize?: ArkPaginationRootProps["defaultPageSize"];
  getPageUrl?: ArkPaginationRootProps["getPageUrl"];
  id?: ArkPaginationRootProps["id"];
  ids?: ArkPaginationRootProps["ids"];
  page?: ArkPaginationRootProps["page"];
  pageSize?: ArkPaginationRootProps["pageSize"];
  siblingCount?: ArkPaginationRootProps["siblingCount"];
  translations?: ArkPaginationRootProps["translations"];
  type?: ArkPaginationRootProps["type"];
}

export type PaginationRootProps = PaginationProps;

export type PaginationEmits = {
  pageChange: [details: PaginationPageChangeDetails];
  pageSizeChange: [details: PaginationPageSizeChangeDetails];
  "update:page": [page: number];
  "update:pageSize": [pageSize: number];
};

export interface PaginationSlots {
  default?: () => VNodeChild;
}

export type PaginationRootSlots = PaginationSlots;

export interface PaginationRootProviderProps
  extends Pick<ArkPaginationRootProviderProps, "value" | "asChild"> {}

export type PaginationRootProviderSlots = PaginationSlots;

export type PaginationItemProps = ArkPaginationItemProps;
export type PaginationEllipsisProps = ArkPaginationEllipsisProps;
export interface PaginationTriggerOptions {
  /** Optional visible text beside the default arrow. A default slot replaces both. */
  label?: string;
}
export type PaginationFirstTriggerProps = ArkPaginationFirstTriggerProps & PaginationTriggerOptions;
export type PaginationPrevTriggerProps = ArkPaginationPrevTriggerProps & PaginationTriggerOptions;
export type PaginationNextTriggerProps = ArkPaginationNextTriggerProps & PaginationTriggerOptions;
export type PaginationLastTriggerProps = ArkPaginationLastTriggerProps & PaginationTriggerOptions;

/** Compact button-mode controls composed within an Ark-backed Pagination root. */
export interface PaginationControlsProps {
  /** Full controls include first/last arrows and a page input. */
  controls?: "full" | "simple";
  /** Show short default labels beside the arrows; preserve custom root translations. */
  showLabels?: boolean;
  /** Accessible name for the page input. */
  pageLabel?: string;
}
export type PaginationContextProps = ArkPaginationContextProps;

export type PaginationItemSlots = PaginationSlots;
export type PaginationEllipsisSlots = PaginationSlots;
export type PaginationFirstTriggerSlots = PaginationSlots;
export type PaginationPrevTriggerSlots = PaginationSlots;
export type PaginationNextTriggerSlots = PaginationSlots;
export type PaginationLastTriggerSlots = PaginationSlots;

export interface PaginationContextSlots {
  default?: (context: PaginationContextValue) => VNodeChild;
}

export type {
  PaginationPageChangeDetails,
  PaginationPageSizeChangeDetails,
  PaginationPageUrlDetails,
  UsePaginationContext,
  UsePaginationReturn,
};
