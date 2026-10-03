<script setup lang="ts">
import { ark } from "@ark-ui/vue/factory";
import { computed, useAttrs } from "vue";
import {
  LINK_DEFAULT_VARIANT,
  resolveLinkRel,
  resolveLinkTarget,
  resolveLinkVariant,
  type LinkProps,
  type LinkSlots,
} from "./link";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<LinkProps>(), {
  asChild: false,
  external: false,
  href: undefined,
  variant: LINK_DEFAULT_VARIANT,
});

defineSlots<LinkSlots>();

const attrs = useAttrs();
const resolvedVariant = computed(() => resolveLinkVariant(props.variant));
const resolvedTarget = computed(() =>
  resolveLinkTarget(attrs.target, props.external),
);
const resolvedRel = computed(() =>
  resolveLinkRel(attrs.rel, resolvedTarget.value, props.external),
);
</script>

<template>
  <ark.a
    v-bind="$attrs"
    class="kappa-link"
    data-slot="link"
    :data-external="props.external ? '' : undefined"
    :data-variant="resolvedVariant"
    :as-child="props.asChild"
    :href="props.asChild ? undefined : props.href"
    :rel="resolvedRel"
    :target="resolvedTarget"
  >
    <slot />
  </ark.a>
</template>

<style src="./link.css"></style>
