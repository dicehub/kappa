<script setup lang="ts">
import { Drawer as ArkDrawer } from "@ark-ui/vue/drawer";
import { DEFAULT_LOCALE, useLocaleContext } from "@ark-ui/vue/locale";
import { computed, ref, Teleport } from "vue";
import type { SidebarProps, SidebarSlots } from "./sidebar";
import { useSidebarContext } from "./sidebar-context";
import { useSidebarPeek } from "./sidebar-peek";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<SidebarProps>(), { label: "Main navigation", fullScreenOnMobile: false });
defineSlots<SidebarSlots>();
const sidebar = useSidebarContext();
const locale = useLocaleContext(DEFAULT_LOCALE);
const nav = ref<HTMLElement>();
useSidebarPeek(nav, sidebar);
const navProps = computed(() => ({
  id: sidebar.navId.value,
  "aria-label": props.label,
  "data-state": sidebar.isMobile.value ? "expanded" : sidebar.state.value,
  "data-side": sidebar.side.value,
  "data-collapsible": sidebar.collapsible.value,
  "data-compact": sidebar.compact.value ? "" : undefined,
  "data-mobile": sidebar.isMobile.value ? "" : undefined,
  "data-peekable": sidebar.peekable.value ? "" : undefined,
  "data-resizing": sidebar.isResizing.value ? "" : undefined,
  style: sidebar.dimensions.value,
}));
</script>

<template>
  <Teleport v-if="sidebar.isMobile.value" to="body">
    <ArkDrawer.Backdrop class="kappa-sidebar__backdrop" data-slot="sidebar-backdrop" />
    <ArkDrawer.Positioner class="kappa-sidebar__positioner" :dir="locale.dir">
      <ArkDrawer.Content
        class="kappa-sidebar__dialog"
        data-slot="sidebar-dialog"
        :aria-label="props.label"
        :draggable="false"
        :dir="locale.dir"
        :data-full-screen="props.fullScreenOnMobile ? '' : undefined"
        :style="sidebar.dimensions.value"
      >
        <nav v-bind="{ ...navProps, ...$attrs, id: sidebar.navId.value }" class="kappa-sidebar" data-slot="sidebar">
          <slot />
        </nav>
      </ArkDrawer.Content>
    </ArkDrawer.Positioner>
  </Teleport>
  <div
    v-else
    class="kappa-sidebar__shell"
    :data-state="sidebar.state.value"
    :data-side="sidebar.side.value"
    :data-collapsible="sidebar.collapsible.value"
    :data-peekable="sidebar.peekable.value ? '' : undefined"
    :data-resizing="sidebar.isResizing.value ? '' : undefined"
  >
    <nav
      ref="nav"
      v-bind="{ ...navProps, ...$attrs, id: sidebar.navId.value }"
      class="kappa-sidebar"
      data-slot="sidebar"
      :inert="sidebar.collapsible.value === 'offcanvas' && sidebar.state.value === 'collapsed' ? true : undefined"
      :aria-hidden="sidebar.collapsible.value === 'offcanvas' && sidebar.state.value === 'collapsed' ? true : undefined"
    ><slot /></nav>
  </div>
</template>

<style src="./sidebar.css"></style>
