<script setup lang="ts">
import { computed, ref } from "vue";
import { Button } from "@dicehub/kappa/components/button";
import { Input } from "@dicehub/kappa/components/input";
import { Label } from "@dicehub/kappa/components/label";
import type {
  FloatingPanelPoint,
  FloatingPanelSize,
  FloatingPanelStage,
} from "@dicehub/kappa/components/floating-panel";
import FloatingPanelDemoWindow from "./FloatingPanelDemoWindow.vue";

type DemoVariant =
  | "preview"
  | "transform"
  | "controlled"
  | "stages"
  | "multiple"
  | "bounded"
  | "fixed";

const props = withDefaults(defineProps<{ standalone?: boolean; variant?: DemoVariant }>(), {
  standalone: false,
  variant: "preview",
});

const workspace = ref<HTMLElement>();
const getBoundaryEl = () => workspace.value ?? null;
const controlledPosition = ref<FloatingPanelPoint>({ x: 56, y: 42 });
const controlledSize = ref<FloatingPanelSize>({ width: 328, height: 244 });
const lastStage = ref<FloatingPanelStage>("default");
const offsetX = ref("0");
const offsetY = ref("0");
const offsetZ = ref("0");

const geometry = computed(
  () =>
    `${Math.round(controlledPosition.value.x)}, ${Math.round(controlledPosition.value.y)} · `
    + `${Math.round(controlledSize.value.width)} × ${Math.round(controlledSize.value.height)}`,
);
</script>

<template>
  <div
    class="floating-panel-demo"
    :data-floating-panel-demo="props.variant"
    :data-standalone="props.standalone || undefined"
  >
    <div
      ref="workspace"
      class="floating-panel-demo__workspace"
      :class="{ 'floating-panel-demo__workspace--standalone': props.standalone }"
    >
      <div class="floating-panel-demo__canvas" aria-hidden="true">
        <span class="floating-panel-demo__axis floating-panel-demo__axis--x" />
        <span class="floating-panel-demo__axis floating-panel-demo__axis--y" />
        <span class="floating-panel-demo__object" />
      </div>

      <FloatingPanelDemoWindow
        v-if="props.variant === 'preview'"
        title="Run monitor"
        :default-position="{ x: 42, y: 42 }"
        :default-size="{ width: 340, height: 250 }"
        :get-boundary-el="getBoundaryEl"
      >
        <div class="floating-panel-demo__summary">
          <div><span>Status</span><strong class="floating-panel-demo__status">Running</strong></div>
          <div><span>Iteration</span><strong>1,248</strong></div>
          <div><span>Elapsed</span><strong>08:42</strong></div>
        </div>
        <div class="floating-panel-demo__progress"><span /></div>
        <p class="floating-panel-demo__muted">Residuals are stable. The next write occurs at iteration 1,300.</p>
      </FloatingPanelDemoWindow>

      <FloatingPanelDemoWindow
        v-else-if="props.variant === 'transform'"
        title="Transform geometry"
        :default-position="{ x: 54, y: 28 }"
        :default-size="{ width: 360, height: 306 }"
        :get-boundary-el="getBoundaryEl"
      >
        <div class="floating-panel-demo__fields">
          <div>
            <Label for="floating-panel-offset-x">Offset X</Label>
            <Input id="floating-panel-offset-x" v-model="offsetX" size="sm" inputmode="decimal" />
          </div>
          <div>
            <Label for="floating-panel-offset-y">Offset Y</Label>
            <Input id="floating-panel-offset-y" v-model="offsetY" size="sm" inputmode="decimal" />
          </div>
          <div>
            <Label for="floating-panel-offset-z">Offset Z</Label>
            <Input id="floating-panel-offset-z" v-model="offsetZ" size="sm" inputmode="decimal" />
          </div>
        </div>
        <p class="floating-panel-demo__muted">Values use the active project length unit.</p>
        <template #footer>
          <Button size="sm" variant="outline">Reset</Button>
          <Button size="sm" variant="primary">Apply transform</Button>
        </template>
      </FloatingPanelDemoWindow>

      <template v-else-if="props.variant === 'controlled'">
        <div class="floating-panel-demo__toolbar">
          <output aria-live="polite">{{ geometry }}</output>
          <Button size="xs" variant="outline" @click="controlledPosition = { x: 24, y: 24 }">
            Reset position
          </Button>
          <Button size="xs" variant="outline" @click="controlledSize = { width: 400, height: 270 }">
            Large
          </Button>
        </div>
        <FloatingPanelDemoWindow
          v-model:position="controlledPosition"
          v-model:size="controlledSize"
          title="Controlled geometry"
          :get-boundary-el="getBoundaryEl"
          :show-trigger="false"
        >
          <p>Drag or resize this panel. The toolbar reflects its controlled geometry.</p>
        </FloatingPanelDemoWindow>
      </template>

      <FloatingPanelDemoWindow
        v-else-if="props.variant === 'stages'"
        title="Inspector"
        :default-position="{ x: 52, y: 36 }"
        :default-size="{ width: 330, height: 246 }"
        :get-boundary-el="getBoundaryEl"
        @stage-change="lastStage = $event.stage"
      >
        <div class="floating-panel-demo__property-list">
          <span>Stage</span><strong>{{ lastStage }}</strong>
          <span>Selection</span><strong>Cooling inlet</strong>
          <span>Type</span><strong>Boundary</strong>
        </div>
      </FloatingPanelDemoWindow>

      <template v-else-if="props.variant === 'multiple'">
        <FloatingPanelDemoWindow
          title="Variables"
          :default-position="{ x: 28, y: 34 }"
          :default-size="{ width: 286, height: 220 }"
          :get-boundary-el="getBoundaryEl"
          :show-trigger="false"
        >
          <div class="floating-panel-demo__property-list">
            <span>Velocity</span><strong>42 m/s</strong>
            <span>Pressure</span><strong>101 kPa</strong>
          </div>
        </FloatingPanelDemoWindow>
        <FloatingPanelDemoWindow
          title="Probe chart"
          :default-position="{ x: 236, y: 94 }"
          :default-size="{ width: 310, height: 230 }"
          :get-boundary-el="getBoundaryEl"
          :show-trigger="false"
        >
          <div class="floating-panel-demo__chart" aria-label="Synthetic probe chart">
            <span v-for="height in [34, 58, 46, 76, 62, 88, 70, 92]" :key="height" :style="{ height: `${height}%` }" />
          </div>
        </FloatingPanelDemoWindow>
      </template>

      <FloatingPanelDemoWindow
        v-else-if="props.variant === 'bounded'"
        title="Bounded tool"
        :default-position="{ x: 24, y: 24 }"
        :default-size="{ width: 300, height: 214 }"
        :get-boundary-el="getBoundaryEl"
      >
        <p>Drag the title bar. The panel remains reachable inside this workspace.</p>
      </FloatingPanelDemoWindow>

      <FloatingPanelDemoWindow
        v-else
        title="Read-only summary"
        :default-position="{ x: 54, y: 46 }"
        :default-size="{ width: 320, height: 220 }"
        :draggable="false"
        :resizable="false"
        :get-boundary-el="getBoundaryEl"
      >
        <p>This panel keeps normal focus and close behavior without drag or resize gestures.</p>
        <Button size="sm" variant="outline">View details</Button>
      </FloatingPanelDemoWindow>
    </div>
  </div>
</template>

<style>
.floating-panel-demo {
  inline-size: 100%;
  min-inline-size: 0;
  color: var(--kappa-default);
  font-family: var(--kappa-font-sans);
}

.floating-panel-demo__workspace {
  position: relative;
  inline-size: min(100%, 48rem);
  block-size: 24rem;
  overflow: hidden;
  border: 1px solid var(--kappa-line);
  border-radius: var(--kappa-radius-lg);
  background:
    linear-gradient(var(--kappa-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--kappa-line) 1px, transparent 1px),
    var(--kappa-tint);
  background-size: 2rem 2rem;
  isolation: isolate;
}

.floating-panel-demo__workspace.floating-panel-demo__workspace--standalone {
  inline-size: 100%;
  block-size: 100dvh;
  border: 0;
  border-radius: 0;
}

.floating-panel-demo__positioner {
  --kappa-floating-panel-z-index: 10;
}

.floating-panel-demo__canvas {
  position: absolute;
  inset: 0;
  opacity: 0.54;
}

.floating-panel-demo__axis {
  position: absolute;
  background: var(--kappa-line-strong);
}

.floating-panel-demo__axis--x { inset: 52% 8% auto; block-size: 1px; }
.floating-panel-demo__axis--y { inset: 10% auto 10% 54%; inline-size: 1px; }

.floating-panel-demo__object {
  position: absolute;
  inset: 34% auto auto 44%;
  inline-size: 6.5rem;
  aspect-ratio: 1;
  border: 1px solid var(--kappa-line-strong);
  transform: rotate(28deg) skew(-8deg);
}

.floating-panel-demo__open {
  position: relative;
  z-index: 1;
  margin: 0.75rem;
  padding: 0.35rem 0.625rem;
  border: 1px solid var(--kappa-line-strong);
  border-radius: var(--kappa-radius-md);
  background: var(--kappa-base);
  color: var(--kappa-default);
  cursor: pointer;
  font: inherit;
  font-size: 0.75rem;
  font-weight: 600;
}

.floating-panel-demo__open:hover { border-color: var(--kappa-focus); }
.floating-panel-demo__open:focus-visible { outline: 2px solid var(--kappa-focus); outline-offset: 2px; }

.floating-panel-demo__summary,
.floating-panel-demo__property-list {
  display: grid;
  gap: 0.625rem;
}

.floating-panel-demo__summary > div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.floating-panel-demo__summary span,
.floating-panel-demo__property-list span,
.floating-panel-demo__muted { color: var(--kappa-subtle); }

.floating-panel-demo__status { color: var(--kappa-status-success-text); }

.floating-panel-demo__progress {
  block-size: 0.25rem;
  margin-block: 1rem 0.75rem;
  overflow: hidden;
  border-radius: 999px;
  background: var(--kappa-tint);
}

.floating-panel-demo__progress span { display: block; inline-size: 68%; block-size: 100%; background: var(--kappa-accent-solid); }
.floating-panel-demo__muted { margin: 0; font-size: 0.75rem; line-height: 1.15rem; }

.floating-panel-demo__fields { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.625rem; }
.floating-panel-demo__fields > div { display: grid; gap: 0.25rem; }

.floating-panel-demo__footer {
  display: flex;
  flex: none;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 0.625rem 0.75rem;
  border-block-start: 1px solid var(--kappa-line);
  background: var(--kappa-base);
}

.floating-panel-demo__body--with-footer {
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
}

.floating-panel-demo__body--with-footer .floating-panel-demo__body-content {
  min-block-size: 0;
  flex: 1;
  padding: 0.875rem;
  overflow: auto;
}

.floating-panel-demo__toolbar {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.625rem;
}

.floating-panel-demo__toolbar output { margin-inline-end: auto; padding: 0.2rem 0.4rem; background: var(--kappa-base); color: var(--kappa-subtle); font-size: 0.6875rem; }

.floating-panel-demo__property-list { grid-template-columns: minmax(5rem, auto) 1fr; }
.floating-panel-demo__property-list strong { font-weight: 600; }

.floating-panel-demo__chart { display: flex; block-size: 7rem; align-items: end; gap: 0.35rem; padding-block-start: 0.5rem; }
.floating-panel-demo__chart span { min-inline-size: 0; flex: 1; border-radius: 2px 2px 0 0; background: var(--kappa-accent-solid); opacity: 0.76; }

@media (max-width: 34rem) {
  .floating-panel-demo__workspace { block-size: 22rem; }
  .floating-panel-demo__fields { grid-template-columns: 1fr; }
  .floating-panel-demo__toolbar { align-items: flex-start; flex-wrap: wrap; }
  .floating-panel-demo__toolbar output { inline-size: 100%; }
}
</style>
