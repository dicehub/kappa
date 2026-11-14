import BreadcrumbsRoot from "./Breadcrumbs.vue";
import BreadcrumbsEllipsis from "./BreadcrumbsEllipsis.vue";
import BreadcrumbsItem from "./BreadcrumbsItem.vue";
import BreadcrumbsLink from "./BreadcrumbsLink.vue";
import BreadcrumbsList from "./BreadcrumbsList.vue";
import BreadcrumbsPage from "./BreadcrumbsPage.vue";
import BreadcrumbsSeparator from "./BreadcrumbsSeparator.vue";
import BreadcrumbsTrigger from "./BreadcrumbsTrigger.vue";

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
  Trigger: BreadcrumbsTrigger,
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
  BreadcrumbsTrigger,
};

export {
  BREADCRUMBS_DEFAULT_SIZE,
  BREADCRUMBS_DEFAULT_VARIANT,
  BREADCRUMBS_SIZES,
  BREADCRUMBS_VARIANTS,
  isBreadcrumbsSize,
  isBreadcrumbsVariant,
  resolveBreadcrumbsSize,
  resolveBreadcrumbsVariant,
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
  type BreadcrumbsTriggerProps,
  type BreadcrumbsTriggerSlots,
  type BreadcrumbsVariant,
} from "./breadcrumbs";
