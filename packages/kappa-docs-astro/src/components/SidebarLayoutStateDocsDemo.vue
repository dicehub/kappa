<script setup lang="ts">
import { ref } from "vue";
import { SidebarLayout } from "@dicehub/kappa/blocks/sidebar-layout";
import { Sidebar } from "@dicehub/kappa/components/sidebar";
import { DirectionProvider } from "@dicehub/kappa/components/direction-provider";
import { Button } from "@dicehub/kappa/components/button";
import { Folder } from "@lucide/vue";

const open = ref(true);
const width = ref(352);
const locked = ref(false);
const end = ref(false);
const rtl = ref(false);
</script>

<template>
  <div class="sidebar-layout-state" data-sidebar-layout-state>
    <div class="sidebar-layout-state__controls">
      <Button size="sm" variant="secondary" :aria-pressed="locked" @click="locked = !locked">{{ locked ? 'Unlock changes' : 'Lock changes' }}</Button>
      <Button size="sm" variant="secondary" :aria-pressed="end" @click="end = !end">End placement</Button>
      <Button size="sm" variant="secondary" :aria-pressed="rtl" @click="rtl = !rtl">RTL</Button>
    </div>
    <component :is="rtl ? DirectionProvider : 'div'" :locale="rtl ? 'ar' : undefined">
      <SidebarLayout
        variant="split" :open="open" :resize-width="width" resizable
        :dir="rtl ? 'rtl' : 'ltr'" :side="end ? 'end' : 'start'"
        :min-width="220" :max-width="440" label="Controlled navigation"
        :trigger-props="{ expandLabel: 'Expand navigation', collapseLabel: 'Collapse navigation', openLabel: 'Open navigation' }"
        close-label="Dismiss navigation" resize-label="Resize navigation"
        class="sidebar-layout-state__layout" data-example-attribute="forwarded"
        @update:open="value => { if (!locked) open = value; }"
        @update:resize-width="value => { if (!locked) width = value; }"
      >
        <template #header><Sidebar.MenuButton :icon="Folder" tooltip="Workspace">Workspace</Sidebar.MenuButton></template>
        <template #navigation><Sidebar.Menu><Sidebar.MenuItem><Sidebar.MenuButton :icon="Folder" tooltip="Projects">Projects</Sidebar.MenuButton></Sidebar.MenuItem></Sidebar.Menu></template>
        <template #secondary><Button size="sm" variant="secondary" :disabled="locked" @click="open = false">Close project list</Button></template>
        <template #toolbar>Controlled layout</template>
        <template #default><output class="sidebar-layout-state__output" aria-live="polite">{{ open ? 'Expanded' : 'Collapsed' }} · {{ Math.round(width) }}px</output></template>
      </SidebarLayout>
    </component>
  </div>
</template>

<style>
.sidebar-layout-state { inline-size: 100%; min-inline-size: 0; }
.sidebar-layout-state__controls { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-block-end: 0.75rem; }
.sidebar-layout-state__layout { block-size: 17rem; border: 1px solid var(--kappa-line); border-radius: 0.5rem; overflow: hidden; }
.sidebar-layout-state__output { display: block; padding: 1rem; font-size: 0.8125rem; }
</style>
