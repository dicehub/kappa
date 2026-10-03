<script setup lang="ts">
import { DEFAULT_LOCALE, LocaleProvider, useLocaleContext } from "@ark-ui/vue/locale";
import type { SidebarResizeHandleProps } from "./sidebar";
import { useSidebarContext } from "./sidebar-context";
import SidebarResizeControl from "./SidebarResizeControl.vue";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<SidebarResizeHandleProps>(), { label: "Resize sidebar", disabled: false });
const sidebar = useSidebarContext();
const locale = useLocaleContext(DEFAULT_LOCALE);
</script>

<template>
  <LocaleProvider locale="en-US">
    <SidebarResizeControl v-if="sidebar.resizable.value && !sidebar.isMobile.value" v-bind="{ ...$attrs, ...props, dir: locale.dir }" />
  </LocaleProvider>
</template>
