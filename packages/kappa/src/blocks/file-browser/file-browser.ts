import type { VNodeChild } from "vue";
import type { FilterBarLabels } from "../../components/filter-bar";

export type FileBrowserFolderId = string | null;
export type FileBrowserSort = "name" | "modified" | "size";
export type FileBrowserSelectionMode = "none" | "single" | "multiple";
export type FileBrowserView = "list" | "grid";

export interface FileBrowserItem {
  /** Stable, globally unique item identifier. */
  id: string;
  name: string;
  kind: "file" | "folder";
  /** Used by the static items source. Omitted means the null root. */
  parentId?: FileBrowserFolderId;
  size?: number;
  /** ISO timestamp. */
  modifiedAt?: string;
  /** Prevents opening, selection, and all actions. */
  disabled?: boolean;
  /** Prevents the built-in rename action. Host actions control their own permissions. */
  readonly?: boolean;
}

export interface FileBrowserLocation { id: FileBrowserFolderId; name: string }
export interface FileBrowserRequest { signal: AbortSignal }
export interface FileBrowserMutationContext extends FileBrowserRequest { folderId: FileBrowserFolderId }
export interface FileBrowserAction { id: string; label: string; disabled?: boolean; destructive?: boolean }

export interface FileBrowserLabels {
  name: string; size: string; modified: string; folder: string; file: string;
  open: string; rename: string; newFolder: string; save: string; create: string; cancel: string;
  refresh: string; loading: string; empty: string; noResults: string; clearSearch: string;
  loadError: string; actionError: string; retry: string; dismiss: string; selectAll: string;
  clearSelection: string; invalidName: string; duplicateName: string;
  createDescription: string; renameDescription: string; saved: string;
  contextMenu: string; noActions: string;
  actions: (name: string) => string;
  select: (name: string) => string;
  count: (count: number) => string;
  selected: (count: number) => string;
}

export const FILE_BROWSER_DEFAULT_LABELS: FileBrowserLabels = {
  name: "Name", size: "Size", modified: "Modified", folder: "Folder", file: "File",
  open: "Open", rename: "Rename", newFolder: "New folder", save: "Save", create: "Create", cancel: "Cancel",
  refresh: "Refresh folder", loading: "Loading files…", empty: "This folder is empty.", noResults: "No matching files.", clearSearch: "Clear search",
  loadError: "Files could not be loaded.", actionError: "The action could not be completed.", retry: "Try again", dismiss: "Dismiss error", selectAll: "Select all visible items",
  clearSelection: "Clear selection", invalidName: "Enter a name without slashes or control characters.", duplicateName: "An item with this name already exists.",
  createDescription: "Create a folder in the current location.", renameDescription: "Enter a new name for this item.", saved: "Changes saved.",
  contextMenu: "File browser actions", noActions: "No actions available",
  actions: name => `Actions for ${name}`, select: name => `Select ${name}`,
  count: count => `${count} ${count === 1 ? "item" : "items"}`, selected: count => `${count} selected`,
};

export interface FileBrowserProps {
  /** Static tree. Use either items or loadFolder. */
  items?: readonly FileBrowserItem[];
  /** Returns the direct children of a folder. Invoked after mount. */
  loadFolder?: (folderId: FileBrowserFolderId, request: FileBrowserRequest) => Promise<readonly FileBrowserItem[]>;
  rootId?: FileBrowserFolderId;
  rootLabel?: string;
  title?: string;
  description?: string;
  modelValue?: readonly string[];
  defaultValue?: readonly string[];
  selectionMode?: FileBrowserSelectionMode;
  /** Controlled content view. Use with update:view. */
  view?: FileBrowserView;
  /** Initial content view when view is uncontrolled. */
  defaultView?: FileBrowserView;
  /** Shows a list/grid control in the filter bar. */
  showView?: boolean;
  disabled?: boolean;
  /** Locale used for name ordering, file sizes, and UTC dates. */
  locale?: string;
  labels?: Partial<FileBrowserLabels>;
  filterLabels?: Partial<FilterBarLabels>;
  renameItem?: (item: FileBrowserItem, name: string, context: FileBrowserMutationContext) => void | Promise<void>;
  createFolder?: (name: string, context: FileBrowserMutationContext) => void | Promise<void>;
  actions?: (item: FileBrowserItem) => readonly FileBrowserAction[];
  runAction?: (action: string, item: FileBrowserItem, context: FileBrowserMutationContext) => void | Promise<void>;
}

export type FileBrowserEmits = {
  "update:modelValue": [value: string[]];
  "update:view": [value: FileBrowserView];
  open: [item: FileBrowserItem];
  navigate: [location: FileBrowserLocation[]];
  complete: [details: { operation: "rename" | "create" | "action"; folderId: FileBrowserFolderId; item?: FileBrowserItem; action?: string }];
};

export interface FileBrowserSlots {
  actions?: (props: { folderId: FileBrowserFolderId; refresh: () => Promise<void> }) => VNodeChild;
  icon?: (props: { item: FileBrowserItem }) => VNodeChild;
  selection?: (props: { items: FileBrowserItem[]; clear: () => void }) => VNodeChild;
}
