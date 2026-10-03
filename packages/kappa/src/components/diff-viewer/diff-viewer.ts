export type DiffViewerView = "unified" | "split";
export type DiffLineKind = "context" | "added" | "removed";

export interface DiffLine {
  kind: DiffLineKind;
  text: string;
  oldLine?: number;
  newLine?: number;
  /** UTF-16 start/end offsets of the changed text in a paired replacement. */
  changed?: [number, number];
  noNewline?: boolean;
}

export interface DiffHunk {
  header: string;
  oldStart: number;
  oldCount: number;
  newStart: number;
  newCount: number;
  lines: DiffLine[];
}

export interface DiffFile {
  oldPath: string;
  newPath: string;
  additions: number;
  deletions: number;
  hunks: DiffHunk[];
}

export interface DiffDocument {
  files: DiffFile[];
  additions: number;
  deletions: number;
}

export interface DiffViewerLabels {
  empty: string;
  invalid: string;
  copy: string;
  copied: string;
  before: string;
  after: string;
  content: string;
  added: string;
  removed: string;
  unchanged: string;
  noNewline: string;
}

export const DIFF_VIEWER_DEFAULT_LABELS: DiffViewerLabels = {
  empty: "No file changes.",
  invalid: "This patch cannot be displayed. Provide a complete unified text diff.",
  copy: "Copy patch",
  copied: "Patch copied",
  before: "Before",
  after: "After",
  content: "Content",
  added: "Added",
  removed: "Removed",
  unchanged: "Unchanged",
  noNewline: "No newline at end of file",
};

export interface DiffViewerProps {
  /** Complete unified text patch. Empty text represents no changes. */
  patch: string;
  /** Accessible name and visible heading for the patch. */
  label?: string;
  /** Split pairs adjacent removal/addition blocks by line order. */
  view?: DiffViewerView;
  lineNumbers?: boolean;
  inlineChanges?: boolean;
  copyable?: boolean;
  labels?: Partial<DiffViewerLabels>;
}
