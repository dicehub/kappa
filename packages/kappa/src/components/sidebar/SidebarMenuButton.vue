<script setup lang="ts">
import { ark } from "@ark-ui/vue/factory";
import { DEFAULT_LOCALE, useLocaleContext } from "@ark-ui/vue/locale";
import { computed } from "vue";
import { Tooltip } from "../tooltip";
import SidebarMenuChild from "./SidebarMenuChild";
import type { SidebarMenuButtonProps, SidebarMenuButtonSlots } from "./sidebar";
import { useSidebarContext } from "./sidebar-context";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<SidebarMenuButtonProps>(), {
  asChild: false, active: false, disabled: false,
});
defineSlots<SidebarMenuButtonSlots>();
const sidebar = useSidebarContext();
const locale = useLocaleContext(DEFAULT_LOCALE);
const element = computed(() => props.href !== undefined ? ark.a : ark.button);
const placement = computed(() => (sidebar.side.value === 'start') !== (locale.value.dir === 'rtl') ? 'right' : 'left');
function blockDisabled(event: Event) {
  if (!props.disabled) return;
  event.preventDefault();
  event.stopImmediatePropagation();
}
function blockDisabledKey(event: KeyboardEvent) {
  if (event.key === "Enter" || event.key === " ") blockDisabled(event);
}
</script>

<template>
  <Tooltip.Root
    :disabled="!sidebar.iconCollapsed.value || !props.tooltip || props.disabled"
    :positioning="{ placement, gutter: 8 }"
  >
    <Tooltip.Trigger as-child>
      <component
        :is="element"
        :aria-current="props.active ? 'page' : undefined"
        :role="props.disabled && props.href !== undefined ? 'link' : undefined"
        v-bind="{ ...$attrs, ...(props.disabled ? { tabindex: -1 } : {}) }"
        :as-child="props.asChild"
        class="kappa-sidebar__menu-button"
        data-slot="sidebar-menu-button"
        :data-active="props.active ? '' : undefined"
        :data-disabled="props.disabled ? '' : undefined"
        :data-icon="props.icon || $slots.icon ? '' : undefined"
        :href="props.disabled ? undefined : props.href"
        :type="props.href !== undefined || props.asChild ? undefined : 'button'"
        :disabled="props.href === undefined && !props.asChild ? props.disabled : undefined"
        :aria-disabled="props.disabled ? true : undefined"
        @click.capture="blockDisabled"
        @pointerdown.capture="blockDisabled"
        @keydown.capture="blockDisabledKey"
      >
        <SidebarMenuChild v-if="props.asChild" :disabled="props.disabled"><slot /></SidebarMenuChild>
        <template v-else>
          <span v-if="props.icon || $slots.icon" class="kappa-sidebar__menu-icon" aria-hidden="true">
            <slot name="icon"><component :is="props.icon" focusable="false" /></slot>
          </span>
          <span class="kappa-sidebar__menu-label"><slot /></span>
        </template>
      </component>
    </Tooltip.Trigger>
    <Tooltip.Content v-if="props.tooltip" :show-arrow="false">{{ props.tooltip }}</Tooltip.Content>
  </Tooltip.Root>
</template>

<style src="./sidebar.css"></style>
