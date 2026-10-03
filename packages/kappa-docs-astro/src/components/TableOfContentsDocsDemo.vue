<script setup lang="ts">
import { reactive, ref } from "vue";
import { Button } from "@dicehub/kappa/components/button";
import {
  TableOfContents,
  type TocItemData,
} from "@dicehub/kappa/components/table-of-contents";

type DemoVariant =
  | "preview"
  | "basic"
  | "nested"
  | "indicator"
  | "controlled"
  | "scroll-tracking";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

type SelectableDemo = "preview" | "basic" | "nested" | "indicator";

const previewItems: TocItemData[] = [
  { value: "installation", depth: 2 },
  { value: "usage", depth: 2 },
  { value: "composition", depth: 2 },
  { value: "examples", depth: 2 },
  { value: "api-reference", depth: 2 },
];
const basicItems: TocItemData[] = [
  { value: "installation", depth: 2 },
  { value: "usage", depth: 2 },
  { value: "examples", depth: 2 },
  { value: "api-reference", depth: 2 },
];
const nestedItems: TocItemData[] = [
  { value: "installation", depth: 2 },
  { value: "barrel", depth: 3 },
  { value: "granular", depth: 3 },
  { value: "usage", depth: 2 },
];
const indicatorItems: TocItemData[] = [
  { value: "installation", depth: 2 },
  { value: "usage", depth: 2 },
  { value: "composition", depth: 2 },
  { value: "examples", depth: 2 },
];
const controlledItems: TocItemData[] = [
  { value: "installation", depth: 2 },
  { value: "usage", depth: 2 },
  { value: "api-reference", depth: 2 },
];
const scrollItems: TocItemData[] = [
  { value: "toc-scroll-overview", depth: 2 },
  { value: "toc-scroll-install", depth: 2 },
  { value: "toc-scroll-api", depth: 2 },
];

const previewLabels: Record<string, string> = {
  installation: "Installation",
  usage: "Usage",
  composition: "Composition",
  examples: "Examples",
  "api-reference": "API Reference",
};
const basicLabels: Record<string, string> = {
  installation: "Installation",
  usage: "Usage",
  examples: "Examples",
  "api-reference": "API Reference",
};
const nestedLabels: Record<string, string> = {
  installation: "Installation",
  barrel: "Barrel",
  granular: "Granular",
  usage: "Usage",
};
const indicatorLabels: Record<string, string> = {
  installation: "Installation",
  usage: "Usage",
  composition: "Composition",
  examples: "Examples",
};
const controlledLabels: Record<string, string> = {
  installation: "Installation",
  usage: "Usage",
  "api-reference": "API Reference",
};
const scrollLabels: Record<string, string> = {
  "toc-scroll-overview": "Overview",
  "toc-scroll-install": "Installation",
  "toc-scroll-api": "API reference",
};

const demoActiveIds = reactive<Record<SelectableDemo, string[]>>({
  preview: [previewItems[1]!.value],
  basic: [basicItems[0]!.value],
  nested: [nestedItems[1]!.value],
  indicator: indicatorItems.slice(1, 3).map((item) => item.value),
});
const controlledIds = ref([controlledItems[0]!.value]);
const controlledChanges = ref(0);
const scrollRoot = ref<HTMLElement | null>(null);
const scrollEl = () => scrollRoot.value;

const handleControlledActiveChange = (details: { activeIds: string[] }) => {
  controlledIds.value = details.activeIds;
  controlledChanges.value += 1;
};

const activateControlled = (value: string) => {
  controlledIds.value = [value];
};

const activateDemoItem = (variant: SelectableDemo, value: string) => {
  demoActiveIds[variant] = [value];
};

const scrollToItem = (value: string) => {
  const container = scrollRoot.value;
  const heading = container?.querySelector<HTMLElement>(`#${CSS.escape(value)}`);
  if (!container || !heading) return;
  container.scrollTo({
    top: container.scrollTop + heading.getBoundingClientRect().top -
      container.getBoundingClientRect().top - container.clientTop -
      Number.parseFloat(getComputedStyle(container).paddingTop),
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
  });
};
</script>

<template>
  <div class="table-of-contents-demo" :data-table-of-contents-demo="props.variant">
    <TableOfContents.Root
      v-if="props.variant === 'preview'"
      id="toc-demo-preview"
      class="table-of-contents-demo__root"
      :active-ids="demoActiveIds.preview"
      :items="previewItems"
    >
      <TableOfContents.Nav id="toc-demo-preview-nav">
        <TableOfContents.Title>On this page</TableOfContents.Title>
        <TableOfContents.List>
          <TableOfContents.Indicator />
          <TableOfContents.Item v-for="item in previewItems" :key="item.value" :item="item">
            <TableOfContents.Link as-child>
              <button type="button" @click="activateDemoItem('preview', item.value)">
                {{ previewLabels[item.value] }}
              </button>
            </TableOfContents.Link>
          </TableOfContents.Item>
        </TableOfContents.List>
      </TableOfContents.Nav>
    </TableOfContents.Root>

    <TableOfContents.Root
      v-else-if="props.variant === 'basic'"
      id="toc-demo-basic"
      class="table-of-contents-demo__root"
      :active-ids="demoActiveIds.basic"
      :items="basicItems"
    >
      <TableOfContents.Nav id="toc-demo-basic-nav">
        <TableOfContents.Title>Sections</TableOfContents.Title>
        <TableOfContents.List>
          <TableOfContents.Item v-for="item in basicItems" :key="item.value" :item="item">
            <TableOfContents.Link as-child>
              <button type="button" @click="activateDemoItem('basic', item.value)">
                {{ basicLabels[item.value] }}
              </button>
            </TableOfContents.Link>
          </TableOfContents.Item>
        </TableOfContents.List>
      </TableOfContents.Nav>
    </TableOfContents.Root>

    <TableOfContents.Root
      v-else-if="props.variant === 'nested'"
      id="toc-demo-nested"
      class="table-of-contents-demo__root"
      :active-ids="demoActiveIds.nested"
      :items="nestedItems"
    >
      <TableOfContents.Nav id="toc-demo-nested-nav">
        <TableOfContents.Title>Guide sections</TableOfContents.Title>
        <TableOfContents.List>
          <TableOfContents.Item v-for="item in nestedItems" :key="item.value" :item="item">
            <TableOfContents.Link as-child>
              <button type="button" @click="activateDemoItem('nested', item.value)">
                {{ nestedLabels[item.value] }}
              </button>
            </TableOfContents.Link>
          </TableOfContents.Item>
        </TableOfContents.List>
      </TableOfContents.Nav>
    </TableOfContents.Root>

    <TableOfContents.Root
      v-else-if="props.variant === 'indicator'"
      id="toc-demo-indicator"
      class="table-of-contents-demo__root"
      :active-ids="demoActiveIds.indicator"
      :items="indicatorItems"
    >
      <TableOfContents.Nav id="toc-demo-indicator-nav">
        <TableOfContents.Title>Visible sections</TableOfContents.Title>
        <TableOfContents.List>
          <TableOfContents.Indicator aria-hidden="true" />
          <TableOfContents.Item v-for="item in indicatorItems" :key="item.value" :item="item">
            <TableOfContents.Link as-child>
              <button type="button" @click="activateDemoItem('indicator', item.value)">
                {{ indicatorLabels[item.value] }}
              </button>
            </TableOfContents.Link>
          </TableOfContents.Item>
        </TableOfContents.List>
      </TableOfContents.Nav>
    </TableOfContents.Root>

    <div v-else-if="props.variant === 'controlled'" class="table-of-contents-demo__controlled">
      <TableOfContents.Root
        id="toc-demo-controlled"
        class="table-of-contents-demo__root"
        :active-ids="controlledIds"
        :items="controlledItems"
        @active-change="handleControlledActiveChange"
      >
        <TableOfContents.Nav id="toc-demo-controlled-nav">
          <TableOfContents.Title>Controlled sections</TableOfContents.Title>
          <TableOfContents.List>
            <TableOfContents.Item v-for="item in controlledItems" :key="item.value" :item="item">
              <TableOfContents.Link as-child>
                <button type="button" @click="activateControlled(item.value)">
                  {{ controlledLabels[item.value] }}
                </button>
              </TableOfContents.Link>
            </TableOfContents.Item>
          </TableOfContents.List>
        </TableOfContents.Nav>
      </TableOfContents.Root>
      <div class="table-of-contents-demo__controls">
        <Button size="sm" variant="outline" @click="activateControlled(controlledItems[1]!.value)">
          Activate usage
        </Button>
        <output role="status">Active: {{ controlledIds.join(", ") }} · Changes: {{ controlledChanges }}</output>
      </div>
    </div>

    <div v-else class="table-of-contents-demo__scroll-tracking">
      <TableOfContents.Root
        id="toc-demo-scroll-tracking"
        :auto-scroll="false"
        class="table-of-contents-demo__root table-of-contents-demo__root--scroll-tracking"
        :default-active-ids="[scrollItems[0]!.value]"
        :items="scrollItems"
        :scroll-el="scrollEl"
        root-margin="-8px 0px -55% 0px"
      >
        <TableOfContents.Content class="table-of-contents-demo__content">
          <div ref="scrollRoot" class="table-of-contents-demo__scroll-root" data-scrollspy-root tabindex="0">
            <section v-for="item in scrollItems" :key="item.value">
              <h3 :id="item.value" data-demo-heading>{{ scrollLabels[item.value] }}</h3>
              <p>Scrollable content keeps the active section deterministic for this example.</p>
              <p>Use the section controls or scroll this panel to update the active indicator.</p>
            </section>
          </div>
        </TableOfContents.Content>
        <TableOfContents.Nav id="toc-demo-scroll-tracking-nav">
          <TableOfContents.Title>In this document</TableOfContents.Title>
          <TableOfContents.List>
            <TableOfContents.Indicator />
            <TableOfContents.Item v-for="item in scrollItems" :key="item.value" :item="item">
              <TableOfContents.Link as-child>
                <button type="button" @click="scrollToItem(item.value)">
                  {{ scrollLabels[item.value] }}
                </button>
              </TableOfContents.Link>
            </TableOfContents.Item>
          </TableOfContents.List>
        </TableOfContents.Nav>
      </TableOfContents.Root>
    </div>
  </div>
</template>

<style scoped>
.table-of-contents-demo {
  display: grid;
  inline-size: 100%;
  min-inline-size: 0;
  min-block-size: 13rem;
  place-items: center;
  color: var(--kappa-default, #17191f);
  font-family: var(--kappa-font-sans, inherit);
}

.table-of-contents-demo .table-of-contents-demo__root {
  inline-size: min(100%, 12rem);
}

.table-of-contents-demo .table-of-contents-demo__root--scroll-tracking {
  display: grid;
  inline-size: min(100%, 42rem);
  grid-template-columns: minmax(0, 1fr) minmax(10rem, 15rem);
  align-items: start;
  gap: 1.5rem;
}

.table-of-contents-demo__root--scroll-tracking :deep(.kappa-table-of-contents__content) {
  grid-column: 1;
  min-inline-size: 0;
}

.table-of-contents-demo__root--scroll-tracking :deep(.kappa-table-of-contents__nav) {
  grid-area: 1 / 2;
}

.table-of-contents-demo__controlled,
.table-of-contents-demo__scroll-tracking {
  display: grid;
  inline-size: min(100%, 42rem);
  justify-items: center;
}

.table-of-contents-demo__controls {
  display: grid;
  align-content: start;
  justify-items: center;
  gap: 0.625rem;
  margin-block-start: 1rem;
}

.table-of-contents-demo__controls output {
  color: var(--kappa-subtle, #6c7480);
  font-size: 0.75rem;
}

.table-of-contents-demo__scroll-root {
  block-size: 15rem;
  overflow-y: auto;
  border: 1px solid var(--kappa-line, #e3e6eb);
  border-radius: 0.5rem;
  padding: 0.875rem 1rem;
  scroll-behavior: smooth;
}

.table-of-contents-demo__scroll-root section {
  min-block-size: 13rem;
  scroll-margin-block-start: 0.5rem;
}

.table-of-contents-demo__scroll-root h3,
.table-of-contents-demo__scroll-root p {
  margin: 0;
}

.table-of-contents-demo__scroll-root p {
  margin-block-start: 0.5rem;
  color: var(--kappa-subtle, #6c7480);
  font-size: 0.75rem;
  line-height: 1.5;
}

@media (max-width: 40rem) {
  .table-of-contents-demo .table-of-contents-demo__root--scroll-tracking {
    grid-template-columns: minmax(0, 1fr);
  }

  .table-of-contents-demo__root--scroll-tracking :deep(.kappa-table-of-contents__content),
  .table-of-contents-demo__root--scroll-tracking :deep(.kappa-table-of-contents__nav) {
    grid-column: 1;
    grid-row: auto;
  }
}
</style>
