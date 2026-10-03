<script setup lang="ts">
import type { CommandPaletteResultItemProps } from "./command-palette";
import CommandPaletteHighlightedText from "./CommandPaletteHighlightedText.vue";
import CommandPaletteItem from "./CommandPaletteItem.vue";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<CommandPaletteResultItemProps>(), {
  breadcrumbs: () => [],
  showArrow: true,
});
const emit = defineEmits<{ select: [value: unknown, event: MouseEvent] }>();
</script>

<template>
  <CommandPaletteItem
    v-bind="$attrs"
    :disabled="props.disabled || props.nonInteractive"
    class="kappa-command-palette__result-item"
    :class="{
      'kappa-command-palette__result-item--external': props.external,
      'kappa-command-palette__result-item--non-interactive': props.nonInteractive,
    }"
    :value="props.value"
    @select="(value, event) => emit('select', value, event)"
  >
    <span v-if="$slots.icon" class="kappa-command-palette__result-icon">
      <slot name="icon" />
    </span>
    <span class="kappa-command-palette__result-body">
      <span class="kappa-command-palette__result-path">
        <template v-for="(breadcrumb, index) in props.breadcrumbs" :key="`${breadcrumb}-${index}`">
          <CommandPaletteHighlightedText
            class="kappa-command-palette__breadcrumb"
            :highlights="props.breadcrumbHighlights?.[index]"
            :text="breadcrumb"
          />
          <span class="kappa-command-palette__separator" aria-hidden="true">/</span>
        </template>
        <CommandPaletteHighlightedText
          class="kappa-command-palette__result-title"
          :highlights="props.titleHighlights"
          :text="props.title"
        />
      </span>
      <span v-if="props.description" class="kappa-command-palette__result-description">
        {{ props.description }}
      </span>
    </span>
    <span
      v-if="props.external"
      class="kappa-command-palette__external-icon"
      aria-hidden="true"
    />
    <span
      v-else-if="props.showArrow && !props.nonInteractive"
      class="kappa-command-palette__arrow-icon"
      aria-hidden="true"
    />
  </CommandPaletteItem>
</template>

<style src="./command-palette.css"></style>
