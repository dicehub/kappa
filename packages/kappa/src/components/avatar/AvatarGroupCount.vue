<script setup lang="ts">
import type { AvatarGroupCountSlots } from "./avatar";

defineOptions({ inheritAttrs: false });
defineSlots<AvatarGroupCountSlots>();
</script>

<template>
  <div v-bind="$attrs" class="kappa-avatar-group__count" data-slot="avatar-group-count">
    <slot />
  </div>
</template>
