<script setup lang="ts">
import { ChevronLeft, ChevronRight } from "@lucide/vue";
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { Tabs } from "@dicehub/kappa/components/tabs";

type ScrollDemoVariant = "many" | "overflow" | "dynamic-count";
type TabItem = readonly [value: string, label: string];

const props = defineProps<{ variant: ScrollDemoVariant }>();

const overflowTabs = [
  ["overview", "Overview"],
  ["analytics", "Analytics"],
  ["reports", "Reports"],
  ["notifications", "Notifications"],
  ["settings", "Settings"],
  ["billing", "Billing"],
  ["security", "Security"],
  ["integrations", "Integrations"],
] as const satisfies readonly TabItem[];

const productionTabs = [
  ["overview", "Overview"],
  ["metrics", "Metrics"],
  ["releases", "Releases"],
  ["observability", "Observability"],
  ["domains", "Domains"],
  ["access", "Access"],
  ["settings", "Settings"],
] as const satisfies readonly TabItem[];

const extraTabs = [
  ["analytics", "Analytics"],
  ["logs", "Logs"],
  ["security", "Security"],
] as const satisfies readonly TabItem[];

const rail = ref<HTMLElement | null>(null);
const selectedValue = ref(props.variant === "dynamic-count" ? "settings" : "overview");
const showExtraTabs = ref(true);
const canScrollStart = ref(false);
const canScrollEnd = ref(false);

const tabs = computed<readonly TabItem[]>(() => {
  if (props.variant !== "dynamic-count") return overflowTabs;
  return showExtraTabs.value ? [...productionTabs, ...extraTabs] : productionTabs;
});

const list = () => rail.value?.querySelector<HTMLElement>('[role="tablist"]');

const updateOverflow = () => {
  const element = list();
  if (!element) return;

  const maxScroll = Math.max(0, element.scrollWidth - element.clientWidth);
  canScrollStart.value = element.scrollLeft > 1;
  canScrollEnd.value = element.scrollLeft < maxScroll - 1;
};

const scrollTabs = (direction: -1 | 1) => {
  const element = list();
  if (!element) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  element.scrollBy({
    behavior: reducedMotion ? "auto" : "smooth",
    left: direction * Math.max(160, element.clientWidth * 0.72),
  });
};

const revealSelectedTab = async () => {
  await nextTick();
  const selectedTab = list()?.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');
  if (!selectedTab) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  selectedTab.scrollIntoView({
    behavior: reducedMotion ? "auto" : "smooth",
    block: "nearest",
    inline: "nearest",
  });
};

const alignDynamicOverflow = () => {
  const element = list();
  if (!element) return;

  const secondTab = element.querySelectorAll<HTMLElement>('[role="tab"]')[1];
  const rootSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
  element.scrollLeft = Math.max(0, (secondTab?.offsetLeft ?? 0) - rootSize * 2 - 2);
};

const toggleExtraTabs = async () => {
  showExtraTabs.value = !showExtraTabs.value;
  await nextTick();
  if (!showExtraTabs.value) list()?.scrollTo({ left: 0 });
  updateOverflow();
};

let resizeObserver: ResizeObserver | undefined;

onMounted(async () => {
  await nextTick();
  const element = list();
  if (!element) return;

  resizeObserver = new ResizeObserver(updateOverflow);
  resizeObserver.observe(element);
  if (props.variant === "dynamic-count") alignDynamicOverflow();
  updateOverflow();
});

onBeforeUnmount(() => resizeObserver?.disconnect());
watch(selectedValue, revealSelectedTab);
</script>

<template>
  <section
    class="tabs-scroll-demo"
    :class="`tabs-scroll-demo--${props.variant}`"
    :data-scroll-demo="props.variant"
  >
    <Tabs.Root :id="`tabs-${props.variant}`" v-model="selectedValue">
      <div
        ref="rail"
        class="tabs-scroll-demo__rail"
        :data-can-scroll-end="canScrollEnd || undefined"
        :data-can-scroll-start="canScrollStart || undefined"
      >
        <Tabs.List
          :size="props.variant === 'dynamic-count' ? 'sm' : 'base'"
          @scroll.passive="updateOverflow"
        >
          <Tabs.Trigger v-for="item in tabs" :key="item[0]" :value="item[0]">
            {{ item[1] }}
          </Tabs.Trigger>
          <Tabs.Indicator />
        </Tabs.List>
        <button
          v-if="canScrollStart"
          aria-label="Scroll tabs backward"
          class="tabs-scroll-demo__scroll-button tabs-scroll-demo__scroll-button--start"
          data-scroll-control="start"
          type="button"
          @click="scrollTabs(-1)"
        >
          <ChevronLeft aria-hidden="true" />
        </button>
        <button
          v-if="canScrollEnd"
          aria-label="Scroll tabs forward"
          class="tabs-scroll-demo__scroll-button tabs-scroll-demo__scroll-button--end"
          data-scroll-control="end"
          type="button"
          @click="scrollTabs(1)"
        >
          <ChevronRight aria-hidden="true" />
        </button>
      </div>
      <Tabs.Content v-for="item in tabs" :key="item[0]" :value="item[0]">
        {{ item[1] }} view is selected.
      </Tabs.Content>
    </Tabs.Root>

    <div v-if="props.variant === 'dynamic-count'" class="tabs-scroll-demo__controls">
      <button type="button" @click="toggleExtraTabs">Toggle extra tabs</button>
      <output aria-live="polite">{{ tabs.length }} tabs</output>
    </div>
  </section>
</template>

<style scoped src="./TabsScrollableDocsDemo.css"></style>
