<script setup lang="ts">
import { Pagination } from "@dicehub/kappa/components/pagination";
import { DirectionProvider } from "@dicehub/kappa/components/direction-provider";
import { ref } from "vue";

type DemoVariant = "preview" | "usage" | "link" | "controlled" | "sibling" | "states" | "labels" | "simple" | "rtl";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const controlledPage = ref(3);

const getPageUrl = ({ page, pageSize }: { page: number; pageSize: number }) =>
  `/runs?page=${page}&pageSize=${pageSize}`;
</script>

<template>
  <div class="pagination-demo" :data-pagination-demo="props.variant">
    <Pagination.Root
      v-if="props.variant === 'preview'"
      class="pagination-demo__compact"
      :count="120"
      :default-page="4"
      aria-label="Results pages"
    >
      <Pagination.Context v-slot="pagination">
        <span class="pagination-demo__info">Showing {{ pagination.pageRange.start + 1 }}–{{ pagination.pageRange.end }} of 120</span>
      </Pagination.Context>
      <Pagination.Controls />
    </Pagination.Root>

    <Pagination.Root
      v-else-if="props.variant === 'usage'"
      :count="42"
      aria-label="Search results"
    >
      <ul>
        <li><Pagination.PrevTrigger aria-label="Previous results" /></li>
        <Pagination.Context v-slot="pagination">
          <template
            v-for="(page, index) in pagination.pages"
            :key="page.type === 'page' ? page.value : 'ellipsis-' + index"
          >
            <li v-if="page.type === 'page'">
              <Pagination.Item type="page" :value="page.value">{{ page.value }}</Pagination.Item>
            </li>
            <li v-else><Pagination.Ellipsis :index="index" /></li>
          </template>
        </Pagination.Context>
        <li><Pagination.NextTrigger aria-label="Next results" /></li>
      </ul>
    </Pagination.Root>

    <Pagination.Root
      v-else-if="props.variant === 'link'"
      :count="250"
      type="link"
      :get-page-url="getPageUrl"
      aria-label="Run history pages"
    >
      <ul>
        <li><Pagination.PrevTrigger as-child><a><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="15 18 9 12 15 6" /></svg></a></Pagination.PrevTrigger></li>
        <Pagination.Context v-slot="pagination">
          <template
            v-for="(page, index) in pagination.pages"
            :key="page.type === 'page' ? page.value : 'ellipsis-' + index"
          >
            <li v-if="page.type === 'page'">
              <Pagination.Item type="page" :value="page.value" as-child><a>{{ page.value }}</a></Pagination.Item>
            </li>
            <li v-else><Pagination.Ellipsis :index="index" /></li>
          </template>
        </Pagination.Context>
        <li><Pagination.NextTrigger as-child><a><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg></a></Pagination.NextTrigger></li>
      </ul>
    </Pagination.Root>

    <section v-else-if="props.variant === 'controlled'" class="pagination-demo__stack">
      <Pagination.Root v-model:page="controlledPage" :count="80" aria-label="Jobs pages">
        <Pagination.Controls />
      </Pagination.Root>
      <output role="status">Page {{ controlledPage }}</output>
    </section>

    <DirectionProvider v-else-if="props.variant === 'rtl'" locale="ar">
      <Pagination.Root :count="120" :default-page="4" aria-label="RTL pages">
        <Pagination.Controls page-label="رقم الصفحة" />
      </Pagination.Root>
    </DirectionProvider>

    <Pagination.Root
      v-else-if="props.variant === 'sibling'"
      :count="500"
      :sibling-count="2"
      :default-page="8"
      aria-label="Large result set"
    >
      <ul>
        <li><Pagination.PrevTrigger /></li>
        <Pagination.Context v-slot="pagination">
          <template
            v-for="(page, index) in pagination.pages"
            :key="page.type === 'page' ? page.value : 'ellipsis-' + index"
          >
            <li v-if="page.type === 'page'">
              <Pagination.Item type="page" :value="page.value">{{ page.value }}</Pagination.Item>
            </li>
            <li v-else><Pagination.Ellipsis :index="index" /></li>
          </template>
        </Pagination.Context>
        <li><Pagination.NextTrigger /></li>
      </ul>
    </Pagination.Root>

    <Pagination.Root
      v-else-if="props.variant === 'labels' || props.variant === 'simple'"
      :count="120"
      :default-page="4"
      :aria-label="props.variant === 'labels' ? 'Labeled pages' : 'Simple pages'"
    >
      <Pagination.Controls :show-labels="props.variant === 'labels'" :controls="props.variant === 'simple' ? 'simple' : 'full'" />
    </Pagination.Root>

    <Pagination.Root
      v-else
      :count="80"
      :default-page="1"
      aria-label="Boundary states"
    >
      <ul>
        <li><Pagination.FirstTrigger /></li>
        <li><Pagination.PrevTrigger /></li>
        <Pagination.Context v-slot="pagination">
          <template
            v-for="(page, index) in pagination.pages"
            :key="page.type === 'page' ? page.value : 'ellipsis-' + index"
          >
            <li v-if="page.type === 'page'">
              <Pagination.Item type="page" :value="page.value">{{ page.value }}</Pagination.Item>
            </li>
            <li v-else><Pagination.Ellipsis :index="index" /></li>
          </template>
        </Pagination.Context>
        <li><Pagination.NextTrigger /></li>
        <li><Pagination.LastTrigger /></li>
      </ul>
    </Pagination.Root>
  </div>
</template>

<style scoped>
.pagination-demo {
  display: grid;
  inline-size: 100%;
  min-inline-size: 0;
  min-block-size: 10rem;
  place-items: center;
  color: var(--kappa-default, #17191f);
  font-family: var(--kappa-font-sans, inherit);
}

.pagination-demo > :deep(.kappa-pagination),
.pagination-demo__stack {
  inline-size: min(100%, 42rem);
}

.pagination-demo :deep(.pagination-demo__compact) {
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.pagination-demo__info {
  font-size: 0.8125rem;
  color: var(--kappa-subtle, #6c7480);
  font-variant-numeric: tabular-nums;
}

.pagination-demo__stack {
  display: grid;
  gap: 0.75rem;
}

.pagination-demo output {
  color: var(--kappa-subtle, #6c7480);
  font-size: 0.75rem;
  text-align: center;
}
</style>
