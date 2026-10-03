<script setup lang="ts">
import { Sidebar } from "@dicehub/kappa/components/sidebar";
import { ArrowLeft, ChevronRight, Folder, House, Layers, Settings, Users } from "@lucide/vue";
import SidebarDemoSearch from "./SidebarDemoSearch.vue";

defineProps<{ selected: string }>();
const emit = defineEmits<{ select: [value: string] }>();
const surface = defineModel<string>({ required: true });
</script>

<template>
  <Sidebar.Context v-slot="{ setMobileOpen, setOpen }">
    <Sidebar.SlidingViews :active-key="surface" :direction="surface === 'project' ? 'left' : 'right'">
      <Sidebar.SlidingView value="workspace" label="Workspace navigation view">
        <Sidebar.Content aria-label="Workspace view links">
          <SidebarDemoSearch @select="emit('select', $event); setMobileOpen(false)" />
          <Sidebar.Group>
            <Sidebar.GroupLabel>Workspace</Sidebar.GroupLabel>
            <Sidebar.Menu>
              <Sidebar.MenuItem><Sidebar.MenuButton :icon="House" tooltip="Overview" :active="selected === 'Overview'" @click="emit('select', 'Overview'); setMobileOpen(false)">Overview</Sidebar.MenuButton></Sidebar.MenuItem>
              <Sidebar.MenuItem><Sidebar.MenuButton :icon="Users" tooltip="Members" @click="emit('select', 'Members'); setMobileOpen(false)">Members</Sidebar.MenuButton></Sidebar.MenuItem>
              <Sidebar.MenuItem><Sidebar.MenuButton :icon="Folder" tooltip="Rotor study" @click="setOpen(true); surface = 'project'">Rotor study <ChevronRight class="sidebar-demo__switch-icon" aria-hidden="true" /></Sidebar.MenuButton></Sidebar.MenuItem>
            </Sidebar.Menu>
          </Sidebar.Group>
        </Sidebar.Content>
      </Sidebar.SlidingView>
      <Sidebar.SlidingView value="project" label="Rotor study navigation view">
        <Sidebar.Content aria-label="Project view links">
          <Sidebar.Menu>
            <Sidebar.MenuItem><Sidebar.MenuButton :icon="ArrowLeft" tooltip="Back to workspace" @click="surface = 'workspace'">Back to workspace</Sidebar.MenuButton></Sidebar.MenuItem>
          </Sidebar.Menu>
          <Sidebar.Separator />
          <Sidebar.Group>
            <Sidebar.GroupLabel>Rotor study</Sidebar.GroupLabel>
            <Sidebar.Menu>
              <Sidebar.MenuItem v-for="link in [{ label: 'Geometry', icon: Layers }, { label: 'Refinement', icon: Settings }]" :key="link.label">
                <Sidebar.MenuButton :icon="link.icon" :tooltip="link.label" :active="selected === link.label" @click="emit('select', link.label); setMobileOpen(false)">{{ link.label }}</Sidebar.MenuButton>
              </Sidebar.MenuItem>
            </Sidebar.Menu>
          </Sidebar.Group>
        </Sidebar.Content>
      </Sidebar.SlidingView>
    </Sidebar.SlidingViews>
  </Sidebar.Context>
</template>
