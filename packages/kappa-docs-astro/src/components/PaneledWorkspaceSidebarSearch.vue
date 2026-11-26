<script setup lang="ts">
import { AppShell } from "@dicehub/kappa/blocks/app-shell";
import { Tooltip } from "@dicehub/kappa/components/tooltip";
import { Search } from "@lucide/vue";

defineProps<{ collapsed: boolean; open: boolean }>();
const emit = defineEmits<{ search: [] }>();
</script>

<template>
  <Tooltip.Root :disabled="!collapsed || open" :open-delay="500" :close-delay="0" :positioning="{ placement: 'right', gutter: 8 }">
    <Tooltip.Trigger as-child>
      <AppShell.SearchTrigger
        class="paneled-workspace-demo__sidebar-search" data-paneled-search :data-collapsed="collapsed || undefined"
        label="Search…" :shortcut="collapsed ? '' : 'Ctrl + K'" :icon="Search"
        aria-label="Search or go to…" aria-keyshortcuts="Control+K" :aria-expanded="open"
        @click="emit('search')"
      />
    </Tooltip.Trigger>
    <Tooltip.Content :show-arrow="false">Search or go to… (Ctrl + K)</Tooltip.Content>
  </Tooltip.Root>
</template>

<style>
.paneled-workspace-demo .paneled-workspace-demo__navigation .paneled-workspace-demo__sidebar-search.kappa-app-shell__search {
  position: static;
  translate: none;
  inline-size: 100%;
  min-inline-size: 0;
  max-inline-size: none;
  margin-block-end: 0.5rem;
}
.paneled-workspace-demo .paneled-workspace-demo__navigation .paneled-workspace-demo__sidebar-search[data-collapsed] {
  inline-size: 1.75rem;
  block-size: 1.75rem;
  justify-content: center;
  padding: 0.25rem;
  border-color: transparent;
  background: transparent;
}
.paneled-workspace-demo__sidebar-search[data-collapsed] .kappa-button__label { display: none; }
</style>
