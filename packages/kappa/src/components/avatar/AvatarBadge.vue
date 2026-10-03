<script setup lang="ts">
import type { AvatarBadgeSlots } from "./avatar";

defineOptions({ inheritAttrs: false });
defineSlots<AvatarBadgeSlots>();
</script>

<template>
  <span v-bind="$attrs" class="kappa-avatar__badge" data-slot="avatar-badge">
    <slot />
  </span>
</template>
