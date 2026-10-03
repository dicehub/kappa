import type {
  FloatingPanelBodyProps as ArkFloatingPanelBodyProps,
  FloatingPanelCloseTriggerProps as ArkFloatingPanelCloseTriggerProps,
  FloatingPanelContentProps as ArkFloatingPanelContentProps,
  FloatingPanelControlProps as ArkFloatingPanelControlProps,
  FloatingPanelDragTriggerProps as ArkFloatingPanelDragTriggerProps,
  FloatingPanelHeaderProps as ArkFloatingPanelHeaderProps,
  FloatingPanelOpenChangeDetails,
  FloatingPanelPoint,
  FloatingPanelPositionChangeDetails,
  FloatingPanelPositionerProps as ArkFloatingPanelPositionerProps,
  FloatingPanelResizeTriggerProps as ArkFloatingPanelResizeTriggerProps,
  FloatingPanelRootProps as ArkFloatingPanelRootProps,
  FloatingPanelRootProviderProps as ArkFloatingPanelRootProviderProps,
  FloatingPanelSize,
  FloatingPanelSizeChangeDetails,
  FloatingPanelStageChangeDetails,
  FloatingPanelStageTriggerProps as ArkFloatingPanelStageTriggerProps,
  FloatingPanelTitleProps as ArkFloatingPanelTitleProps,
  FloatingPanelTriggerProps as ArkFloatingPanelTriggerProps,
  UseFloatingPanelContext,
  UseFloatingPanelReturn,
} from "@ark-ui/vue/floating-panel";
import type { TeleportProps, UnwrapRef, VNodeChild } from "vue";

export const FLOATING_PANEL_DEFAULT_MIN_SIZE = {
  width: 240,
  height: 160,
} as const satisfies FloatingPanelSize;

export type FloatingPanelApi = UnwrapRef<UseFloatingPanelReturn>;
export type FloatingPanelContextValue = UnwrapRef<UseFloatingPanelContext>;

/** Ark UI floating-panel props with Kappa defaults applied by FloatingPanel.Root. */
export type FloatingPanelProps = ArkFloatingPanelRootProps;
export type FloatingPanelRootProps = FloatingPanelProps;

export type FloatingPanelEmits = {
  exitComplete: [];
  openChange: [details: FloatingPanelOpenChangeDetails];
  positionChange: [details: FloatingPanelPositionChangeDetails];
  positionChangeEnd: [details: FloatingPanelPositionChangeDetails];
  sizeChange: [details: FloatingPanelSizeChangeDetails];
  sizeChangeEnd: [details: FloatingPanelSizeChangeDetails];
  stageChange: [details: FloatingPanelStageChangeDetails];
  "update:open": [open: boolean];
  "update:position": [position: FloatingPanelPoint];
  "update:size": [size: FloatingPanelSize];
};

export type FloatingPanelRootEmits = FloatingPanelEmits;

export interface FloatingPanelSlots {
  default?: () => VNodeChild;
}

export type FloatingPanelRootSlots = FloatingPanelSlots;

export interface FloatingPanelRootProviderProps {
  value: FloatingPanelApi;
  lazyMount?: ArkFloatingPanelRootProviderProps["lazyMount"];
  unmountOnExit?: ArkFloatingPanelRootProviderProps["unmountOnExit"];
}

export type FloatingPanelRootProviderEmits = {
  enterComplete: [];
  exitComplete: [];
};

export type FloatingPanelRootProviderSlots = FloatingPanelSlots;
export type FloatingPanelTriggerProps = ArkFloatingPanelTriggerProps;
export type FloatingPanelTriggerSlots = FloatingPanelSlots;

export interface FloatingPanelPositionerProps extends ArkFloatingPanelPositionerProps {
  /** Teleports the positioner. Disable this for a panel constrained to a local boundary. */
  teleport?: boolean;
  teleportTo?: TeleportProps["to"];
}

export type FloatingPanelPositionerSlots = FloatingPanelSlots;
export type FloatingPanelContentProps = ArkFloatingPanelContentProps;
export type FloatingPanelContentSlots = FloatingPanelSlots;
export type FloatingPanelDragTriggerProps = ArkFloatingPanelDragTriggerProps;
export type FloatingPanelDragTriggerSlots = FloatingPanelSlots;
export type FloatingPanelHeaderProps = ArkFloatingPanelHeaderProps;
export type FloatingPanelHeaderSlots = FloatingPanelSlots;
export type FloatingPanelTitleProps = ArkFloatingPanelTitleProps;
export type FloatingPanelTitleSlots = FloatingPanelSlots;
export type FloatingPanelControlProps = ArkFloatingPanelControlProps;
export type FloatingPanelControlSlots = FloatingPanelSlots;

export interface FloatingPanelStageTriggerProps extends ArkFloatingPanelStageTriggerProps {
  /** Accessible label for the built-in icon control. */
  label?: string;
}

export type FloatingPanelStageTriggerSlots = FloatingPanelSlots;

export interface FloatingPanelCloseProps extends ArkFloatingPanelCloseTriggerProps {
  /** Accessible label for the built-in icon control. */
  label?: string;
}

export type FloatingPanelCloseSlots = FloatingPanelSlots;
export type FloatingPanelCloseTriggerProps = FloatingPanelCloseProps;
export type FloatingPanelCloseTriggerSlots = FloatingPanelCloseSlots;
export type FloatingPanelBodyProps = ArkFloatingPanelBodyProps;
export type FloatingPanelBodySlots = FloatingPanelSlots;
export type FloatingPanelResizeTriggerProps = ArkFloatingPanelResizeTriggerProps;
export type FloatingPanelResizeTriggerSlots = FloatingPanelSlots;

export interface FloatingPanelContextSlots {
  default?: (context: FloatingPanelContextValue) => VNodeChild;
}
