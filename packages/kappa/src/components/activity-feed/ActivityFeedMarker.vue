<script setup lang="ts">
import { computed } from "vue";
import {
  ACTIVITY_FEED_DEFAULT_MARKER_VARIANT,
  resolveActivityFeedMarkerVariant,
  type ActivityFeedMarkerProps,
  type ActivityFeedMarkerSlots,
} from "./activity-feed";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ActivityFeedMarkerProps>(), {
  variant: ACTIVITY_FEED_DEFAULT_MARKER_VARIANT,
});

defineSlots<ActivityFeedMarkerSlots>();

const resolvedVariant = computed(() => resolveActivityFeedMarkerVariant(props.variant));
</script>

<template>
  <div
    v-bind="$attrs"
    class="kappa-activity-feed__marker"
    data-slot="activity-feed-marker"
    :data-variant="resolvedVariant"
  >
    <slot />
  </div>
</template>
