<script setup lang="ts">
import { computed } from "vue";
import { SidebarLayout } from "../sidebar-layout";
import { Sidebar } from "../../components/sidebar";
import type { SidebarLayoutEmits, SidebarLayoutProps } from "../sidebar-layout";
import type { AppShellProps, AppShellSlots } from "./app-shell";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<AppShellProps>(), {
  appearance: "default", fill: false, bloom: false, railLabel: "Workspace tools",
  open: undefined, mobileOpen: undefined, defaultOpen: undefined,
  fullScreenOnMobile: undefined, resizable: undefined, peekable: undefined,
  defaultMobileOpen: undefined, compact: undefined, collapseOnResize: undefined,
});
const emit = defineEmits<SidebarLayoutEmits>();
const slots = defineSlots<AppShellSlots>();
// Vue updates slots during render; their keys are not reactive computed inputs.
const slotNames = () => Object.keys(slots).filter(name => name !== "rail" && name !== "toolbar-trigger") as Exclude<keyof AppShellSlots, "rail" | "toolbar-trigger">[];
const layoutProps = computed(() => {
  const { appearance, fill, bloom, hideDesktopTrigger, railLabel, ...rest } = props;
  const preset = appearance === "paneled" ? {
    variant: "header", contentAlignment: "available", width: "240px", collapsedWidth: "44px",
    mobileWidth: "min(80vw, 320px)", mobileBreakpoint: 1200,
  } : appearance === "compact" ? {
    variant: "header", width: "250px", defaultWidth: 250, collapsedWidth: "48px",
    resizable: true, minWidth: 200, maxWidth: 420,
  } : {};
  return { ...preset, ...Object.fromEntries(Object.entries(rest).filter(([, value]) => value !== undefined)) } as SidebarLayoutProps;
});
</script>

<template>
  <SidebarLayout v-bind="{ ...$attrs, ...layoutProps }" class="kappa-app-shell"
    :data-has-rail="Boolean(slots.rail) || undefined"
    :data-hide-desktop-trigger="props.hideDesktopTrigger || undefined" :data-appearance="props.appearance" :data-fill="props.fill || undefined" :data-bloom="props.bloom || undefined"
    :navigation-props="{ ...props.navigationProps, 'data-app-shell-appearance': props.appearance }"
    @update:open="emit('update:open', $event)" @open-change="emit('openChange', $event)"
    @update:mobile-open="emit('update:mobileOpen', $event)" @mobile-open-change="emit('mobileOpenChange', $event)"
    @update:resize-width="emit('update:resizeWidth', $event)" @resize="emit('resize', $event)" @resize-end="emit('resizeEnd', $event)">
    <template v-for="name in slotNames()" #[name]="context"><slot :name="name" v-bind="context" /></template>
    <template #toolbar-trigger="context">
      <slot name="toolbar-trigger" v-bind="context">
        <Sidebar.Trigger v-if="props.appearance === 'paneled' && context.isMobile" v-bind="props.triggerProps"
          :aria-label="context.mobileOpen ? props.triggerProps?.closeLabel ?? 'Close sidebar' : props.triggerProps?.openLabel ?? 'Open sidebar'">
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false"><path d="M2 4h12M2 8h12M2 12h12" /></svg>
        </Sidebar.Trigger>
        <Sidebar.Trigger v-else v-bind="props.triggerProps" />
      </slot>
    </template>
    <template v-if="slots.rail" #rail="context">
      <nav class="kappa-app-shell__rail" :aria-label="props.railLabel"><slot name="rail" v-bind="context" /></nav>
    </template>
  </SidebarLayout>
</template>
<style src="./app-shell.css"></style>
<style src="./app-shell-rail.css"></style>
<style src="./app-shell-paneled.css"></style>
