<script setup lang="ts">
import { ref } from "vue";
import { AppShell } from "@dicehub/kappa/blocks/app-shell";
import { Sidebar } from "@dicehub/kappa/components/sidebar";
import { Button } from "@dicehub/kappa/components/button";
const custom = ref(true);
const paneled = ref(true);
</script>

<template>
  <AppShell.Root :appearance="paneled ? 'paneled' : 'default'" fill
    label="Header example navigation" :mobile-breakpoint="1200"
    :trigger-props="{ openLabel: 'Open project menu', closeLabel: 'Close project menu' }">
    <template #toolbar-start><a href="#main">Project home</a></template>
    <template v-if="custom" #toolbar-trigger="{ isMobile }">
      <Sidebar.Trigger aria-label="Project navigation" :data-mobile-toggle="isMobile">Menu</Sidebar.Trigger>
    </template>
    <template #toolbar>Project workspace</template>
    <template #header>Project</template>
    <template #navigation="{ setMobileOpen }"><Sidebar.MenuButton @click="setMobileOpen(false)">Project overview</Sidebar.MenuButton></template>
    <AppShell.Page id="main" title="Project content">
      <Button @click="custom = !custom">{{ custom ? 'Use default toggle' : 'Use custom toggle' }}</Button>
      <Button @click="paneled = !paneled">{{ paneled ? 'Use default appearance' : 'Use paneled appearance' }}</Button>
    </AppShell.Page>
  </AppShell.Root>
</template>
