export const barrelCode = `import { Pagination } from "@dicehub/kappa";`;

export const granularCode = `import { Pagination } from "@dicehub/kappa/components/pagination";`;

export const previewCode = `<script setup>
import { Pagination } from "@dicehub/kappa/components/pagination";
</script>

<template>
  <Pagination.Root :count="120" :default-page="4" aria-label="Results pages">
    <Pagination.Context v-slot="pagination">
      <span>Showing {{ pagination.pageRange.start + 1 }}–{{ pagination.pageRange.end }} of 120</span>
    </Pagination.Context>
    <Pagination.Controls />
  </Pagination.Root>
</template>`;

export const usageCode = `<script setup>
import { Pagination } from "@dicehub/kappa/components/pagination";
</script>

<template>
  <Pagination.Root :count="42" :default-page-size="10" aria-label="Search results">
    <ul>
      <li><Pagination.PrevTrigger aria-label="Previous results" /></li>
      <Pagination.Context v-slot="pagination">
        <template v-for="(page, index) in pagination.pages" :key="page.type === 'page' ? page.value : 'ellipsis-' + index">
          <li v-if="page.type === 'page'">
            <Pagination.Item type="page" :value="page.value">{{ page.value }}</Pagination.Item>
          </li>
          <li v-else><Pagination.Ellipsis :index="index" /></li>
        </template>
      </Pagination.Context>
      <li><Pagination.NextTrigger aria-label="Next results" /></li>
    </ul>
  </Pagination.Root>
</template>`;

export const linkCode = `<script setup>
import { Pagination } from "@dicehub/kappa/components/pagination";

const getPageUrl = ({ page, pageSize }) => "/runs?page=" + page + "&pageSize=" + pageSize;
</script>

<template>
  <Pagination.Root
    :count="250"
    type="link"
    :get-page-url="getPageUrl"
    aria-label="Run history pages"
  >
    <ul>
      <li><Pagination.PrevTrigger as-child><a><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="15 18 9 12 15 6" /></svg></a></Pagination.PrevTrigger></li>
      <Pagination.Context v-slot="pagination">
        <template v-for="(page, index) in pagination.pages" :key="page.type === 'page' ? page.value : 'ellipsis-' + index">
          <li v-if="page.type === 'page'">
            <Pagination.Item type="page" :value="page.value" as-child><a>{{ page.value }}</a></Pagination.Item>
          </li>
          <li v-else><Pagination.Ellipsis :index="index" /></li>
        </template>
      </Pagination.Context>
      <li><Pagination.NextTrigger as-child><a><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg></a></Pagination.NextTrigger></li>
    </ul>
  </Pagination.Root>
</template>`;

export const controlledCode = `<script setup>
import { Pagination } from "@dicehub/kappa/components/pagination";
import { ref } from "vue";

const page = ref(3);
</script>

<template>
  <Pagination.Root v-model:page="page" :count="80" aria-label="Jobs pages">
    <Pagination.Controls />
  </Pagination.Root>
  <output aria-live="polite">Page {{ page }}</output>
</template>`;

export const siblingCode = `<template>
  <Pagination.Root :count="500" :sibling-count="2" aria-label="Large result set">
    <!-- Compose the same Context and navigation triggers as the usage example. -->
  </Pagination.Root>
</template>`;

export const statesCode = `<template>
  <Pagination.Root :count="80" :default-page="1" aria-label="Boundary states">
    <ul>
      <li><Pagination.FirstTrigger /></li>
      <li><Pagination.PrevTrigger /></li>
      <!-- Page items from Pagination.Context go here. -->
      <li><Pagination.NextTrigger /></li>
      <li><Pagination.LastTrigger /></li>
    </ul>
  </Pagination.Root>
</template>`;

export const labelsCode = `<template>
  <Pagination.Root :count="120" :default-page="4" aria-label="Labeled pages">
    <Pagination.Controls show-labels />
  </Pagination.Root>
</template>`;

export const simpleCode = `<template>
  <Pagination.Root :count="120" :default-page="4" aria-label="Simple pages">
    <Pagination.Controls controls="simple" />
  </Pagination.Root>
</template>`;

export const rtlCode = `<script setup>
import { DirectionProvider } from "@dicehub/kappa/components/direction-provider";
import { Pagination } from "@dicehub/kappa/components/pagination";
</script>

<template>
  <DirectionProvider locale="ar">
    <Pagination.Root :count="120" :default-page="4" aria-label="RTL pages">
      <Pagination.Controls page-label="رقم الصفحة" />
    </Pagination.Root>
  </DirectionProvider>
</template>`;

export const controlsProps = [
  { name: "controls", type: '"full" | "simple"', defaultValue: '"full"', description: "Full: first, previous, page input, next, last. Simple: previous and next only. Use inside a button-mode Root." },
  { name: "showLabels", type: "boolean", defaultValue: "false", description: "Shows First, Previous, Next, and Last beside the arrows. Custom root translations are preserved; accessible names stay unchanged." },
  { name: "pageLabel", type: "string", defaultValue: '"Page number"', description: "Accessible name of the page input; localize with your application." },
] as const;

export const triggerProps = [
  { name: "label", type: "string", defaultValue: "—", description: "Optional visible text beside the default single or double arrow. The default slot replaces the icon and label together." },
  { name: "asChild", type: "boolean", defaultValue: "false", description: "Compose a custom element, such as an anchor. Supply its content through the default slot." },
] as const;

export const compositionCode = `<Pagination.Root>
├── Pagination.FirstTrigger
├── Pagination.PrevTrigger
├── Pagination.Context
│   ├── Pagination.Item
│   └── Pagination.Ellipsis
├── Pagination.NextTrigger
└── Pagination.LastTrigger
</Pagination.Root>`;

export const rootProps = [
  { name: "count", type: "number", defaultValue: "0", description: "Total number of data items used to calculate total pages." },
  { name: "page / defaultPage", type: "number", defaultValue: "1", description: "Controlled or initial active page." },
  { name: "pageSize / defaultPageSize", type: "number", defaultValue: "10", description: "Controlled or initial number of data items per page." },
  { name: "siblingCount", type: "number", defaultValue: "1", description: "Number of page items shown beside the active page." },
  { name: "type", type: '"button" | "link"', defaultValue: '"button"', description: "Chooses native button triggers or links generated with getPageUrl." },
  { name: "getPageUrl", type: "(details) => string", defaultValue: "—", description: "Returns href values when type is link. Details include page and pageSize." },
  { name: "translations", type: "IntlTranslations", defaultValue: "Ark defaults", description: "Customizes the root, trigger, and page-item accessible names." },
  { name: "id / ids / asChild", type: "string / partial ID map / boolean", defaultValue: "generated / false", description: "Overrides machine IDs or composes the root with its direct child." },
] as const;

export const itemProps = [
  { name: "type", type: '"page"', defaultValue: "required", description: "Identifies this part as a page item for the Ark machine." },
  { name: "value", type: "number", defaultValue: "required", description: "Page number represented by the item." },
  { name: "disabled / asChild", type: "boolean / boolean", defaultValue: "false / false", description: "Disables the native item or composes it with a direct child." },
] as const;

export const parts = [
  { name: "Controls", element: "div", description: "Compact grouped arrow controls with a page input; composes the existing Ark-backed triggers." },
  { name: "Root", element: "nav", description: "Owns page state, page range calculation, and pagination semantics." },
  { name: "RootProvider", element: "nav", description: "Provides an externally created Ark pagination machine." },
  { name: "FirstTrigger / PrevTrigger", element: "button | a", description: "Moves to the first page or previous page; Ark disables them at the lower boundary." },
  { name: "Item", element: "button | a", description: "Selects a page and exposes the current page through aria-current." },
  { name: "Ellipsis", element: "span", description: "Marks an omitted page range. The part is non-interactive and aria-hidden by Ark." },
  { name: "NextTrigger / LastTrigger", element: "button | a", description: "Moves to the next page or last page; Ark disables them at the upper boundary." },
  { name: "Context", element: "renderless", description: "Exposes pages, totalPages, pageRange, and navigation methods to a slot." },
] as const;

export const events = [
  { name: "update:page", payload: "number", description: "Updates v-model:page after a page change." },
  { name: "pageChange", payload: "PaginationPageChangeDetails", description: "Reports page and pageSize after a page change." },
  { name: "update:pageSize", payload: "number", description: "Updates v-model:pageSize after the page size changes." },
  { name: "pageSizeChange", payload: "PaginationPageSizeChangeDetails", description: "Reports the new pageSize." },
] as const;

export const slots = [
  { name: "Root.default", description: "Native list markup and Pagination navigation parts." },
  { name: "RootProvider.default", description: "Native list markup and parts backed by an external machine." },
  { name: "Item / trigger.default", description: "Custom page or trigger content. Triggers have default arrows; label adds optional text." },
  { name: "Context.default", description: "Receives the renderless pagination API, including pages and totalPages." },
] as const;

export const dataAttributes = [
  { name: "data-slot", value: '"pagination" | "pagination-item" | "pagination-ellipsis" | "pagination-*-trigger"', description: "Identifies Kappa root and navigation parts." },
  { name: "data-scope / data-part", value: '"pagination" / Ark anatomy part', description: "Ark UI machine and anatomy markers." },
  { name: "aria-current", value: '"page" on current item', description: "Marks the active page for assistive technology and styling." },
  { name: "data-disabled / disabled", value: "present at boundaries", description: "Exposes Ark disabled trigger state at the first and last pages." },
] as const;

export const exportsList = [
  { name: "PaginationControls / PaginationControlsProps", description: "Compact control group and its public options." },
  { name: "Pagination", description: "Compound Ark-backed pagination component." },
  { name: "PaginationRoot / RootProvider / Item / Ellipsis", description: "Named root, provider, page-item, and ellipsis parts." },
  { name: "PaginationFirstTrigger / PrevTrigger / NextTrigger / LastTrigger", description: "Named boundary-navigation trigger parts." },
  { name: "PaginationContext", description: "Renderless page-range context part." },
  { name: "PaginationProps / PaginationRootProps / PaginationEmits", description: "Public root props and event contracts for button or link pagination." },
  { name: "PaginationItemProps / PaginationEllipsisProps / Pagination*TriggerProps", description: "Public part props for page items, ellipsis, and boundary triggers." },
  { name: "Pagination*Slots", description: "Public default and renderless Context slot contracts." },
  { name: "usePagination / usePaginationContext / paginationAnatomy", description: "Ark UI composition exports." },
] as const;

export const keyboardRows = [
  { key: "Tab", description: "Moves to the next enabled pagination control." },
  { key: "Enter / Space", description: "Activates a focused button trigger or page item." },
  { key: "Shift + Tab", description: "Moves to the previous enabled pagination control." },
] as const;
