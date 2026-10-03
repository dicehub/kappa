import type { HTMLAttributes, VNodeChild } from "vue";

export const CONTENT_LOADER_STATES = ["ready", "loading", "empty", "error"] as const;
export type ContentLoaderState = (typeof CONTENT_LOADER_STATES)[number];
export interface ContentLoaderProps extends /* @vue-ignore */ HTMLAttributes {
  /** The application owns loading, fetching, and error recovery. */
  state?: ContentLoaderState;
  /** Keep previously rendered content mounted but hidden between states. */
  keepMounted?: boolean;
  /** Reduce placeholder spacing for narrow panels. */
  compact?: boolean;
  loadingLabel?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  errorTitle?: string;
  errorDescription?: string;
  /** Show a retry button in the default error state. */
  retryable?: boolean;
  retryLabel?: string;
}
export interface ContentLoaderSlots {
  default?: () => VNodeChild;
  loading?: () => VNodeChild;
  empty?: () => VNodeChild;
  error?: (props: { retry: () => void }) => VNodeChild;
}
export interface ContentLoaderEmits { retry: [] }
