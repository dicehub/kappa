<script setup lang="ts">
import { ChartLine, File, Settings } from "@lucide/vue";
import { ref } from "vue";
import { Tabs } from "@dicehub/kappa/components/tabs";
import TabsScrollableDocsDemo from "./TabsScrollableDocsDemo.vue";

type DemoVariant =
  | "preview"
  | "usage"
  | "composition"
  | "basic"
  | "variants"
  | "sizes"
  | "icons"
  | "many"
  | "overflow"
  | "dynamic-count"
  | "rtl"
  | "manual"
  | "vertical"
  | "controlled"
  | "disabled"
  | "dynamic"
  | "rich";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const previewValue = ref("overview");
const controlledValue = ref("residuals");
const dynamicValue = ref("overview");
const showInspect = ref(false);
</script>

<template>
  <div class="tabs-demo" :data-tabs-demo="props.variant">
    <section v-if="props.variant === 'preview'" class="tabs-demo__preview">
      <Tabs.Root id="tabs-preview" v-model="previewValue">
        <Tabs.List>
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="runs">Runs</Tabs.Trigger>
          <Tabs.Trigger value="artifacts">Artifacts</Tabs.Trigger>
          <Tabs.Indicator />
        </Tabs.List>
        <Tabs.Content value="overview">
          <p class="tabs-demo__copy">Case overview and current status.</p>
        </Tabs.Content>
        <Tabs.Content value="runs">
          <p class="tabs-demo__copy">Recent solver runs and timings.</p>
        </Tabs.Content>
        <Tabs.Content value="artifacts">
          <p class="tabs-demo__copy">Meshes, logs, and exported fields.</p>
        </Tabs.Content>
      </Tabs.Root>
      <output class="tabs-demo__readout" aria-live="polite">
        Selected: <strong>{{ previewValue }}</strong>
      </output>
    </section>

    <Tabs.Root v-else-if="props.variant === 'usage'" id="tabs-usage" default-value="mesh">
      <Tabs.List>
        <Tabs.Trigger value="mesh">Mesh</Tabs.Trigger>
        <Tabs.Trigger value="solver">Solver</Tabs.Trigger>
        <Tabs.Trigger value="results">Results</Tabs.Trigger>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Content value="mesh">The mesh contains 2.4 million cells.</Tabs.Content>
      <Tabs.Content value="solver">PIMPLE is using six outer correctors.</Tabs.Content>
      <Tabs.Content value="results">Pressure and force histories are ready.</Tabs.Content>
    </Tabs.Root>

    <Tabs.Root v-else-if="props.variant === 'composition'" id="tabs-composition" default-value="summary">
      <Tabs.List>
        <Tabs.Trigger value="summary">Summary</Tabs.Trigger>
        <Tabs.Trigger value="log">Log</Tabs.Trigger>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Content value="summary">Run summary.</Tabs.Content>
      <Tabs.Content value="log">Solver log excerpt.</Tabs.Content>
    </Tabs.Root>

    <Tabs.Root v-else-if="props.variant === 'basic'" id="tabs-basic" default-value="overview">
      <Tabs.List>
        <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
        <Tabs.Trigger value="runs">Runs</Tabs.Trigger>
        <Tabs.Trigger value="artifacts">Artifacts</Tabs.Trigger>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Content value="overview">
        <p class="tabs-demo__copy">The case is ready for review. Mesh and solver inputs are valid.</p>
      </Tabs.Content>
      <Tabs.Content value="runs">
        <p class="tabs-demo__copy">Three solver runs completed in the latest batch.</p>
      </Tabs.Content>
      <Tabs.Content value="artifacts">
        <p class="tabs-demo__copy">Meshes, logs, and exported fields are available.</p>
      </Tabs.Content>
    </Tabs.Root>

    <div v-else-if="props.variant === 'variants'" class="tabs-demo__stack">
      <section class="tabs-demo__group">
        <p class="tabs-demo__label">Segmented</p>
        <Tabs.Root id="tabs-variants-segmented" default-value="preview">
          <Tabs.List>
            <Tabs.Trigger value="preview">Preview</Tabs.Trigger>
            <Tabs.Trigger value="code">Code</Tabs.Trigger>
            <Tabs.Trigger value="history">History</Tabs.Trigger>
            <Tabs.Indicator />
          </Tabs.List>
          <Tabs.Content value="preview">Preview is selected.</Tabs.Content>
          <Tabs.Content value="code">Code is selected.</Tabs.Content>
          <Tabs.Content value="history">History is selected.</Tabs.Content>
        </Tabs.Root>
      </section>
      <section class="tabs-demo__group">
        <p class="tabs-demo__label">Line</p>
        <Tabs.Root id="tabs-variants-line" default-value="preview">
          <Tabs.List variant="line">
            <Tabs.Trigger value="preview">Preview</Tabs.Trigger>
            <Tabs.Trigger value="code">Code</Tabs.Trigger>
            <Tabs.Trigger value="history">History</Tabs.Trigger>
            <Tabs.Indicator />
          </Tabs.List>
          <Tabs.Content value="preview">Preview is selected.</Tabs.Content>
          <Tabs.Content value="code">Code is selected.</Tabs.Content>
          <Tabs.Content value="history">History is selected.</Tabs.Content>
        </Tabs.Root>
      </section>
    </div>

    <div v-else-if="props.variant === 'sizes'" class="tabs-demo__stack">
      <section class="tabs-demo__group">
        <p class="tabs-demo__label">Base</p>
        <Tabs.Root id="tabs-sizes-base" default-value="daily">
          <Tabs.List>
            <Tabs.Trigger value="daily">Daily</Tabs.Trigger>
            <Tabs.Trigger value="weekly">Weekly</Tabs.Trigger>
            <Tabs.Trigger value="monthly">Monthly</Tabs.Trigger>
            <Tabs.Indicator />
          </Tabs.List>
          <Tabs.Content value="daily">Daily data.</Tabs.Content>
          <Tabs.Content value="weekly">Weekly data.</Tabs.Content>
          <Tabs.Content value="monthly">Monthly data.</Tabs.Content>
        </Tabs.Root>
      </section>
      <section class="tabs-demo__group">
        <p class="tabs-demo__label">Small</p>
        <Tabs.Root id="tabs-sizes-sm" default-value="daily">
          <Tabs.List size="sm">
            <Tabs.Trigger value="daily">Daily</Tabs.Trigger>
            <Tabs.Trigger value="weekly">Weekly</Tabs.Trigger>
            <Tabs.Trigger value="monthly">Monthly</Tabs.Trigger>
            <Tabs.Indicator />
          </Tabs.List>
          <Tabs.Content value="daily">Daily data.</Tabs.Content>
          <Tabs.Content value="weekly">Weekly data.</Tabs.Content>
          <Tabs.Content value="monthly">Monthly data.</Tabs.Content>
        </Tabs.Root>
      </section>
    </div>

    <Tabs.Root v-else-if="props.variant === 'icons'" id="tabs-icons" default-value="analytics">
      <Tabs.List variant="line">
        <Tabs.Trigger value="analytics"><ChartLine aria-hidden="true" />Analytics</Tabs.Trigger>
        <Tabs.Trigger value="files"><File aria-hidden="true" />Files</Tabs.Trigger>
        <Tabs.Trigger value="settings"><Settings aria-hidden="true" />Settings</Tabs.Trigger>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Content value="analytics">Analytics are ready.</Tabs.Content>
      <Tabs.Content value="files">Files are ready.</Tabs.Content>
      <Tabs.Content value="settings">Settings are ready.</Tabs.Content>
    </Tabs.Root>

    <TabsScrollableDocsDemo v-else-if="props.variant === 'many'" variant="many" />

    <TabsScrollableDocsDemo v-else-if="props.variant === 'overflow'" variant="overflow" />

    <TabsScrollableDocsDemo
      v-else-if="props.variant === 'dynamic-count'"
      variant="dynamic-count"
    />

    <Tabs.Root v-else-if="props.variant === 'rtl'" id="tabs-rtl" default-value="overview" dir="rtl">
      <Tabs.List variant="line">
        <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
        <Tabs.Trigger value="reports">Reports</Tabs.Trigger>
        <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Content value="overview">Direction-aware overview.</Tabs.Content>
      <Tabs.Content value="reports">Direction-aware reports.</Tabs.Content>
      <Tabs.Content value="settings">Direction-aware settings.</Tabs.Content>
    </Tabs.Root>

    <Tabs.Root
      v-else-if="props.variant === 'manual'"
      id="tabs-manual"
      default-value="setup"
      activation-mode="manual"
    >
      <Tabs.List variant="line">
        <Tabs.Trigger value="setup">Setup</Tabs.Trigger>
        <Tabs.Trigger value="review">Review</Tabs.Trigger>
        <Tabs.Trigger value="submit">Submit</Tabs.Trigger>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Content value="setup">
        <p class="tabs-demo__copy">Configure the case before review.</p>
      </Tabs.Content>
      <Tabs.Content value="review">
        <p class="tabs-demo__copy">Review the input values and quality checks.</p>
      </Tabs.Content>
      <Tabs.Content value="submit">
        <p class="tabs-demo__copy">Submit a validated run to the queue.</p>
      </Tabs.Content>
    </Tabs.Root>

    <Tabs.Root
      v-else-if="props.variant === 'vertical'"
      class="tabs-demo__vertical"
      default-value="geometry"
      id="tabs-vertical"
      orientation="vertical"
    >
      <Tabs.List variant="line">
        <Tabs.Trigger value="geometry">Geometry</Tabs.Trigger>
        <Tabs.Trigger value="mesh">Mesh</Tabs.Trigger>
        <Tabs.Trigger value="boundaries">Boundaries</Tabs.Trigger>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Content value="geometry">
        <p class="tabs-demo__copy">The geometry is watertight and ready for meshing.</p>
      </Tabs.Content>
      <Tabs.Content value="mesh">
        <p class="tabs-demo__copy">All mesh quality checks passed before decomposition.</p>
      </Tabs.Content>
      <Tabs.Content value="boundaries">
        <p class="tabs-demo__copy">Seven boundary patches are assigned to every face.</p>
      </Tabs.Content>
    </Tabs.Root>

    <section v-else-if="props.variant === 'controlled'" class="tabs-demo__controlled">
      <Tabs.Root id="tabs-controlled" v-model="controlledValue">
        <Tabs.List>
          <Tabs.Trigger value="residuals">Residuals</Tabs.Trigger>
          <Tabs.Trigger value="forces">Forces</Tabs.Trigger>
          <Tabs.Indicator />
        </Tabs.List>
        <Tabs.Content value="residuals">
          <p class="tabs-demo__copy">All normalized residuals are below 1e-5.</p>
        </Tabs.Content>
        <Tabs.Content value="forces">
          <p class="tabs-demo__copy">The mean drag coefficient is 0.31.</p>
        </Tabs.Content>
      </Tabs.Root>
      <output class="tabs-demo__readout" data-controlled-feedback aria-live="polite">
        Selected: <strong>{{ controlledValue }}</strong>
      </output>
    </section>

    <Tabs.Root v-else-if="props.variant === 'disabled'" id="tabs-disabled" default-value="available">
      <Tabs.List>
        <Tabs.Trigger value="available">Available</Tabs.Trigger>
        <Tabs.Trigger value="pending" disabled>Pending data</Tabs.Trigger>
        <Tabs.Trigger value="history">History</Tabs.Trigger>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Content value="available">
        <p class="tabs-demo__copy">Current diagnostics are ready.</p>
      </Tabs.Content>
      <Tabs.Content value="pending">
        <p class="tabs-demo__copy">This panel is not available yet.</p>
      </Tabs.Content>
      <Tabs.Content value="history">
        <p class="tabs-demo__copy">Previous diagnostics are archived.</p>
      </Tabs.Content>
    </Tabs.Root>

    <section v-else-if="props.variant === 'dynamic'" class="tabs-demo__dynamic">
      <Tabs.Root
        id="tabs-dynamic"
        v-model="dynamicValue"
        lazy-mount
        unmount-on-exit
        default-value="overview"
      >
        <Tabs.List>
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="logs">Logs</Tabs.Trigger>
          <Tabs.Trigger v-if="showInspect" value="inspect">Inspect</Tabs.Trigger>
          <Tabs.Indicator />
        </Tabs.List>
        <Tabs.Content value="overview">
          <p class="tabs-demo__copy">Overview is mounted only while selected.</p>
        </Tabs.Content>
        <Tabs.Content value="logs">
          <p class="tabs-demo__copy" data-lazy-panel>Logs mount only when selected.</p>
        </Tabs.Content>
        <Tabs.Content v-if="showInspect" value="inspect">
          <p class="tabs-demo__copy">Inspect is dynamic content.</p>
        </Tabs.Content>
      </Tabs.Root>
      <button type="button" @click="showInspect = !showInspect">
        {{ showInspect ? "Remove inspect" : "Add inspect" }}
      </button>
    </section>

    <Tabs.Root v-else id="tabs-rich" class="tabs-demo__rich" default-value="metrics">
      <Tabs.List>
        <Tabs.Trigger value="metrics">Metrics</Tabs.Trigger>
        <Tabs.Trigger value="boundaries">Boundaries</Tabs.Trigger>
        <Tabs.Trigger value="notes">Notes</Tabs.Trigger>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Content value="metrics">
        <dl class="tabs-demo__metrics">
          <div><dt>Cells</dt><dd>2.4M</dd></div>
          <div><dt>Residual</dt><dd>8.4e-6</dd></div>
          <div><dt>Courant max</dt><dd>0.82</dd></div>
        </dl>
      </Tabs.Content>
      <Tabs.Content value="boundaries">
        <div class="tabs-demo__table-wrap">
          <table>
            <caption>Patch summary</caption>
            <thead><tr><th scope="col">Patch</th><th scope="col">Faces</th><th scope="col">State</th></tr></thead>
            <tbody>
              <tr><th scope="row">inlet</th><td>2,048</td><td>Ready</td></tr>
              <tr><th scope="row">outlet</th><td>1,024</td><td>Ready</td></tr>
            </tbody>
          </table>
        </div>
      </Tabs.Content>
      <Tabs.Content value="notes">
        <p class="tabs-demo__copy">Add review notes alongside any Vue content.</p>
      </Tabs.Content>
    </Tabs.Root>
  </div>
</template>

<style scoped src="./TabsDocsDemo.css"></style>
