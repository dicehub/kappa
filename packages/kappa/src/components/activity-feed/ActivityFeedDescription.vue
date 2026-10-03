<script setup lang="ts">
import type { ActivityFeedDescriptionSlots, ActivityFeedPartProps } from "./activity-feed";

defineOptions({ inheritAttrs: false });
defineProps<ActivityFeedPartProps>();
defineSlots<ActivityFeedDescriptionSlots>();
</script>

<template>
  <p
    v-bind="$attrs"
    class="kappa-activity-feed__description"
    data-slot="activity-feed-description"
  >
    <slot />
  </p>
</template>
