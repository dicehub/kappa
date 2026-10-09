<script setup lang="ts">
import { ref } from "vue";
import { SidebarLayout } from "@dicehub/kappa/blocks/sidebar-layout";
import { Sidebar } from "@dicehub/kappa/components/sidebar";
import { Button } from "@dicehub/kappa/components/button";
import { FileText, Settings } from "@lucide/vue";
const settings = ref<HTMLElement>();
const reports = Array.from({ length: 40 }, (_, index) => `Report ${index + 1}`);
function scrollToSettings() {
  const item = settings.value;
  const content = item?.closest<HTMLElement>('[data-slot="sidebar-content"]');
  if (!item || !content) return;
  const top = content.scrollTop + item.getBoundingClientRect().top - content.getBoundingClientRect().top;
  content.scrollTo({ top, behavior: "instant" });
}
</script>

<template>
  <SidebarLayout collapsible="none" :mobile-breakpoint="0" label="Report navigation">
    <template #header><Sidebar.MenuLabel>Reports</Sidebar.MenuLabel></template>
    <template #navigation>
      <Sidebar.Menu>
        <Sidebar.MenuItem v-for="report in reports" :key="report">
          <Sidebar.MenuButton :icon="FileText" :tooltip="report">{{ report }}</Sidebar.MenuButton>
        </Sidebar.MenuItem>
        <Sidebar.MenuItem as-child>
          <li ref="settings"><Sidebar.MenuButton :icon="Settings">Settings</Sidebar.MenuButton></li>
        </Sidebar.MenuItem>
      </Sidebar.Menu>
    </template>
    <Button @click="scrollToSettings">Scroll to Settings</Button>
  </SidebarLayout>
</template>
