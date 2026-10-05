import NavigationMenuRoot from "./NavigationMenu.vue";
import NavigationMenuRootProvider from "./NavigationMenuRootProvider.vue";
import NavigationMenuList from "./NavigationMenuList.vue";
import NavigationMenuItem from "./NavigationMenuItem.vue";
import NavigationMenuTrigger from "./NavigationMenuTrigger.vue";
import NavigationMenuContent from "./NavigationMenuContent.vue";
import NavigationMenuLink from "./NavigationMenuLink.vue";
import NavigationMenuViewportPositioner from "./NavigationMenuViewportPositioner.vue";
import NavigationMenuViewport from "./NavigationMenuViewport.vue";
import NavigationMenuIndicator from "./NavigationMenuIndicator.vue";
import NavigationMenuItemIndicator from "./NavigationMenuItemIndicator.vue";
import NavigationMenuArrow from "./NavigationMenuArrow.vue";
import NavigationMenuContext from "./NavigationMenuContext.vue";

export const NavigationMenu = Object.assign(NavigationMenuRoot, {
  Root: NavigationMenuRoot,
  RootProvider: NavigationMenuRootProvider,
  List: NavigationMenuList,
  Item: NavigationMenuItem,
  Trigger: NavigationMenuTrigger,
  Content: NavigationMenuContent,
  Link: NavigationMenuLink,
  ViewportPositioner: NavigationMenuViewportPositioner,
  Viewport: NavigationMenuViewport,
  Indicator: NavigationMenuIndicator,
  ItemIndicator: NavigationMenuItemIndicator,
  Arrow: NavigationMenuArrow,
  Context: NavigationMenuContext,
});

export { NavigationMenuRoot, NavigationMenuRootProvider, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink, NavigationMenuViewportPositioner, NavigationMenuViewport, NavigationMenuIndicator, NavigationMenuItemIndicator, NavigationMenuArrow, NavigationMenuContext };
export type * from "./navigation-menu";
export { NAVIGATION_MENU_SIZES } from "./navigation-menu";
export { useNavigationMenu } from "./use-navigation-menu";
export { useNavigationMenuContext, navigationMenuAnatomy } from "@ark-ui/vue/navigation-menu";
export type {
  NavigationMenuValueChangeDetails, UseNavigationMenuProps,
  UseNavigationMenuReturn, UseNavigationMenuContext,
} from "@ark-ui/vue/navigation-menu";
