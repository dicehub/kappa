<script setup lang="ts">
import type { ActivityFeedTimeProps, ActivityFeedTimeSlots } from "./activity-feed";

defineOptions({ inheritAttrs: false });
defineProps<ActivityFeedTimeProps>();
defineSlots<ActivityFeedTimeSlots>();
</script>

<template>
  <time
    v-bind="$attrs"
    class="kappa-activity-feed__time"
    data-slot="activity-feed-time"
    :datetime="datetime"
  >
    <slot />
  </time>
</template>
