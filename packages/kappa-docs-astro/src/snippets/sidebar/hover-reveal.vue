<script setup lang="ts">
import { SidebarLayout } from "@dicehub/kappa/blocks/sidebar-layout";
import { Sidebar } from "@dicehub/kappa/components/sidebar";
import { House } from "@lucide/vue";
</script>

<template>
  <SidebarLayout variant="header" collapsible="offcanvas" peekable resizable
    :min-width="260" :max-width="600" :collapse-on-resize="false"
    :trigger-props="{ peek: true }" label="Workspace navigation">
    <template #header><Sidebar.Trigger /> Workspace</template>
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
