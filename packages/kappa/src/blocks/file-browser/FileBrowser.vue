<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { Breadcrumbs } from "../../components/breadcrumbs";
import { Button } from "../../components/button";
import { Checkbox, type CheckboxCheckedChangeDetails } from "../../components/checkbox";
import { ContextMenu } from "../../components/context-menu";
import { FilterBar } from "../../components/filter-bar";
import { Loader } from "../../components/loader";
import { Table } from "../../components/table";
import FileBrowserIcon from "./FileBrowserIcon.vue";
import FileBrowserControlIcon from "./FileBrowserControlIcon.vue";
import FileBrowserItemActions from "./FileBrowserItemActions.vue";
import FileBrowserNameDialog from "./FileBrowserNameDialog.vue";
import type { FileBrowserEmits, FileBrowserItem, FileBrowserProps, FileBrowserSlots, FileBrowserSort, FileBrowserView } from "./file-browser";
import { formatFileBrowserDate, formatFileBrowserSize } from "./file-browser-logic";
import { useFileBrowserState } from "./use-file-browser-state";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<FileBrowserProps>(), {
  items: () => [], rootId: null, rootLabel: "Files", title: "Files", modelValue: undefined,
  defaultValue: () => [], selectionMode: "multiple", defaultView: "list", showView: false,
  disabled: false, locale: "en",
});
const emit = defineEmits<FileBrowserEmits>();
defineSlots<FileBrowserSlots>();
const state = useFileBrowserState(props, emit);
const { labels, path, folderId, visible, loading, error, query, sortBy, sortDirection, selected, selectedIds, eligible, allSelected, someSelected, dialog, name, formError, busy, blocked, actionError, message } = state;
const root = ref<HTMLElement | null>(null);
const content = ref<HTMLElement | null>(null);
const internalView = ref<FileBrowserView>(props.defaultView);
const currentView = computed(() => props.view ?? internalView.value);
const contextItem = ref<FileBrowserItem | null>(null);
const contextTarget = ref<HTMLElement | null>(null);
const contextOpen = ref(false);
const contextAnchor = ref<{ x: number; y: number }>();
let focusTarget: HTMLElement | null = null;
const finalFocusEl = () => focusTarget?.isConnected ? focusTarget : root.value?.querySelector<HTMLElement>('input[type="search"]') ?? null;
const sortOptions = computed(() => [{ value: "name", label: labels.value.name }, { value: "modified", label: labels.value.modified }, { value: "size", label: labels.value.size }]);
const filterLabels = computed(() => ({ root: "Filter files", search: "Search files", searchPlaceholder: "Filter files by name…", ...props.filterLabels }));
const status = computed(() => loading.value ? "loading" : error.value ? "error" : visible.value.length ? "ready" : "empty");

function openCreate(event: MouseEvent) {
  focusTarget = event.currentTarget as HTMLElement;
  state.openNameDialog("create");
}
function openRename(item: FileBrowserItem, element: HTMLElement | null) {
  focusTarget = element;
  state.openNameDialog("rename", item);
}
function updateSort(value: string) { if (["name", "modified", "size"].includes(value)) sortBy.value = value as FileBrowserSort; }
function updateView(value: string) {
  if (value !== "list" && value !== "grid") return;
  if (props.view === undefined) internalView.value = value;
  emit("update:view", value);
}
function rememberContextItem(event: MouseEvent) {
  event.preventDefault();
  const target = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-file-id]") : null;
  contextTarget.value = target;
  contextItem.value = target ? visible.value.find(item => item.id === target.dataset.fileId) ?? null : null;
  contextAnchor.value = { x: event.clientX, y: event.clientY };
  contextOpen.value = true;
}
function handleContextKeydown(event: KeyboardEvent) {
  if (!(event.shiftKey && event.key === "F10") && event.key !== "ContextMenu") return;
  event.preventDefault();
  const target = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-file-id]") : null;
  contextTarget.value = target;
  contextItem.value = target ? visible.value.find(item => item.id === target.dataset.fileId) ?? null : null;
  const rect = target?.getBoundingClientRect() ?? root.value?.getBoundingClientRect();
  if (!rect) return;
  contextAnchor.value = { x: rect.left + Math.min(rect.width / 2, 24), y: rect.bottom };
  contextOpen.value = true;
}
function openContextRename() {
  if (!contextItem.value) return;
  openRename(contextItem.value, contextTarget.value?.querySelector<HTMLElement>(".kappa-file-browser__open") ?? null);
}
function selectCard(item: FileBrowserItem, details: CheckboxCheckedChangeDetails) {
  state.select(item.id, details.checked === "indeterminate" ? true : Boolean(details.checked));
}
onMounted(state.activate);
watch(folderId, async () => {
  if (!root.value?.contains(root.value.ownerDocument.activeElement)) return;
  await nextTick();
  content.value?.focus();
});
defineExpose({ refresh: state.refresh });
</script>

<template>
  <section ref="root" v-bind="$attrs" class="kappa-file-browser" data-slot="file-browser" :data-state="status" :aria-label="title">
    <header class="kappa-file-browser__header">
      <div class="kappa-file-browser__identity"><h2 class="kappa-file-browser__title">{{ title }}</h2><p v-if="description" class="kappa-file-browser__description">{{ description }}</p></div>
      <div class="kappa-file-browser__actions">
        <slot name="actions" :folder-id="folderId" :refresh="state.refresh" />
        <Button v-if="createFolder" size="sm" variant="secondary" :disabled="blocked || loading || Boolean(error)" :icon="FileBrowserControlIcon" :icon-props="{ name: 'add' }" @click="openCreate">{{ labels.newFolder }}</Button>
      </div>
    </header>
    <div class="kappa-file-browser__location">
      <Breadcrumbs :aria-label="rootLabel">
        <Breadcrumbs.List>
          <template v-for="(location, index) in path" :key="location.id ?? 'root'">
            <Breadcrumbs.Separator v-if="index" />
            <Breadcrumbs.Item>
              <Breadcrumbs.Page v-if="index === path.length - 1">{{ location.name }}</Breadcrumbs.Page>
              <Breadcrumbs.Link v-else as-child><button type="button" :disabled="blocked" @click="state.goTo(index)">{{ location.name }}</button></Breadcrumbs.Link>
            </Breadcrumbs.Item>
          </template>
        </Breadcrumbs.List>
      </Breadcrumbs>
      <Button v-if="loadFolder" size="sm" variant="ghost" shape="square" :aria-label="labels.refresh" :disabled="blocked || loading" :icon="FileBrowserControlIcon" :icon-props="{ name: 'refresh' }" @click="state.refresh" />
    </div>
    <FilterBar v-model="query" :sort-by="sortBy" v-model:sort-direction="sortDirection" :sort-options="sortOptions" :labels="filterLabels" :disabled="blocked" :show-view="showView" :view="currentView" class="kappa-file-browser__filters" @update:sort-by="updateSort" @update:view="updateView" />
    <div v-if="actionError" class="kappa-file-browser__action-error" role="alert"><span>{{ actionError }}</span><Button size="sm" variant="ghost" @click="actionError = ''">{{ labels.dismiss }}</Button></div>
    <div ref="content" class="kappa-file-browser__body" tabindex="-1" role="region" :aria-label="path.at(-1)?.name" :aria-busy="loading || busy" @contextmenu.capture="rememberContextItem" @keydown.capture="handleContextKeydown">
          <div v-if="loading" class="kappa-file-browser__state" role="status"><Loader decorative size="sm" /><span>{{ labels.loading }}</span></div>
          <div v-else-if="error" class="kappa-file-browser__state" role="alert"><span>{{ error }}</span><Button size="sm" variant="secondary" :disabled="blocked" @click="state.refresh">{{ labels.retry }}</Button></div>
          <div v-else-if="!visible.length" class="kappa-file-browser__state" role="status"><FileBrowserIcon kind="folder" /><span>{{ query.trim() ? labels.noResults : labels.empty }}</span><Button v-if="query.trim()" size="sm" variant="ghost" :disabled="blocked" @click="query = ''">{{ labels.clearSearch }}</Button></div>
          <div v-else-if="currentView === 'list'" class="kappa-file-browser__scroll" tabindex="0" role="region" :aria-label="path.at(-1)?.name">
            <Table compact :aria-label="path.at(-1)?.name" class="kappa-file-browser__table">
              <Table.Header>
                <Table.Row>
                  <Table.CheckHead v-if="selectionMode === 'multiple'" :checked="allSelected" :indeterminate="someSelected" :disabled="blocked || !eligible.length" :label="labels.selectAll" @update:checked="state.selectAll" />
                  <Table.Head v-else-if="selectionMode === 'single'"><span class="kappa-file-browser__sr">{{ labels.selected(1) }}</span></Table.Head>
                  <Table.Head>{{ labels.name }}</Table.Head><Table.Head class="kappa-file-browser__size">{{ labels.size }}</Table.Head><Table.Head class="kappa-file-browser__modified">{{ labels.modified }}</Table.Head><Table.Head class="kappa-file-browser__menu-cell"><span class="kappa-file-browser__sr">{{ labels.actions('') }}</span></Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row v-for="item in visible" :key="item.id" :variant="selectedIds.has(item.id) ? 'selected' : 'default'" :data-file-id="item.id" :data-disabled="item.disabled || undefined">
                  <Table.CheckCell v-if="selectionMode !== 'none'" :checked="selectedIds.has(item.id)" :disabled="blocked || item.disabled" :label="labels.select(item.name)" @update:checked="state.select(item.id, $event)" />
                  <Table.Cell class="kappa-file-browser__name-cell">
                    <button type="button" class="kappa-file-browser__open" :disabled="blocked || item.disabled" @click="state.open(item)"><span class="kappa-file-browser__media"><slot name="icon" :item="item"><FileBrowserIcon :kind="item.kind" /></slot></span><span class="kappa-file-browser__name">{{ item.name }}</span><span class="kappa-file-browser__sr"> ({{ item.kind === 'folder' ? labels.folder : labels.file }})</span></button>
                  </Table.Cell>
                  <Table.Cell class="kappa-file-browser__size">{{ item.kind === 'folder' ? '—' : formatFileBrowserSize(item.size, locale) }}</Table.Cell>
                  <Table.Cell class="kappa-file-browser__modified"><time v-if="item.modifiedAt" :datetime="item.modifiedAt">{{ formatFileBrowserDate(item.modifiedAt, locale) }}</time><template v-else>—</template></Table.Cell>
                  <Table.Cell class="kappa-file-browser__menu-cell"><FileBrowserItemActions :item="item" :labels="labels" :can-rename="Boolean(renameItem)" :actions="runAction ? actions?.(item) ?? [] : []" :disabled="blocked" @open="state.open(item)" @rename="openRename(item, $event)" @action="state.runAction($event, item)" /></Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </div>
          <div v-else class="kappa-file-browser__scroll kappa-file-browser__grid-scroll" tabindex="0" role="region" :aria-label="path.at(-1)?.name">
            <div class="kappa-file-browser__grid" role="list">
              <article v-for="item in visible" :key="item.id" class="kappa-file-browser__card" role="listitem" :data-file-id="item.id" :data-selected="selectedIds.has(item.id) || undefined" :data-disabled="item.disabled || undefined">
                <div class="kappa-file-browser__card-controls">
                  <Checkbox v-if="selectionMode !== 'none'" :checked="selectedIds.has(item.id)" :disabled="blocked || item.disabled" :aria-label="labels.select(item.name)" @checked-change="selectCard(item, $event)"><Checkbox.Control /></Checkbox>
                  <FileBrowserItemActions :item="item" :labels="labels" :can-rename="Boolean(renameItem)" :actions="runAction ? actions?.(item) ?? [] : []" :disabled="blocked" @open="state.open(item)" @rename="openRename(item, $event)" @action="state.runAction($event, item)" />
                </div>
                <button type="button" class="kappa-file-browser__open kappa-file-browser__card-open" :disabled="blocked || item.disabled" @click="state.open(item)">
                  <span class="kappa-file-browser__media"><slot name="icon" :item="item"><FileBrowserIcon :kind="item.kind" /></slot></span>
                  <span class="kappa-file-browser__name">{{ item.name }}</span><span class="kappa-file-browser__sr"> ({{ item.kind === 'folder' ? labels.folder : labels.file }})</span>
                  <span class="kappa-file-browser__card-meta">{{ item.kind === 'folder' ? labels.folder : formatFileBrowserSize(item.size, locale) }}</span>
                </button>
                <time v-if="item.modifiedAt" class="kappa-file-browser__card-date" :datetime="item.modifiedAt">{{ formatFileBrowserDate(item.modifiedAt, locale) }}</time>
              </article>
            </div>
          </div>
    </div>
    <ContextMenu.Root v-model:open="contextOpen" :anchor-point="contextAnchor" :aria-label="labels.contextMenu" lazy-mount unmount-on-exit>
      <ContextMenu.Content>
        <ContextMenu.Group>
          <ContextMenu.Label>{{ contextItem?.name ?? path.at(-1)?.name }}</ContextMenu.Label>
          <template v-if="contextItem">
            <ContextMenu.Item value="open" :disabled="blocked || contextItem.disabled" @select="state.open(contextItem)">{{ labels.open }}</ContextMenu.Item>
            <ContextMenu.Item v-if="renameItem" value="rename" :disabled="blocked || contextItem.disabled || contextItem.readonly" @select="openContextRename">{{ labels.rename }}</ContextMenu.Item>
            <ContextMenu.Separator v-if="runAction && (actions?.(contextItem).length ?? 0) > 0" />
            <ContextMenu.Item v-for="action in runAction ? actions?.(contextItem) ?? [] : []" :key="action.id" :value="`custom:${action.id}`" :disabled="blocked || contextItem.disabled || action.disabled" :variant="action.destructive ? 'destructive' : 'default'" @select="state.runAction(action.id, contextItem)">{{ action.label }}</ContextMenu.Item>
          </template>
          <template v-else>
            <ContextMenu.Item v-if="createFolder" value="new-folder" :disabled="blocked || loading || Boolean(error)" @select="state.openNameDialog('create')">{{ labels.newFolder }}</ContextMenu.Item>
            <ContextMenu.Item v-if="loadFolder" value="refresh" :disabled="blocked || loading" @select="state.refresh">{{ labels.refresh }}</ContextMenu.Item>
            <ContextMenu.Item v-if="!createFolder && !loadFolder" value="none" disabled>{{ labels.noActions }}</ContextMenu.Item>
          </template>
        </ContextMenu.Group>
      </ContextMenu.Content>
    </ContextMenu.Root>
    <footer class="kappa-file-browser__footer">
      <span role="status">{{ loading || error ? '' : labels.count(visible.length) }}<template v-if="selected.length"> · {{ labels.selected(selected.length) }}</template></span>
      <template v-if="selected.length"><slot name="selection" :items="selected" :clear="state.clearSelection"><Button size="sm" variant="ghost" :disabled="blocked" @click="state.clearSelection">{{ labels.clearSelection }}</Button></slot></template>
      <span class="kappa-file-browser__sr" role="status">{{ message }}</span>
    </footer>
    <FileBrowserNameDialog :open="Boolean(dialog)" :mode="dialog?.mode ?? 'create'" v-model:name="name" :error="formError" :busy="busy" :disabled="props.disabled" :labels="labels" :final-focus-el="finalFocusEl" @close="state.closeDialog" @submit="state.submitName" />
  </section>
</template>

<style src="./file-browser.css"></style>
