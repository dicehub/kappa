<script setup lang="ts">
import { ref } from "vue";
import { Sidebar, useSidebarContext } from "@dicehub/kappa/components/sidebar";
import { CommandPalette } from "@dicehub/kappa/components/command-palette";
import { Search } from "@lucide/vue";

const emit = defineEmits<{ select: [value: string] }>();
const open = ref(false);
const query = ref("");
const navigating = ref(false);
const sidebar = useSidebarContext();
const items = ["Overview", "Projects", "Geometry", "Refinement", "Settings"];
function search() { query.value = ""; navigating.value = false; open.value = true; }
function select(item: unknown) { navigating.value = true; open.value = false; emit("select", String(item)); }
</script>

<template>
  <Sidebar.Menu class="sidebar-demo__search">
    <Sidebar.MenuItem>
      <Sidebar.MenuButton :icon="Search" tooltip="Quick search" @click="search">Quick search …</Sidebar.MenuButton>
    </Sidebar.MenuItem>
  </Sidebar.Menu>
  <CommandPalette.Root v-model:open="open" v-model:value="query" :restore-focus="!navigating || !sidebar.isMobile.value" :items="items" aria-label="Search navigation" @select="select">
    <CommandPalette.Input placeholder="Search navigation…" />
    <CommandPalette.List>
      <CommandPalette.Results v-slot="{ item }"><CommandPalette.Item :value="item">{{ item }}</CommandPalette.Item></CommandPalette.Results>
      <CommandPalette.Empty>No pages found.</CommandPalette.Empty>
    </CommandPalette.List>
    <CommandPalette.Footer><span>↑↓ Navigate</span><span>Enter Open</span></CommandPalette.Footer>
  </CommandPalette.Root>
</template>
