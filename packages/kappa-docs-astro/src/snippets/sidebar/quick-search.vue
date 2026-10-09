<script setup lang="ts">
import { ref } from "vue";
import { SidebarLayout } from "@dicehub/kappa/blocks/sidebar-layout";
import { Sidebar } from "@dicehub/kappa/components/sidebar";
import { CommandPalette } from "@dicehub/kappa/components/command-palette";
import { Search } from "@lucide/vue";
const open = ref(false);
const selected = ref("Overview");
const pages = ["Overview", "Projects", "Settings"];
</script>

<template>
  <SidebarLayout label="Workspace navigation">
    <template #header><Sidebar.MenuLabel>Workspace</Sidebar.MenuLabel></template>
    <template #navigation>
      <Sidebar.Menu><Sidebar.MenuItem>
        <Sidebar.MenuButton :icon="Search" tooltip="Quick search" @click="open = true">Quick search</Sidebar.MenuButton>
      </Sidebar.MenuItem></Sidebar.Menu>
    </template>
    <h1>{{ selected }}</h1>
    <CommandPalette.Root v-model:open="open" :items="pages" aria-label="Search navigation"
      @select="item => { selected = String(item); open = false; }">
      <CommandPalette.Input placeholder="Search navigation…" />
      <CommandPalette.List>
        <CommandPalette.Results v-slot="{ item }">
          <CommandPalette.Item :value="item">{{ item }}</CommandPalette.Item>
        </CommandPalette.Results>
        <CommandPalette.Empty>No pages found.</CommandPalette.Empty>
      </CommandPalette.List>
    </CommandPalette.Root>
  </SidebarLayout>
</template>
