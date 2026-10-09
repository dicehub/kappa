<script setup lang="ts">
import { Avatar } from "../../components/avatar";
import type { WorkspaceSwitcherItem } from "./workspace-switcher";
defineProps<{ item: WorkspaceSwitcherItem; large?: boolean }>();
</script>

<template>
  <span class="kappa-workspace-switcher__badge" :data-large="large || undefined" aria-hidden="true">
    <Avatar.Root v-if="item.avatarSrc" class="kappa-workspace-switcher__avatar">
      <Avatar.Image :src="item.avatarSrc" alt="" />
      <Avatar.Fallback>{{ item.initials ?? item.name.slice(0, 2).toUpperCase() }}</Avatar.Fallback>
    </Avatar.Root>
    <component :is="item.icon" v-else-if="item.icon" />
    <span v-else>{{ item.initials ?? item.name.slice(0, 2).toUpperCase() }}</span>
  </span>
</template>
