<script setup lang="ts">
import { SidebarLayout } from "@dicehub/kappa/blocks/sidebar-layout";
import { Sidebar } from "@dicehub/kappa/components/sidebar";
import { Folder } from "@lucide/vue";
defineProps<{ currentPath?: string }>();
</script>

<template>
  <SidebarLayout label="Workspace navigation">
    <template #header><Sidebar.MenuLabel>Workspace</Sidebar.MenuLabel></template>
    <template #navigation>
      <Sidebar.Menu><Sidebar.MenuItem>
        <Sidebar.MenuButton as-child tooltip="Projects" :active="currentPath === '/projects'">
          <a href="/projects">
            <Folder aria-hidden="true" />
            <Sidebar.MenuLabel>Projects</Sidebar.MenuLabel>
          </a>
        </Sidebar.MenuButton>
      </Sidebar.MenuItem></Sidebar.Menu>
    </template>
    <h1>Projects</h1>
  </SidebarLayout>
</template>
