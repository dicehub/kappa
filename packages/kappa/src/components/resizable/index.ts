import ResizableContext from "./ResizableContext.vue";
import ResizableHandle from "./ResizableHandle.vue";
import ResizablePanel from "./ResizablePanel.vue";
import ResizableResizeTrigger from "./ResizableResizeTrigger.vue";
import ResizableResizeTriggerIndicator from "./ResizableResizeTriggerIndicator.vue";
import ResizableRoot from "./Resizable.vue";
import ResizableRootProvider from "./ResizableRootProvider.vue";

export const Resizable = Object.assign(ResizableRoot, {
  Root: ResizableRoot,
  RootProvider: ResizableRootProvider,
  Panel: ResizablePanel,
  Handle: ResizableHandle,
  ResizeTrigger: ResizableResizeTrigger,
  ResizeTriggerIndicator: ResizableResizeTriggerIndicator,
  Context: ResizableContext,
});

export {
  ResizableContext,
  ResizableHandle,
  ResizablePanel,
  ResizableResizeTrigger,
  ResizableResizeTriggerIndicator,
  ResizableRoot,
  ResizableRootProvider,
};

export {
  RESIZABLE_DEFAULT_ORIENTATION,
  RESIZABLE_ORIENTATIONS,
  isResizableOrientation,
  resolveResizableOrientation,
} from "./resizable";

export type {
  ResizableApi,
  ResizableContextProps,
  ResizableContextSlots,
  ResizableContextValue,
  ResizableEmits,
  ResizableExpandCollapseDetails,
  ResizableHandleProps,
  ResizableHandleSlots,
  ResizableOrientation,
  ResizablePanelData,
  ResizablePanelProps,
  ResizablePanelSlots,
  ResizablePanelSize,
  ResizableProps,
  ResizableResizeDetails,
  ResizableResizeEndDetails,
  ResizableResizeTriggerIndicatorProps,
  ResizableResizeTriggerIndicatorSlots,
  ResizableResizeTriggerProps,
  ResizableResizeTriggerSlots,
  ResizableRootEmits,
  ResizableRootProps,
  ResizableRootProviderProps,
  ResizableRootProviderSlots,
  ResizableRootSlots,
  ResizableSlots,
  UseSplitterContext,
  UseSplitterReturn,
} from "./resizable";

export {
  getSplitterLayout,
  splitterAnatomy,
  useSplitter,
  useSplitterContext,
  type UseSplitterProps,
} from "@ark-ui/vue/splitter";
