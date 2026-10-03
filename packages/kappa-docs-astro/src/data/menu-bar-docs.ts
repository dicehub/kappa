export const barrelCode = `import { MenuBar } from "@dicehub/kappa";`;
export const granularCode = `import { MenuBar } from "@dicehub/kappa/components/menu-bar";`;

export const previewCode = `<script setup lang="ts">
import { ref } from "vue";
import { MenuBar } from "@dicehub/kappa/components/menu-bar";

const lastAction = ref("Choose a command");
</script>

<template>
  <MenuBar.Root aria-label="Document commands">
    <MenuBar.Menu value="file" @select="lastAction = $event.value">
      <MenuBar.Trigger>File</MenuBar.Trigger>
      <MenuBar.Content>
        <MenuBar.Item value="new">New document</MenuBar.Item>
        <MenuBar.Item value="open">Open…</MenuBar.Item>
        <MenuBar.Separator />
        <MenuBar.Item value="save">Save</MenuBar.Item>
      </MenuBar.Content>
    </MenuBar.Menu>
    <MenuBar.Menu value="edit" @select="lastAction = $event.value">
      <MenuBar.Trigger>Edit</MenuBar.Trigger>
      <MenuBar.Content>
        <MenuBar.Item value="undo">Undo</MenuBar.Item>
        <MenuBar.Item value="redo">Redo</MenuBar.Item>
      </MenuBar.Content>
    </MenuBar.Menu>
  </MenuBar.Root>
  <output aria-live="polite">{{ lastAction }}</output>
</template>`;

export const nestedCode = `<MenuBar.Root aria-label="Document commands">
  <MenuBar.Menu value="file" @select="handleAction($event.value)">
    <MenuBar.Trigger>File</MenuBar.Trigger>
    <MenuBar.Content>
      <MenuBar.Item value="save">Save</MenuBar.Item>
      <MenuBar.Sub aria-label="Export format" @select="handleAction($event.value)">
        <MenuBar.SubTrigger>Export as</MenuBar.SubTrigger>
        <MenuBar.SubContent>
          <MenuBar.Item value="export-pdf">PDF</MenuBar.Item>
          <MenuBar.Item value="export-svg">SVG</MenuBar.Item>
        </MenuBar.SubContent>
      </MenuBar.Sub>
    </MenuBar.Content>
  </MenuBar.Menu>
</MenuBar.Root>`;

export const optionsCode = `<script setup lang="ts">
import { ref } from "vue";
import { MenuBar } from "@dicehub/kappa/components/menu-bar";

const showGrid = ref(true);
const density = ref("comfortable");
</script>

<template>
  <MenuBar.Root aria-label="View commands">
    <MenuBar.Menu value="view">
      <MenuBar.Trigger>View</MenuBar.Trigger>
      <MenuBar.Content>
        <MenuBar.CheckboxItem v-model:checked="showGrid" value="grid">
          Show grid
        </MenuBar.CheckboxItem>
        <MenuBar.Separator />
        <MenuBar.RadioGroup v-model="density">
          <MenuBar.Label>Density</MenuBar.Label>
          <MenuBar.RadioItem value="compact">Compact</MenuBar.RadioItem>
          <MenuBar.RadioItem value="comfortable">Comfortable</MenuBar.RadioItem>
        </MenuBar.RadioGroup>
      </MenuBar.Content>
    </MenuBar.Menu>
  </MenuBar.Root>
</template>`;

export const controlledCode = `<script setup lang="ts">
import { ref } from "vue";
import { MenuBar } from "@dicehub/kappa/components/menu-bar";

const openMenu = ref<string | null>(null);
</script>

<template>
  <MenuBar.Root v-model="openMenu" aria-label="Workspace commands">
    <MenuBar.Menu value="file">
      <MenuBar.Trigger>File</MenuBar.Trigger>
      <MenuBar.Content>
        <MenuBar.Item value="save">Save</MenuBar.Item>
      </MenuBar.Content>
    </MenuBar.Menu>
    <MenuBar.Menu value="edit">
      <MenuBar.Trigger disabled>Edit</MenuBar.Trigger>
      <MenuBar.Content>
        <MenuBar.Item value="undo">Undo</MenuBar.Item>
      </MenuBar.Content>
    </MenuBar.Menu>
  </MenuBar.Root>
  <output>Open menu: {{ openMenu ?? "none" }}</output>
</template>`;
