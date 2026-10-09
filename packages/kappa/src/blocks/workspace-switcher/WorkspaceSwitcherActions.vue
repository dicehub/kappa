<script setup lang="ts">
import { Dropdown } from "../../components/dropdown";
import type { WorkspaceSwitcherAction } from "./workspace-switcher";
defineProps<{ items: readonly WorkspaceSwitcherAction[]; section: "primary" | "workspace" | "footer" }>();
defineEmits<{ action: [action: WorkspaceSwitcherAction] }>();
</script>

<template>
  <Dropdown.Group>
    <Dropdown.Separator v-if="section === 'footer'" />
    <Dropdown.Item v-for="action in items" :key="action.value" :value="`workspace-action:${section}:${action.value}`"
      :value-text="action.label" :icon="action.icon" :disabled="action.disabled" :variant="action.variant"
      :data-accent="action.accent || undefined" class="kappa-workspace-switcher__action"
      @select="$emit('action', action)">{{ action.label }}</Dropdown.Item>
  </Dropdown.Group>
</template>
