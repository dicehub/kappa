<script setup lang="ts">
import { AppWindow, FolderKanban, Plus, UsersRound } from "@lucide/vue";
import { ToolbarButton } from "@dicehub/kappa/components/button";
import { Dropdown } from "@dicehub/kappa/components/dropdown";

defineProps<{ projectCode?: string }>();
const emit = defineEmits<{ navigate: [page: string, projectCode: string] }>();
const actions = [
  { page: "New project", icon: FolderKanban },
  { page: "New group", icon: UsersRound },
  { page: "New application", icon: AppWindow },
];
</script>

<template>
  <Dropdown.Root aria-label="Create new…"
    :positioning="{ placement: 'bottom-end', strategy: 'fixed', gutter: 6, fitViewport: true, overflowPadding: 8 }">
    <Dropdown.Trigger as-child>
      <ToolbarButton :icon="Plus" tooltip="Create new…" aria-label="Create new…" />
    </Dropdown.Trigger>
    <Dropdown.Content show-arrow>
      <Dropdown.Group>
        <Dropdown.Item v-for="action in actions" :key="action.page" :value="action.page" :icon="action.icon"
          @select="emit('navigate', action.page, '')">{{ action.page }}</Dropdown.Item>
      </Dropdown.Group>
      <Dropdown.Group v-if="projectCode">
        <Dropdown.Label>This project</Dropdown.Label>
        <Dropdown.Separator />
        <Dropdown.Item value="project-application" :icon="AppWindow"
          @select="emit('navigate', 'New application', projectCode)">New application</Dropdown.Item>
      </Dropdown.Group>
    </Dropdown.Content>
  </Dropdown.Root>
</template>
