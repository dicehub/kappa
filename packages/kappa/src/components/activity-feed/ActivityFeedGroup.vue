<script setup lang="ts">
import type { ActivityFeedGroupProps, ActivityFeedGroupSlots } from "./activity-feed";

defineOptions({ inheritAttrs: false });
defineProps<ActivityFeedGroupProps>();
defineSlots<ActivityFeedGroupSlots>();
</script>

<template>
  <section v-bind="$attrs" class="kappa-activity-feed__group" data-slot="activity-feed-group">
    <slot />
  </section>
</template>
