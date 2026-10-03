<script setup lang="ts">
import { computed } from "vue";
import {
  BANNER_ACTION_SIZE_BY_BANNER,
  BANNER_DEFAULT_SIZE,
  BANNER_DEFAULT_VARIANT,
  resolveBannerSize,
  resolveBannerVariant,
  type BannerProps,
  type BannerSlots,
} from "./banner";
import { provideBannerContext } from "./banner-context";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<BannerProps>(), {
  iconProps: () => ({}),
  size: BANNER_DEFAULT_SIZE,
  variant: BANNER_DEFAULT_VARIANT,
});

const slots = defineSlots<BannerSlots>();
const resolvedVariant = computed(() => resolveBannerVariant(props.variant));
const resolvedSize = computed(() => resolveBannerSize(props.size));
const actionSize = computed(() => BANNER_ACTION_SIZE_BY_BANNER[resolvedSize.value]);
const hasDescription = computed(() => Boolean(props.description || slots.description));
const hasIcon = computed(() => Boolean(props.icon || slots.icon));
const hasStructuredCopy = computed(() => Boolean(props.title || hasDescription.value));
const hasStructuredContent = computed(() => Boolean(hasStructuredCopy.value || slots.action));
const isCompact = computed(() => resolvedSize.value === "sm");

provideBannerContext({ actionSize });
</script>

<template>
  <div
    v-bind="$attrs"
    class="kappa-banner"
    :class="[`kappa-banner--${resolvedVariant}`, `kappa-banner--${resolvedSize}`]"
    data-slot="banner"
    :data-size="resolvedSize"
    :data-variant="resolvedVariant"
  >
    <span v-if="hasIcon" class="kappa-banner__icon" data-slot="banner-icon" aria-hidden="true">
      <slot v-if="$slots.icon" name="icon" />
      <component
        :is="icon"
        v-else-if="icon"
        v-bind="iconProps"
        class="kappa-banner__icon-node"
      />
    </span>

    <div v-if="hasStructuredContent" class="kappa-banner__body" data-slot="banner-body">
      <div
        class="kappa-banner__copy"
        :class="{ 'kappa-banner__copy--inline': isCompact }"
      >
        <template v-if="isCompact">
          <span v-if="title" class="kappa-banner__title" data-slot="banner-title">
            {{ title }}
          </span>
          <span
            v-if="hasDescription"
            class="kappa-banner__description"
            data-slot="banner-description"
          >
            <slot name="description">{{ description }}</slot>
          </span>
          <span
            v-if="!hasStructuredCopy"
            class="kappa-banner__content"
            data-slot="banner-content"
          >
            <slot>{{ text }}</slot>
          </span>
        </template>
        <template v-else>
          <p v-if="title" class="kappa-banner__title" data-slot="banner-title">{{ title }}</p>
          <div
            v-if="hasDescription"
            class="kappa-banner__description"
            data-slot="banner-description"
          >
            <slot name="description">{{ description }}</slot>
          </div>
          <div
            v-if="!hasStructuredCopy"
            class="kappa-banner__content"
            data-slot="banner-content"
          >
            <slot>{{ text }}</slot>
          </div>
        </template>

        <div
          v-if="$slots.action && isCompact"
          class="kappa-banner__action kappa-banner__action--compact"
          data-slot="banner-actions"
        >
          <slot name="action" />
        </div>
      </div>

      <div
        v-if="$slots.action && !isCompact"
        class="kappa-banner__action"
        data-slot="banner-actions"
      >
        <slot name="action" />
      </div>
    </div>

    <div v-else class="kappa-banner__content" data-slot="banner-content">
      <slot>{{ text }}</slot>
    </div>
  </div>
</template>

<style src="./banner.css"></style>
