import type { VNodeChild } from "vue";

export interface ChartFrameProps {
  accessibleDescription: string;
  accessibleLabel: string;
  description?: string;
  empty?: boolean;
  emptyLabel?: string;
  error?: string;
  height?: string | number;
  loading?: boolean;
  loadingLabel?: string;
  slotName: "chart" | "xy-plot";
  title?: string;
}

export interface ChartFrameSlots {
  default?: (props: { descriptionId: string }) => VNodeChild;
  empty?: () => VNodeChild;
  error?: (props: { error?: string }) => VNodeChild;
  footer?: () => VNodeChild;
  loading?: () => VNodeChild;
  toolbar?: () => VNodeChild;
}
