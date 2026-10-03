import DrawerRoot from "./Drawer.vue";
import DrawerBackdrop from "./DrawerBackdrop.vue";
import DrawerClose from "./DrawerClose.vue";
import DrawerContent from "./DrawerContent.vue";
import DrawerContext from "./DrawerContext.vue";
import DrawerDescription from "./DrawerDescription.vue";
import DrawerFooter from "./DrawerFooter.vue";
import DrawerGrabber from "./DrawerGrabber.vue";
import DrawerGrabberIndicator from "./DrawerGrabberIndicator.vue";
import DrawerHeader from "./DrawerHeader.vue";
import DrawerIndent from "./DrawerIndent.vue";
import DrawerIndentBackground from "./DrawerIndentBackground.vue";
import DrawerPositioner from "./DrawerPositioner.vue";
import DrawerRootProvider from "./DrawerRootProvider.vue";
import DrawerStack from "./DrawerStack.vue";
import DrawerSwipeArea from "./DrawerSwipeArea.vue";
import DrawerTitle from "./DrawerTitle.vue";
import DrawerTrigger from "./DrawerTrigger.vue";

export const Drawer = Object.assign(DrawerRoot, {
  Root: DrawerRoot,
  RootProvider: DrawerRootProvider,
  Stack: DrawerStack,
  Trigger: DrawerTrigger,
  SwipeArea: DrawerSwipeArea,
  Backdrop: DrawerBackdrop,
  Positioner: DrawerPositioner,
  Content: DrawerContent,
  Grabber: DrawerGrabber,
  GrabberIndicator: DrawerGrabberIndicator,
  Header: DrawerHeader,
  Title: DrawerTitle,
  Description: DrawerDescription,
  Footer: DrawerFooter,
  Close: DrawerClose,
  CloseTrigger: DrawerClose,
  Context: DrawerContext,
  Indent: DrawerIndent,
  IndentBackground: DrawerIndentBackground,
});

export {
  DrawerBackdrop,
  DrawerClose,
  DrawerClose as DrawerCloseTrigger,
  DrawerContent,
  DrawerContext,
  DrawerDescription,
  DrawerFooter,
  DrawerGrabber,
  DrawerGrabberIndicator,
  DrawerHeader,
  DrawerIndent,
  DrawerIndentBackground,
  DrawerPositioner,
  DrawerRoot,
  DrawerRootProvider,
  DrawerStack,
  DrawerSwipeArea,
  DrawerTitle,
  DrawerTrigger,
};

export {
  DRAWER_DEFAULT_ROLE,
  DRAWER_DEFAULT_SWIPE_DIRECTION,
  DRAWER_ROLES,
  DRAWER_SWIPE_DIRECTIONS,
} from "./drawer";

export type {
  DrawerApi,
  DrawerBackdropProps,
  DrawerBackdropSlots,
  DrawerCloseProps,
  DrawerCloseSlots,
  DrawerCloseTriggerProps,
  DrawerCloseTriggerSlots,
  DrawerContentProps,
  DrawerContentSlots,
  DrawerContextSlots,
  DrawerContextValue,
  DrawerDescriptionProps,
  DrawerDescriptionSlots,
  DrawerEmits,
  DrawerFooterSlots,
  DrawerGrabberIndicatorProps,
  DrawerGrabberIndicatorSlots,
  DrawerGrabberProps,
  DrawerGrabberSlots,
  DrawerHeaderSlots,
  DrawerIndentBackgroundProps,
  DrawerIndentBackgroundSlots,
  DrawerIndentProps,
  DrawerIndentSlots,
  DrawerOpenChangeDetails,
  DrawerPositionerProps,
  DrawerPositionerSlots,
  DrawerProps,
  DrawerRole,
  DrawerRootProps,
  DrawerRootProviderEmits,
  DrawerRootProviderProps,
  DrawerRootProviderSlots,
  DrawerRootSlots,
  DrawerSlots,
  DrawerSnapPoint,
  DrawerSnapPointChangeDetails,
  DrawerStackSlots,
  DrawerSwipeAreaProps,
  DrawerSwipeAreaSlots,
  DrawerSwipeDirection,
  DrawerTitleProps,
  DrawerTitleSlots,
  DrawerTriggerProps,
  DrawerTriggerSlots,
  DrawerTriggerValueChangeDetails,
} from "./drawer";

export {
  drawerAnatomy,
  useDrawer,
  useDrawerContext,
  useDrawerStackContext,
  type UseDrawerProps,
  type UseDrawerReturn,
} from "@ark-ui/vue/drawer";
