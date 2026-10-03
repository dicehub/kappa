import PaginationRoot from "./Pagination.vue";
import PaginationContext from "./PaginationContext.vue";
import PaginationControls from "./PaginationControls.vue";
import PaginationEllipsis from "./PaginationEllipsis.vue";
import PaginationFirstTrigger from "./PaginationFirstTrigger.vue";
import PaginationItem from "./PaginationItem.vue";
import PaginationLastTrigger from "./PaginationLastTrigger.vue";
import PaginationNextTrigger from "./PaginationNextTrigger.vue";
import PaginationPrevTrigger from "./PaginationPrevTrigger.vue";
import PaginationRootProvider from "./PaginationRootProvider.vue";

export const Pagination = Object.assign(PaginationRoot, {
  Root: PaginationRoot,
  RootProvider: PaginationRootProvider,
  Item: PaginationItem,
  Ellipsis: PaginationEllipsis,
  FirstTrigger: PaginationFirstTrigger,
  PrevTrigger: PaginationPrevTrigger,
  NextTrigger: PaginationNextTrigger,
  LastTrigger: PaginationLastTrigger,
  Context: PaginationContext,
  Controls: PaginationControls,
});

export {
  PaginationContext,
  PaginationControls,
  PaginationEllipsis,
  PaginationFirstTrigger,
  PaginationItem,
  PaginationLastTrigger,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
  PaginationRootProvider,
};

export type {
  PaginationApi,
  PaginationContextProps,
  PaginationContextSlots,
  PaginationContextValue,
  PaginationControlsProps,
  PaginationTriggerOptions,
  PaginationEllipsisProps,
  PaginationEllipsisSlots,
  PaginationEmits,
  PaginationFirstTriggerProps,
  PaginationFirstTriggerSlots,
  PaginationItemProps,
  PaginationItemSlots,
  PaginationLastTriggerProps,
  PaginationLastTriggerSlots,
  PaginationNextTriggerProps,
  PaginationNextTriggerSlots,
  PaginationPageChangeDetails,
  PaginationPageSizeChangeDetails,
  PaginationPageUrlDetails,
  PaginationPrevTriggerProps,
  PaginationPrevTriggerSlots,
  PaginationProps,
  PaginationRootProps,
  PaginationRootProviderProps,
  PaginationRootProviderSlots,
  PaginationRootSlots,
  PaginationSlots,
  UsePaginationContext,
  UsePaginationReturn,
} from "./pagination";

export {
  paginationAnatomy,
  usePagination,
  usePaginationContext,
  type UsePaginationProps,
} from "@ark-ui/vue/pagination";
