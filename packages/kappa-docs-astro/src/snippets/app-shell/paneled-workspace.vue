<script setup lang="ts">
import { ref } from "vue";
import { AppShell } from "@dicehub/kappa/blocks/app-shell";
import { Sidebar } from "@dicehub/kappa/components/sidebar";
import { Button, ToolbarButton } from "@dicehub/kappa/components/button";
import { Avatar } from "@dicehub/kappa/components/avatar";
import { DicehubLogo } from "@dicehub/kappa/components/dicehub-logo";
import { Folder, MessageSquare, Search } from "@lucide/vue";
import { CommandPalette } from "@dicehub/kappa/components/command-palette";
const pages = ["Rotor study", "Channel flow", "Heat exchanger"];
const project = { name: "Engineering", avatarUrl: undefined as string | undefined };
const selected = ref(pages[0]);
const detailOpen = ref(false);
const activityOpen = ref(false);
const searchOpen = ref(false);
const query = ref("");
</script>

<template>
  <AppShell.Root appearance="paneled" collapsible="icon" bloom fill label="Project navigation">
    <template #toolbar-start><a class="kappa-app-shell__brand" href="?view=Overview" aria-label="dicehub home"><DicehubLogo variant="glyph" aria-hidden="true" /></a></template>
    <template #header><strong>Project</strong></template>
    <template #navigation="{ setMobileOpen }">
      <Sidebar.Menu class="kappa-app-shell__project">
        <Sidebar.MenuItem>
          <Sidebar.MenuButton class="kappa-app-shell__project-link" :tooltip="project.name" :active="selected === project.name"
            @click="selected = project.name; detailOpen = false; setMobileOpen(false)">
            <template #icon>
              <Avatar.Root class="kappa-app-shell__project-avatar">
                <Avatar.Image v-if="project.avatarUrl" :src="project.avatarUrl" alt="" />
                <Avatar.Fallback>{{ Array.from(project.name.trim())[0]?.toLocaleUpperCase() }}</Avatar.Fallback>
              </Avatar.Root>
            </template>
            {{ project.name }}
          </Sidebar.MenuButton>
        </Sidebar.MenuItem>
      </Sidebar.Menu>
      <Sidebar.Menu>
        <Sidebar.MenuItem v-for="page in pages" :key="page">
          <Sidebar.MenuButton :icon="Folder" :active="selected === page" :tooltip="page"
            @click="selected = page; setMobileOpen(false)">{{ page }}</Sidebar.MenuButton>
        </Sidebar.MenuItem>
      </Sidebar.Menu>
    </template>
    <template #toolbar><AppShell.SearchTrigger :icon="Search" :aria-expanded="searchOpen" @click="searchOpen = true" /></template>
    <template #rail><ToolbarButton variant="ghost" size="sm" :icon="MessageSquare" tooltip="Activity" :aria-expanded="activityOpen" @click="activityOpen = !activityOpen" /></template>
    <AppShell.Panels v-model:detail-open="detailOpen" v-model:aside-open="activityOpen">
      <AppShell.Page :title="selected" description="Review the latest project updates.">
        <Button @click="detailOpen = true">Open details</Button>
      </AppShell.Page>
      <template #detail="{ close }">
        <AppShell.Toolbar>Project details<Button variant="ghost" @click="close">Close details</Button></AppShell.Toolbar>
        <AppShell.Page as="section" :title="selected"><p>Project notes and results go here.</p></AppShell.Page>
      </template>
      <template #aside="{ close, toggleMaximized, maximized, canMaximize }">
        <AppShell.Toolbar>Activity<Button variant="ghost" @click="close">Close activity</Button></AppShell.Toolbar>
        <Button v-if="canMaximize" variant="ghost" @click="toggleMaximized">{{ maximized ? 'Restore' : 'Maximize' }}</Button>
        <p>The latest simulation is ready to review.</p>
      </template>
    </AppShell.Panels>
    <AppShell.SearchDialog v-model:open="searchOpen" aria-label="Search projects">
      <CommandPalette.Panel v-model:value="query" :open="searchOpen" :items="pages"
        @close="searchOpen = false" @select="selected = String($event); searchOpen = false">
        <CommandPalette.Input placeholder="Find a project…" />
        <CommandPalette.List><CommandPalette.Results v-slot="{ item }"><CommandPalette.ResultItem :value="item" :title="String(item)" /></CommandPalette.Results><CommandPalette.Empty>No projects found.</CommandPalette.Empty></CommandPalette.List>
      </CommandPalette.Panel>
    </AppShell.SearchDialog>
  </AppShell.Root>
</template>
