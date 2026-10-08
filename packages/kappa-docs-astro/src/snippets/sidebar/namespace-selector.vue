<script setup lang="ts">
import { ref } from "vue";
import { SidebarLayout } from "@dicehub/kappa/blocks/sidebar-layout";
import { WorkspaceSwitcher } from "@dicehub/kappa/blocks/workspace-switcher";
import { Sidebar } from "@dicehub/kappa/components/sidebar";
import { Building2, FlaskConical } from "@lucide/vue";
const namespace = ref("Engineering");
const namespaces = [
  { value: "Engineering", name: "Engineering", description: "12 members", icon: Building2 },
  { value: "Research", name: "Research", description: "8 members", icon: FlaskConical },
];
</script>

<template>
  <SidebarLayout label="Workspace navigation">
    <template #header="{ isMobile }">
      <WorkspaceSwitcher v-model="namespace" :items="namespaces" label="Namespaces" :teleport="!isMobile">
        <template #trigger="{ workspace }">
          <Sidebar.MenuButton :icon="workspace?.icon" :tooltip="namespace" :aria-label="`Namespace: ${namespace}`">
            {{ namespace }}
          </Sidebar.MenuButton>
        </template>
      </WorkspaceSwitcher>
    </template>
    <template #navigation>
      <Sidebar.Menu><Sidebar.MenuItem>
        <Sidebar.MenuButton :icon="Building2" tooltip="Overview" href="/overview">Overview</Sidebar.MenuButton>
      </Sidebar.MenuItem></Sidebar.Menu>
    </template>
    <h1>{{ namespace }}</h1>
  </SidebarLayout>
</template>
