<script setup lang="ts">
import { computed } from "vue";
import {
  BREADCRUMBS_DEFAULT_SIZE,
  resolveBreadcrumbsSize,
  type BreadcrumbsProps,
  type BreadcrumbsSlots,
} from "./breadcrumbs";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<BreadcrumbsProps>(), {
  size: BREADCRUMBS_DEFAULT_SIZE,
});
defineSlots<BreadcrumbsSlots>();

const resolvedSize = computed(() => resolveBreadcrumbsSize(props.size));
</script>

<template>
  <nav
    :aria-label="$attrs['aria-labelledby'] === undefined ? 'Breadcrumb' : undefined"
    v-bind="$attrs"
    class="kappa-breadcrumbs"
    data-slot="breadcrumbs"
    :data-size="resolvedSize"
  >
    <slot />
  </nav>
</template>

<style src="./breadcrumbs.css"></style>
