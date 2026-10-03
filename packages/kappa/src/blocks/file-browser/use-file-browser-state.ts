import { computed, onScopeDispose, ref, shallowRef, watch } from "vue";
import { FILE_BROWSER_DEFAULT_LABELS, type FileBrowserEmits, type FileBrowserItem, type FileBrowserLocation, type FileBrowserProps, type FileBrowserSort } from "./file-browser.ts";
import { fileBrowserNameError, filterFileBrowserItems, validateFileBrowserItems } from "./file-browser-logic.ts";

type Emit = <Event extends keyof FileBrowserEmits>(event: Event, ...args: FileBrowserEmits[Event]) => void;
type NameDialog = { mode: "create" | "rename"; item?: FileBrowserItem };

export function useFileBrowserState(props: Readonly<FileBrowserProps>, emit: Emit) {
  const labels = computed(() => ({ ...FILE_BROWSER_DEFAULT_LABELS, ...props.labels }));
  const path = ref<FileBrowserLocation[]>([{ id: props.rootId ?? null, name: props.rootLabel ?? "Files" }]);
  const folderId = computed(() => path.value.at(-1)!.id);
  const loaded = shallowRef<FileBrowserItem[]>([]);
  const active = ref(false);
  const loading = ref(Boolean(props.loadFolder));
  const error = ref("");
  const query = ref("");
  const sortBy = ref<FileBrowserSort>("name");
  const sortDirection = ref<"asc" | "desc">("asc");
  const internalValue = ref([...(props.defaultValue ?? [])]);
  const dialog = shallowRef<NameDialog | null>(null);
  const name = ref("");
  const formError = ref("");
  const busy = ref(false);
  const actionError = ref("");
  const message = ref("");
  let loadRequest: AbortController | undefined;
  let mutation: AbortController | undefined;
  let disposed = false;
  const blocked = computed(() => Boolean(props.disabled) || busy.value);
  const items = computed(() => props.loadFolder ? loaded.value : (props.items ?? []).filter(item => (item.parentId ?? null) === folderId.value));
  const visible = computed(() => filterFileBrowserItems(items.value, query.value, sortBy.value, sortDirection.value, props.locale));
  const selected = computed(() => {
    if (props.selectionMode === "none") return [];
    const available = new Map(items.value.filter(item => !item.disabled).map(item => [item.id, item]));
    const values = [...new Set(props.modelValue ?? internalValue.value)].flatMap(id => available.has(id) ? [available.get(id)!] : []);
    return props.selectionMode === "single" ? values.slice(0, 1) : values;
  });
  const eligible = computed(() => visible.value.filter(item => !item.disabled));
  const selectedIds = computed(() => new Set(selected.value.map(item => item.id)));
  const allSelected = computed(() => eligible.value.length > 0 && eligible.value.every(item => selectedIds.value.has(item.id)));
  const someSelected = computed(() => eligible.value.some(item => selectedIds.value.has(item.id)) && !allSelected.value);

  function updateSelection(ids: string[]) {
    const unique = [...new Set(ids)];
    internalValue.value = unique;
    emit("update:modelValue", unique);
  }
  function select(id: string, checked: boolean) {
    if (blocked.value || loading.value || props.selectionMode === "none" || !items.value.some(item => item.id === id && !item.disabled)) return;
    const next = selected.value.map(item => item.id).filter(value => value !== id);
    updateSelection(checked ? (props.selectionMode === "single" ? [id] : [...next, id]) : next);
  }
  function selectAll(checked: boolean) {
    if (blocked.value || loading.value || props.selectionMode === "none" || props.selectionMode === "single") return;
    const visibleIds = new Set(eligible.value.map(item => item.id));
    const hidden = selected.value.map(item => item.id).filter(id => !visibleIds.has(id));
    updateSelection(checked ? [...hidden, ...visibleIds] : hidden);
  }
  function clearSelection() { if (!blocked.value) updateSelection([]); }

  async function refresh() {
    if (disposed || !active.value) return;
    loadRequest?.abort();
    if (!props.loadFolder) { loading.value = false; error.value = ""; return; }
    const request = new AbortController();
    loadRequest = request;
    loading.value = true;
    error.value = "";
    try {
      const result = await props.loadFolder(folderId.value, { signal: request.signal });
      if (request.signal.aborted || disposed) return;
      loaded.value = validateFileBrowserItems(result);
    } catch (cause) {
      if (!request.signal.aborted && !disposed) {
        loaded.value = [];
        error.value = cause instanceof Error && cause.message ? cause.message : labels.value.loadError;
      }
    } finally {
      if (!request.signal.aborted && !disposed) loading.value = false;
    }
  }
  function navigate(next: FileBrowserLocation[], force = false) {
    if (blocked.value && !force) return;
    loadRequest?.abort();
    loaded.value = [];
    path.value = next;
    query.value = "";
    updateSelection([]);
    actionError.value = "";
    message.value = "";
    emit("navigate", next.map(item => ({ ...item })));
  }
  function open(item: FileBrowserItem) {
    if (blocked.value || loading.value || item.disabled) return;
    if (item.kind === "folder") {
      const ancestor = path.value.findIndex(location => location.id === item.id);
      navigate(ancestor < 0 ? [...path.value, { id: item.id, name: item.name }] : path.value.slice(0, ancestor + 1));
    } else emit("open", item);
  }
  function goTo(index: number) { if (index >= 0 && index < path.value.length - 1) navigate(path.value.slice(0, index + 1)); }

  function openNameDialog(mode: "create" | "rename", item?: FileBrowserItem) {
    if (blocked.value || loading.value || error.value || (mode === "create" ? !props.createFolder : !props.renameItem || !item || item.disabled || item.readonly)) return;
    dialog.value = { mode, item };
    name.value = mode === "rename" ? item!.name : "";
    formError.value = "";
    message.value = "";
  }
  function closeDialog() { if (!busy.value) dialog.value = null; }
  async function submitName() {
    const current = dialog.value;
    if (!current || blocked.value) return;
    if (current.mode === "rename" && (!props.renameItem || !items.value.some(item => item.id === current.item?.id && !item.disabled && !item.readonly))) {
      formError.value = labels.value.actionError;
      return;
    }
    const invalid = fileBrowserNameError(name.value, items.value, current.item?.id);
    if (invalid) { formError.value = labels.value[invalid]; return; }
    const value = name.value.trim();
    const context = { folderId: folderId.value, signal: (mutation = new AbortController()).signal };
    busy.value = true;
    formError.value = "";
    try {
      if (current.mode === "rename" && current.item && props.renameItem) await props.renameItem(current.item, value, context);
      else if (current.mode === "create" && props.createFolder) await props.createFolder(value, context);
      else return;
      if (context.signal.aborted || disposed) return;
      emit("complete", { operation: current.mode, folderId: context.folderId, item: current.item });
      if (folderId.value === context.folderId) await refresh();
      if (context.signal.aborted || disposed) return;
      // Finish the refresh before closing so the return target is enabled and mounted.
      busy.value = false;
      dialog.value = null;
      message.value = labels.value.saved;
    } catch (cause) {
      if (!context.signal.aborted && !disposed) formError.value = cause instanceof Error && cause.message ? cause.message : labels.value.actionError;
    } finally {
      if (!context.signal.aborted && !disposed) busy.value = false;
    }
  }
  async function runAction(id: string, item: FileBrowserItem) {
    if (blocked.value || loading.value || item.disabled || !props.runAction) return;
    const action = props.actions?.(item).find(action => action.id === id);
    if (!action || action.disabled) return;
    const context = { folderId: folderId.value, signal: (mutation = new AbortController()).signal };
    busy.value = true;
    actionError.value = "";
    message.value = "";
    try {
      await props.runAction(id, item, context);
      if (context.signal.aborted || disposed) return;
      message.value = labels.value.saved;
      emit("complete", { operation: "action", action: id, item, folderId: context.folderId });
      if (folderId.value === context.folderId) await refresh();
    } catch (cause) {
      if (!context.signal.aborted && !disposed) actionError.value = cause instanceof Error && cause.message ? cause.message : labels.value.actionError;
    } finally {
      if (!context.signal.aborted && !disposed) busy.value = false;
    }
  }

  watch([folderId, () => props.loadFolder, active], () => { void refresh(); });
  watch(() => props.rootId, () => {
    mutation?.abort(); loadRequest?.abort(); busy.value = false; dialog.value = null;
    navigate([{ id: props.rootId ?? null, name: props.rootLabel ?? "Files" }], true);
  });
  watch(() => [items.value.map(item => [item.id, item.disabled]), loading.value], () => {
    if (loading.value || error.value) return;
    const available = new Set(items.value.filter(item => !item.disabled).map(item => item.id));
    const value = props.modelValue ?? internalValue.value;
    if (value.some(id => !available.has(id))) updateSelection(value.filter(id => available.has(id)));
  });
  watch(() => props.rootLabel, label => { path.value[0].name = label ?? "Files"; });
  watch(name, () => { formError.value = ""; });
  onScopeDispose(() => { disposed = true; loadRequest?.abort(); mutation?.abort(); });
  return { labels, path, folderId, items, visible, loading, error, query, sortBy, sortDirection, selected, selectedIds, eligible, allSelected, someSelected, dialog, name, formError, busy, blocked, actionError, message,
    activate: () => { active.value = true; }, refresh, select, selectAll, clearSelection, open, goTo, openNameDialog, closeDialog, submitName, runAction };
}
