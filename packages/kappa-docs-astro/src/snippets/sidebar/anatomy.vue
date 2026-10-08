<script setup lang="ts">
import { Sidebar } from "@dicehub/kappa/components/sidebar";
import { House } from "@lucide/vue";
</script>

<template>
  <Sidebar.Provider>
    <Sidebar.Root label="Workspace navigation">
      <Sidebar.Header>Workspace <Sidebar.Close /></Sidebar.Header>
      <Sidebar.Content aria-label="Workspace links">
        <Sidebar.Menu><Sidebar.MenuItem>
          <Sidebar.MenuButton href="/overview" :icon="House" tooltip="Overview">Overview</Sidebar.MenuButton>
        </Sidebar.MenuItem></Sidebar.Menu>
      </Sidebar.Content>
    </Sidebar.Root>
    <main><Sidebar.Trigger /><h1>Overview</h1></main>
  </Sidebar.Provider>
</template>
