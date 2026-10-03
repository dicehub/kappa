<script setup lang="ts">
import { computed } from "vue";
import {
  ACTIVITY_FEED_DEFAULT_TONE,
  resolveActivityFeedTone,
  type ActivityFeedItemProps,
  type ActivityFeedItemSlots,
} from "./activity-feed";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ActivityFeedItemProps>(), {
  tone: ACTIVITY_FEED_DEFAULT_TONE,
});

defineSlots<ActivityFeedItemSlots>();

const resolvedTone = computed(() => resolveActivityFeedTone(props.tone));
</script>

<template>
  <li
    v-bind="$attrs"
    class="kappa-activity-feed__item"
    data-slot="activity-feed-item"
    :data-tone="resolvedTone"
  >
    <slot />
  </li>
</template>
