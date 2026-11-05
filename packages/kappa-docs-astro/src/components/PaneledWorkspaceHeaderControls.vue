<script setup lang="ts">
import { AppShell } from "@dicehub/kappa/blocks/app-shell";
import { ToolbarButton } from "@dicehub/kappa/components/button";
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
}>();
const insetHeader = defineModel<boolean>("insetHeader", { required: true });
const emit = defineEmits<{
  search: [];
  navigate: [page: string, projectCode?: string];
  addCredits: [cents: number];
  openNotification: [notification: WorkspaceNotification];
  readAll: [];
}>();
</script>

<template>
  <AppShell.SearchTrigger shortcut="Ctrl + K" data-paneled-search :icon="Search" aria-keyshortcuts="Control+K" aria-haspopup="dialog" :aria-expanded="searchOpen" @click="emit('search')" />
  <div class="paneled-workspace-demo__global-actions">
    <PaneledWorkspaceCreateMenu :project-code="projectCode" @navigate="(page, project) => emit('navigate', page, project)" />
    <PaneledWorkspaceCredits :namespace="namespace" :compute="compute" :loading="!creditsReady" @navigate="emit('navigate', $event)" @add-credits="emit('addCredits', $event)" />
    <ToolbarButton :icon="CirclePlay" class="paneled-workspace-demo__runs" :aria-label="`Runs: ${activeRunCount} active`" :tooltip="`${activeRunCount} active simulation runs`" @click="emit('navigate', 'Simulation runs')">{{ activeRunCount }}</ToolbarButton>
    <PaneledWorkspaceNotifications :items="notifications" @open="emit('openNotification', $event)" @read-all="emit('readAll')" />
    <PaneledWorkspaceProfileMenu v-model:inset-header="insetHeader" @navigate="emit('navigate', $event, '')" />
  </div>
</template>
