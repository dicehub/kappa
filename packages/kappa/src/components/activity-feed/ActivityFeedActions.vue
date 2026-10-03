<script setup lang="ts">
import type { ActivityFeedActionsSlots, ActivityFeedPartProps } from "./activity-feed";

defineOptions({ inheritAttrs: false });
defineProps<ActivityFeedPartProps>();
defineSlots<ActivityFeedActionsSlots>();
</script>

<template>
  <div v-bind="$attrs" class="kappa-activity-feed__actions" data-slot="activity-feed-actions">
    <slot />
  </div>
</template>
