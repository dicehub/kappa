import BreadcrumbsRoot from "./Breadcrumbs.vue";
import BreadcrumbsEllipsis from "./BreadcrumbsEllipsis.vue";
import BreadcrumbsItem from "./BreadcrumbsItem.vue";
import BreadcrumbsLink from "./BreadcrumbsLink.vue";
import BreadcrumbsList from "./BreadcrumbsList.vue";
import BreadcrumbsPage from "./BreadcrumbsPage.vue";
import BreadcrumbsSeparator from "./BreadcrumbsSeparator.vue";

const BreadcrumbsCurrent = BreadcrumbsPage;

export const Breadcrumbs = Object.assign(BreadcrumbsRoot, {
  Root: BreadcrumbsRoot,
  List: BreadcrumbsList,
  Item: BreadcrumbsItem,
  Link: BreadcrumbsLink,
  Page: BreadcrumbsPage,
  Current: BreadcrumbsCurrent,
  Separator: BreadcrumbsSeparator,
  Ellipsis: BreadcrumbsEllipsis,
});

export {
  BreadcrumbsCurrent,
  BreadcrumbsEllipsis,
  BreadcrumbsItem,
  BreadcrumbsLink,
  BreadcrumbsList,
  BreadcrumbsPage,
  BreadcrumbsRoot,
  BreadcrumbsSeparator,
};

export {
  BREADCRUMBS_DEFAULT_SIZE,
  BREADCRUMBS_SIZES,
  isBreadcrumbsSize,
  resolveBreadcrumbsSize,
  type BreadcrumbsCurrentProps,
  type BreadcrumbsCurrentSlots,
  type BreadcrumbsEllipsisProps,
  type BreadcrumbsEllipsisSlots,
  type BreadcrumbsItemProps,
  type BreadcrumbsItemSlots,
  type BreadcrumbsLinkProps,
  type BreadcrumbsLinkSlots,
  type BreadcrumbsListProps,
  type BreadcrumbsListSlots,
  type BreadcrumbsPageProps,
  type BreadcrumbsPageSlots,
  type BreadcrumbsProps,
  type BreadcrumbsRootProps,
  type BreadcrumbsRootSlots,
  type BreadcrumbsSeparatorProps,
  type BreadcrumbsSeparatorSlots,
  type BreadcrumbsSize,
  type BreadcrumbsSlots,
} from "./breadcrumbs";
