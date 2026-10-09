<script setup lang="ts">
import { computed } from "vue";
import { Sidebar } from "@dicehub/kappa/components/sidebar";
import { Dropdown } from "@dicehub/kappa/components/dropdown";
import { Bell, ChevronsUpDown, Settings, UserRound } from "@lucide/vue";

const emit = defineEmits<{ select: [value: string] }>();
const profile = defineModel<string>({ required: true });
const profiles = [
  { value: "casey", name: "Casey Rivera", email: "casey@example.test", initials: "CR" },
  { value: "jordan", name: "Jordan Lee", email: "jordan@example.test", initials: "JL" },
];
const selected = computed(() => profiles.find(item => item.value === profile.value)!);
</script>

<template>
  <Sidebar.Context v-slot="{ isMobile, setMobileOpen }">
    <Dropdown.Root aria-label="Profile" :positioning="{ placement: 'top-start', gutter: 6, strategy: 'fixed' }">
      <Dropdown.Trigger as-child>
        <Sidebar.MenuButton :aria-label="`Profile: ${selected.name}`" :tooltip="selected.name" class="sidebar-demo__profile">
          <template #icon><span class="sidebar-demo__avatar" aria-hidden="true">{{ selected.initials }}</span></template>
          <ChevronsUpDown class="sidebar-demo__switch-icon" aria-hidden="true" />
          <span class="sidebar-demo__identity"><strong>{{ selected.name }}</strong><small>{{ selected.email }}</small></span>
        </Sidebar.MenuButton>
      </Dropdown.Trigger>
      <Dropdown.Content :teleport="!isMobile" class="sidebar-demo__popup">
        <Dropdown.RadioGroup v-model="profile">
          <Dropdown.Label>Switch profile</Dropdown.Label>
          <Dropdown.RadioItem v-for="item in profiles" :key="item.value" :value="item.value" close-on-select class="sidebar-demo__profile-option">
            <template #indicator><svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="m3 8.25 3 3 7-7" /></svg></template>
            {{ item.name }}
          </Dropdown.RadioItem>
        </Dropdown.RadioGroup>
        <Dropdown.Separator />
        <Dropdown.Item value="account" :icon="UserRound" @select="emit('select', 'Account'); setMobileOpen(false)">Account</Dropdown.Item>
        <Dropdown.Item value="preferences" :icon="Settings" @select="emit('select', 'Preferences'); setMobileOpen(false)">Preferences</Dropdown.Item>
        <Dropdown.Item value="notifications" :icon="Bell" @select="emit('select', 'Notifications'); setMobileOpen(false)">Notifications</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  </Sidebar.Context>
</template>
