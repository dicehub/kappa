<script setup lang="ts">
import { computed } from "vue";
import {
  ACTIVITY_FEED_GROUP_LABEL_DEFAULT_ELEMENT,
  resolveActivityFeedGroupLabelElement,
  type ActivityFeedGroupLabelProps,
  type ActivityFeedGroupLabelSlots,
} from "./activity-feed";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ActivityFeedGroupLabelProps>(), {
  as: ACTIVITY_FEED_GROUP_LABEL_DEFAULT_ELEMENT,
});

defineSlots<ActivityFeedGroupLabelSlots>();

const resolvedElement = computed(() => resolveActivityFeedGroupLabelElement(props.as));
</script>

<template>
  <component
    :is="resolvedElement"
    v-bind="$attrs"
    class="kappa-activity-feed__group-label"
    data-slot="activity-feed-group-label"
  >
    <slot />
  </component>
</template>
