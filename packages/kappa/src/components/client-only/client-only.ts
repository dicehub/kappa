import type { ClientOnlyProps as ArkClientOnlyProps } from "@ark-ui/vue/client-only";
import type { VNodeChild } from "vue";

/** Props accepted by the renderless client-only boundary. */
export type ClientOnlyProps = ArkClientOnlyProps;

export interface ClientOnlySlots {
  /** Content rendered after the component mounts in the browser. */
  default?: () => VNodeChild;
  /** Content rendered during server-side rendering and before client mount. */
  fallback?: () => VNodeChild;
}
