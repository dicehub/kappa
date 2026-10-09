<script setup lang="ts">
import { SidebarLayout } from "@dicehub/kappa/blocks/sidebar-layout";
import { Sidebar } from "@dicehub/kappa/components/sidebar";
import { DirectionProvider } from "@dicehub/kappa/components/direction-provider";
import { House } from "@lucide/vue";
</script>

<template>
  <DirectionProvider locale="ar">
    <SidebarLayout dir="rtl" label="التنقل الرئيسي" resizable>
      <template #header><Sidebar.MenuLabel>المساحة</Sidebar.MenuLabel></template>
      <template #navigation>
        <Sidebar.Menu><Sidebar.MenuItem>
          <Sidebar.MenuButton href="/overview" :icon="House" tooltip="نظرة عامة">نظرة عامة</Sidebar.MenuButton>
        </Sidebar.MenuItem></Sidebar.Menu>
      </template>
      <h1>نظرة عامة</h1>
    </SidebarLayout>
  </DirectionProvider>
</template>
