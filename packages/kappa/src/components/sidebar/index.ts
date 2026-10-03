import SidebarRoot from "./Sidebar.vue";
import SidebarProvider from "./SidebarProvider.vue";
import SidebarContext from "./SidebarContext.vue";
import SidebarTrigger from "./SidebarTrigger.vue";
import SidebarClose from "./SidebarClose.vue";
import SidebarHeader from "./SidebarHeader.vue";
import SidebarFooter from "./SidebarFooter.vue";
import SidebarContent from "./SidebarContent.vue";
import SidebarGroup from "./SidebarGroup.vue";
import SidebarGroupLabel from "./SidebarGroupLabel.vue";
import SidebarMenu from "./SidebarMenu.vue";
import SidebarMenuItem from "./SidebarMenuItem.vue";
import SidebarMenuButton from "./SidebarMenuButton.vue";
import SidebarMenuSub from "./SidebarMenuSub.vue";
import SidebarMenuSubItem from "./SidebarMenuSubItem.vue";
import SidebarMenuLabel from "./SidebarMenuLabel.vue";
import SidebarMenuBadge from "./SidebarMenuBadge.vue";
import SidebarMenuChevron from "./SidebarMenuChevron.vue";
import SidebarSeparator from "./SidebarSeparator.vue";
import SidebarCollapsible from "./SidebarCollapsible.vue";
import SidebarCollapsibleTrigger from "./SidebarCollapsibleTrigger.vue";
import SidebarCollapsibleContent from "./SidebarCollapsibleContent.vue";
import SidebarLoading from "./SidebarLoading.vue";
import SidebarResizeHandle from "./SidebarResizeHandle.vue";
import SidebarSlidingViews from "./SidebarSlidingViews.vue";
import SidebarSlidingView from "./SidebarSlidingView.vue";

export const Sidebar = Object.assign(SidebarRoot, {
  Root: SidebarRoot,
  Provider: SidebarProvider,
  Context: SidebarContext,
  Trigger: SidebarTrigger,
  Close: SidebarClose,
  Header: SidebarHeader,
  Footer: SidebarFooter,
  Content: SidebarContent,
  Group: SidebarGroup,
  GroupLabel: SidebarGroupLabel,
  Menu: SidebarMenu,
  MenuItem: SidebarMenuItem,
  MenuButton: SidebarMenuButton,
  MenuSub: SidebarMenuSub,
  MenuSubItem: SidebarMenuSubItem,
  MenuLabel: SidebarMenuLabel,
  MenuBadge: SidebarMenuBadge,
  MenuChevron: SidebarMenuChevron,
  Separator: SidebarSeparator,
  Collapsible: SidebarCollapsible,
  CollapsibleTrigger: SidebarCollapsibleTrigger,
  CollapsibleContent: SidebarCollapsibleContent,
  Loading: SidebarLoading,
  ResizeHandle: SidebarResizeHandle,
  SlidingViews: SidebarSlidingViews,
  SlidingView: SidebarSlidingView,
});

export {
  SidebarRoot,
  SidebarProvider,
  SidebarContext,
  SidebarTrigger,
  SidebarClose,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuLabel,
  SidebarMenuBadge,
  SidebarMenuChevron,
  SidebarSeparator,
  SidebarCollapsible,
  SidebarCollapsibleTrigger,
  SidebarCollapsibleContent,
  SidebarLoading,
  SidebarResizeHandle,
  SidebarSlidingViews,
  SidebarSlidingView,
};

export { SIDEBAR_DEFAULTS } from "./sidebar";
export { useSidebarContext } from "./sidebar-context";
export type { SidebarContextValue } from "./sidebar-context";
export type {
  SidebarProps, SidebarRootProps, SidebarSlots, SidebarRootSlots,
  SidebarProviderProps, SidebarProviderEmits, SidebarProviderSlots,
  SidebarSide, SidebarCollapsibleMode, SidebarState, SidebarOpenChangeDetails,
  SidebarPartProps, SidebarTriggerProps, SidebarCloseProps,
  SidebarMenuButtonProps, SidebarMenuButtonSlots,
  SidebarCollapsibleProps, SidebarCollapsibleEmits,
  SidebarCollapsibleTriggerProps, SidebarCollapsibleContentProps, SidebarLoadingProps,
  SidebarResizeHandleProps, SidebarResizeDetails, SidebarSlidingViewsProps, SidebarSlidingViewProps,
} from "./sidebar";
