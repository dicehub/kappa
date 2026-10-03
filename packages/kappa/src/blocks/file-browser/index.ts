import FileBrowserRoot from "./FileBrowser.vue";

export const FileBrowser = Object.assign(FileBrowserRoot, { Root: FileBrowserRoot });
export { FileBrowserRoot };
export { FILE_BROWSER_DEFAULT_LABELS } from "./file-browser";
export type {
  FileBrowserAction, FileBrowserEmits, FileBrowserFolderId, FileBrowserItem, FileBrowserLabels,
  FileBrowserLocation, FileBrowserMutationContext, FileBrowserProps, FileBrowserRequest,
  FileBrowserSelectionMode, FileBrowserSlots, FileBrowserSort, FileBrowserView,
} from "./file-browser";
