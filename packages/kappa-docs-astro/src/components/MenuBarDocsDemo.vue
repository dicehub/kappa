<script setup lang="ts">
import { MenuBar } from "@dicehub/kappa";
import { ref } from "vue";

type DemoVariant = "preview" | "nested" | "options" | "controlled";
const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), { variant: "preview" });
const lastAction = ref("Choose a command");
const showGrid = ref(true);
const density = ref("comfortable");
const openMenu = ref<string | null>(null);
const handleAction = (value: string) => { lastAction.value = value; };
</script>

<template>
  <div class="menu-bar-demo" :data-menu-bar-demo="props.variant">
    <div v-if="props.variant === 'preview'" class="menu-bar-demo__workbench">
      <div class="menu-bar-demo__topline">
        <MenuBar.Root aria-label="Document commands">
          <MenuBar.Menu value="file" @select="handleAction($event.value)">
            <MenuBar.Trigger>File</MenuBar.Trigger>
            <MenuBar.Content data-menu-bar-surface="file">
              <MenuBar.Item value="new">New document <template #end><MenuBar.Shortcut>⌘N</MenuBar.Shortcut></template></MenuBar.Item>
              <MenuBar.Item value="open">Open… <template #end><MenuBar.Shortcut>⌘O</MenuBar.Shortcut></template></MenuBar.Item>
              <MenuBar.Separator />
              <MenuBar.Item value="save">Save <template #end><MenuBar.Shortcut>⌘S</MenuBar.Shortcut></template></MenuBar.Item>
            </MenuBar.Content>
          </MenuBar.Menu>
          <MenuBar.Menu value="edit" @select="handleAction($event.value)">
            <MenuBar.Trigger>Edit</MenuBar.Trigger>
            <MenuBar.Content data-menu-bar-surface="edit">
              <MenuBar.Item value="undo">Undo <template #end><MenuBar.Shortcut>⌘Z</MenuBar.Shortcut></template></MenuBar.Item>
              <MenuBar.Item value="redo" disabled>Redo <template #end><MenuBar.Shortcut>⇧⌘Z</MenuBar.Shortcut></template></MenuBar.Item>
            </MenuBar.Content>
          </MenuBar.Menu>
          <MenuBar.Menu value="view" @select="handleAction($event.value)">
            <MenuBar.Trigger>View</MenuBar.Trigger>
            <MenuBar.Content data-menu-bar-surface="view">
              <MenuBar.Item value="zoom-in">Zoom in</MenuBar.Item>
              <MenuBar.Item value="zoom-out">Zoom out</MenuBar.Item>
            </MenuBar.Content>
          </MenuBar.Menu>
        </MenuBar.Root>
      </div>
      <div class="menu-bar-demo__paper"><span class="menu-bar-demo__paper-kicker">WORKSPACE NOTE / 001</span><strong>Design review</strong><span>Use File, Edit, and View to work with this document.</span></div>
      <output class="menu-bar-demo__status" aria-live="polite">{{ lastAction }}</output>
    </div>

    <div v-else-if="props.variant === 'nested'" class="menu-bar-demo__compact">
      <MenuBar.Root aria-label="Export commands">
        <MenuBar.Menu value="file" @select="handleAction($event.value)">
          <MenuBar.Trigger>File</MenuBar.Trigger>
          <MenuBar.Content data-menu-bar-surface="nested">
            <MenuBar.Item value="save">Save</MenuBar.Item>
            <MenuBar.Sub aria-label="Export format" @select="handleAction($event.value)">
              <MenuBar.SubTrigger>Export as</MenuBar.SubTrigger>
              <MenuBar.SubContent data-menu-bar-surface="export">
                <MenuBar.Item value="export-pdf">PDF</MenuBar.Item>
                <MenuBar.Item value="export-svg">SVG</MenuBar.Item>
              </MenuBar.SubContent>
            </MenuBar.Sub>
          </MenuBar.Content>
        </MenuBar.Menu>
      </MenuBar.Root>
      <output aria-live="polite">{{ lastAction }}</output>
    </div>

    <div v-else-if="props.variant === 'options'" class="menu-bar-demo__compact">
      <MenuBar.Root aria-label="View commands">
        <MenuBar.Menu value="view">
          <MenuBar.Trigger>View</MenuBar.Trigger>
          <MenuBar.Content data-menu-bar-surface="options">
            <MenuBar.CheckboxItem v-model:checked="showGrid" value="grid">Show grid</MenuBar.CheckboxItem>
            <MenuBar.Separator />
            <MenuBar.RadioGroup v-model="density">
              <MenuBar.Label>Density</MenuBar.Label>
              <MenuBar.RadioItem value="compact">Compact</MenuBar.RadioItem>
              <MenuBar.RadioItem value="comfortable">Comfortable</MenuBar.RadioItem>
            </MenuBar.RadioGroup>
          </MenuBar.Content>
        </MenuBar.Menu>
      </MenuBar.Root>
      <output aria-live="polite">Grid {{ showGrid ? "on" : "off" }} · {{ density }}</output>
    </div>

    <div v-else class="menu-bar-demo__compact">
      <MenuBar.Root v-model="openMenu" aria-label="Workspace commands">
        <MenuBar.Menu value="file">
          <MenuBar.Trigger>File</MenuBar.Trigger>
          <MenuBar.Content data-menu-bar-surface="controlled"><MenuBar.Item value="save">Save</MenuBar.Item></MenuBar.Content>
        </MenuBar.Menu>
        <MenuBar.Menu value="edit">
          <MenuBar.Trigger disabled>Edit</MenuBar.Trigger>
          <MenuBar.Content><MenuBar.Item value="undo">Undo</MenuBar.Item></MenuBar.Content>
        </MenuBar.Menu>
      </MenuBar.Root>
      <output aria-live="polite">Open menu: {{ openMenu ?? "none" }}</output>
    </div>
  </div>
</template>

<style scoped src="./menu-bar-docs-demo.css"></style>
