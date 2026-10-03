<script setup lang="ts">
import { ark } from "@ark-ui/vue/factory";
import type { BreadcrumbsLinkProps, BreadcrumbsLinkSlots } from "./breadcrumbs";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<BreadcrumbsLinkProps>(), {
  asChild: false,
});
defineSlots<BreadcrumbsLinkSlots>();
</script>

<template>
  <ark.a
    v-bind="{ ...$attrs, ...props }"
    class="kappa-breadcrumbs__link"
    data-slot="breadcrumbs-link"
    :as-child="props.asChild"
  >
    <slot />
  </ark.a>
</template>
