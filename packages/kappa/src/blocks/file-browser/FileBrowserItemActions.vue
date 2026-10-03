<script setup lang="ts">
import { ref } from "vue";
import { Button } from "../../components/button";
import { Dropdown } from "../../components/dropdown";
import FileBrowserControlIcon from "./FileBrowserControlIcon.vue";
import type { FileBrowserAction, FileBrowserItem, FileBrowserLabels } from "./file-browser";

defineProps<{ item: FileBrowserItem; labels: FileBrowserLabels; canRename: boolean; actions: readonly FileBrowserAction[]; disabled: boolean }>();
const emit = defineEmits<{ open: []; rename: [element: HTMLElement | null]; action: [id: string] }>();
const root = ref<HTMLElement | null>(null);
</script>
<template>
  <div ref="root" class="kappa-file-browser__item-actions">
    <Dropdown.Root :aria-label="labels.actions(item.name)">
      <Dropdown.Trigger as-child>
        <Button variant="ghost" size="sm" shape="square" :disabled="disabled || item.disabled" :aria-label="labels.actions(item.name)" :icon="FileBrowserControlIcon" :icon-props="{ name: 'more' }" />
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item value="open" @select="emit('open')">{{ labels.open }}</Dropdown.Item>
        <Dropdown.Item v-if="canRename" value="rename" :disabled="item.readonly" @select="emit('rename', root?.querySelector('button') ?? null)">{{ labels.rename }}</Dropdown.Item>
        <Dropdown.Separator v-if="actions.length" />
        <Dropdown.Item v-for="action in actions" :key="action.id" :value="`custom:${action.id}`" :disabled="action.disabled" :variant="action.destructive ? 'destructive' : 'default'" @select="emit('action', action.id)">{{ action.label }}</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  </div>
</template>
