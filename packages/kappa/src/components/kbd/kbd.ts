import type { HTMLAttributes, VNodeChild } from "vue";

/** Native attributes accepted by the semantic keyboard-input element. */
export interface KbdProps extends /* @vue-ignore */ HTMLAttributes {}

/** Native attributes accepted by the inline shortcut group. */
export interface KbdGroupProps extends /* @vue-ignore */ HTMLAttributes {}

export interface KbdSlots {
  /** A key name, symbol, or other textual user input. */
  default?: () => VNodeChild;
}

export interface KbdGroupSlots {
  /** Keyboard keys and optional visible separators. */
  default?: () => VNodeChild;
}
