<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@dicehub/kappa/components/button";
import { Combobox } from "@dicehub/kappa/components/combobox";
import { Dialog, type DialogSize } from "@dicehub/kappa/components/dialog";

type DemoVariant =
  | "preview"
  | "basic"
  | "alert-dialog"
  | "confirmation"
  | "controlled"
  | "sizes"
  | "custom-close-button"
  | "no-close-button"
  | "native-form-control"
  | "combobox"
  | "sticky-footer"
  | "scrollable-content"
  | "nested-dialog"
  | "right-to-left";

type Region = { label: string; value: string };

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const dialogSizes: DialogSize[] = ["sm", "base", "lg", "xl"];
const regions: Region[] = [
  { label: "EU Central · Frankfurt", value: "eu-central" },
  { label: "EU West · Dublin", value: "eu-west" },
  { label: "US East · Virginia", value: "us-east" },
  { label: "AP Northeast · Tokyo", value: "ap-northeast" },
];
const notes = [
  "The transient solver reached the configured end time without a fatal error.",
  "Pressure residuals stayed below 1e-5 for the final 240 iterations.",
  "The maximum Courant number remained within the accepted operating range.",
  "Three surface reports and the volume field archive are ready for review.",
  "Restart data is available at the latest write interval.",
];

const runName = ref("PIMPLE baseline 07");
const controlledOpen = ref(false);
const selectedRegion = ref("eu-central");
const comboboxValue = ref(["eu-central"]);
</script>

<template>
  <div class="dialog-demo" :data-dialog-demo="props.variant">
    <Dialog.Root v-if="props.variant === 'preview'">
      <Dialog.Trigger as-child><Button variant="outline">Edit run details</Button></Dialog.Trigger>
      <Dialog.Content data-dialog-demo-surface="preview">
        <Dialog.Header>
          <Dialog.Title>Edit run details</Dialog.Title>
          <Dialog.Description>Change the label used in reports and result archives.</Dialog.Description>
        </Dialog.Header>
        <label class="dialog-demo__field">
          <span>Run label</span>
          <input v-model="runName" data-dialog-initial-focus />
        </label>
        <Dialog.Footer>
          <Dialog.Close as-child><Button variant="secondary">Cancel</Button></Dialog.Close>
          <Dialog.Close as-child><Button variant="primary">Save changes</Button></Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>

    <Dialog.Root v-else-if="props.variant === 'basic'">
      <Dialog.Trigger as-child><Button>Open dialog</Button></Dialog.Trigger>
      <Dialog.Content data-dialog-demo-surface="basic">
        <Dialog.Header>
          <Dialog.Title>Simulation summary</Dialog.Title>
          <Dialog.Description>Run 4189 completed in 02:14:38.</Dialog.Description>
        </Dialog.Header>
        <dl class="dialog-demo__metrics">
          <div><dt>Iterations</dt><dd>1,240</dd></div>
          <div><dt>Residual</dt><dd>8.4e-6</dd></div>
          <div><dt>Courant max</dt><dd>0.82</dd></div>
        </dl>
      </Dialog.Content>
    </Dialog.Root>

    <Dialog.Root v-else-if="props.variant === 'alert-dialog'" role="alertdialog">
      <Dialog.Trigger as-child><Button variant="destructive">Delete run</Button></Dialog.Trigger>
      <Dialog.Content :show-close-button="false" data-dialog-demo-surface="alert-dialog">
        <Dialog.Header>
          <span class="dialog-demo__danger-mark" aria-hidden="true">!</span>
          <Dialog.Title>Delete run 4189?</Dialog.Title>
          <Dialog.Description>This removes all fields, reports, and restart data. You cannot undo this action.</Dialog.Description>
        </Dialog.Header>
        <Dialog.Footer>
          <Dialog.Close as-child><Button variant="secondary">Keep run</Button></Dialog.Close>
          <Dialog.Close as-child><Button variant="destructive">Delete permanently</Button></Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>

    <Dialog.Root v-else-if="props.variant === 'confirmation'" disable-pointer-dismissal>
      <Dialog.Trigger as-child><Button variant="warning">Stop solver</Button></Dialog.Trigger>
      <Dialog.Content :show-close-button="false" data-dialog-demo-surface="confirmation">
        <Dialog.Header>
          <Dialog.Title>Stop the active solver?</Dialog.Title>
          <Dialog.Description>The current write interval will finish before the worker stops.</Dialog.Description>
        </Dialog.Header>
        <Dialog.Footer>
          <Dialog.Close as-child><Button variant="secondary">Continue run</Button></Dialog.Close>
          <Dialog.Close as-child><Button variant="warning">Stop solver</Button></Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>

    <div v-else-if="props.variant === 'controlled'" class="dialog-demo__controlled">
      <Button variant="outline" @click="controlledOpen = true">Open controlled dialog</Button>
      <output aria-live="polite">State: {{ controlledOpen ? "open" : "closed" }}</output>
      <Dialog.Root v-model:open="controlledOpen">
        <Dialog.Content data-dialog-demo-surface="controlled">
          <Dialog.Header>
            <Dialog.Title>Controlled state</Dialog.Title>
            <Dialog.Description>The parent owns this dialog's open value.</Dialog.Description>
          </Dialog.Header>
          <Dialog.Footer>
            <Button variant="primary" @click="controlledOpen = false">Done</Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    </div>

    <div v-else-if="props.variant === 'sizes'" class="dialog-demo__sizes">
      <Dialog.Root v-for="size in dialogSizes" :key="size">
        <Dialog.Trigger as-child><Button variant="outline" size="sm">{{ size }}</Button></Dialog.Trigger>
        <Dialog.Content :size="size" :data-dialog-demo-surface="`size-${size}`">
          <Dialog.Header>
            <Dialog.Title>{{ size }} dialog</Dialog.Title>
            <Dialog.Description>Viewport-safe width with the {{ size }} size token.</Dialog.Description>
          </Dialog.Header>
        </Dialog.Content>
      </Dialog.Root>
    </div>

    <Dialog.Root v-else-if="props.variant === 'custom-close-button'">
      <Dialog.Trigger as-child><Button variant="outline">Open custom close</Button></Dialog.Trigger>
      <Dialog.Content data-dialog-demo-surface="custom-close-button">
        <template #close>
          <Dialog.Close as-child>
            <Button class="dialog-demo__custom-close" size="xs" variant="ghost">Dismiss</Button>
          </Dialog.Close>
        </template>
        <Dialog.Header>
          <Dialog.Title>Custom close control</Dialog.Title>
          <Dialog.Description>The close slot can use any accessible Kappa control.</Dialog.Description>
        </Dialog.Header>
      </Dialog.Content>
    </Dialog.Root>

    <Dialog.Root v-else-if="props.variant === 'no-close-button'">
      <Dialog.Trigger as-child><Button variant="outline">Open without corner close</Button></Dialog.Trigger>
      <Dialog.Content :show-close-button="false" data-dialog-demo-surface="no-close-button">
        <Dialog.Header>
          <Dialog.Title>Review required</Dialog.Title>
          <Dialog.Description>A clear action row replaces the corner close control.</Dialog.Description>
        </Dialog.Header>
        <Dialog.Footer>
          <Dialog.Close as-child><Button variant="primary">Acknowledge</Button></Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>

    <Dialog.Root v-else-if="props.variant === 'native-form-control'">
      <Dialog.Trigger as-child><Button>Configure resource</Button></Dialog.Trigger>
      <Dialog.Content data-dialog-demo-surface="native-form-control">
        <Dialog.Header>
          <Dialog.Title>Configure resource</Dialog.Title>
          <Dialog.Description>Choose the target region for the new worker.</Dialog.Description>
        </Dialog.Header>
        <label class="dialog-demo__field">
          <span>Region</span>
          <select v-model="selectedRegion">
            <option v-for="region in regions" :key="region.value" :value="region.value">{{ region.label }}</option>
          </select>
        </label>
        <Dialog.Footer>
          <Dialog.Close as-child><Button variant="secondary">Cancel</Button></Dialog.Close>
          <Dialog.Close as-child><Button variant="primary">Create worker</Button></Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>

    <Dialog.Root v-else-if="props.variant === 'combobox'">
      <Dialog.Trigger as-child><Button>Open searchable form</Button></Dialog.Trigger>
      <Dialog.Content size="lg" data-dialog-demo-surface="combobox">
        <Dialog.Header>
          <Dialog.Title>Move simulation</Dialog.Title>
          <Dialog.Description>Search for a destination cluster without leaving the dialog.</Dialog.Description>
        </Dialog.Header>
        <Combobox
          v-model="comboboxValue"
          :items="regions"
          label="Destination region"
          lazy-mount
          placeholder="Search regions"
          unmount-on-exit
        />
        <Dialog.Footer>
          <Dialog.Close as-child><Button variant="secondary">Cancel</Button></Dialog.Close>
          <Dialog.Close as-child><Button variant="primary">Move simulation</Button></Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>

    <Dialog.Root v-else-if="props.variant === 'sticky-footer'">
      <Dialog.Trigger as-child><Button variant="outline">Review report</Button></Dialog.Trigger>
      <Dialog.Content
        class="dialog-demo__tall"
        size="lg"
        data-dialog-demo-surface="sticky-footer"
      >
        <Dialog.Header>
          <Dialog.Title>Convergence report</Dialog.Title>
          <Dialog.Description>The header and actions stay visible while the report scrolls.</Dialog.Description>
        </Dialog.Header>
        <div class="dialog-demo__scroll-body" tabindex="0">
          <p v-for="(note, index) in [...notes, ...notes]" :key="index"><strong>{{ String(index + 1).padStart(2, "0") }}</strong>{{ note }}</p>
        </div>
        <Dialog.Footer>
          <Dialog.Close as-child><Button variant="secondary">Close</Button></Dialog.Close>
          <Button variant="primary">Export report</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>

    <Dialog.Root v-else-if="props.variant === 'scrollable-content'">
      <Dialog.Trigger as-child><Button variant="outline">Read solver notes</Button></Dialog.Trigger>
      <Dialog.Content size="base" data-dialog-demo-surface="scrollable-content">
        <Dialog.Header><Dialog.Title>Solver notes</Dialog.Title></Dialog.Header>
        <div class="dialog-demo__scroll-body dialog-demo__scroll-body--compact" tabindex="0">
          <p v-for="(note, index) in [...notes, ...notes]" :key="index">{{ note }}</p>
        </div>
      </Dialog.Content>
    </Dialog.Root>

    <Dialog.Root v-else-if="props.variant === 'nested-dialog'">
      <Dialog.Trigger as-child><Button variant="outline">Open parent dialog</Button></Dialog.Trigger>
      <Dialog.Content data-dialog-demo-surface="nested-dialog">
        <Dialog.Header>
          <Dialog.Title>Run settings</Dialog.Title>
          <Dialog.Description>Nested dialogs keep independent focus and dismissal layers.</Dialog.Description>
        </Dialog.Header>
        <Dialog.Root>
          <Dialog.Trigger as-child><Button variant="outline">Edit advanced settings</Button></Dialog.Trigger>
          <Dialog.Content size="sm" data-dialog-demo-surface="nested-child">
            <Dialog.Header>
              <Dialog.Title>Advanced settings</Dialog.Title>
              <Dialog.Description>Pressure correction limit: 12 iterations.</Dialog.Description>
            </Dialog.Header>
            <Dialog.Footer><Dialog.Close as-child><Button variant="primary">Done</Button></Dialog.Close></Dialog.Footer>
          </Dialog.Content>
        </Dialog.Root>
      </Dialog.Content>
    </Dialog.Root>

    <Dialog.Root v-else>
      <Dialog.Trigger as-child><Button variant="outline">فتح الحوار</Button></Dialog.Trigger>
      <Dialog.Content dir="rtl" data-dialog-demo-surface="right-to-left">
        <Dialog.Header>
          <Dialog.Title>نتائج المحاكاة</Dialog.Title>
          <Dialog.Description>اكتملت المحاكاة والنتائج جاهزة للمراجعة.</Dialog.Description>
        </Dialog.Header>
        <Dialog.Footer><Dialog.Close as-child><Button variant="primary">تم</Button></Dialog.Close></Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  </div>
</template>

<style scoped>
.dialog-demo {
  display: flex;
  inline-size: 100%;
  min-inline-size: 0;
  min-block-size: 7rem;
  align-items: center;
  justify-content: center;
  color: var(--docs-default);
  font-family: var(--docs-font-sans);
}

.dialog-demo__controlled {
  display: grid;
  justify-items: center;
  gap: 0.625rem;
}

.dialog-demo__controlled output {
  color: var(--docs-subtle);
  font-family: var(--docs-font-mono);
  font-size: 0.75rem;
}

.dialog-demo__sizes {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}

.dialog-demo__field {
  display: grid;
  gap: 0.375rem;
  color: var(--docs-default);
  font-size: 0.75rem;
  font-weight: 600;
}

.dialog-demo__field input,
.dialog-demo__field select {
  min-block-size: 2rem;
  inline-size: 100%;
  padding-inline: 0.625rem;
  border: 1px solid var(--docs-border);
  border-radius: 0.4375rem;
  background: var(--docs-control);
  color: var(--docs-default);
  font: inherit;
  font-size: 0.8125rem;
}

.dialog-demo__field :is(input, select):focus-visible {
  border-color: var(--docs-brand);
  outline: 2px solid var(--docs-brand-soft);
  outline-offset: 1px;
}

.dialog-demo__metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin: 0;
  padding: 0.75rem;
  border: 1px solid var(--docs-border);
  border-radius: 0.5rem;
  background: var(--docs-tint);
}

.dialog-demo__metrics div {
  display: grid;
  gap: 0.125rem;
  text-align: center;
}

.dialog-demo__metrics dt {
  color: var(--docs-subtle);
  font-size: 0.6875rem;
}

.dialog-demo__metrics dd {
  margin: 0;
  font-family: var(--docs-font-mono);
  font-size: 0.8125rem;
  font-weight: 600;
}

.dialog-demo__danger-mark {
  display: inline-grid;
  inline-size: 1.75rem;
  block-size: 1.75rem;
  place-items: center;
  margin-block-end: 0.25rem;
  border-radius: 50%;
  background: var(--kappa-danger-tint);
  color: var(--kappa-danger-text);
  font-weight: 750;
}

.dialog-demo__custom-close {
  position: absolute;
  inset-block-start: 0.75rem;
  inset-inline-end: 0.75rem;
}

:global(.dialog-demo__tall) {
  block-size: min(30rem, calc(100dvb - 2rem));
}

.dialog-demo__scroll-body {
  min-block-size: 0;
  flex: 1 1 auto;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 0.75rem;
  border: 1px solid var(--docs-border);
  border-radius: 0.5rem;
  background: var(--docs-tint);
  scrollbar-color: var(--docs-border) transparent;
}

.dialog-demo__scroll-body--compact {
  max-block-size: 16rem;
}

.dialog-demo__scroll-body p {
  display: grid;
  grid-template-columns: 1.5rem minmax(0, 1fr);
  gap: 0.5rem;
  margin: 0;
  color: var(--docs-default);
  font-size: 0.8125rem;
  line-height: 1.35rem;
}

.dialog-demo__scroll-body p + p {
  margin-block-start: 0.75rem;
  padding-block-start: 0.75rem;
  border-block-start: 1px solid var(--docs-border);
}

.dialog-demo__scroll-body strong {
  color: var(--docs-subtle);
  font-family: var(--docs-font-mono);
  font-size: 0.6875rem;
}

@media (max-width: 480px) {
  .dialog-demo__metrics {
    grid-template-columns: minmax(0, 1fr);
    gap: 0.625rem;
  }
}
</style>
