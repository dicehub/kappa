<script setup lang="ts">
import { ref } from "vue";
import { AppShell } from "@dicehub/kappa/blocks/app-shell";
import { Sidebar } from "@dicehub/kappa/components/sidebar";
import { Button } from "@dicehub/kappa/components/button";
import { Folder } from "@lucide/vue";
import { Dropdown } from "@dicehub/kappa/components/dropdown";
const pages = ["Rotor study", "Channel flow", "Heat exchanger"];
const selected = ref(pages[0]);
</script>

<template>
  <AppShell.Root appearance="default" variant="workspace" collapsible="offcanvas" full-screen-on-mobile fill label="Project navigation">
    <template #header><Sidebar.MenuButton :icon="Folder" tooltip="Engineering">Engineering</Sidebar.MenuButton></template>
    <template #navigation="{ setMobileOpen, isMobile }">
      <Dropdown.Root>
        <Dropdown.Trigger as-child><Sidebar.MenuButton :icon="Folder">Projects</Sidebar.MenuButton></Dropdown.Trigger>
        <Dropdown.Content :teleport="!isMobile">
          <Dropdown.Item v-for="page in pages" :key="page" :value="page"
            @select="selected = page; setMobileOpen(false)">{{ page }}</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>
    </template>
    <template #toolbar>{{ selected }}</template>
    <AppShell.Page :title="selected" description="Review the latest project updates.">
      <template #actions><Button @click="selected = 'New project'">New project</Button></template>
      <p>Your project content goes here.</p>
    </AppShell.Page>
  </AppShell.Root>
</template>
