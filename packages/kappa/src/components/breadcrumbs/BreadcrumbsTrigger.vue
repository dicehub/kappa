<script setup lang="ts">
import { ark } from "@ark-ui/vue/factory";
import type { BreadcrumbsTriggerProps, BreadcrumbsTriggerSlots } from "./breadcrumbs";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<BreadcrumbsTriggerProps>(), { asChild: false, type: "button" });
defineSlots<BreadcrumbsTriggerSlots>();
</script>

<template>
  <ark.button
    v-bind="{ ...$attrs, ...props }"
    class="kappa-breadcrumbs__trigger"
    data-slot="breadcrumbs-trigger"
    :as-child="props.asChild"
  >
    <slot>
      <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <path d="M4 6.5h8l-4 4z" fill="currentColor" />
      </svg>
    </slot>
  </ark.button>
</template>

<style src="./breadcrumbs.css"></style>
