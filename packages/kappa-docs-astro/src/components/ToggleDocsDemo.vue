<script setup lang="ts">
import { Bold, Bookmark, Italic } from "@lucide/vue";
import { ref } from "vue";
import { Toggle } from "@dicehub/kappa/components/toggle";

type DemoVariant =
  | "preview"
  | "usage"
  | "variants"
  | "text"
  | "sizes"
  | "controlled"
  | "disabled"
  | "rtl";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const controlledPressed = ref(true);
</script>

<template>
  <div class="toggle-demo" :data-toggle-demo="props.variant">
    <Toggle
      v-if="props.variant === 'preview'"
      aria-label="Toggle bookmark"
      class="bookmark-toggle"
      size="sm"
      variant="outline"
    >
      <Bookmark aria-hidden="true" class="bookmark-toggle__icon" />
      Bookmark
    </Toggle>

    <Toggle v-else-if="props.variant === 'usage'" aria-label="Bold" default-pressed>
      <Bold aria-hidden="true" />
    </Toggle>

    <div v-else-if="props.variant === 'variants'" class="toggle-demo__row">
      <Toggle aria-label="Bold" default-pressed>
        <Bold aria-hidden="true" />
      </Toggle>
      <Toggle aria-label="Italic" variant="outline">
        <Italic aria-hidden="true" />
      </Toggle>
    </div>

    <Toggle v-else-if="props.variant === 'text'" variant="outline">
      <Italic aria-hidden="true" />
      Italic
    </Toggle>

    <div v-else-if="props.variant === 'sizes'" class="toggle-demo__sizes">
      <Toggle size="sm" variant="outline">
        <Bookmark aria-hidden="true" />
        Small
      </Toggle>
      <Toggle size="base" variant="outline">
        <Bookmark aria-hidden="true" />
        Base
      </Toggle>
      <Toggle size="lg" variant="outline">
        <Bookmark aria-hidden="true" />
        Large
      </Toggle>
    </div>

    <div v-else-if="props.variant === 'controlled'" class="toggle-demo__controlled">
      <Toggle
        v-model:pressed="controlledPressed"
        aria-label="Save report"
        variant="outline"
      >
        <Bookmark :fill="controlledPressed ? 'currentColor' : 'none'" aria-hidden="true" />
      </Toggle>
      <output aria-live="polite">{{ controlledPressed ? "Saved" : "Not saved" }}</output>
    </div>

    <div v-else-if="props.variant === 'disabled'" class="toggle-demo__row">
      <Toggle disabled aria-label="Bold unavailable">
        <Bold aria-hidden="true" />
      </Toggle>
      <Toggle disabled default-pressed aria-label="Italic enabled and unavailable">
        <Italic aria-hidden="true" />
      </Toggle>
    </div>

    <div v-else class="toggle-demo__rtl" dir="rtl" lang="ar">
      <Toggle class="bookmark-toggle" variant="outline">
        <Bookmark aria-hidden="true" class="bookmark-toggle__icon" />
        حفظ
      </Toggle>
    </div>
  </div>
</template>

<style scoped>
.toggle-demo {
  display: grid;
  inline-size: 100%;
  min-inline-size: 0;
  min-block-size: 8rem;
  place-items: center;
  color: var(--kappa-default, #17191f);
  font-family: var(--kappa-font-sans, inherit);
}

.bookmark-toggle[data-state="on"] .bookmark-toggle__icon {
  fill: currentColor;
}

.toggle-demo__controlled {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.toggle-demo__controlled output {
  min-inline-size: 5.75rem;
  color: var(--kappa-subtle, #6c7480);
  font-size: 0.75rem;
}

.toggle-demo__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.toggle-demo__sizes {
  display: grid;
  justify-items: start;
  gap: 0.75rem;
}

.toggle-demo__rtl {
  display: flex;
  inline-size: min(100%, 20rem);
  justify-content: center;
}
</style>
