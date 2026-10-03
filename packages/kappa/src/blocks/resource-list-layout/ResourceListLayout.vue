<script setup lang="ts">
import { computed, useSlots } from "vue";
import {
  RESOURCE_LIST_LAYOUT_DEFAULTS,
  resolveResourceListLayoutDensity,
  resolveResourceListLayoutSidebarSide,
  type ResourceListLayoutProps,
  type ResourceListLayoutSlots,
} from "./resource-list-layout";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<ResourceListLayoutProps>(),
  RESOURCE_LIST_LAYOUT_DEFAULTS,
);
defineSlots<ResourceListLayoutSlots>();

const slots = useSlots();
const resolvedDensity = computed(() =>
  resolveResourceListLayoutDensity(props.density),
);
const resolvedSidebarSide = computed(() =>
  resolveResourceListLayoutSidebarSide(props.sidebarSide),
);
const showsHeader = computed(
  () =>
    Boolean(props.title) ||
    Boolean(props.description) ||
    Boolean(slots.icon) ||
    Boolean(slots.title) ||
    Boolean(slots.description) ||
    Boolean(slots.actions),
);
</script>

<template>
  <div
    v-bind="$attrs"
    class="kappa-resource-list-layout"
    data-slot="resource-list-layout"
    :data-density="resolvedDensity"
    :data-sidebar-side="resolvedSidebarSide"
    :data-sticky-sidebar="props.stickySidebar ? '' : undefined"
  >
    <div
      class="kappa-resource-list-layout__inner"
      data-slot="resource-list-layout-inner"
    >
      <header
        v-if="showsHeader"
        class="kappa-resource-list-layout__header"
        data-slot="resource-list-layout-header"
      >
        <div
          v-if="slots.icon"
          class="kappa-resource-list-layout__icon"
          data-slot="resource-list-layout-icon"
          aria-hidden="true"
        >
          <slot name="icon" />
        </div>

        <div
          class="kappa-resource-list-layout__identity"
          data-slot="resource-list-layout-identity"
        >
          <h1
            v-if="slots.title || props.title"
            class="kappa-resource-list-layout__title"
            data-slot="resource-list-layout-title"
          >
            <slot name="title">{{ props.title }}</slot>
          </h1>
          <div
            v-if="slots.description || props.description"
            class="kappa-resource-list-layout__description"
            data-slot="resource-list-layout-description"
          >
            <slot name="description">{{ props.description }}</slot>
          </div>
        </div>

        <div
          v-if="slots.actions"
          class="kappa-resource-list-layout__actions"
          data-slot="resource-list-layout-actions"
        >
          <slot name="actions" />
        </div>
      </header>

      <div
        class="kappa-resource-list-layout__body"
        data-slot="resource-list-layout-body"
      >
        <div
          class="kappa-resource-list-layout__primary"
          data-slot="resource-list-layout-primary"
        >
          <div
            v-if="slots.toolbar"
            class="kappa-resource-list-layout__toolbar"
            data-slot="resource-list-layout-toolbar"
          >
            <slot name="toolbar" />
          </div>
          <slot />
        </div>

        <aside
          v-if="slots.aside"
          class="kappa-resource-list-layout__aside"
          data-slot="resource-list-layout-aside"
        >
          <div class="kappa-resource-list-layout__aside-inner">
            <slot name="aside" />
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<style src="./resource-list-layout.css"></style>
