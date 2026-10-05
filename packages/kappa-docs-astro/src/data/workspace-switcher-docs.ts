export const workspaceSwitcherUsage = `<script setup>
import { ref } from "vue";
import { WorkspaceSwitcher } from "@dicehub/kappa/blocks/workspace-switcher";
import { Building2, Plus, Settings, UsersRound } from "@lucide/vue";

const workspace = ref("engineering");
const items = [
  { value: "engineering", name: "Engineering", description: "Pro plan · 12 members", icon: Building2 },
  { value: "personal", name: "Personal", description: "Free plan · 1 member", initials: "P" },
];
const actions = [
  { value: "settings", label: "Settings", icon: Settings },
  { value: "invite", label: "Invite members", icon: UsersRound },
];
function onAction(action) {
  // Open the matching view in your application.
  console.log(action.value);
}
</script>

<template>
  <WorkspaceSwitcher v-model="workspace" :items="items" :actions="actions"
    account-label="alex@example.test"
    :workspace-actions="[{ value: 'create', label: 'New workspace', icon: Plus }]"
    @action="onAction" />
</template>`;

export const workspaceSwitcherSidebarUsage = `<Sidebar.Context v-slot="{ isMobile }">
  <WorkspaceSwitcher v-model="workspace" :items="items" :teleport="!isMobile"
    :positioning="{ placement: isMobile ? 'bottom-start' : 'right-start', strategy: 'fixed' }">
    <template #trigger="{ workspace: current, disabled }">
      <Sidebar.MenuButton :icon="current?.icon" :disabled="disabled"
        :tooltip="current?.name" :aria-label="'Workspace: ' + current?.name">
        {{ current?.name }}
      </Sidebar.MenuButton>
    </template>
  </WorkspaceSwitcher>
</Sidebar.Context>`;
