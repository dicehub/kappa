<script setup lang="ts">
import type { AvatarGroupSlots } from "./avatar";

defineOptions({ inheritAttrs: false });
defineSlots<AvatarGroupSlots>();
</script>

<template>
  <div v-bind="$attrs" class="kappa-avatar-group" data-slot="avatar-group">
    <slot />
  </div>
</template>
