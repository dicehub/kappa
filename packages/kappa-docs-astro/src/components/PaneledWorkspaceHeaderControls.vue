<script setup lang="ts">
import { AppShell } from "@dicehub/kappa/blocks/app-shell";
import { ToolbarButton } from "@dicehub/kappa/components/button";
import { Tooltip } from "@dicehub/kappa/components/tooltip";
import { CirclePlay, Search } from "@lucide/vue";
import PaneledWorkspaceCreateMenu from "./PaneledWorkspaceCreateMenu.vue";
import PaneledWorkspaceCredits from "./PaneledWorkspaceCredits.vue";
import PaneledWorkspaceNotifications from "./PaneledWorkspaceNotifications.vue";
import PaneledWorkspaceProfileMenu from "./PaneledWorkspaceProfileMenu.vue";
import type { WorkspaceCompute } from "./paneled-workspace-compute";
import type { WorkspaceNotification } from "./paneled-workspace-notifications";

defineProps<{
  namespace: string;
  projectCode?: string;
  compute: WorkspaceCompute;
  creditsReady: boolean;
  activeRunCount: number;
  notifications: WorkspaceNotification[];
  searchOpen: boolean;
  isMobile: boolean;
  insetHeader: boolean;
  sidebarSearch: boolean;
}>();
const emit = defineEmits<{
  search: [];
  navigate: [page: string, projectCode?: string];
  addCredits: [cents: number];
  openNotification: [notification: WorkspaceNotification];
  readAll: [];
}>();
</script>

<template>
  <AppShell.SearchTrigger v-if="!insetHeader && (!sidebarSearch || isMobile)" shortcut="Ctrl + K" data-paneled-search :icon="Search" aria-keyshortcuts="Control+K" aria-haspopup="dialog" :aria-expanded="searchOpen" @click="emit('search')" />
  <div v-if="insetHeader && (!sidebarSearch || isMobile)" class="paneled-workspace-demo__search-island">
    <Tooltip.Root :disabled="searchOpen" :open-delay="500" :close-delay="0" :positioning="{ placement: 'bottom', gutter: 8 }">
      <Tooltip.Trigger as-child>
        <AppShell.SearchTrigger label="Search…" shortcut="Ctrl + K" data-paneled-search :icon="Search" aria-label="Search or go to…" aria-keyshortcuts="Control+K" aria-haspopup="dialog" :aria-expanded="searchOpen" @click="emit('search')" />
      </Tooltip.Trigger>
      <Tooltip.Content :show-arrow="false">Search or go to… (Ctrl + K)</Tooltip.Content>
    </Tooltip.Root>
  </div>
  <div class="paneled-workspace-demo__global-actions">
    <PaneledWorkspaceCreateMenu :project-code="projectCode" @navigate="(page, project) => emit('navigate', page, project)" />
    <PaneledWorkspaceCredits :namespace="namespace" :compute="compute" :loading="!creditsReady" @navigate="emit('navigate', $event)" @add-credits="emit('addCredits', $event)" />
    <ToolbarButton :icon="CirclePlay" class="paneled-workspace-demo__runs" :aria-label="`Runs: ${activeRunCount} active`" :tooltip="`${activeRunCount} active simulation runs`" @click="emit('navigate', 'Simulation runs')">{{ activeRunCount }}</ToolbarButton>
    <PaneledWorkspaceNotifications :items="notifications" @open="emit('openNotification', $event)" @read-all="emit('readAll')" />
    <PaneledWorkspaceProfileMenu @navigate="emit('navigate', $event, '')" />
  </div>
</template>
