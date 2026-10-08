<script setup lang="ts">
import { SidebarLayout } from "@dicehub/kappa/blocks/sidebar-layout";
import { Sidebar } from "@dicehub/kappa/components/sidebar";
import { House } from "@lucide/vue";
defineProps<{ loading?: boolean }>();
</script>

<template>
  <SidebarLayout label="Workspace navigation">
    <template #header><Sidebar.MenuLabel>Workspace</Sidebar.MenuLabel></template>
    <template #navigation>
      <Sidebar.Loading v-if="loading" :rows="5" />
      <Sidebar.Menu v-else><Sidebar.MenuItem>
        <Sidebar.MenuButton href="/overview" :icon="House" tooltip="Overview">Overview</Sidebar.MenuButton>
      </Sidebar.MenuItem></Sidebar.Menu>
    </template>
    <h1>Overview</h1>
  </SidebarLayout>
</template>
