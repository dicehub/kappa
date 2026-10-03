import FloatingPanelRoot from "./FloatingPanel.vue";
import FloatingPanelBody from "./FloatingPanelBody.vue";
import FloatingPanelClose from "./FloatingPanelClose.vue";
import FloatingPanelContent from "./FloatingPanelContent.vue";
import FloatingPanelContext from "./FloatingPanelContext.vue";
import FloatingPanelControl from "./FloatingPanelControl.vue";
import FloatingPanelDragTrigger from "./FloatingPanelDragTrigger.vue";
import FloatingPanelHeader from "./FloatingPanelHeader.vue";
import FloatingPanelPositioner from "./FloatingPanelPositioner.vue";
import FloatingPanelResizeTrigger from "./FloatingPanelResizeTrigger.vue";
import FloatingPanelRootProvider from "./FloatingPanelRootProvider.vue";
import FloatingPanelStageTrigger from "./FloatingPanelStageTrigger.vue";
import FloatingPanelTitle from "./FloatingPanelTitle.vue";
import FloatingPanelTrigger from "./FloatingPanelTrigger.vue";

export const FloatingPanel = Object.assign(FloatingPanelRoot, {
  Root: FloatingPanelRoot,
  RootProvider: FloatingPanelRootProvider,
  Trigger: FloatingPanelTrigger,
  Positioner: FloatingPanelPositioner,
  Content: FloatingPanelContent,
  DragTrigger: FloatingPanelDragTrigger,
  Header: FloatingPanelHeader,
  Title: FloatingPanelTitle,
  Control: FloatingPanelControl,
  StageTrigger: FloatingPanelStageTrigger,
  Close: FloatingPanelClose,
  CloseTrigger: FloatingPanelClose,
  Body: FloatingPanelBody,
  ResizeTrigger: FloatingPanelResizeTrigger,
  Context: FloatingPanelContext,
});

export {
  FloatingPanelBody,
  FloatingPanelClose,
  FloatingPanelClose as FloatingPanelCloseTrigger,
  FloatingPanelContent,
  FloatingPanelContext,
  FloatingPanelControl,
  FloatingPanelDragTrigger,
  FloatingPanelHeader,
  FloatingPanelPositioner,
  FloatingPanelResizeTrigger,
  FloatingPanelRoot,
  FloatingPanelRootProvider,
  FloatingPanelStageTrigger,
  FloatingPanelTitle,
  FloatingPanelTrigger,
};

export { FLOATING_PANEL_DEFAULT_MIN_SIZE } from "./floating-panel";

export type {
  FloatingPanelApi,
  FloatingPanelBodyProps,
  FloatingPanelBodySlots,
  FloatingPanelCloseProps,
  FloatingPanelCloseSlots,
  FloatingPanelCloseTriggerProps,
  FloatingPanelCloseTriggerSlots,
  FloatingPanelContentProps,
  FloatingPanelContentSlots,
  FloatingPanelContextSlots,
  FloatingPanelContextValue,
  FloatingPanelControlProps,
  FloatingPanelControlSlots,
  FloatingPanelDragTriggerProps,
  FloatingPanelDragTriggerSlots,
  FloatingPanelEmits,
  FloatingPanelHeaderProps,
  FloatingPanelHeaderSlots,
  FloatingPanelPositionerProps,
  FloatingPanelPositionerSlots,
  FloatingPanelProps,
  FloatingPanelResizeTriggerProps,
  FloatingPanelResizeTriggerSlots,
  FloatingPanelRootEmits,
  FloatingPanelRootProps,
  FloatingPanelRootProviderEmits,
  FloatingPanelRootProviderProps,
  FloatingPanelRootProviderSlots,
  FloatingPanelRootSlots,
  FloatingPanelSlots,
  FloatingPanelStageTriggerProps,
  FloatingPanelStageTriggerSlots,
  FloatingPanelTitleProps,
  FloatingPanelTitleSlots,
  FloatingPanelTriggerProps,
  FloatingPanelTriggerSlots,
} from "./floating-panel";

export {
  floatingPanelAnatomy,
  useFloatingPanel,
  useFloatingPanelContext,
  type FloatingPanelAnchorPositionDetails,
  type FloatingPanelElementIds,
  type FloatingPanelIntlTranslations,
  type FloatingPanelOpenChangeDetails,
  type FloatingPanelPoint,
  type FloatingPanelPositionChangeDetails,
  type FloatingPanelResizeTriggerAxis,
  type FloatingPanelSize,
  type FloatingPanelSizeChangeDetails,
  type FloatingPanelStage,
  type FloatingPanelStageChangeDetails,
  type UseFloatingPanelContext,
  type UseFloatingPanelProps,
  type UseFloatingPanelReturn,
} from "@ark-ui/vue/floating-panel";
