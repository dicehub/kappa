<script setup lang="ts">
import { Collapsible as ArkCollapsible } from "@ark-ui/vue/collapsible";
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, type VNodeChild } from "vue";
import type { CodeHighlightedProps } from "./code-highlighted";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<Pick<CodeHighlightedProps,
  "collapsible" | "collapsedLines" | "defaultOpen" | "open" | "expandLabel" | "collapseLabel"
>>(), {
  collapsible: false,
  collapsedLines: 10,
  defaultOpen: false,
  open: undefined,
  expandLabel: "Expand code",
  collapseLabel: "Collapse code",
});
const emit = defineEmits<{
  "update:open": [open: boolean];
  openChange: [details: { open: boolean }];
}>();
defineSlots<{
  header?: () => VNodeChild;
  default?: (props: { open: boolean }) => VNodeChild;
  copy?: () => VNodeChild;
}>();

const rootRef = ref<HTMLElement | null>(null);
const bodyRef = ref<HTMLElement | null>(null);
const internalOpen = ref(props.defaultOpen);
const overflowing = ref(true);
const animated = ref(false);
let resizeObserver: ResizeObserver | undefined;

const previewLines = computed(() => Number.isFinite(props.collapsedLines)
  ? Math.max(1, Math.floor(props.collapsedLines)) : 10);
const canCollapse = computed(() => props.collapsible && overflowing.value);
const requestedOpen = computed(() => props.open ?? internalOpen.value);
const effectiveOpen = computed(() => !canCollapse.value || requestedOpen.value);
const label = computed(() => effectiveOpen.value ? props.collapseLabel : props.expandLabel);

function measureOverflow(): void {
  const body = bodyRef.value;
  const pre = body?.querySelector("pre");
  if (!body || !pre) return;
  const styles = getComputedStyle(pre);
  const lineHeight = Number.parseFloat(styles.lineHeight);
  const padding = Number.parseFloat(styles.paddingTop) + Number.parseFloat(styles.paddingBottom);
  overflowing.value = pre.scrollHeight > lineHeight * previewLines.value + padding + 1;
}

function changeOpen(details: { open: boolean }): void {
  animated.value = true;
  if (props.open === undefined) internalOpen.value = details.open;
  emit("update:open", details.open);
  emit("openChange", details);
}

watch(previewLines, () => nextTick(measureOverflow));
watch(requestedOpen, () => { animated.value = true; });
watch(effectiveOpen, (open) => {
  if (!open && bodyRef.value?.contains(document.activeElement)) {
    rootRef.value?.querySelector<HTMLButtonElement>("[data-slot='code-block-toggle']")?.focus();
  }
}, { flush: "post" });

onMounted(() => {
  watch(() => props.collapsible, (enabled) => {
    resizeObserver?.disconnect();
    resizeObserver = undefined;
    if (!enabled) return;
    measureOverflow();
    if (typeof ResizeObserver === "undefined" || !bodyRef.value) return;
    resizeObserver = new ResizeObserver(measureOverflow);
    resizeObserver.observe(bodyRef.value);
  }, { immediate: true, flush: "post" });
});
onBeforeUnmount(() => resizeObserver?.disconnect());
</script>

<template>
  <ArkCollapsible.Root
    v-if="collapsible"
    as-child
    :open="effectiveOpen"
    :collapsed-height="collapsible ? 'calc(var(--kappa-code-collapsed-lines) * 1.25rem + 1.5rem)' : undefined"
    @open-change="changeOpen"
  >
    <figure
      ref="rootRef"
      v-bind="$attrs"
      :data-collapsible="collapsible || undefined"
      :data-animated="animated || undefined"
      :style="{ '--kappa-code-collapsed-lines': previewLines }"
    >
      <slot name="header" />
      <ArkCollapsible.Content class="kappa-code-block__content" data-slot="code-block-content">
        <div ref="bodyRef" class="kappa-code-block__body">
          <slot :open="effectiveOpen" />
        </div>
      </ArkCollapsible.Content>
      <slot name="copy" />
      <ArkCollapsible.Trigger
        v-if="canCollapse"
        class="kappa-code-block__toggle"
        data-slot="code-block-toggle"
      >
        {{ label }}
        <ArkCollapsible.Indicator as-child>
          <svg class="kappa-code-block__toggle-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="m4.25 6.25 3.75 3.5 3.75-3.5" />
          </svg>
        </ArkCollapsible.Indicator>
      </ArkCollapsible.Trigger>
    </figure>
  </ArkCollapsible.Root>
  <figure v-else ref="rootRef" v-bind="$attrs">
    <slot name="header" />
    <div class="kappa-code-block__content">
      <div ref="bodyRef" class="kappa-code-block__body">
        <slot :open="true" />
      </div>
    </div>
    <slot name="copy" />
  </figure>
</template>
