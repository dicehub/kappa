<script setup lang="ts">
import { computed } from "vue";
import { Sidebar, SIDEBAR_DEFAULTS } from "../../components/sidebar";
import SidebarLayoutSecondary from "./SidebarLayoutSecondary.vue";
import {
  SIDEBAR_LAYOUT_DEFAULTS, sidebarLayoutDefaultOpen, sidebarLayoutDefaultWidth,
  type SidebarLayoutEmits, type SidebarLayoutProps, type SidebarLayoutSlots,
} from "./sidebar-layout";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<SidebarLayoutProps>(), {
  ...SIDEBAR_DEFAULTS, ...SIDEBAR_LAYOUT_DEFAULTS,
  open: undefined, mobileOpen: undefined, defaultOpen: undefined,
  width: undefined, defaultWidth: undefined,
});
const emit = defineEmits<SidebarLayoutEmits>();
defineSlots<SidebarLayoutSlots>();
const providerProps = computed(() => {
  const { variant, contentAlignment, label, navigationLabel, secondaryLabel, closeLabel, resizeLabel, fullScreenOnMobile, triggerProps, ...provider } = props;
  return {
    ...provider,
    defaultOpen: props.defaultOpen ?? sidebarLayoutDefaultOpen(variant),
    width: props.width ?? `${sidebarLayoutDefaultWidth(variant)}px`,
    defaultWidth: props.defaultWidth ?? sidebarLayoutDefaultWidth(variant),
  };
});
</script>

<template>
  <Sidebar.Provider
    v-bind="{ ...$attrs, ...providerProps }"
    class="kappa-sidebar-layout" :data-variant="props.variant" :data-side="props.side"
    :data-content-alignment="props.contentAlignment" :data-collapsible="props.collapsible"
    @update:open="emit('update:open', $event)" @open-change="emit('openChange', $event)"
    @update:mobile-open="emit('update:mobileOpen', $event)" @mobile-open-change="emit('mobileOpenChange', $event)"
    @update:resize-width="emit('update:resizeWidth', $event)" @resize="emit('resize', $event)" @resize-end="emit('resizeEnd', $event)"
  >
    <Sidebar.Context v-slot="context">
      <header v-if="props.variant === 'header'" class="kappa-sidebar-layout__toolbar kappa-sidebar-layout__site-header">
        <Sidebar.Trigger v-bind="props.triggerProps" />
        <slot name="toolbar" v-bind="context" />
      </header>
      <div class="kappa-sidebar-layout__body">
        <Sidebar.Root :label="props.label" :full-screen-on-mobile="props.fullScreenOnMobile" class="kappa-sidebar-layout__navigation" :data-layout="props.variant">
          <Sidebar.Header>
            <slot name="header" v-bind="context" />
            <Sidebar.Close :label="props.closeLabel" />
          </Sidebar.Header>
          <div class="kappa-sidebar-layout__columns">
            <Sidebar.Content :aria-label="props.navigationLabel" class="kappa-sidebar-layout__primary">
              <slot name="navigation" v-bind="context" />
            </Sidebar.Content>
            <SidebarLayoutSecondary
              v-if="props.variant === 'split' && $slots.secondary"
              :label="props.secondaryLabel"
            ><slot name="secondary" v-bind="context" /></SidebarLayoutSecondary>
          </div>
          <Sidebar.Footer v-if="$slots.footer"><slot name="footer" v-bind="context" /></Sidebar.Footer>
          <Sidebar.ResizeHandle v-if="props.resizable" :label="props.resizeLabel" />
        </Sidebar.Root>
        <div class="kappa-sidebar-layout__main">
          <header v-if="props.variant !== 'header'" class="kappa-sidebar-layout__toolbar">
            <Sidebar.Trigger v-bind="props.triggerProps" />
            <slot name="toolbar" v-bind="context" />
          </header>
          <div class="kappa-sidebar-layout__content-frame">
            <div class="kappa-sidebar-layout__content"><slot v-bind="context" /></div>
          </div>
        </div>
      </div>
    </Sidebar.Context>
  </Sidebar.Provider>
</template>

<style src="./sidebar-layout.css"></style>
