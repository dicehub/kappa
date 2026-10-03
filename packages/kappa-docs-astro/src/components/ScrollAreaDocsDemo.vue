<script setup lang="ts">
import { ScrollArea } from "@dicehub/kappa/components/scroll-area";

type DemoVariant =
  | "preview"
  | "usage"
  | "horizontal"
  | "both"
  | "nested"
  | "controls"
  | "no-overflow"
  | "rtl";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const events = [
  ["08:42", "Mesh uploaded", "geometry.step"],
  ["08:44", "Surface checks complete", "128 patches"],
  ["08:47", "Volume mesh started", "16 workers"],
  ["08:51", "Boundary layers complete", "12 layers"],
  ["08:54", "Quality report ready", "0 critical cells"],
  ["08:58", "Solver initialized", "steady state"],
  ["09:03", "Residual target reached", "1.8e-5"],
  ["09:05", "Result package created", "84 MB"],
] as const;

const cases = [
  "Baseline",
  "Low speed",
  "Cruise",
  "High speed",
  "Crosswind",
  "Yaw +5°",
  "Yaw -5°",
  "Validation",
];
const columns = ["Case", "Cells", "Iterations", "Residual", "Runtime", "Status"];
</script>

<template>
  <div class="scroll-area-demo" :data-scroll-area-demo="props.variant">
    <ScrollArea.Root
      v-if="props.variant === 'preview' || props.variant === 'usage'"
      class="scroll-area-demo__activity"
    >
      <ScrollArea.Viewport tabindex="0" role="region" aria-label="Recent activity">
        <ScrollArea.Content>
          <ol class="scroll-area-demo__event-list">
            <li v-for="event in events" :key="event[0]">
              <time>{{ event[0] }}</time>
              <span><strong>{{ event[1] }}</strong><small>{{ event[2] }}</small></span>
            </li>
          </ol>
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar><ScrollArea.Thumb /></ScrollArea.Scrollbar>
    </ScrollArea.Root>

    <ScrollArea.Root
      v-else-if="props.variant === 'horizontal' || props.variant === 'rtl'"
      class="scroll-area-demo__horizontal"
      :dir="props.variant === 'rtl' ? 'rtl' : 'ltr'"
    >
      <ScrollArea.Viewport tabindex="0" role="region" :aria-label="props.variant === 'rtl' ? 'Cases, right to left' : 'Cases'">
        <ScrollArea.Content class="scroll-area-demo__case-row">
          <article v-for="(name, index) in cases" :key="name">
            <span>CASE {{ String(index + 1).padStart(2, '0') }}</span>
            <strong>{{ name }}</strong>
            <small>{{ 1.8 + index * 0.35 }}M cells</small>
          </article>
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="horizontal"><ScrollArea.Thumb /></ScrollArea.Scrollbar>
    </ScrollArea.Root>

    <ScrollArea.Root v-else-if="props.variant === 'both'" class="scroll-area-demo__matrix">
      <ScrollArea.Viewport tabindex="0" role="region" aria-label="Case comparison">
        <ScrollArea.Content>
          <table>
            <thead><tr><th v-for="column in columns" :key="column">{{ column }}</th></tr></thead>
            <tbody>
              <tr v-for="(name, index) in cases" :key="name">
                <th>{{ name }}</th><td>{{ 1842000 + index * 174000 }}</td><td>{{ 420 + index * 38 }}</td><td>{{ (1.8 + index * 0.7).toFixed(1) }}e-5</td><td>{{ 28 + index * 7 }} min</td><td>Complete</td>
              </tr>
            </tbody>
          </table>
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar><ScrollArea.Thumb /></ScrollArea.Scrollbar>
      <ScrollArea.Scrollbar orientation="horizontal"><ScrollArea.Thumb /></ScrollArea.Scrollbar>
      <ScrollArea.Corner />
    </ScrollArea.Root>

    <ScrollArea.Root v-else-if="props.variant === 'nested'" class="scroll-area-demo__nested-outer">
      <ScrollArea.Viewport tabindex="0" role="region" aria-label="Project notes">
        <ScrollArea.Content>
          <h4>Project notes</h4>
          <p v-for="index in 3" :key="index">Iteration {{ index }} confirms stable convergence across the operating range.</p>
          <ScrollArea.Root class="scroll-area-demo__nested-inner">
            <ScrollArea.Viewport tabindex="0" role="region" aria-label="Referenced files">
              <ScrollArea.Content class="scroll-area-demo__file-row">
                <code v-for="name in ['mesh.case', 'solver.log', 'forces.csv', 'report.pdf', 'archive.zip']" :key="name">{{ name }}</code>
              </ScrollArea.Content>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar orientation="horizontal"><ScrollArea.Thumb /></ScrollArea.Scrollbar>
          </ScrollArea.Root>
          <p v-for="index in 3" :key="`tail-${index}`">The recorded values remain within the accepted validation limits.</p>
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar><ScrollArea.Thumb /></ScrollArea.Scrollbar>
    </ScrollArea.Root>

    <ScrollArea.Root v-else-if="props.variant === 'controls'" class="scroll-area-demo__controlled">
      <ScrollArea.Context v-slot="api">
        <div class="scroll-area-demo__controls">
          <button type="button" @click="api.scrollToEdge({ edge: 'top', behavior: 'smooth' })">First</button>
          <span>{{ api.isAtTop ? "At start" : api.isAtBottom ? "At end" : "Reading" }}</span>
          <button type="button" @click="api.scrollToEdge({ edge: 'bottom', behavior: 'smooth' })">Last</button>
        </div>
      </ScrollArea.Context>
      <ScrollArea.Viewport tabindex="0" role="region" aria-label="Controlled event log">
        <ScrollArea.Content>
          <ol class="scroll-area-demo__numbered-list"><li v-for="index in 24" :key="index">Log entry {{ String(index).padStart(2, "0") }}</li></ol>
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar><ScrollArea.Thumb /></ScrollArea.Scrollbar>
    </ScrollArea.Root>

    <ScrollArea.Root v-else class="scroll-area-demo__short">
      <ScrollArea.Viewport tabindex="0" role="region" aria-label="Short content">
        <ScrollArea.Content><p>No scrollbar is shown when the content fits.</p></ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar><ScrollArea.Thumb /></ScrollArea.Scrollbar>
    </ScrollArea.Root>
  </div>
</template>

<style>
.scroll-area-demo { display: grid; inline-size: 100%; min-inline-size: 0; min-block-size: 14rem; place-items: center; color: var(--kappa-default, #17191f); font-family: var(--kappa-font-sans, inherit); }
.scroll-area-demo .kappa-scroll-area { border: 1px solid var(--kappa-line, #dfe3e8); border-radius: 0.5rem; background: var(--kappa-control, #fff); }
.scroll-area-demo__activity { inline-size: min(100%, 29rem); block-size: 16rem; }
.scroll-area-demo__event-list { display: grid; margin: 0; padding: 0.5rem 1rem; list-style: none; }
.scroll-area-demo__event-list li { display: grid; grid-template-columns: 3.5rem 1fr; gap: 0.75rem; padding: 0.75rem 0; border-block-end: 1px solid var(--kappa-line, #dfe3e8); }
.scroll-area-demo__event-list li:last-child { border: 0; }
.scroll-area-demo__event-list time { color: var(--kappa-subtle, #6c7480); font: 600 0.7rem/1.4 var(--kappa-font-mono, monospace); }
.scroll-area-demo__event-list span { display: grid; gap: 0.15rem; }
.scroll-area-demo__event-list strong { font-size: 0.8125rem; }
.scroll-area-demo__event-list small { color: var(--kappa-subtle, #6c7480); font-size: 0.75rem; }
.scroll-area-demo__horizontal { inline-size: min(100%, 40rem); block-size: 11rem; }
.scroll-area-demo__case-row { display: flex; gap: 0.75rem; inline-size: max-content; padding: 1rem 1rem 1.5rem; }
.scroll-area-demo__case-row article { display: grid; flex: none; gap: 0.4rem; inline-size: 10.5rem; padding: 1rem; border: 1px solid var(--kappa-line, #dfe3e8); border-radius: 0.375rem; background: var(--kappa-surface, #f7f8fa); }
.scroll-area-demo__case-row span { color: var(--kappa-accent-text, #3342b5); font: 700 0.625rem/1.2 var(--kappa-font-mono, monospace); letter-spacing: 0.08em; }
.scroll-area-demo__case-row strong { font-size: 0.875rem; }
.scroll-area-demo__case-row small { color: var(--kappa-subtle, #6c7480); }
.scroll-area-demo__matrix { inline-size: min(100%, 42rem); block-size: 15rem; }
.scroll-area-demo__matrix table { inline-size: 48rem; border-collapse: collapse; font-size: 0.75rem; text-align: start; }
.scroll-area-demo__matrix :is(th, td) { padding: 0.7rem 0.85rem; border-block-end: 1px solid var(--kappa-line, #dfe3e8); white-space: nowrap; }
.scroll-area-demo__matrix thead th { position: sticky; inset-block-start: 0; z-index: 1; background: var(--kappa-surface, #f7f8fa); color: var(--kappa-subtle, #6c7480); font-size: 0.6875rem; text-transform: uppercase; }
.scroll-area-demo__matrix tbody th { text-align: start; }
.scroll-area-demo__nested-outer { inline-size: min(100%, 34rem); block-size: 18rem; }
.scroll-area-demo__nested-outer > [data-slot="scroll-area-viewport"] > [data-slot="scroll-area-content"] { padding: 1rem; }
.scroll-area-demo__nested-outer h4 { margin: 0 0 0.75rem; font-size: 0.875rem; }
.scroll-area-demo__nested-outer p { margin: 0 0 0.75rem; color: var(--kappa-subtle, #6c7480); font-size: 0.8125rem; line-height: 1.55; }
.scroll-area-demo__nested-inner { block-size: 5rem; margin-block: 1rem; }
.scroll-area-demo__file-row { display: flex; gap: 0.5rem; inline-size: max-content; padding: 0.75rem 0.75rem 1.25rem; }
.scroll-area-demo__file-row code { padding: 0.5rem 0.65rem; border: 1px solid var(--kappa-line, #dfe3e8); border-radius: 0.25rem; white-space: nowrap; }
.scroll-area-demo__controlled { display: grid; grid-template-rows: auto 1fr; inline-size: min(100%, 24rem); block-size: 18rem; }
.scroll-area-demo__controls { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 0.75rem; padding: 0.625rem; border-block-end: 1px solid var(--kappa-line, #dfe3e8); }
.scroll-area-demo__controls span { color: var(--kappa-subtle, #6c7480); font-size: 0.7rem; text-align: center; text-transform: uppercase; letter-spacing: 0.06em; }
.scroll-area-demo__controls button { min-block-size: 2rem; padding-inline: 0.75rem; border: 1px solid var(--kappa-line-strong, #c7cdd6); border-radius: 0.25rem; background: var(--kappa-control, #fff); color: inherit; font: inherit; font-size: 0.75rem; cursor: pointer; }
.scroll-area-demo__controls button:focus-visible { outline: 2px solid var(--kappa-focus, #4c63ff); outline-offset: 2px; }
.scroll-area-demo__numbered-list { display: grid; margin: 0; padding: 0.5rem 1rem; list-style: none; counter-reset: entry; }
.scroll-area-demo__numbered-list li { padding: 0.65rem 0; border-block-end: 1px solid var(--kappa-line, #dfe3e8); color: var(--kappa-subtle, #6c7480); font: 0.75rem/1.3 var(--kappa-font-mono, monospace); }
.scroll-area-demo__short { inline-size: min(100%, 28rem); block-size: 8rem; }
.scroll-area-demo__short p { margin: 0; padding: 1rem; color: var(--kappa-subtle, #6c7480); font-size: 0.8125rem; }
</style>
