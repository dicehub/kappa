<script setup lang="ts">
import { SidebarLayout } from "@dicehub/kappa/blocks/sidebar-layout";
import { Sidebar } from "@dicehub/kappa/components/sidebar";
import { Folder, House } from "@lucide/vue";
</script>

<template>
  <SidebarLayout label="Workspace navigation">
    <template #header><Sidebar.MenuLabel>Workspace</Sidebar.MenuLabel></template>
    <template #navigation>
      <Sidebar.Menu>
        <Sidebar.MenuItem>
          <Sidebar.MenuButton href="/overview" :icon="House" tooltip="Overview" active>Overview</Sidebar.MenuButton>
        </Sidebar.MenuItem>
        <Sidebar.MenuItem>
          <Sidebar.MenuButton href="/projects" :icon="Folder" tooltip="Projects">Projects</Sidebar.MenuButton>
        </Sidebar.MenuItem>
      </Sidebar.Menu>
    </template>
    <h1>Overview</h1>
  </SidebarLayout>
</template>
