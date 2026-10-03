<script setup lang="ts">
import { Collapsible as ArkCollapsible } from "@ark-ui/vue/collapsible";
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useId,
  watch,
} from "vue";
import {
  EXPANDABLE_TEXT_DEFAULT_COLLAPSE_LABEL,
  EXPANDABLE_TEXT_DEFAULT_EXPAND_LABEL,
  EXPANDABLE_TEXT_DEFAULT_LINES,
  resolveExpandableTextLines,
  type ExpandableTextEmits,
  type ExpandableTextProps,
  type ExpandableTextSlots,
} from "./expandable-text";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ExpandableTextProps>(), {
  lines: EXPANDABLE_TEXT_DEFAULT_LINES,
  defaultOpen: false,
  open: undefined,
  disabled: undefined,
  id: undefined,
  expandLabel: EXPANDABLE_TEXT_DEFAULT_EXPAND_LABEL,
  collapseLabel: EXPANDABLE_TEXT_DEFAULT_COLLAPSE_LABEL,
});

const emit = defineEmits<ExpandableTextEmits>();
defineSlots<ExpandableTextSlots>();

const generatedId = `kappa-expandable-text-${useId()}`;
const bodyRef = ref<HTMLDivElement | null>(null);
const internalOpen = ref(props.defaultOpen);
const measured = ref(false);
const overflowing = ref(true);
const animated = ref(false);
let resizeObserver: ResizeObserver | undefined;

const resolvedLines = computed(() => resolveExpandableTextLines(props.lines));
const resolvedOpen = computed(() =>
  props.open === undefined ? internalOpen.value : props.open,
);
const effectiveOpen = computed(() =>
  measured.value && !overflowing.value ? true : resolvedOpen.value,
);
const collapsedHeight = computed(() => `${resolvedLines.value * 1.5}em`);
const triggerLabel = computed(() =>
  resolvedOpen.value ? props.collapseLabel : props.expandLabel,
);

const measureOverflow = () => {
  const body = bodyRef.value;
  if (!body) return;

  const styles = getComputedStyle(body);
  const parsedLineHeight = Number.parseFloat(styles.lineHeight);
  const parsedFontSize = Number.parseFloat(styles.fontSize);
  const lineHeight = Number.isFinite(parsedLineHeight)
    ? parsedLineHeight
    : parsedFontSize * 1.5;

  overflowing.value = body.scrollHeight > lineHeight * resolvedLines.value + 1;
  measured.value = true;
};

const handleOpenChange = (details: { open: boolean }) => {
  animated.value = true;
  if (props.open === undefined) internalOpen.value = details.open;
  emit("update:open", details.open);
  emit("openChange", details);
};

watch(
  () => props.lines,
  () => nextTick(measureOverflow),
);

watch(
  () => props.open,
  (value, previous) => {
    if (measured.value && value !== previous) animated.value = true;
  },
);

onMounted(() => {
  measureOverflow();
  if (typeof ResizeObserver === "undefined" || !bodyRef.value) return;

  resizeObserver = new ResizeObserver(measureOverflow);
  resizeObserver.observe(bodyRef.value);
});

onBeforeUnmount(() => resizeObserver?.disconnect());
</script>

<template>
  <ArkCollapsible.Root
    v-bind="$attrs"
    class="kappa-expandable-text"
    data-slot="expandable-text"
    :data-animated="animated ? '' : undefined"
    :data-measured="measured ? '' : undefined"
    :data-overflowing="overflowing ? '' : undefined"
    :collapsed-height="collapsedHeight"
    :disabled="props.disabled"
    :id="props.id ?? generatedId"
    :open="effectiveOpen"
    @open-change="handleOpenChange"
  >
    <ArkCollapsible.Content
      class="kappa-expandable-text__content"
      data-slot="expandable-text-content"
    >
      <div
        ref="bodyRef"
        class="kappa-expandable-text__body"
        data-slot="expandable-text-body"
      >
        <slot />
      </div>
    </ArkCollapsible.Content>

    <ArkCollapsible.Trigger
      v-if="overflowing"
      class="kappa-expandable-text__trigger"
      data-slot="expandable-text-trigger"
      :aria-label="triggerLabel"
      :disabled="props.disabled"
    >
      <span class="kappa-expandable-text__trigger-label">
        <slot name="trigger" :open="resolvedOpen" :label="triggerLabel">
          {{ triggerLabel }}
        </slot>
      </span>
      <svg
        class="kappa-expandable-text__indicator"
        data-slot="expandable-text-indicator"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <path d="m4.25 6.25 3.75 3.5 3.75-3.5" />
      </svg>
    </ArkCollapsible.Trigger>
  </ArkCollapsible.Root>
</template>

<style src="./expandable-text.css"></style>
