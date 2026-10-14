<script setup lang="ts">
import { ref } from "vue";
import { FileBrowser, type FileBrowserFolderId, type FileBrowserItem, type FileBrowserRequest, type FileBrowserMutationContext } from "@dicehub/kappa/blocks/file-browser";
const params = new URL(location.href).searchParams;
const endpoint = `${params.get("api")}/cases/${params.get("case")}`;
const mounted = ref(true), disabled = ref(false), root = ref<FileBrowserFolderId>(null);
const events = ref<string[]>([]), selection = ref<string[]>(["alpha", "docs"]);
const controlled = params.has("controlled"), ignoreAbort = params.has("ignore-abort");
const initialItems: FileBrowserItem[] = [
  { id: "beta", name: "beta.txt", kind: "file", size: 0, modifiedAt: "not a date" },
  { id: "alpha", name: "alpha.txt", kind: "file", size: 1500, modifiedAt: "2026-09-22T23:00:00Z" },
  { id: "disabled", name: "disabled.txt", kind: "file", size: -1, disabled: true },
  { id: "docs", name: "Documents", kind: "folder" },
  { id: "child", name: "notes.txt", kind: "file", parentId: "docs" },
];
const items = ref<FileBrowserItem[]>(initialItems);
const browser = ref<InstanceType<typeof FileBrowser>>();
const record = (name: string, value: unknown) => events.value.push(`${name}:${JSON.stringify(value)}`);
async function request(operation: string, folderId: FileBrowserFolderId, signal: AbortSignal, input?: unknown) {
  signal.addEventListener("abort", () => record("abort", { operation, folderId }), { once: true });
  const response = await fetch(`${endpoint}/${operation}?folder=${encodeURIComponent(folderId ?? "root")}`, {
    signal: ignoreAbort ? undefined : signal,
    ...(input ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) } : {}),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error);
  record("response", { operation, folderId });
  return result;
}
const loadFolder = (id: FileBrowserFolderId, { signal }: FileBrowserRequest): Promise<FileBrowserItem[]> => request("folder", id, signal);
const renameItem = (item: FileBrowserItem, name: string, { signal, folderId }: FileBrowserMutationContext) => request("rename", folderId, signal, { id: item.id, name });
const createFolder = (name: string, { signal, folderId }: FileBrowserMutationContext) => request("create", folderId, signal, { name });
const runAction = (action: string, item: FileBrowserItem, { signal, folderId }: FileBrowserMutationContext) => request("action", folderId, signal, { action, id: item.id });
</script>

<template>
  <main>
    <h1>File browser consumer</h1>
    <div aria-label="Consumer controls">
      <button @click="root = 'replacement'">Change root</button>
      <button @click="disabled = !disabled">Toggle disabled</button>
      <button @click="mounted = false">Unmount browser</button>
      <button @click="browser?.refresh()">Refresh through public API</button>
      <template v-if="params.has('static')">
        <button @click="items = initialItems.map(item => item.id === 'alpha' ? { ...item, disabled: true } : item)">Disable alpha</button>
        <button @click="items = initialItems.filter(item => item.id !== 'alpha')">Remove alpha</button>
        <button @click="items = initialItems">Restore items</button>
      </template>
    </div>
    <FileBrowser v-if="mounted" ref="browser" title="Project files" root-label="Project" :root-id="root" :disabled="disabled"
      :items="params.has('static') ? items : undefined" :load-folder="params.has('static') ? undefined : loadFolder"
      locale="en-US" :rename-item="renameItem" :create-folder="createFolder" :run-action="runAction"
      :actions="() => [{ id: 'download', label: 'Download' }, { id: 'forbidden', label: 'Restricted', disabled: true }]"
      :selection-mode="params.has('single') ? 'single' : 'multiple'" :model-value="controlled ? selection : undefined"
      @update:model-value="record('selection', $event)" @complete="record('complete', $event)"
      @navigate="record('navigate', $event)" @open="record('open', $event)" />
    <output aria-label="Public events">{{ events.join('\n') }}</output>
    <output v-if="params.has('static')" aria-label="Consumer source order">{{ items.map(item => item.id).join(',') }}</output>
  </main>
</template>
