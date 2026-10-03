import DiffViewerRoot from "./DiffViewer.vue";

export const DiffViewer = Object.assign(DiffViewerRoot, { Root: DiffViewerRoot });
export { DiffViewerRoot };
export { parseUnifiedDiff } from "./parse-unified-diff";
export { DIFF_VIEWER_DEFAULT_LABELS } from "./diff-viewer";
export type {
  DiffDocument, DiffFile, DiffHunk, DiffLine, DiffLineKind,
  DiffViewerLabels, DiffViewerProps, DiffViewerView,
} from "./diff-viewer";
