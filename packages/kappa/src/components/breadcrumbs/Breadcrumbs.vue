<script setup lang="ts">
import { computed } from "vue";
import {
  BREADCRUMBS_DEFAULT_SIZE,
  BREADCRUMBS_DEFAULT_VARIANT,
  resolveBreadcrumbsSize,
  resolveBreadcrumbsVariant,
  type BreadcrumbsProps,
  type BreadcrumbsSlots,
} from "./breadcrumbs";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<BreadcrumbsProps>(), {
  size: BREADCRUMBS_DEFAULT_SIZE,
  variant: BREADCRUMBS_DEFAULT_VARIANT,
});
defineSlots<BreadcrumbsSlots>();

const resolvedSize = computed(() => resolveBreadcrumbsSize(props.size));
const resolvedVariant = computed(() => resolveBreadcrumbsVariant(props.variant));
</script>

<template>
  <nav
    :aria-label="$attrs['aria-labelledby'] === undefined ? 'Breadcrumb' : undefined"
    v-bind="$attrs"
    class="kappa-breadcrumbs"
    data-slot="breadcrumbs"
    :data-size="resolvedSize"
    :data-variant="resolvedVariant"
  >
    <slot />
  </nav>
</template>

<style src="./breadcrumbs.css"></style>
