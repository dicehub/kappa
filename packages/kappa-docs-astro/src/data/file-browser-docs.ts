export const initialFiles = [
  { id: "documents", name: "Documents", kind: "folder", modifiedAt: "2026-09-21T09:00:00Z" },
  { id: "images", name: "Images", kind: "folder", modifiedAt: "2026-09-20T09:00:00Z" },
  { id: "archive", name: "Archive", kind: "folder", modifiedAt: "2026-09-18T09:00:00Z" },
  { id: "readme", name: "README.md", kind: "file", size: 2400, modifiedAt: "2026-09-22T09:00:00Z" },
  { id: "budget", name: "budget-2026.csv", kind: "file", size: 18600, modifiedAt: "2026-09-21T09:00:00Z" },
  { id: "policy", name: "workspace-policy.pdf", kind: "file", size: 143000, modifiedAt: "2026-09-19T09:00:00Z", readonly: true },
  { id: "guide", name: "team-guide.pdf", kind: "file", parentId: "documents", size: 1420000, modifiedAt: "2026-09-21T09:00:00Z" },
  { id: "notes", name: "meeting-notes.md", kind: "file", parentId: "documents", size: 4200, modifiedAt: "2026-09-20T09:00:00Z" },
  { id: "drafts", name: "Drafts", kind: "folder", parentId: "documents", modifiedAt: "2026-09-18T09:00:00Z" },
  { id: "banner", name: "banner.png", kind: "file", parentId: "images", size: 2400000, modifiedAt: "2026-09-20T09:00:00Z" },
  { id: "logo", name: "logo.svg", kind: "file", parentId: "images", size: 12000, modifiedAt: "2026-09-20T09:00:00Z" },
] as const;

export const previewCode = `<script setup>
import { ref } from "vue";
import { FileBrowser } from "@dicehub/kappa/blocks/file-browser";

const selected = ref([]);
const items = [
  { id: "docs", name: "Documents", kind: "folder" },
  { id: "readme", name: "README.md", kind: "file", size: 2400 },
  { id: "notes", name: "notes.md", kind: "file", parentId: "docs", size: 800 },
];
const openedFile = ref("");
</script>

<template>
  <FileBrowser
    v-model="selected"
    :items="items"
    title="Project files"
    root-label="Project"
    @open="item => openedFile = item.name"
  />
  <p v-if="openedFile">Opened: {{ openedFile }}</p>
</template>`;

export const asyncCode = `<script setup>
import { FileBrowser } from "@dicehub/kappa/blocks/file-browser";

async function loadFolder(folderId, { signal }) {
  const query = new URLSearchParams({ folder: folderId ?? "root" });
  const response = await fetch(\`/api/files?\${query}\`, { signal });
  if (!response.ok) throw new Error("Files could not be loaded.");
  return response.json(); // Direct child FileBrowserItem records.
}
</script>

<template>
  <FileBrowser :load-folder="loadFolder" title="Project files" />
</template>`;

export const editingCode = `<script setup>
import { ref } from "vue";
import { FileBrowser } from "@dicehub/kappa/blocks/file-browser";

const items = ref([
  { id: "notes", name: "notes.md", kind: "file", size: 800 },
]);
function renameItem(item, name) {
  items.value = items.value.map(value => value.id === item.id ? { ...value, name } : value);
}
function createFolder(name, { folderId }) {
  items.value.push({ id: crypto.randomUUID(), name, kind: "folder", parentId: folderId });
}
</script>

<template>
  <FileBrowser :items="items" :rename-item="renameItem" :create-folder="createFolder" />
</template>`;

export const gridCode = `<script setup>
import { ref } from "vue";
import { FileBrowser } from "@dicehub/kappa/blocks/file-browser";

const view = ref("grid");
const items = [
  { id: "docs", name: "Documents", kind: "folder" },
  { id: "images", name: "Images", kind: "folder" },
  { id: "readme", name: "README.md", kind: "file", size: 2400 },
];
</script>

<template>
  <FileBrowser
    v-model:view="view"
    :items="items"
    show-view
    title="Project files"
  />
</template>`;

export const actionsCode = `<FileBrowser
  :items="items"
  :actions="item => [{ id: 'details', label: 'Show details' }]"
  :run-action="async (action, item, { signal }) => { await showDetails(item, signal); }"
  @open="openFile"
>
  <template #selection="{ items: selected, clear }">
    <Button size="sm" @click="attachFiles(selected); clear()">Attach selected files</Button>
  </template>
</FileBrowser>`;

export const props = [
  ["items", "readonly FileBrowserItem[]", "[]", "Static tree; parentId identifies each item's parent."],
  ["loadFolder", "(folderId, { signal }) => Promise<items>", "—", "Load direct children after mount. Takes precedence over items."],
  ["rootId / rootLabel", "string | null / string", 'null / "Files"', "Initial folder and breadcrumb label. Changing rootId resets navigation."],
  ["title / description", "string", '"Files" / —', "Heading and optional supporting text."],
  ["modelValue / defaultValue", "readonly string[]", "[]", "Controlled or initial selection IDs in the current folder."],
  ["selectionMode", '"none" | "single" | "multiple"', '"multiple"', "Checkbox selection behavior."],
  ["view / defaultView", '"list" | "grid"', '— / "list"', "Controlled or initial folder presentation."],
  ["showView", "boolean", "false", "Shows the list/grid switch in the filter bar."],
  ["renameItem", "(item, name, context) => void | Promise<void>", "—", "Enables Rename. Reject to show an error."],
  ["createFolder", "(name, context) => void | Promise<void>", "—", "Enables New folder. Reject to keep the dialog open."],
  ["actions / runAction", "(item) => actions / (action, item, context) => Promise<void> | void", "—", "Additional menu actions and their host callback."],
  ["disabled", "boolean", "false", "Disables built-in user controls."],
  ["locale", "string", '"en"', "Name collation, decimal file sizes, and UTC dates."],
  ["labels / filterLabels", "Partial<FileBrowserLabels> / Partial<FilterBarLabels>", "English", "Visible and accessible labels; count and item labels are functions."],
];

export type FileBrowserDemoVariant = "preview" | "grid" | "async" | "editing";

export const fileBrowserExamples = [
  { id: "preview", title: "Static files", description: "Browse a local file tree with search, sort, selection, and folder navigation.", code: previewCode },
  { id: "grid", title: "Cards and folders", description: "Use a familiar file-explorer grid and let people switch back to the compact list.", code: gridCode },
  { id: "async", title: "Async loading", description: "Load each folder on demand with retry and request cancellation.", code: asyncCode },
  { id: "editing", title: "Rename and new folders", description: "Connect rename, folder creation, and item actions to host storage.", code: editingCode },
] as const satisfies readonly { id: FileBrowserDemoVariant; title: string; description: string; code: string }[];
