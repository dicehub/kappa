export const manyTabsCode = `<script setup>
import { Tabs } from "@dicehub/kappa/components/tabs";

const tabs = [
  ["overview", "Overview"],
  ["analytics", "Analytics"],
  ["reports", "Reports"],
  ["notifications", "Notifications"],
  ["settings", "Settings"],
  ["billing", "Billing"],
  ["security", "Security"],
  ["integrations", "Integrations"],
];
</script>

<template>
  <Tabs.Root default-value="overview" class="many-tabs">
    <Tabs.List>
      <Tabs.Trigger v-for="tab in tabs" :key="tab[0]" :value="tab[0]">
        {{ tab[1] }}
      </Tabs.Trigger>
      <Tabs.Indicator />
    </Tabs.List>
    <Tabs.Content v-for="tab in tabs" :key="tab[0]" :value="tab[0]">
      {{ tab[1] }} view is selected.
    </Tabs.Content>
  </Tabs.Root>
</template>

<style scoped>
.many-tabs {
  inline-size: min(100%, 29rem);
}
</style>`;

export const overflowCode = `<script setup>
import { ChevronLeft, ChevronRight } from "@lucide/vue";
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { Tabs } from "@dicehub/kappa/components/tabs";

const tabs = ["Overview", "Analytics", "Reports", "Notifications", "Settings"];
const rail = ref(null);
const canScrollBack = ref(false);
const canScrollForward = ref(false);

const getList = () => rail.value?.querySelector('[role="tablist"]');
const updateOverflow = () => {
  const list = getList();
  if (!list) return;
  const max = list.scrollWidth - list.clientWidth;
  canScrollBack.value = list.scrollLeft > 1;
  canScrollForward.value = list.scrollLeft < max - 1;
};
const scrollTabs = (direction) => {
  getList()?.scrollBy({ left: direction * 200, behavior: "smooth" });
};

let resizeObserver;
onMounted(async () => {
  await nextTick();
  const list = getList();
  if (!list) return;
  resizeObserver = new ResizeObserver(updateOverflow);
  resizeObserver.observe(list);
  updateOverflow();
});
onBeforeUnmount(() => resizeObserver?.disconnect());
</script>

<template>
  <Tabs.Root default-value="Overview" class="overflow-tabs">
    <div ref="rail" class="overflow-tabs__rail">
      <Tabs.List class="overflow-tabs__list" @scroll.passive="updateOverflow">
        <Tabs.Trigger v-for="tab in tabs" :key="tab" :value="tab">{{ tab }}</Tabs.Trigger>
        <Tabs.Indicator />
      </Tabs.List>
      <button
        v-if="canScrollBack"
        type="button"
        class="overflow-tabs__button overflow-tabs__button--start"
        aria-label="Scroll tabs backward"
        @click="scrollTabs(-1)"
      >
        <ChevronLeft aria-hidden="true" />
      </button>
      <button
        v-if="canScrollForward"
        type="button"
        class="overflow-tabs__button overflow-tabs__button--end"
        aria-label="Scroll tabs forward"
        @click="scrollTabs(1)"
      >
        <ChevronRight aria-hidden="true" />
      </button>
    </div>
    <Tabs.Content v-for="tab in tabs" :key="tab" :value="tab">
      {{ tab }} view is selected.
    </Tabs.Content>
  </Tabs.Root>
</template>

<style scoped>
.overflow-tabs {
  inline-size: min(100%, 17.5rem);
}

.overflow-tabs__rail {
  position: relative;
}

.overflow-tabs__list {
  scroll-padding-inline: 2.5rem;
}

.overflow-tabs__button {
  position: absolute;
  z-index: 2;
  inset-block: 1px;
  inline-size: 2rem;
  border: 0;
}

.overflow-tabs__button--start {
  inset-inline-start: 1px;
}

.overflow-tabs__button--end {
  inset-inline-end: 1px;
}
</style>`;

export const dynamicCountCode = `<script setup>
import { ChevronLeft, ChevronRight } from "@lucide/vue";
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { Tabs } from "@dicehub/kappa/components/tabs";

const standardTabs = [
  "Overview",
  "Metrics",
  "Releases",
  "Observability",
  "Domains",
  "Access",
  "Settings",
];
const extraTabs = ["Analytics", "Logs", "Security"];
const showExtraTabs = ref(true);
const selectedTab = ref("Settings");
const tabs = computed(() =>
  showExtraTabs.value ? [...standardTabs, ...extraTabs] : standardTabs,
);
const rail = ref(null);
const canScrollBack = ref(false);
const canScrollForward = ref(false);

const getList = () => rail.value?.querySelector('[role="tablist"]');
const updateOverflow = () => {
  const list = getList();
  if (!list) return;
  const max = list.scrollWidth - list.clientWidth;
  canScrollBack.value = list.scrollLeft > 1;
  canScrollForward.value = list.scrollLeft < max - 1;
};
const scrollTabs = (direction) => {
  getList()?.scrollBy({ left: direction * 300, behavior: "smooth" });
};
const revealSelectedTab = async () => {
  await nextTick();
  const selected = getList()?.querySelector('[role="tab"][aria-selected="true"]');
  selected?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
};

let resizeObserver;
onMounted(async () => {
  await nextTick();
  const list = getList();
  if (!list) return;
  resizeObserver = new ResizeObserver(updateOverflow);
  resizeObserver.observe(list);
  updateOverflow();
});
onBeforeUnmount(() => resizeObserver?.disconnect());
watch(tabs, async () => {
  await nextTick();
  updateOverflow();
});
watch(selectedTab, revealSelectedTab);
</script>

<template>
  <div class="dynamic-tabs">
    <Tabs.Root v-model="selectedTab">
      <div ref="rail" class="dynamic-tabs__rail">
        <Tabs.List size="sm" @scroll.passive="updateOverflow">
          <Tabs.Trigger v-for="tab in tabs" :key="tab" :value="tab">
            {{ tab }}
          </Tabs.Trigger>
          <Tabs.Indicator />
        </Tabs.List>
        <button
          v-if="canScrollBack"
          type="button"
          aria-label="Scroll tabs backward"
          @click="scrollTabs(-1)"
        >
          <ChevronLeft aria-hidden="true" />
        </button>
        <button
          v-if="canScrollForward"
          type="button"
          aria-label="Scroll tabs forward"
          @click="scrollTabs(1)"
        >
          <ChevronRight aria-hidden="true" />
        </button>
      </div>
      <Tabs.Content v-for="tab in tabs" :key="tab" :value="tab">
        {{ tab }} view is selected.
      </Tabs.Content>
    </Tabs.Root>
    <div class="dynamic-tabs__controls">
      <button type="button" @click="showExtraTabs = !showExtraTabs">Toggle extra tabs</button>
      <output aria-live="polite">{{ tabs.length }} tabs</output>
    </div>
  </div>
</template>

<style scoped>
.dynamic-tabs {
  display: grid;
  inline-size: min(100%, 42rem);
  gap: 0.75rem;
}

.dynamic-tabs__rail {
  position: relative;
}

.dynamic-tabs__rail :deep([role="tablist"]) {
  inline-size: 100%;
  scroll-padding-inline: 3.25rem;
}

.dynamic-tabs__rail > button {
  position: absolute;
  z-index: 2;
  inset-block: 1px;
  inline-size: 2.5rem;
  border: 0;
}

.dynamic-tabs__rail > button[aria-label="Scroll tabs backward"] {
  inset-inline-start: 1px;
}

.dynamic-tabs__rail > button[aria-label="Scroll tabs forward"] {
  inset-inline-end: 1px;
}

.dynamic-tabs__controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
</style>`;
