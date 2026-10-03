import ScrollAreaRoot from "./ScrollArea.vue";
import ScrollAreaContent from "./ScrollAreaContent.vue";
import ScrollAreaContext from "./ScrollAreaContext.vue";
import ScrollAreaCorner from "./ScrollAreaCorner.vue";
import ScrollAreaRootProvider from "./ScrollAreaRootProvider.vue";
import ScrollAreaScrollbar from "./ScrollAreaScrollbar.vue";
import ScrollAreaThumb from "./ScrollAreaThumb.vue";
import ScrollAreaViewport from "./ScrollAreaViewport.vue";

export const ScrollArea = Object.assign(ScrollAreaRoot, {
  Root: ScrollAreaRoot,
  RootProvider: ScrollAreaRootProvider,
  Viewport: ScrollAreaViewport,
  Content: ScrollAreaContent,
  Scrollbar: ScrollAreaScrollbar,
  Thumb: ScrollAreaThumb,
  Corner: ScrollAreaCorner,
  Context: ScrollAreaContext,
});

export {
  ScrollAreaContent,
  ScrollAreaContext,
  ScrollAreaCorner,
  ScrollAreaRoot,
  ScrollAreaRootProvider,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
};

export {
  SCROLL_AREA_DEFAULT_ORIENTATION,
  type ScrollAreaApi,
  type ScrollAreaContentProps,
  type ScrollAreaContentSlots,
  type ScrollAreaContextSlots,
  type ScrollAreaContextValue,
  type ScrollAreaCornerProps,
  type ScrollAreaCornerSlots,
  type ScrollAreaDirection,
  type ScrollAreaOrientation,
  type ScrollAreaPartSlots,
  type ScrollAreaProps,
  type ScrollAreaRootProps,
  type ScrollAreaRootProviderProps,
  type ScrollAreaRootProviderSlots,
  type ScrollAreaRootSlots,
  type ScrollAreaScrollbarProps,
  type ScrollAreaScrollbarSlots,
  type ScrollAreaSlots,
  type ScrollAreaThumbProps,
  type ScrollAreaThumbSlots,
  type ScrollAreaViewportProps,
  type ScrollAreaViewportSlots,
  type UseScrollAreaContext,
  type UseScrollAreaReturn,
} from "./scroll-area";

export {
  scrollAreaAnatomy,
  useScrollArea,
  useScrollAreaContext,
  type ScrollAreaElementIds,
  type ScrollAreaScrollbarState,
  type ScrollAreaScrollToDetails,
  type ScrollAreaScrollToEdge,
  type ScrollAreaScrollToEdgeDetails,
  type UseScrollAreaProps,
} from "@ark-ui/vue/scroll-area";
