<script setup lang="ts">
import { ref } from "vue";
import { SidebarLayout } from "@dicehub/kappa/blocks/sidebar-layout";
import { Sidebar } from "@dicehub/kappa/components/sidebar";
import { Dropdown } from "@dicehub/kappa/components/dropdown";
import { UserRound } from "@lucide/vue";
const profile = ref("Casey Rivera");
const profiles = ["Casey Rivera", "Jordan Lee"];
</script>

<template>
  <SidebarLayout label="Workspace navigation">
    <template #header><Sidebar.MenuLabel>Workspace</Sidebar.MenuLabel></template>
    <template #footer="{ isMobile }">
      <Dropdown.Root :positioning="{ placement: 'top-start', strategy: 'fixed' }">
        <Dropdown.Trigger as-child>
          <Sidebar.MenuButton :icon="UserRound" :tooltip="profile">{{ profile }}</Sidebar.MenuButton>
        </Dropdown.Trigger>
        <Dropdown.Content :teleport="!isMobile">
          <Dropdown.Label>Switch profile</Dropdown.Label>
          <Dropdown.Item v-for="name in profiles" :key="name" :value="name" :selected="profile === name"
            :aria-current="profile === name ? 'true' : undefined" @select="profile = name">{{ name }}</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>
    </template>
    <h1>{{ profile }}</h1>
  </SidebarLayout>
</template>
