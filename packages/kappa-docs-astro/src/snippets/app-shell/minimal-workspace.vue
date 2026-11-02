<script setup lang="ts">
import { ref } from "vue";
import { AppShell } from "@dicehub/kappa/blocks/app-shell";
import { Sidebar } from "@dicehub/kappa/components/sidebar";
import { Button } from "@dicehub/kappa/components/button";
import { Folder, Search } from "@lucide/vue";
import { CommandPalette } from "@dicehub/kappa/components/command-palette";
const pages = ["Rotor study", "Channel flow", "Heat exchanger"];
const selected = ref(pages[0]);
const searchOpen = ref(false);
const query = ref("");
</script>

<template>
  <AppShell.Root appearance="compact" collapsible="icon" resizable full-screen-on-mobile fill label="Project navigation">
    <template #header><Sidebar.MenuButton :icon="Folder" tooltip="Engineering">Engineering</Sidebar.MenuButton></template>
    <template #navigation="{ setMobileOpen }">
      <Sidebar.Menu>
        <Sidebar.MenuItem v-for="page in pages" :key="page">
          <Sidebar.MenuButton :icon="Folder" :active="selected === page" :tooltip="page"
            @click="selected = page; setMobileOpen(false)">{{ page }}</Sidebar.MenuButton>
        </Sidebar.MenuItem>
      </Sidebar.Menu>
    </template>
    <template #toolbar><AppShell.SearchTrigger :icon="Search" :aria-expanded="searchOpen" @click="searchOpen = true" /></template>
    <AppShell.Page :title="selected" description="Review the latest project updates.">
      <template #actions><Button @click="selected = 'New project'">New project</Button></template>
      <p>Your project content goes here.</p>
    </AppShell.Page>
    <AppShell.SearchDialog v-model:open="searchOpen" aria-label="Search projects">
      <CommandPalette.Panel v-model:value="query" :open="searchOpen" :items="pages"
        @close="searchOpen = false" @select="selected = String($event); searchOpen = false">
        <CommandPalette.Input placeholder="Find a project…" />
        <CommandPalette.List><CommandPalette.Results v-slot="{ item }"><CommandPalette.ResultItem :value="item" :title="String(item)" /></CommandPalette.Results><CommandPalette.Empty>No projects found.</CommandPalette.Empty></CommandPalette.List>
      </CommandPalette.Panel>
    </AppShell.SearchDialog>
  </AppShell.Root>
</template>
