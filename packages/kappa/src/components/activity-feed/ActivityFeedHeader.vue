<script setup lang="ts">
import type { ActivityFeedHeaderSlots, ActivityFeedPartProps } from "./activity-feed";

defineOptions({ inheritAttrs: false });
defineProps<ActivityFeedPartProps>();
defineSlots<ActivityFeedHeaderSlots>();
</script>

<template>
  <div v-bind="$attrs" class="kappa-activity-feed__header" data-slot="activity-feed-header">
    <slot />
  </div>
</template>
