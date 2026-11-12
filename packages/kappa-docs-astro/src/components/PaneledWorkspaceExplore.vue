<script setup lang="ts">
import { computed } from "vue";
import { LayoutTemplate, UsersRound } from "@lucide/vue";
import { Tabs } from "@dicehub/kappa/components/tabs";
import PaneledWorkspaceCommunity from "./PaneledWorkspaceCommunity.vue";
import PaneledWorkspaceTemplates from "./PaneledWorkspaceTemplates.vue";
import { workspaceCommunityPages } from "./paneled-workspace-navigation";
import type { WorkspaceProject } from "./paneled-workspace-projects";

const props = defineProps<{
  page: string;
  projects: WorkspaceProject[];
  hrefForPage: (page: string) => string;
}>();
const emit = defineEmits<{
  navigate: [page: string];
  open: [page: string, event: MouseEvent];
}>();
const section = computed(() => workspaceCommunityPages.includes(props.page) ? "community" : "templates");
</script>

<template>
  <Tabs.Root :model-value="section" lazy-mount unmount-on-exit
    @update:model-value="emit('navigate', $event === 'community' ? 'Community' : 'Explore')">
    <Tabs.List variant="line" aria-label="Explore">
      <Tabs.Trigger value="templates"><LayoutTemplate aria-hidden="true" />Templates</Tabs.Trigger>
      <Tabs.Trigger value="community"><UsersRound aria-hidden="true" />Community</Tabs.Trigger>
      <Tabs.Indicator />
    </Tabs.List>
    <Tabs.Content value="templates">
      <PaneledWorkspaceTemplates :page="page === 'Explore' ? 'All templates' : page" />
    </Tabs.Content>
    <Tabs.Content value="community">
      <PaneledWorkspaceCommunity :page="page" :projects="projects" :href-for-page="hrefForPage"
        @navigate="emit('navigate', $event)" @open="(page, event) => emit('open', page, event)" />
    </Tabs.Content>
  </Tabs.Root>
</template>
