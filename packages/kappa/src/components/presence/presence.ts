import type { VNodeChild } from "vue";

export interface PresenceProps {
  /** Merges presence behavior and Kappa attributes onto one direct child element. */
  asChild?: boolean;
  /** Applies a presence change without waiting for the next animation frame. */
  immediate?: boolean;
  /** Defers the initial mount until the content is first shown. */
  lazyMount?: boolean;
  /** Controls whether the content is present. */
  present?: boolean;
  /** Prevents an entrance animation when initially mounted as present. */
  skipAnimationOnMount?: boolean;
  /** Removes the content from the DOM after its exit animation completes. */
  unmountOnExit?: boolean;
}

export type PresenceEmits = {
  /** Emitted after the entrance animation completes. */
  enterComplete: [];
  /** Emitted after the exit animation completes. */
  exitComplete: [];
};

export interface PresenceSlots {
  /** Content controlled by the presence state. */
  default?: () => VNodeChild;
}

export type {
  UsePresenceContext,
  UsePresenceProps,
  UsePresenceReturn,
} from "@ark-ui/vue/presence";
