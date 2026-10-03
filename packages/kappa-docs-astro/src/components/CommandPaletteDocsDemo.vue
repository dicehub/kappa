<script setup lang="ts">
import { ChartLine, File, Folder, House, Search, Settings, Users } from "@lucide/vue";
import { computed, onBeforeUnmount, ref } from "vue";
import { Button } from "@dicehub/kappa/components/button";
import { CommandPalette } from "@dicehub/kappa/components/command-palette";

type DemoVariant =
  | "autocomplete-off"
  | "grouped"
  | "loading"
  | "preview"
  | "result-item"
  | "simple";
type CommandItem = {
  description?: string;
  disabled?: boolean;
  icon?: object;
  id: string;
  title: string;
};
type CommandGroup = { id: string; items: CommandItem[]; label: string };
type SearchResult = {
  breadcrumbs: string[];
  description?: string;
  id: string;
  title: string;
};

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), { variant: "preview" });
const sampleGroups: CommandGroup[] = [
  {
    id: "commands",
    label: "Commands",
    items: [
      { id: "new-project", title: "Create new project", icon: Folder },
      { id: "settings", title: "Open settings", icon: Settings },
      { id: "search", title: "Search files", icon: Search },
      { id: "restart", title: "Restart active worker", disabled: true },
    ],
  },
  {
    id: "pages",
    label: "Pages",
    items: [
      { id: "home", title: "Home", icon: House },
      { id: "dashboard", title: "Dashboard", icon: ChartLine },
      { id: "users", title: "Users", icon: Users },
    ],
  },
];
const simpleItems: CommandItem[] = [
  { id: "copy", title: "Copy" },
  { id: "paste", title: "Paste" },
  { id: "cut", title: "Cut" },
  { id: "delete", title: "Delete" },
  { id: "select-all", title: "Select all" },
];
const searchResults: SearchResult[] = [
  { id: "button", title: "Button", breadcrumbs: ["Components"] },
  { id: "dialog", title: "Dialog", breadcrumbs: ["Components"] },
  {
    id: "page-header",
    title: "Page Header",
    breadcrumbs: ["Blocks"],
    description: "Technical page heading and actions",
  },
];

const groupedOpen = ref(false);
const groupedSearch = ref("");
const groupedSelected = ref("");
const simpleOpen = ref(false);
const loadingOpen = ref(false);
const loadingSearch = ref("");
const loading = ref(false);
const autocompleteOpen = ref(false);
const autocompleteSearch = ref("");
const resultOpen = ref(false);
const resultSearch = ref("");
let loadingTimer: ReturnType<typeof window.setTimeout> | undefined;

const filterGroups = (groups: CommandGroup[], query: string) => {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (!normalizedQuery) return groups;
  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        `${item.title} ${item.description ?? ""}`.toLocaleLowerCase().includes(normalizedQuery),
      ),
    }))
    .filter((group) => group.items.length);
};
const filterItems = <T extends { title: string }>(items: T[], query: string) => {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  return normalizedQuery
    ? items.filter((item) => item.title.toLocaleLowerCase().includes(normalizedQuery))
    : items;
};
const getSelectableItems = (groups: unknown[]) =>
  (groups as CommandGroup[]).flatMap((group) => group.items);
const itemToTitle = (item: unknown) => (item as { title?: string }).title ?? "";
const isItemDisabled = (item: unknown) => (item as CommandItem).disabled === true;

const filteredGroups = computed(() => filterGroups(sampleGroups, groupedSearch.value));
const filteredLoadingGroups = computed(() => filterGroups(sampleGroups, loadingSearch.value));
const filteredAutocompleteGroups = computed(() =>
  filterGroups(sampleGroups, autocompleteSearch.value),
);
const filteredSearchResults = computed(() => filterItems(searchResults, resultSearch.value));

const openGrouped = () => {
  groupedSearch.value = "";
  groupedOpen.value = true;
};
const resetGrouped = () => {
  groupedOpen.value = false;
  groupedSearch.value = "";
};
const selectGroupedItem = (item: unknown) => {
  groupedSelected.value = itemToTitle(item);
  resetGrouped();
};
const closeSimple = () => {
  simpleOpen.value = false;
};
const openSimple = () => {
  simpleOpen.value = true;
};
const closeAutocomplete = () => {
  autocompleteOpen.value = false;
  autocompleteSearch.value = "";
};
const openAutocomplete = () => {
  autocompleteSearch.value = "";
  autocompleteOpen.value = true;
};
const closeResult = () => {
  resultOpen.value = false;
  resultSearch.value = "";
};
const openResult = () => {
  resultSearch.value = "";
  resultOpen.value = true;
};
const closeLoading = () => {
  loadingOpen.value = false;
  loadingSearch.value = "";
  loading.value = false;
  if (loadingTimer !== undefined) window.clearTimeout(loadingTimer);
};
const openLoading = () => {
  if (loadingTimer !== undefined) window.clearTimeout(loadingTimer);
  loadingSearch.value = "";
  loadingOpen.value = true;
  loading.value = true;
  loadingTimer = window.setTimeout(() => {
    loading.value = false;
  }, 2_000);
};

onBeforeUnmount(() => {
  if (loadingTimer !== undefined) window.clearTimeout(loadingTimer);
});
</script>

<template>
  <div class="command-palette-demo" :data-command-palette-demo="props.variant">
    <template v-if="props.variant === 'preview' || props.variant === 'grouped'">
      <Button @click="openGrouped">Open Command Palette</Button>
      <p v-if="groupedSelected" class="command-palette-demo__selected">
        Last selected: <span>{{ groupedSelected }}</span>
      </p>
      <CommandPalette.Root
        v-model:open="groupedOpen"
        v-model:value="groupedSearch"
        :data-command-palette-demo-surface="props.variant"
        :filter="false"
        :get-selectable-items="getSelectableItems"
        :is-item-disabled="isItemDisabled"
        :item-to-string-value="itemToTitle"
        :items="filteredGroups"
        @select="selectGroupedItem"
      >
        <CommandPalette.Input placeholder="Type a command or search..." />
        <CommandPalette.List>
          <CommandPalette.Results v-slot="{ item: group }">
            <CommandPalette.Group :items="(group as CommandGroup).items">
              <CommandPalette.GroupLabel>{{ (group as CommandGroup).label }}</CommandPalette.GroupLabel>
              <CommandPalette.Items v-slot="{ item }">
                <CommandPalette.Item
                  :disabled="(item as CommandItem).disabled"
                  :value="item"
                >
                  <span class="command-palette-demo__item">
                    <component
                      :is="(item as CommandItem).icon"
                      v-if="(item as CommandItem).icon"
                      :size="16"
                      aria-hidden="true"
                    />
                    <span>{{ (item as CommandItem).title }}</span>
                  </span>
                </CommandPalette.Item>
              </CommandPalette.Items>
            </CommandPalette.Group>
          </CommandPalette.Results>
          <CommandPalette.Empty>No commands found.</CommandPalette.Empty>
        </CommandPalette.List>
        <CommandPalette.Footer>
          <span><kbd>↑↓</kbd> Navigate</span>
          <span><kbd>Enter</kbd> Select</span>
        </CommandPalette.Footer>
      </CommandPalette.Root>
    </template>

    <template v-else-if="props.variant === 'simple'">
      <Button @click="openSimple">Open Simple Palette</Button>
      <CommandPalette.Root
        v-model:open="simpleOpen"
        :data-command-palette-demo-surface="props.variant"
        :items="simpleItems"
        @select="closeSimple"
      >
        <CommandPalette.Input placeholder="Search actions..." />
        <CommandPalette.List>
          <CommandPalette.Results v-slot="{ item }">
            <CommandPalette.Item :value="item">{{ (item as CommandItem).title }}</CommandPalette.Item>
          </CommandPalette.Results>
          <CommandPalette.Empty>No actions found.</CommandPalette.Empty>
        </CommandPalette.List>
      </CommandPalette.Root>
    </template>

    <template v-else-if="props.variant === 'loading'">
      <Button @click="openLoading">Open with Loading</Button>
      <CommandPalette.Root
        v-model:open="loadingOpen"
        v-model:value="loadingSearch"
        :data-command-palette-demo-surface="props.variant"
        :filter="false"
        :get-selectable-items="getSelectableItems"
        :item-to-string-value="itemToTitle"
        :items="filteredLoadingGroups"
        @select="closeLoading"
      >
        <CommandPalette.Input placeholder="Search..." />
        <CommandPalette.List>
          <CommandPalette.Loading v-if="loading" />
          <CommandPalette.Results v-show="!loading" v-slot="{ item: group }">
            <CommandPalette.Group :items="(group as CommandGroup).items">
              <CommandPalette.GroupLabel>{{ (group as CommandGroup).label }}</CommandPalette.GroupLabel>
              <CommandPalette.Items v-slot="{ item }">
                <CommandPalette.Item :value="item">{{ (item as CommandItem).title }}</CommandPalette.Item>
              </CommandPalette.Items>
            </CommandPalette.Group>
          </CommandPalette.Results>
          <CommandPalette.Empty v-show="!loading">No results found.</CommandPalette.Empty>
        </CommandPalette.List>
      </CommandPalette.Root>
    </template>

    <template v-else-if="props.variant === 'autocomplete-off'">
      <Button @click="openAutocomplete">Open Palette (No Autocomplete)</Button>
      <CommandPalette.Root
        v-model:open="autocompleteOpen"
        v-model:value="autocompleteSearch"
        :data-command-palette-demo-surface="props.variant"
        :filter="false"
        :get-selectable-items="getSelectableItems"
        :item-to-string-value="itemToTitle"
        :items="filteredAutocompleteGroups"
        @select="closeAutocomplete"
      >
        <CommandPalette.Input
          autocomplete="off"
          autocapitalize="none"
          autocorrect="off"
          data-1p-ignore="true"
          data-lpignore="true"
          placeholder="Search commands..."
          :spellcheck="false"
        />
        <CommandPalette.List>
          <CommandPalette.Results v-slot="{ item: group }">
            <CommandPalette.Group :items="(group as CommandGroup).items">
              <CommandPalette.GroupLabel>{{ (group as CommandGroup).label }}</CommandPalette.GroupLabel>
              <CommandPalette.Items v-slot="{ item }">
                <CommandPalette.Item :value="item">{{ (item as CommandItem).title }}</CommandPalette.Item>
              </CommandPalette.Items>
            </CommandPalette.Group>
          </CommandPalette.Results>
          <CommandPalette.Empty>No commands found.</CommandPalette.Empty>
        </CommandPalette.List>
      </CommandPalette.Root>
    </template>

    <template v-else>
      <Button @click="openResult">Open with ResultItem</Button>
      <CommandPalette.Root
        v-model:open="resultOpen"
        v-model:value="resultSearch"
        :data-command-palette-demo-surface="props.variant"
        :filter="false"
        :item-to-string-value="itemToTitle"
        :items="filteredSearchResults"
        @select="closeResult"
      >
        <CommandPalette.Input placeholder="Search documentation..." />
        <CommandPalette.List>
          <CommandPalette.Results v-slot="{ item }">
            <CommandPalette.ResultItem
              :breadcrumbs="(item as SearchResult).breadcrumbs"
              :description="(item as SearchResult).description"
              :title="(item as SearchResult).title"
              :value="item"
            >
              <template #icon><File :size="16" aria-hidden="true" /></template>
            </CommandPalette.ResultItem>
          </CommandPalette.Results>
          <CommandPalette.Empty>No pages found.</CommandPalette.Empty>
        </CommandPalette.List>
        <CommandPalette.Footer>
          <span><kbd>↑↓</kbd> Navigate</span>
          <span><kbd>Ctrl Enter</kbd> New tab</span>
        </CommandPalette.Footer>
      </CommandPalette.Root>
    </template>
  </div>
</template>

<style scoped>
.command-palette-demo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
}

.command-palette-demo__selected {
  margin: 0;
  color: var(--kappa-subtle);
  font-size: 0.875rem;
}

.command-palette-demo__selected span {
  color: var(--kappa-default);
  font-weight: 600;
}

.command-palette-demo__item {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
}

.command-palette-demo__item svg {
  color: var(--kappa-subtle);
}

kbd {
  color: inherit;
  font: inherit;
  font-weight: 600;
}
</style>
