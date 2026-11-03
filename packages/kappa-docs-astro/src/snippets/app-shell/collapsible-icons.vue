<script setup lang="ts">
import { ref } from "vue";
import { AppShell } from "@dicehub/kappa/blocks/app-shell";
import { Sidebar } from "@dicehub/kappa/components/sidebar";
import { Button } from "@dicehub/kappa/components/button";
import { Folder } from "@lucide/vue";
const pages = ["Rotor study", "Channel flow", "Heat exchanger"];
const selected = ref(pages[0]);
</script>

<template>
  <AppShell.Root appearance="default" variant="workspace" collapsible="icon" full-screen-on-mobile fill label="Project navigation">
    <template #header><Sidebar.MenuButton :icon="Folder" tooltip="Engineering">Engineering</Sidebar.MenuButton></template>
    <template #navigation="{ setMobileOpen, iconCollapsed, setOpen }">
      <Sidebar.Collapsible default-open>
        <Sidebar.CollapsibleTrigger as-child><Sidebar.MenuButton :icon="Folder" @click="iconCollapsed && setOpen(true)">Projects</Sidebar.MenuButton></Sidebar.CollapsibleTrigger>
        <Sidebar.CollapsibleContent>
      <Sidebar.Menu>
        <Sidebar.MenuItem v-for="page in pages" :key="page">
          <Sidebar.MenuButton :icon="Folder" :active="selected === page" :tooltip="page"
            @click="selected = page; setMobileOpen(false)">{{ page }}</Sidebar.MenuButton>
        </Sidebar.MenuItem>
      </Sidebar.Menu>
        </Sidebar.CollapsibleContent>
      </Sidebar.Collapsible>
    </template>
    <template #toolbar>{{ selected }}</template>
    <AppShell.Page :title="selected" description="Review the latest project updates.">
      <template #actions><Button @click="selected = 'New project'">New project</Button></template>
      <p>Your project content goes here.</p>
    </AppShell.Page>
  </AppShell.Root>
</template>
