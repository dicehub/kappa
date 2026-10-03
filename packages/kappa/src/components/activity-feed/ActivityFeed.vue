<script setup lang="ts">
import { computed } from "vue";
import {
  ACTIVITY_FEED_DEFAULT_SIZE,
  resolveActivityFeedSize,
  type ActivityFeedRootProps,
  type ActivityFeedRootSlots,
} from "./activity-feed";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ActivityFeedRootProps>(), {
  size: ACTIVITY_FEED_DEFAULT_SIZE,
});

defineSlots<ActivityFeedRootSlots>();

const resolvedSize = computed(() => resolveActivityFeedSize(props.size));
</script>

<template>
  <div
    v-bind="$attrs"
    class="kappa-activity-feed"
    data-slot="activity-feed"
    :data-size="resolvedSize"
  >
    <slot />
  </div>
</template>

<style src="./activity-feed.css"></style>
