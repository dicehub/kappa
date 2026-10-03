<script setup lang="ts">
import { computed } from "vue";
import {
  ACTIVITY_FEED_TITLE_DEFAULT_ELEMENT,
  resolveActivityFeedTitleElement,
  type ActivityFeedTitleProps,
  type ActivityFeedTitleSlots,
} from "./activity-feed";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ActivityFeedTitleProps>(), {
  as: ACTIVITY_FEED_TITLE_DEFAULT_ELEMENT,
});

defineSlots<ActivityFeedTitleSlots>();

const resolvedElement = computed(() => resolveActivityFeedTitleElement(props.as));
</script>

<template>
  <component
    :is="resolvedElement"
    v-bind="$attrs"
    class="kappa-activity-feed__title"
    data-slot="activity-feed-title"
  >
    <slot />
  </component>
</template>
