import type {
  SplitterContextProps as ArkResizableContextProps,
  SplitterExpandCollapseDetails,
  SplitterPanelData,
  SplitterPanelProps as ArkResizablePanelProps,
  SplitterResizeDetails,
  SplitterResizeEndDetails,
  SplitterResizeTriggerIndicatorProps as ArkResizableResizeTriggerIndicatorProps,
  SplitterResizeTriggerProps as ArkResizableResizeTriggerProps,
  SplitterRootProps as ArkResizableRootProps,
  SplitterRootProviderProps as ArkResizableRootProviderProps,
  UseSplitterContext,
  UseSplitterReturn,
} from "@ark-ui/vue/splitter";
import type { UnwrapRef, VNodeChild } from "vue";

export const RESIZABLE_ORIENTATIONS = ["horizontal", "vertical"] as const;
export type ResizableOrientation = (typeof RESIZABLE_ORIENTATIONS)[number];

export const RESIZABLE_DEFAULT_ORIENTATION =
  "horizontal" satisfies ResizableOrientation;

export const isResizableOrientation = (
  value: unknown,
): value is ResizableOrientation =>
  typeof value === "string" &&
  RESIZABLE_ORIENTATIONS.includes(value as ResizableOrientation);

export const resolveResizableOrientation = (
  value: unknown,
): ResizableOrientation =>
  isResizableOrientation(value) ? value : RESIZABLE_DEFAULT_ORIENTATION;

export type ResizableApi = UnwrapRef<UseSplitterReturn>;
export type ResizableContextValue = UnwrapRef<UseSplitterContext>;
export type ResizablePanelData = SplitterPanelData;
export type ResizablePanelSize = number | string;

/** Ark UI splitter root props, with a horizontal Kappa default. */
export type ResizableProps = ArkResizableRootProps;
export type ResizableRootProps = ResizableProps;
export type ResizableRootProviderProps = ArkResizableRootProviderProps;
export type ResizablePanelProps = ArkResizablePanelProps;
export type ResizableResizeTriggerProps = ArkResizableResizeTriggerProps;
/** Friendly alias for ResizableResizeTriggerProps. */
export type ResizableHandleProps = ResizableResizeTriggerProps;
export type ResizableResizeTriggerIndicatorProps =
  ArkResizableResizeTriggerIndicatorProps;
export type ResizableContextProps = ArkResizableContextProps;

export type ResizableEmits = {
  collapse: [details: SplitterExpandCollapseDetails];
  expand: [details: SplitterExpandCollapseDetails];
  resize: [details: SplitterResizeDetails];
  resizeEnd: [details: SplitterResizeEndDetails];
  resizeStart: [];
  "update:size": [size: number[]];
};

export type ResizableRootEmits = ResizableEmits;

export interface ResizableSlots {
  default?: () => VNodeChild;
}

export type ResizableRootSlots = ResizableSlots;
export type ResizableRootProviderSlots = ResizableSlots;
export type ResizablePanelSlots = ResizableSlots;
export type ResizableResizeTriggerSlots = ResizableSlots;
export type ResizableHandleSlots = ResizableResizeTriggerSlots;
export type ResizableResizeTriggerIndicatorSlots = ResizableSlots;

export interface ResizableContextSlots {
  default?: (context: ResizableContextValue) => VNodeChild;
}

export type {
  SplitterExpandCollapseDetails as ResizableExpandCollapseDetails,
  SplitterResizeDetails as ResizableResizeDetails,
  SplitterResizeEndDetails as ResizableResizeEndDetails,
  UseSplitterContext,
  UseSplitterReturn,
};
