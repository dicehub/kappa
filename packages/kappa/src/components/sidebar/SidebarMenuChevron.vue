<script setup lang="ts">
import { Collapsible as ArkCollapsible } from "@ark-ui/vue/collapsible";
defineOptions({ inheritAttrs: false });
</script>
<template>
  <ArkCollapsible.Indicator v-bind="$attrs" class="kappa-sidebar__menu-chevron" data-slot="sidebar-menu-chevron" aria-hidden="true">
    <svg viewBox="0 0 16 16" fill="none" focusable="false"><path d="m6 4 4 4-4 4" /></svg>
  </ArkCollapsible.Indicator>
</template>

<style src="./sidebar.css"></style>
