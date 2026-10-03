<script setup lang="ts">
import { computed, useAttrs, useSlots } from "vue";
import { LinkButton } from "../button";
import { useToolbarContext } from "./context";
import {
  TOOLBAR_DEFAULT_SIZE,
  type ToolbarLinkProps,
  type ToolbarLinkSlots,
} from "./toolbar";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ToolbarLinkProps>(), {
  asChild: false,
  disabled: false,
  external: false,
  href: undefined,
  icon: undefined,
  iconProps: undefined,
  shape: undefined,
  title: undefined,
});

defineSlots<ToolbarLinkSlots>();

const attrs = useAttrs();
const slots = useSlots();
const toolbar = useToolbarContext();

const resolvedSize = computed(() => toolbar?.size.value ?? TOOLBAR_DEFAULT_SIZE);
const resolvedShape = computed(() =>
  props.shape ?? (!slots.default && props.icon ? "square" : "base"),
);
const linkAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(([key]) => !["size", "variant"].includes(key)),
  ),
);
const resolvedDisabled = computed(
  () => props.disabled || Boolean(toolbar?.disabled.value),
);
</script>

<template>
  <LinkButton
    v-bind="linkAttrs"
    class="kappa-toolbar__item kappa-toolbar__button kappa-toolbar__link"
    data-kappa-component="Toolbar.Link"
    data-kappa-toolbar-item=""
    :as-child="props.asChild"
    :disabled="resolvedDisabled"
    :external="props.external"
    :full-width="props.fullWidth"
    :href="props.href"
    :icon="props.icon"
    :icon-position="props.iconPosition"
    :icon-props="props.iconProps"
    :shape="resolvedShape"
    :size="resolvedSize"
    :title="props.title"
    variant="ghost"
  >
    <slot />
  </LinkButton>
</template>
