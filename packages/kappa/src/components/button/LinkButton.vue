<script setup lang="ts">
import { ark } from "@ark-ui/vue/factory";
import {
  Comment,
  Fragment,
  computed,
  isVNode,
  onMounted,
  useAttrs,
  type VNodeChild,
} from "vue";
import Button from "./Button.vue";
import {
  BUTTON_DEFAULT_ICON_POSITION,
  BUTTON_DEFAULT_SHAPE,
  BUTTON_DEFAULT_SIZE,
  BUTTON_DEFAULT_VARIANT,
  resolveButtonIconPosition,
  resolveButtonShape,
  resolveButtonSize,
  resolveButtonVariant,
  type LinkButtonProps,
  type LinkButtonSlots,
} from "./button";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<LinkButtonProps>(), {
  asChild: false,
  disabled: false,
  external: false,
  fullWidth: false,
  href: undefined,
  icon: undefined,
  iconPosition: BUTTON_DEFAULT_ICON_POSITION,
  iconProps: undefined,
  shape: BUTTON_DEFAULT_SHAPE,
  size: BUTTON_DEFAULT_SIZE,
  title: undefined,
  variant: BUTTON_DEFAULT_VARIANT,
});

const slots = defineSlots<LinkButtonSlots>();

const attrs = useAttrs();
const resolvedVariant = computed(() => resolveButtonVariant(props.variant));
const resolvedSize = computed(() => resolveButtonSize(props.size));
const resolvedShape = computed(() => resolveButtonShape(props.shape));
const resolvedIconPosition = computed(() =>
  resolveButtonIconPosition(props.iconPosition),
);
const resolvedTitle = computed(() =>
  props.title === undefined ? undefined : String(props.title),
);
const disabledAttrs = computed(() => {
  const {
    download: _download,
    hreflang: _hreflang,
    ping: _ping,
    referrerpolicy: _referrerPolicy,
    rel: _rel,
    target: _target,
    ...buttonAttrs
  } = attrs;
  return buttonAttrs;
});
const resolvedTarget = computed(() => {
  const target = typeof attrs.target === "string" ? attrs.target : undefined;
  return props.external ? (target ?? "_blank") : target;
});
const resolvedRel = computed(() => {
  const value = typeof attrs.rel === "string" ? attrs.rel : "";
  if (!props.external && resolvedTarget.value !== "_blank") return value || undefined;

  const tokens = new Set(value.split(/\s+/).filter(Boolean));
  tokens.add("noopener");
  tokens.add("noreferrer");
  return [...tokens].join(" ");
});

const unwrapDisabledChild = (node: VNodeChild): VNodeChild[] => {
  if (Array.isArray(node)) return node.flatMap(unwrapDisabledChild);
  if (!isVNode(node)) return [node];
  if (node.type === Comment) return [];
  if (node.type === Fragment) {
    return Array.isArray(node.children)
      ? node.children.flatMap(unwrapDisabledChild)
      : [];
  }

  const shouldUnwrap = typeof node.type !== "string" || node.type === "a";
  if (!shouldUnwrap) return [node];
  if (Array.isArray(node.children)) return node.children.flatMap(unwrapDisabledChild);
  if (typeof node.children === "string") return [node.children];
  if (node.children && typeof node.children === "object" && "default" in node.children) {
    const defaultSlot = (node.children as { default?: () => VNodeChild }).default;
    return defaultSlot ? unwrapDisabledChild(defaultSlot()) : [];
  }
  return [];
};

const DisabledChildContent = () =>
  unwrapDisabledChild(slots.default?.() ?? []);

onMounted(() => {
  if (
    props.icon &&
    !slots.default &&
    !attrs["aria-label"] &&
    !attrs["aria-labelledby"]
  ) {
    console.warn(
      "[Kappa LinkButton] Icon-only links require aria-label or aria-labelledby.",
    );
  }
  if (props.asChild && !props.disabled && props.icon) {
    console.warn(
      "[Kappa LinkButton] asChild owns its content; render icons inside the child instead of using icon.",
    );
  }
});
</script>

<template>
  <Button
    v-if="props.disabled"
    v-bind="disabledAttrs"
    disabled
    :full-width="props.fullWidth"
    :icon="props.icon"
    :icon-position="resolvedIconPosition"
    :icon-props="props.iconProps"
    :shape="resolvedShape"
    :size="resolvedSize"
    :title="resolvedTitle"
    type="button"
    :variant="resolvedVariant"
  >
    <DisabledChildContent v-if="props.asChild" />
    <slot v-else />
  </Button>

  <ark.a
    v-else
    v-bind="$attrs"
    class="kappa-button kappa-link-button"
    :class="{ 'kappa-button--full-width': props.fullWidth }"
    data-slot="link-button"
    :data-icon-position="resolvedIconPosition"
    :data-shape="resolvedShape"
    :data-size="resolvedSize"
    :data-variant="resolvedVariant"
    :as-child="props.asChild"
    :href="props.asChild ? undefined : props.href"
    :rel="resolvedRel"
    :target="resolvedTarget"
    :title="resolvedTitle"
  >
    <slot v-if="props.asChild" />
    <template v-else>
      <component
        :is="props.icon"
        v-if="props.icon"
        v-bind="props.iconProps"
        aria-hidden="true"
        class="kappa-button__icon"
        data-icon=""
        data-slot="button-icon"
        :data-position="resolvedIconPosition"
        focusable="false"
      />
      <span v-if="$slots.default" class="kappa-button__label" data-slot="button-label">
        <slot />
      </span>
    </template>
  </ark.a>
</template>

<style src="./button.css"></style>
