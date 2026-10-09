<script setup lang="ts">
import { SidebarLayout } from "@dicehub/kappa/blocks/sidebar-layout";
import { Sidebar } from "@dicehub/kappa/components/sidebar";
import { FileText } from "@lucide/vue";
const reports = Array.from({ length: 40 }, (_, index) => `Report ${index + 1}`);
</script>

<template>
  <SidebarLayout label="Report navigation">
    <template #header><Sidebar.MenuLabel>Reports</Sidebar.MenuLabel></template>
    <template #navigation>
      <Sidebar.Menu><Sidebar.MenuItem v-for="report in reports" :key="report">
        <Sidebar.MenuButton :icon="FileText" :tooltip="report">{{ report }}</Sidebar.MenuButton>
      </Sidebar.MenuItem></Sidebar.Menu>
    </template>
    <template #footer><Sidebar.MenuLabel>Casey Rivera</Sidebar.MenuLabel></template>
    <h1>Reports</h1>
  </SidebarLayout>
</template>
