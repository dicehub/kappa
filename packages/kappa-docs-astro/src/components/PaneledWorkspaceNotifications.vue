<script setup lang="ts">
import { computed } from "vue";
import { Bell, CheckCheck } from "@lucide/vue";
import { Dropdown } from "@dicehub/kappa/components/dropdown";
import { ToolbarButton } from "@dicehub/kappa/components/button";
import type { WorkspaceNotification } from "./paneled-workspace-notifications";

const props = defineProps<{ items: WorkspaceNotification[] }>();
const emit = defineEmits<{ open: [notification: WorkspaceNotification]; readAll: [] }>();
const unread = computed(() => props.items.filter(item => !item.read).length);
</script>

<template>
  <Dropdown.Root aria-label="Notifications" :positioning="{ placement: 'bottom-end', strategy: 'fixed', gutter: 4, fitViewport: true, overflowPadding: 8 }">
    <Dropdown.Trigger as-child>
      <ToolbarButton :icon="Bell" class="paneled-notifications__trigger" tooltip="Notifications" :aria-label="`${unread} unread notifications`"><span>{{ unread }}</span></ToolbarButton>
    </Dropdown.Trigger>
    <Dropdown.Content show-arrow class="paneled-notifications__menu">
      <Dropdown.Group>
        <Dropdown.Label>Notifications</Dropdown.Label>
        <Dropdown.Item v-for="item in items" :key="item.id" :value="item.id" :value-text="item.title" class="paneled-notifications__item" @select="emit('open', item)">
          <span class="paneled-notifications__copy">
            <strong>{{ item.title }}<span v-if="!item.read" class="paneled-notifications__unread" aria-label="Unread" /></strong>
            <span>{{ item.description }}</span>
            <small>{{ item.time }}</small>
          </span>
        </Dropdown.Item>
        <Dropdown.Item v-if="!items.length" value="empty" disabled>No notifications.</Dropdown.Item>
      </Dropdown.Group>
      <Dropdown.Separator />
      <Dropdown.Item value="read-all" :icon="CheckCheck" :disabled="!unread" :close-on-select="false" @select="emit('readAll')">Mark all as read</Dropdown.Item>
    </Dropdown.Content>
  </Dropdown.Root>
</template>

<style>
.paneled-notifications__menu { --kappa-dropdown-min-inline-size: 20rem; --kappa-dropdown-max-inline-size: 20rem; }
.paneled-notifications__copy { display: flex; flex-direction: column; gap: 0.375rem; white-space: normal; }
.paneled-notifications__copy strong { display: flex; align-items: center; gap: 0.5rem; font-size: 0.8125rem; font-weight: 550; }
.paneled-notifications__copy > span, .paneled-notifications__copy small { color: var(--kappa-subtle); font-size: 0.75rem; line-height: 1.125rem; }
.paneled-notifications__unread { inline-size: 0.375rem; block-size: 0.375rem; flex: none; border-radius: 50%; background: var(--kappa-accent); }
@container paneled-workspace (max-width: 63.999rem) {
  .paneled-notifications__trigger .kappa-button__label { display: none; }
}
</style>
