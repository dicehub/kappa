<script setup lang="ts">
import { SidebarLayout } from "@dicehub/kappa/blocks/sidebar-layout";
import { Sidebar } from "@dicehub/kappa/components/sidebar";
import { Box } from "@lucide/vue";
</script>

<template>
  <SidebarLayout label="Project navigation">
    <template #header><Sidebar.MenuLabel>Project</Sidebar.MenuLabel></template>
    <template #navigation>
      <Sidebar.Menu><Sidebar.MenuItem>
        <Sidebar.Collapsible default-open>
          <Sidebar.CollapsibleTrigger as-child>
            <Sidebar.MenuButton :icon="Box" tooltip="Mesh">Mesh <Sidebar.MenuChevron /></Sidebar.MenuButton>
          </Sidebar.CollapsibleTrigger>
          <Sidebar.CollapsibleContent>
            <Sidebar.MenuSub><Sidebar.MenuSubItem>
              <Sidebar.MenuButton href="/mesh/geometry">Geometry</Sidebar.MenuButton>
            </Sidebar.MenuSubItem></Sidebar.MenuSub>
          </Sidebar.CollapsibleContent>
        </Sidebar.Collapsible>
      </Sidebar.MenuItem></Sidebar.Menu>
    </template>
    <h1>Geometry</h1>
  </SidebarLayout>
</template>
