<script setup lang="ts">
import { Check, ChevronDown, SlidersHorizontal } from "@lucide/vue";
import { onBeforeUnmount, ref } from "vue";
import { Button } from "@dicehub/kappa/components/button";
import { Popover, type PopoverPositioningOptions } from "@dicehub/kappa/components/popover";

type DemoVariant =
  | "preview"
  | "usage"
  | "basic"
  | "placement"
  | "form"
  | "controlled"
  | "anchor"
  | "hover"
  | "states"
  | "right-to-left";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const controlledOpen = ref(false);
const hoverOpen = ref(false);
const runLabel = ref("PIMPLE baseline 07");
let hoverTimer: number | undefined;

const clearHoverTimer = () => {
  if (hoverTimer === undefined) return;
  window.clearTimeout(hoverTimer);
  hoverTimer = undefined;
};

const scheduleHoverOpen = () => {
  clearHoverTimer();
  hoverTimer = window.setTimeout(() => {
    hoverOpen.value = true;
  }, 200);
};

const scheduleHoverClose = () => {
  clearHoverTimer();
  hoverTimer = window.setTimeout(() => {
    hoverOpen.value = false;
  }, 150);
};

const keepHoverOpen = () => {
  clearHoverTimer();
  hoverOpen.value = true;
};

onBeforeUnmount(clearHoverTimer);

const placementOptions = [
  { label: "Top", placement: "top" },
  { label: "Bottom", placement: "bottom" },
  { label: "Left", placement: "left" },
  { label: "Right", placement: "right" },
] as const satisfies ReadonlyArray<{
  label: string;
  placement: PopoverPositioningOptions["placement"];
}>;
</script>

<template>
  <div class="popover-demo" :data-popover-demo="props.variant">
    <Popover.Root v-if="props.variant === 'preview'" id="popover-demo-preview">
      <Popover.Trigger as-child>
        <Button :icon="SlidersHorizontal" variant="outline">Run filters</Button>
      </Popover.Trigger>
      <Popover.Content data-popover-demo-surface="preview">
        <Popover.Title>Run filters</Popover.Title>
        <Popover.Description>Choose which result sets stay in the report.</Popover.Description>
        <div class="popover-demo__summary">
          <span class="popover-demo__summary-mark" aria-hidden="true"><Check :size="14" /></span>
          <span>Residuals below 1e-5</span>
        </div>
        <Popover.Close as-child label="Apply filters"><Button variant="primary">Apply filters</Button></Popover.Close>
      </Popover.Content>
    </Popover.Root>

    <Popover.Root v-else-if="props.variant === 'usage'" id="popover-demo-usage">
      <Popover.Trigger as-child><Button variant="outline">Open popover</Button></Popover.Trigger>
      <Popover.Content data-popover-demo-surface="usage">
        <Popover.Title>Simulation summary</Popover.Title>
        <Popover.Description>Run 4189 completed in 02:14:38.</Popover.Description>
        <p class="popover-demo__copy">Pressure residuals stayed below the configured acceptance limit.</p>
      </Popover.Content>
    </Popover.Root>

    <Popover.Root v-else-if="props.variant === 'basic'" id="popover-demo-basic">
      <Popover.Trigger as-child><Button>Inspect run</Button></Popover.Trigger>
      <Popover.Content data-popover-demo-surface="basic">
        <Popover.Title>Run 4189</Popover.Title>
        <dl class="popover-demo__metrics">
          <div><dt>Iterations</dt><dd>1,240</dd></div>
          <div><dt>Residual</dt><dd>8.4e-6</dd></div>
        </dl>
      </Popover.Content>
    </Popover.Root>

    <div v-else-if="props.variant === 'placement'" class="popover-demo__placement">
      <Popover.Root
        v-for="option in placementOptions"
        :key="option.placement"
        :id="`popover-demo-placement-${option.placement}`"
        :positioning="{ placement: option.placement, gutter: 10 }"
      >
        <Popover.Trigger as-child><Button size="sm" variant="outline">{{ option.label }}</Button></Popover.Trigger>
        <Popover.Content :data-popover-demo-surface="`placement-${option.placement}`">
          <Popover.Title>{{ option.label }} placement</Popover.Title>
          <Popover.Description>Ark UI flips this surface when the viewport is tight.</Popover.Description>
        </Popover.Content>
      </Popover.Root>
    </div>

    <Popover.Root v-else-if="props.variant === 'form'" id="popover-demo-form">
      <Popover.Trigger as-child><Button :icon="ChevronDown" variant="outline">Edit run details</Button></Popover.Trigger>
      <Popover.Content data-popover-demo-surface="form">
        <Popover.Title>Edit run details</Popover.Title>
        <Popover.Description>Change the label used in reports and archives.</Popover.Description>
        <label class="popover-demo__field">
          <span>Run label</span>
          <input v-model="runLabel" aria-label="Run label" />
        </label>
        <div class="popover-demo__actions">
          <Popover.Close as-child label="Cancel"><Button size="sm" variant="secondary">Cancel</Button></Popover.Close>
          <Popover.Close as-child label="Save changes"><Button size="sm" variant="primary">Save changes</Button></Popover.Close>
        </div>
      </Popover.Content>
    </Popover.Root>

    <div v-else-if="props.variant === 'controlled'" class="popover-demo__controlled">
      <Button variant="outline" @click="controlledOpen = true">Open controlled popover</Button>
      <output aria-live="polite">State: {{ controlledOpen ? "open" : "closed" }}</output>
      <Popover.Root id="popover-demo-controlled" v-model:open="controlledOpen">
        <Popover.Content data-popover-demo-surface="controlled">
          <Popover.Title>Controlled state</Popover.Title>
          <Popover.Description>The parent owns the open value.</Popover.Description>
          <Popover.Close as-child label="Done"><Button variant="primary">Done</Button></Popover.Close>
        </Popover.Content>
      </Popover.Root>
    </div>

    <Popover.Root v-else-if="props.variant === 'anchor'" id="popover-demo-anchor">
      <Popover.Anchor as-child>
        <span class="popover-demo__anchor">Report context · Run 4189</span>
      </Popover.Anchor>
      <Popover.Trigger as-child>
        <Button :icon="SlidersHorizontal" shape="square" variant="outline" aria-label="Open anchored details" />
      </Popover.Trigger>
      <Popover.Content data-popover-demo-surface="anchor">
        <Popover.Title>Anchored details</Popover.Title>
        <Popover.Description>This surface is positioned against the custom anchor for the report context.</Popover.Description>
      </Popover.Content>
    </Popover.Root>

    <Popover.Root
      v-else-if="props.variant === 'hover'"
      id="popover-demo-hover"
      v-model:open="hoverOpen"
      :auto-focus="false"
    >
      <Popover.Trigger as-child>
        <Button
          variant="secondary"
          @mouseenter="scheduleHoverOpen"
          @mouseleave="scheduleHoverClose"
        >
          Hover or focus
        </Button>
      </Popover.Trigger>
      <Popover.Content
        data-popover-demo-surface="hover"
        @focusin="keepHoverOpen"
        @focusout="scheduleHoverClose"
        @mouseenter="keepHoverOpen"
        @mouseleave="scheduleHoverClose"
      >
        <Popover.Title>Hover-triggered content</Popover.Title>
        <Popover.Description>
          The surface stays open while you move from the trigger into its interactive content.
        </Popover.Description>
        <Popover.Close as-child label="Got it"><Button size="sm" variant="secondary">Got it</Button></Popover.Close>
      </Popover.Content>
    </Popover.Root>

    <div v-else-if="props.variant === 'states'" class="popover-demo__states">
      <Popover.Root id="popover-demo-disabled">
        <Popover.Trigger as-child><Button disabled>Unavailable action</Button></Popover.Trigger>
        <Popover.Content data-popover-demo-surface="disabled">
          <Popover.Title>Unavailable action</Popover.Title>
          <Popover.Description>Validation must pass before this action is enabled.</Popover.Description>
        </Popover.Content>
      </Popover.Root>
      <Popover.Root id="popover-demo-modal" :modal="true">
        <Popover.Trigger as-child><Button variant="outline">Modal popover</Button></Popover.Trigger>
        <Popover.Content data-popover-demo-surface="modal">
          <Popover.Title>Modal popover</Popover.Title>
          <Popover.Description>Outside interaction is blocked while this surface is open.</Popover.Description>
          <Popover.Close as-child label="Close"><Button variant="primary">Close</Button></Popover.Close>
        </Popover.Content>
      </Popover.Root>
    </div>

    <Popover.Root v-else id="popover-demo-rtl" dir="rtl">
      <Popover.Trigger as-child><Button variant="outline">فتح التفاصيل</Button></Popover.Trigger>
      <Popover.Content data-popover-demo-surface="right-to-left">
        <Popover.Title>تفاصيل المحاكاة</Popover.Title>
        <Popover.Description>النتائج جاهزة للمراجعة.</Popover.Description>
        <Popover.Close as-child label="تم"><Button variant="primary">تم</Button></Popover.Close>
      </Popover.Content>
    </Popover.Root>
  </div>
</template>

<style scoped>
.popover-demo {
  display: flex;
  inline-size: 100%;
  min-inline-size: 0;
  min-block-size: 8rem;
  align-items: center;
  justify-content: center;
  color: var(--docs-default);
  font-family: var(--docs-font-sans);
}

.popover-demo__placement,
.popover-demo__states {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.popover-demo__controlled {
  display: grid;
  justify-items: center;
  gap: 0.625rem;
}

.popover-demo__controlled output {
  color: var(--docs-subtle);
  font-family: var(--docs-font-mono);
  font-size: 0.75rem;
}

.popover-demo__copy {
  max-inline-size: 24rem;
  margin: 0;
  color: var(--docs-subtle);
}

.popover-demo__summary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-block: 0.5rem;
  color: var(--docs-default);
  font-size: 0.75rem;
}

.popover-demo__summary-mark {
  display: inline-flex;
  inline-size: 1.375rem;
  block-size: 1.375rem;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--docs-brand-soft);
  color: var(--docs-brand);
}

.popover-demo__metrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  margin: 0;
}

.popover-demo__metrics div {
  display: grid;
  gap: 0.125rem;
}

.popover-demo__metrics dt {
  color: var(--docs-subtle);
  font-size: 0.6875rem;
}

.popover-demo__metrics dd {
  margin: 0;
  font-family: var(--docs-font-mono);
  font-size: 0.8125rem;
  font-weight: 650;
}

.popover-demo__field {
  display: grid;
  gap: 0.375rem;
  color: var(--docs-default);
  font-size: 0.75rem;
  font-weight: 600;
}

.popover-demo__field input {
  min-block-size: 2.125rem;
  inline-size: min(100%, 18rem);
  padding-inline: 0.625rem;
  border: 1px solid var(--docs-border);
  border-radius: 0.4375rem;
  background: var(--docs-control);
  color: var(--docs-default);
  font: inherit;
}

.popover-demo__field input:focus-visible {
  border-color: var(--docs-brand);
  outline: 2px solid var(--docs-brand-soft);
  outline-offset: 1px;
}

.popover-demo__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.popover-demo__anchor {
  display: inline-flex;
  align-items: center;
  margin-inline-end: 0.5rem;
  padding: 0.375rem 0.625rem;
  border: 1px dashed var(--docs-border);
  border-radius: 0.375rem;
  color: var(--docs-subtle);
  font-family: var(--docs-font-mono);
  font-size: 0.6875rem;
}

@media (max-width: 36rem) {
  .popover-demo__placement {
    flex-direction: column;
  }
}
</style>
