<script setup lang="ts">
import { ref } from "vue";
import { SidebarLayout } from "@dicehub/kappa/blocks/sidebar-layout";
import { Sidebar } from "@dicehub/kappa/components/sidebar";
import { ArrowLeft, Folder } from "@lucide/vue";
const view = ref("workspace");
</script>

<template>
  <SidebarLayout label="Workspace navigation">
    <template #header><Sidebar.MenuLabel>Workspace</Sidebar.MenuLabel></template>
    <template #navigation>
      <Sidebar.SlidingViews :active-key="view" :direction="view === 'project' ? 'left' : 'right'">
        <Sidebar.SlidingView value="workspace" label="Workspace view">
          <Sidebar.Menu><Sidebar.MenuItem>
            <Sidebar.MenuButton :icon="Folder" tooltip="Rotor study" @click="view = 'project'">Rotor study</Sidebar.MenuButton>
          </Sidebar.MenuItem></Sidebar.Menu>
        </Sidebar.SlidingView>
        <Sidebar.SlidingView value="project" label="Project view">
          <Sidebar.Menu><Sidebar.MenuItem>
            <Sidebar.MenuButton :icon="ArrowLeft" tooltip="Back to workspace" @click="view = 'workspace'">Back to workspace</Sidebar.MenuButton>
          </Sidebar.MenuItem></Sidebar.Menu>
        </Sidebar.SlidingView>
      </Sidebar.SlidingViews>
    </template>
    <h1>Rotor study</h1>
  </SidebarLayout>
</template>
