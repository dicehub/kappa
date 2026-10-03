<script setup lang="ts">
import { navigate } from "astro:transitions/client";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { CommandPalette } from "@dicehub/kappa/components/command-palette";
import {
  docsSearchItems,
  type DocsSearchItem,
  type DocsSearchKind,
} from "../data/docs-nav";

type SearchGroup = { items: DocsSearchItem[]; label: string };

const sectionOrder = ["Guides", "Components", "Charts", "Blocks"];
const kindLabels: Record<DocsSearchKind, string> = {
  block: "BL",
  chart: "CH",
  component: "CO",
  guide: "GU",
};
const open = ref(false);
const query = ref("");
const normalizedQuery = computed(() => query.value.trim().toLocaleLowerCase());
const queryTerms = computed(() => normalizedQuery.value.split(/\s+/).filter(Boolean));

const scoreItem = (item: DocsSearchItem) => {
  if (!normalizedQuery.value) return 0;
  const label = item.label.toLocaleLowerCase();
  const section = item.section.toLocaleLowerCase();
  const description = item.description.toLocaleLowerCase();
  const searchable = `${label} ${section} ${description} ${item.href.toLocaleLowerCase()}`;
  if (!queryTerms.value.every((term) => searchable.includes(term))) return Number.POSITIVE_INFINITY;
  if (label === normalizedQuery.value) return 0;
  if (label.startsWith(normalizedQuery.value)) return 1;
  if (label.includes(normalizedQuery.value)) return 2;
  if (section.includes(normalizedQuery.value)) return 3;
  return description.includes(normalizedQuery.value) ? 4 : 5;
};

const filteredItems = computed(() =>
  docsSearchItems
    .map((item) => ({ item, score: scoreItem(item) }))
    .filter(({ score }) => Number.isFinite(score))
    .sort((first, second) => first.score - second.score || first.item.label.localeCompare(second.item.label))
    .map(({ item }) => item),
);
const groups = computed<SearchGroup[]>(() => {
  if (normalizedQuery.value) {
    return filteredItems.value.length ? [{ label: "Results", items: filteredItems.value }] : [];
  }
  return sectionOrder
    .map((section) => ({
      label: section,
      items: docsSearchItems.filter((item) => item.section === section),
    }))
    .filter((group) => group.items.length);
});

const getSelectableItems = (items: unknown[]) =>
  (items as SearchGroup[]).flatMap((group) => group.items);
const itemToStringValue = (item: unknown) => (item as DocsSearchItem).label;
const findHighlights = (text: string) => {
  if (!normalizedQuery.value) return [];
  const index = text.toLocaleLowerCase().indexOf(normalizedQuery.value);
  return index < 0 ? [] : ([[index, index + normalizedQuery.value.length - 1]] as [number, number][]);
};

const syncTriggers = () => {
  document.querySelectorAll<HTMLElement>("[data-docs-search-open]").forEach((trigger) => {
    trigger.setAttribute("aria-expanded", open.value ? "true" : "false");
    trigger.setAttribute("data-docs-search-ready", "true");
  });
};
const openSearch = () => {
  open.value = true;
};
const handleDocumentClick = (event: MouseEvent) => {
  const target = event.target instanceof Element ? event.target : null;
  if (target?.closest("[data-docs-search-open]")) openSearch();
};
const handleDocumentKeydown = (event: KeyboardEvent) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLocaleLowerCase() === "k") {
    event.preventDefault();
    openSearch();
  }
};
const navigateToItem = async (value: unknown, options: { newTab: boolean }) => {
  const item = value as DocsSearchItem;
  open.value = false;
  if (options.newTab) window.open(item.href, "_blank", "noopener,noreferrer");
  else await navigate(item.href);
};

watch(open, (isOpen) => {
  syncTriggers();
  if (!isOpen) query.value = "";
});

onMounted(() => {
  document.addEventListener("click", handleDocumentClick);
  document.addEventListener("keydown", handleDocumentKeydown);
  document.addEventListener("astro:page-load", syncTriggers);
  syncTriggers();
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleDocumentClick);
  document.removeEventListener("keydown", handleDocumentKeydown);
  document.removeEventListener("astro:page-load", syncTriggers);
});
</script>

<template>
  <CommandPalette.Root
    id="docs-search-dialog"
    v-model:open="open"
    v-model:value="query"
    aria-label="Search documentation"
    :filter="false"
    :get-selectable-items="getSelectableItems"
    :item-to-string-value="itemToStringValue"
    :items="groups"
    @select="navigateToItem"
  >
    <CommandPalette.Input aria-label="Search documentation" placeholder="Search documentation..." />
    <CommandPalette.List>
      <CommandPalette.Results v-slot="{ item: group }">
        <CommandPalette.Group :items="(group as SearchGroup).items">
          <CommandPalette.GroupLabel>{{ (group as SearchGroup).label }}</CommandPalette.GroupLabel>
          <CommandPalette.Items v-slot="{ item }">
            <CommandPalette.ResultItem
              :breadcrumbs="[(item as DocsSearchItem).section]"
              :breadcrumb-highlights="[findHighlights((item as DocsSearchItem).section)]"
              :description="(item as DocsSearchItem).description"
              :title="(item as DocsSearchItem).label"
              :title-highlights="findHighlights((item as DocsSearchItem).label)"
              :value="item"
            >
              <template #icon>
                <span class="docs-search-result__kind">
                  {{ kindLabels[(item as DocsSearchItem).kind] }}
                </span>
              </template>
            </CommandPalette.ResultItem>
          </CommandPalette.Items>
        </CommandPalette.Group>
      </CommandPalette.Results>
      <CommandPalette.Empty>No documentation matches “{{ query }}”.</CommandPalette.Empty>
    </CommandPalette.List>
    <CommandPalette.Footer>
      <span><kbd>↑↓</kbd> Move</span>
      <span><kbd>Enter</kbd> Open</span>
      <span><kbd>Ctrl Enter</kbd> New tab</span>
      <span><kbd>Esc</kbd> Close</span>
    </CommandPalette.Footer>
  </CommandPalette.Root>
</template>

<style scoped>
.docs-search-result__kind {
  font-family: var(--kappa-font-mono);
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

kbd {
  color: var(--kappa-default);
  font: inherit;
  font-weight: 600;
}
</style>
