export const barrelCode = `import {
  ScrollArea,
  ScrollAreaContent,
  ScrollAreaCorner,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "@dicehub/kappa";`;

export const granularCode = `import {
  ScrollArea,
  ScrollAreaContent,
  ScrollAreaCorner,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "@dicehub/kappa/components/scroll-area";`;

export const previewCode = `<script setup>
import { ScrollArea } from "@dicehub/kappa/components/scroll-area";

const events = [
  ["08:42", "Mesh uploaded", "geometry.step"],
  ["08:44", "Surface checks complete", "128 patches"],
  ["08:47", "Volume mesh started", "16 workers"],
  ["08:51", "Boundary layers complete", "12 layers"],
  ["08:54", "Quality report ready", "0 critical cells"],
];
</script>

<template>
  <ScrollArea.Root class="activity-log">
    <ScrollArea.Viewport tabindex="0" role="region" aria-label="Recent activity">
      <ScrollArea.Content>
        <ol>
          <li v-for="event in events" :key="event[0]">
            <time>{{ event[0] }}</time>
            <span>{{ event[1] }} — {{ event[2] }}</span>
          </li>
        </ol>
      </ScrollArea.Content>
    </ScrollArea.Viewport>
    <ScrollArea.Scrollbar>
      <ScrollArea.Thumb />
    </ScrollArea.Scrollbar>
  </ScrollArea.Root>
</template>

<style>
.activity-log {
  block-size: 16rem;
}
</style>`;

export const usageCode = previewCode;

export const horizontalCode = `<script setup>
import { ScrollArea } from "@dicehub/kappa/components/scroll-area";

const cases = ["Baseline", "Low speed", "Cruise", "High speed", "Crosswind"];
</script>

<template>
  <ScrollArea.Root class="case-strip">
    <ScrollArea.Viewport tabindex="0" role="region" aria-label="Cases">
      <ScrollArea.Content class="case-strip__content">
        <article v-for="name in cases" :key="name">{{ name }}</article>
      </ScrollArea.Content>
    </ScrollArea.Viewport>
    <ScrollArea.Scrollbar orientation="horizontal">
      <ScrollArea.Thumb />
    </ScrollArea.Scrollbar>
  </ScrollArea.Root>
</template>

<style>
.case-strip { block-size: 11rem; }
.case-strip__content { display: flex; inline-size: max-content; }
.case-strip__content article { flex: none; inline-size: 10.5rem; }
</style>`;

export const bothCode = `<script setup>
import { ScrollArea } from "@dicehub/kappa/components/scroll-area";

const rows = [
  ["Baseline", "1,842,000", "420", "1.8e-5", "28 min", "Complete"],
  ["Low speed", "2,016,000", "458", "2.5e-5", "35 min", "Complete"],
  ["Cruise", "2,190,000", "496", "3.2e-5", "42 min", "Complete"],
  ["High speed", "2,364,000", "534", "3.9e-5", "49 min", "Complete"],
  ["Crosswind", "2,538,000", "572", "4.6e-5", "56 min", "Complete"],
];
</script>

<template>
  <ScrollArea.Root class="result-matrix">
    <ScrollArea.Viewport tabindex="0" role="region" aria-label="Case comparison">
      <ScrollArea.Content>
        <table>
          <thead>
            <tr>
              <th>Case</th><th>Cells</th><th>Iterations</th>
              <th>Residual</th><th>Runtime</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in rows" :key="row[0]">
              <td v-for="value in row" :key="value">{{ value }}</td>
            </tr>
          </tbody>
        </table>
      </ScrollArea.Content>
    </ScrollArea.Viewport>
    <ScrollArea.Scrollbar>
      <ScrollArea.Thumb />
    </ScrollArea.Scrollbar>
    <ScrollArea.Scrollbar orientation="horizontal">
      <ScrollArea.Thumb />
    </ScrollArea.Scrollbar>
    <ScrollArea.Corner />
  </ScrollArea.Root>
</template>

<style>
.result-matrix { block-size: 15rem; }
.result-matrix table { inline-size: 48rem; }
</style>`;

export const nestedCode = `<script setup>
import { ScrollArea } from "@dicehub/kappa/components/scroll-area";

const files = ["mesh.case", "solver.log", "forces.csv", "report.pdf", "archive.zip"];
</script>

<template>
  <ScrollArea.Root class="notes">
    <ScrollArea.Viewport tabindex="0" role="region" aria-label="Project notes">
      <ScrollArea.Content>
        <h3>Project notes</h3>
        <p v-for="index in 6" :key="index">
          Iteration {{ index }} confirms stable convergence across the operating range.
        </p>
        <ScrollArea.Root class="files">
          <ScrollArea.Viewport tabindex="0" role="region" aria-label="Referenced files">
            <ScrollArea.Content class="files__content">
              <code v-for="file in files" :key="file">{{ file }}</code>
            </ScrollArea.Content>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar orientation="horizontal">
            <ScrollArea.Thumb />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      </ScrollArea.Content>
    </ScrollArea.Viewport>
    <ScrollArea.Scrollbar>
      <ScrollArea.Thumb />
    </ScrollArea.Scrollbar>
  </ScrollArea.Root>
</template>

<style>
.notes { block-size: 18rem; }
.files { block-size: 5rem; }
.files__content { display: flex; inline-size: max-content; }
.files__content code { inline-size: 8rem; }
</style>`;

export const controlsCode = `<script setup>
import { ScrollArea } from "@dicehub/kappa/components/scroll-area";

const entries = Array.from({ length: 24 }, (_, index) => "Log entry " + (index + 1));
</script>

<template>
  <ScrollArea.Root class="event-log">
    <ScrollArea.Context v-slot="api">
      <button type="button" @click="api.scrollToEdge({ edge: 'top', behavior: 'smooth' })">
        First
      </button>
      <button type="button" @click="api.scrollToEdge({ edge: 'bottom', behavior: 'smooth' })">
        Last
      </button>
    </ScrollArea.Context>
    <ScrollArea.Viewport tabindex="0" role="region" aria-label="Controlled event log">
      <ScrollArea.Content>
        <ol>
          <li v-for="entry in entries" :key="entry">{{ entry }}</li>
        </ol>
      </ScrollArea.Content>
    </ScrollArea.Viewport>
    <ScrollArea.Scrollbar>
      <ScrollArea.Thumb />
    </ScrollArea.Scrollbar>
  </ScrollArea.Root>
</template>

<style>
.event-log { block-size: 18rem; }
</style>`;

export const noOverflowCode = `<script setup>
import { ScrollArea } from "@dicehub/kappa/components/scroll-area";
</script>

<template>
  <ScrollArea.Root class="short-content">
    <ScrollArea.Viewport tabindex="0" role="region" aria-label="Short content">
      <ScrollArea.Content>
        <p>No scrollbar is shown when the content fits.</p>
      </ScrollArea.Content>
    </ScrollArea.Viewport>
    <ScrollArea.Scrollbar>
      <ScrollArea.Thumb />
    </ScrollArea.Scrollbar>
  </ScrollArea.Root>
</template>`;

export const rtlCode = `<script setup>
import { ScrollArea } from "@dicehub/kappa/components/scroll-area";

const cases = ["الأساس", "سرعة منخفضة", "الإبحار", "سرعة عالية", "رياح جانبية"];
</script>

<template>
  <ScrollArea.Root dir="rtl" class="case-strip">
    <ScrollArea.Viewport tabindex="0" role="region" aria-label="Cases, right to left">
      <ScrollArea.Content class="case-strip__content">
        <article v-for="name in cases" :key="name">{{ name }}</article>
      </ScrollArea.Content>
    </ScrollArea.Viewport>
    <ScrollArea.Scrollbar orientation="horizontal">
      <ScrollArea.Thumb />
    </ScrollArea.Scrollbar>
  </ScrollArea.Root>
</template>

<style>
.case-strip { block-size: 11rem; }
.case-strip__content { display: flex; inline-size: max-content; }
.case-strip__content article { flex: none; inline-size: 10.5rem; }
</style>`;

export const rootProps = [
  { name: "id", type: "string", defaultValue: "generated", description: "Stable identifier for the scroll-area machine." },
  { name: "dir", type: `"ltr" | "rtl"`, defaultValue: "inherited", description: "Overrides the inherited Ark UI locale direction." },
  { name: "ids", type: "Partial<ScrollAreaElementIds>", defaultValue: "generated", description: "Overrides identifiers for the root, viewport, content, scrollbars, and thumbs." },
  { name: "asChild", type: "boolean", defaultValue: "false", description: "Merges root behavior into the direct child." },
] as const;

export const scrollbarProps = [
  { name: "orientation", type: `"vertical" | "horizontal"`, defaultValue: `"vertical"`, description: "Selects the axis controlled by this scrollbar." },
  { name: "asChild", type: "boolean", defaultValue: "false", description: "Merges scrollbar behavior into the direct child." },
] as const;

export const parts = [
  { name: "Viewport", element: "div", description: "Native scrolling viewport. Give it a keyboard focus target and accessible name when needed." },
  { name: "Content", element: "div", description: "Container measured by Ark UI to detect overflow." },
  { name: "Scrollbar", element: "div", description: "Pointer and touch track for one axis." },
  { name: "Thumb", element: "div", description: "Draggable control that reports the visible content proportion." },
  { name: "Corner", element: "div", description: "Fills the intersection when both scrollbars are present." },
  { name: "Context", element: "renderless", description: "Exposes overflow state, edge state, and programmatic scroll methods." },
] as const;

export const exportsList = [
  { name: "ScrollArea", description: "Styled compound component with all parts." },
  { name: "ScrollAreaRoot / ScrollAreaRootProvider", description: "Direct root and external-machine provider components." },
  { name: "ScrollAreaViewport / ScrollAreaContent", description: "Granular viewport and measured content parts." },
  { name: "ScrollAreaScrollbar / ScrollAreaThumb / ScrollAreaCorner", description: "Granular custom scrollbar parts." },
  { name: "ScrollAreaContext", description: "Renderless access to the active Ark UI context." },
  { name: "useScrollArea / useScrollAreaContext", description: "Ark UI composition functions." },
  { name: "ScrollArea*Props / ScrollArea*Slots / ScrollAreaApi", description: "Public TypeScript contracts." },
] as const;
