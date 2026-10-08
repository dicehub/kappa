<script setup lang="ts">
import { ref } from "vue";
import { SidebarLayout } from "@dicehub/kappa/blocks/sidebar-layout";
import { Sidebar } from "@dicehub/kappa/components/sidebar";
import { House } from "@lucide/vue";
const open = ref(true);
const mobileOpen = ref(false);
</script>

<template>
  <SidebarLayout v-model:open="open" v-model:mobile-open="mobileOpen" label="Workspace navigation">
    <template #header><Sidebar.MenuLabel>Workspace</Sidebar.MenuLabel></template>
    <template #navigation>
      <Sidebar.Menu>
        <Sidebar.MenuItem>
          <Sidebar.MenuButton href="/overview" :icon="House" tooltip="Overview" active>Overview</Sidebar.MenuButton>
        </Sidebar.MenuItem>
      </Sidebar.Menu>
    </template>
    <h1>Overview</h1>
  </SidebarLayout>
</template>
