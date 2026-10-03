<script setup lang="ts">
import type { ActivityFeedContentSlots, ActivityFeedPartProps } from "./activity-feed";

defineOptions({ inheritAttrs: false });
defineProps<ActivityFeedPartProps>();
defineSlots<ActivityFeedContentSlots>();
</script>

<template>
  <div v-bind="$attrs" class="kappa-activity-feed__content" data-slot="activity-feed-content">
    <slot />
  </div>
</template>
