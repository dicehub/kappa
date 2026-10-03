<script setup lang="ts">
import type { ActivityFeedListProps, ActivityFeedListSlots } from "./activity-feed";

defineOptions({ inheritAttrs: false });
defineProps<ActivityFeedListProps>();
defineSlots<ActivityFeedListSlots>();
</script>

<template>
  <ol v-bind="$attrs" class="kappa-activity-feed__list" data-slot="activity-feed-list">
    <slot />
  </ol>
</template>
