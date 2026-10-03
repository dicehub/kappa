<script setup lang="ts">
import { computed, useSlots } from "vue";
import {
  LOGIN_LAYOUT_DEFAULTS,
  resolveLoginLayoutMediaSide,
  resolveLoginLayoutVariant,
  type LoginLayoutProps,
  type LoginLayoutSlots,
} from "./login-layout";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<LoginLayoutProps>(), LOGIN_LAYOUT_DEFAULTS);
defineSlots<LoginLayoutSlots>();

const slots = useSlots();
const resolvedVariant = computed(() => resolveLoginLayoutVariant(props.variant));
const resolvedMediaSide = computed(() => resolveLoginLayoutMediaSide(props.mediaSide));
const showsMedia = computed(
  () => Boolean(slots.media) && ["split", "card"].includes(resolvedVariant.value),
);
</script>

<template>
  <section
    v-bind="$attrs"
    class="kappa-login-layout"
    data-slot="login-layout"
    :data-variant="resolvedVariant"
    :data-media-side="resolvedMediaSide"
    :aria-label="props.label"
  >
    <div class="kappa-login-layout__frame" data-slot="login-layout-frame">
      <div class="kappa-login-layout__primary" data-slot="login-layout-primary">
        <header
          v-if="slots.brand"
          class="kappa-login-layout__brand"
          data-slot="login-layout-brand"
        >
          <slot name="brand" />
        </header>

        <div class="kappa-login-layout__body" data-slot="login-layout-body">
          <slot />
        </div>

        <footer
          v-if="slots.footer"
          class="kappa-login-layout__footer"
          data-slot="login-layout-footer"
        >
          <slot name="footer" />
        </footer>
      </div>

      <aside
        v-if="showsMedia"
        class="kappa-login-layout__media"
        data-slot="login-layout-media"
      >
        <slot name="media" />
      </aside>
    </div>
  </section>
</template>

<style src="./login-layout.css"></style>
