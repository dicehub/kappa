<script setup lang="ts">
import { ref } from "vue";
import { SidebarLayout } from "@dicehub/kappa/blocks/sidebar-layout";
import { Sidebar } from "@dicehub/kappa/components/sidebar";
import { House } from "@lucide/vue";
const width = ref(240);
</script>

<template>
  <SidebarLayout resizable v-model:resize-width="width" :min-width="180" :max-width="400" label="Workspace navigation">
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
