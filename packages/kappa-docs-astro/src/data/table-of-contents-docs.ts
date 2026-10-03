export const tableOfContentsBarrelCode = `import { TableOfContents } from "@dicehub/kappa";`;

export const tableOfContentsGranularCode = `import { TableOfContents, type TocItemData } from "@dicehub/kappa/components/table-of-contents";`;

export const tableOfContentsPreviewCode = `<script setup lang="ts">
import { ref } from "vue";
import { TableOfContents, type TocItemData } from "@dicehub/kappa/components/table-of-contents";

const items: TocItemData[] = [
  { value: "installation", depth: 2 },
  { value: "usage", depth: 2 },
  { value: "composition", depth: 2 },
  { value: "examples", depth: 2 },
  { value: "api-reference", depth: 2 },
];
const labels: Record<string, string> = {
  installation: "Installation",
  usage: "Usage",
  composition: "Composition",
  examples: "Examples",
  "api-reference": "API Reference",
};
const activeIds = ref(["usage"]);
const activate = (value: string) => {
  activeIds.value = [value];
};
</script>

<template>
  <TableOfContents.Root :items="items" :active-ids="activeIds">
    <TableOfContents.Nav>
      <TableOfContents.Title>On this page</TableOfContents.Title>
      <TableOfContents.List>
        <TableOfContents.Indicator />
        <TableOfContents.Item v-for="item in items" :key="item.value" :item="item">
          <TableOfContents.Link as-child>
            <button type="button" @click="activate(item.value)">
              {{ labels[item.value] }}
            </button>
          </TableOfContents.Link>
        </TableOfContents.Item>
      </TableOfContents.List>
    </TableOfContents.Nav>
  </TableOfContents.Root>
</template>`;

export const tableOfContentsUsageCode = `<script setup lang="ts">
import { TableOfContents, type TocItemData } from "@dicehub/kappa/components/table-of-contents";

const items: TocItemData[] = [
  { value: "introduction", depth: 2 },
  { value: "installation", depth: 2 },
  { value: "configuration", depth: 3 },
];
</script>

<template>
  <TableOfContents.Root :items="items">
    <TableOfContents.Content>
      <section v-for="item in items" :key="item.value">
        <component :is="item.depth === 3 ? 'h3' : 'h2'" :id="item.value">{{ item.value }}</component>
      </section>
    </TableOfContents.Content>
    <TableOfContents.Nav>
      <TableOfContents.Title>Guide</TableOfContents.Title>
      <TableOfContents.List>
        <TableOfContents.Item v-for="item in items" :key="item.value" :item="item">
          <TableOfContents.Link :href="\`#\${item.value}\`">{{ item.value }}</TableOfContents.Link>
        </TableOfContents.Item>
      </TableOfContents.List>
    </TableOfContents.Nav>
  </TableOfContents.Root>
</template>`;

export const tableOfContentsBasicCode = `<script setup lang="ts">
import { ref } from "vue";
import { TableOfContents, type TocItemData } from "@dicehub/kappa/components/table-of-contents";

const items: TocItemData[] = [
  { value: "installation", depth: 2 },
  { value: "usage", depth: 2 },
  { value: "examples", depth: 2 },
  { value: "api-reference", depth: 2 },
];
const labels: Record<string, string> = {
  installation: "Installation",
  usage: "Usage",
  examples: "Examples",
  "api-reference": "API Reference",
};
const activeIds = ref(["installation"]);
const activate = (value: string) => {
  activeIds.value = [value];
};
</script>

<template>
  <TableOfContents.Root :items="items" :active-ids="activeIds">
    <TableOfContents.Nav>
      <TableOfContents.Title>Sections</TableOfContents.Title>
      <TableOfContents.List>
        <TableOfContents.Item v-for="item in items" :key="item.value" :item="item">
          <TableOfContents.Link as-child>
            <button type="button" @click="activate(item.value)">
              {{ labels[item.value] }}
            </button>
          </TableOfContents.Link>
        </TableOfContents.Item>
      </TableOfContents.List>
    </TableOfContents.Nav>
  </TableOfContents.Root>
</template>`;

export const tableOfContentsNestedCode = `<script setup lang="ts">
import { ref } from "vue";
import { TableOfContents, type TocItemData } from "@dicehub/kappa/components/table-of-contents";

const items: TocItemData[] = [
  { value: "installation", depth: 2 },
  { value: "barrel", depth: 3 },
  { value: "granular", depth: 3 },
  { value: "usage", depth: 2 },
];
const labels: Record<string, string> = {
  installation: "Installation",
  barrel: "Barrel",
  granular: "Granular",
  usage: "Usage",
};
const activeIds = ref(["barrel"]);
const activate = (value: string) => {
  activeIds.value = [value];
};
</script>

<template>
  <TableOfContents.Root :items="items" :active-ids="activeIds">
    <TableOfContents.Nav>
      <TableOfContents.Title>Guide sections</TableOfContents.Title>
      <TableOfContents.List>
        <TableOfContents.Item v-for="item in items" :key="item.value" :item="item">
          <TableOfContents.Link as-child>
            <button type="button" @click="activate(item.value)">
              {{ labels[item.value] }}
            </button>
          </TableOfContents.Link>
        </TableOfContents.Item>
      </TableOfContents.List>
    </TableOfContents.Nav>
  </TableOfContents.Root>
</template>`;

export const tableOfContentsIndicatorCode = `<script setup lang="ts">
import { ref } from "vue";
import { TableOfContents, type TocItemData } from "@dicehub/kappa/components/table-of-contents";

const items: TocItemData[] = [
  { value: "installation", depth: 2 },
  { value: "usage", depth: 2 },
  { value: "composition", depth: 2 },
  { value: "examples", depth: 2 },
];
const labels: Record<string, string> = {
  installation: "Installation",
  usage: "Usage",
  composition: "Composition",
  examples: "Examples",
};
const activeIds = ref(["usage", "composition"]);
const activate = (value: string) => {
  activeIds.value = [value];
};
</script>

<template>
  <TableOfContents.Root
    :items="items"
    :active-ids="activeIds"
  >
    <TableOfContents.Nav>
      <TableOfContents.Title>Visible sections</TableOfContents.Title>
      <TableOfContents.List>
        <TableOfContents.Indicator />
        <TableOfContents.Item v-for="item in items" :key="item.value" :item="item">
          <TableOfContents.Link as-child>
            <button type="button" @click="activate(item.value)">
              {{ labels[item.value] }}
            </button>
          </TableOfContents.Link>
        </TableOfContents.Item>
      </TableOfContents.List>
    </TableOfContents.Nav>
  </TableOfContents.Root>
</template>`;

export const tableOfContentsControlledCode = `<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@dicehub/kappa/components/button";
import {
  TableOfContents,
  type TocActiveChangeDetails,
  type TocItemData,
} from "@dicehub/kappa/components/table-of-contents";

const items: TocItemData[] = [
  { value: "installation", depth: 2 },
  { value: "usage", depth: 2 },
  { value: "api-reference", depth: 2 },
];
const labels: Record<string, string> = {
  installation: "Installation",
  usage: "Usage",
  "api-reference": "API Reference",
};
const activeIds = ref<string[]>(["installation"]);
const changes = ref(0);
const handleActiveChange = ({ activeIds: next }: TocActiveChangeDetails) => {
  activeIds.value = next;
  changes.value += 1;
};
const activateUsage = () => {
  activeIds.value = ["usage"];
};
const activateSection = (value: string) => {
  activeIds.value = [value];
};
</script>

<template>
  <TableOfContents.Root
    :active-ids="activeIds"
    :items="items"
    @active-change="handleActiveChange"
  >
    <TableOfContents.Nav>
      <TableOfContents.Title>Controlled sections</TableOfContents.Title>
      <TableOfContents.List>
        <TableOfContents.Item v-for="item in items" :key="item.value" :item="item">
          <TableOfContents.Link as-child>
            <button type="button" @click="activateSection(item.value)">
              {{ labels[item.value] }}
            </button>
          </TableOfContents.Link>
        </TableOfContents.Item>
      </TableOfContents.List>
    </TableOfContents.Nav>
  </TableOfContents.Root>
  <Button size="sm" variant="outline" @click="activateUsage">
    Activate usage
  </Button>
  <output role="status">
    Active: {{ activeIds.join(", ") }} · Changes: {{ changes }}
  </output>
</template>`;

export const tableOfContentsScrollTrackingCode = `<script setup lang="ts">
import { ref } from "vue";
import { TableOfContents, type TocItemData } from "@dicehub/kappa/components/table-of-contents";

const items: TocItemData[] = [
  { value: "overview", depth: 2 },
  { value: "api", depth: 2 },
];
const scrollRoot = ref<HTMLElement | null>(null);
const scrollEl = () => scrollRoot.value;
const scrollToItem = (value: string) => {
  const container = scrollRoot.value;
  const heading = container?.querySelector<HTMLElement>(\`#\${CSS.escape(value)}\`);
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
  <TableOfContents.Root id="guide-toc" :items="items" :scroll-el="scrollEl" :auto-scroll="false">
    <TableOfContents.Content>
      <div ref="scrollRoot" class="scroll-container">
        <h2 id="overview">Overview</h2>
        <h2 id="api">API</h2>
      </div>
    </TableOfContents.Content>
    <TableOfContents.Nav id="guide-toc-nav">
      <TableOfContents.Title>Guide sections</TableOfContents.Title>
      <TableOfContents.List>
        <TableOfContents.Indicator />
        <TableOfContents.Item v-for="item in items" :key="item.value" :item="item">
          <TableOfContents.Link as-child>
            <button type="button" @click="scrollToItem(item.value)">
              {{ item.value }}
            </button>
          </TableOfContents.Link>
        </TableOfContents.Item>
      </TableOfContents.List>
    </TableOfContents.Nav>
  </TableOfContents.Root>
</template>`;

export const tableOfContentsExamples = [
  {
    id: "basic",
    title: "Basic",
    variant: "basic",
    description: "Compose a compact labelled `Nav`, `List`, `Item`, and button-backed `Link`.",
    code: tableOfContentsBasicCode,
  },
  {
    id: "nested",
    title: "Nested depth",
    variant: "nested",
    description: "Set each item `depth` to preserve heading hierarchy and Kappa indentation.",
    code: tableOfContentsNestedCode,
  },
  {
    id: "indicator",
    title: "Active indicator",
    variant: "indicator",
    description: "Add `Indicator` inside `List`; Ark UI updates its geometry for the active heading range.",
    code: tableOfContentsIndicatorCode,
  },
  {
    id: "controlled",
    title: "Controlled active change",
    variant: "controlled",
    description: "Use `activeIds` for controlled state and `activeChange` to reconcile scroll visibility.",
    code: tableOfContentsControlledCode,
  },
  {
    id: "scroll-tracking",
    title: "Scroll tracking",
    variant: "scroll-tracking",
    description: "Pass `scrollEl` for a real scroll container. Ark observes its headings while the demo buttons avoid page navigation.",
    code: tableOfContentsScrollTrackingCode,
  },
] as const;

export const tableOfContentsRootProps = [
  {
    name: "items",
    type: "TocItemData[]",
    defaultValue: "required",
    description: "Heading ids and depths. Each value must match a heading id in the observed document.",
  },
  {
    name: "activeIds / defaultActiveIds",
    type: "string[]",
    defaultValue: "[]",
    description: "Controlled or initial active heading ids.",
  },
  {
    name: "scrollEl",
    type: "() => HTMLElement | null",
    defaultValue: "viewport",
    description: "Returns the scroll container used by IntersectionObserver and link scrolling.",
  },
  {
    name: "rootMargin",
    type: "string",
    defaultValue: '"-20px 0% -40% 0%"',
    description: "IntersectionObserver root margin for active heading detection.",
  },
  {
    name: "threshold",
    type: "number | number[]",
    defaultValue: "0",
    description: "IntersectionObserver threshold.",
  },
  {
    name: "autoScroll",
    type: "boolean",
    defaultValue: "true",
    description: "Keeps the first active TOC item visible in the list.",
  },
  {
    name: "scrollBehavior",
    type: "ScrollBehavior",
    defaultValue: '"smooth"',
    description: "Default behavior for link scrolling and active-item auto-scroll.",
  },
] as const;

export const tableOfContentsParts = [
  { name: "Root", element: "div", description: "Creates the Ark TOC machine and provides context." },
  { name: "Content", element: "article", description: "Content region for the TOC composition." },
  { name: "Nav", element: "nav", description: "Semantic navigation region labelled by Title." },
  { name: "Title", element: "h2", description: "Required visible heading used to label Nav." },
  { name: "List", element: "ul", description: "List container for TOC items and Indicator." },
  { name: "Item", element: "li", description: "Binds one { value, depth } item to the Ark machine." },
  { name: "Link", element: "a", description: "Scrolls to a same-page heading and exposes active state." },
  { name: "Indicator", element: "div", description: "Tracks the first-to-last active item geometry." },
  { name: "Context", element: "renderless", description: "Exposes the Ark TOC API to a scoped slot." },
  { name: "RootProvider", element: "div", description: "Uses a TOC API created with useToc outside the template." },
] as const;

export const tableOfContentsEvents = [
  {
    name: "activeChange",
    payload: "{ activeIds: string[]; activeItems: TocItemData[] }",
    description: "Emitted when observed heading visibility changes.",
  },
] as const;

export const tableOfContentsKeyboardRows = [
  { key: "Tab", description: "Moves through links using the browser's normal navigation order." },
  { key: "Enter", description: "Activates a link and scrolls to its same-page heading." },
  { key: "Shift + Tab", description: "Moves backward through TOC links." },
] as const;

export const tableOfContentsDataAttributes = [
  { name: "data-active", value: "present", description: "Marks items and links whose heading is active." },
  { name: "data-first / data-last", value: "present", description: "Marks the first and last active item." },
  { name: "data-depth", value: "number", description: "Exposes the item heading depth." },
  { name: "data-value", value: "string", description: "Exposes the heading id on Item and Link." },
] as const;

export const tableOfContentsExports = [
  { name: "TableOfContents", description: "Compound namespace with Root, Content, Nav, Title, List, Item, Link, Indicator, Context, and RootProvider." },
  { name: "TableOfContentsRoot … TableOfContentsRootProvider", description: "Named component exports for granular composition." },
  { name: "TableOfContentsRootProps and part prop types", description: "Public Ark-aligned Vue prop contracts." },
  { name: "TocItemData / TocActiveChangeDetails", description: "Ark UI TOC data and event contracts." },
  { name: "useToc / useTocContext / tocAnatomy", description: "Ark UI behavior hooks and anatomy exports." },
] as const;
