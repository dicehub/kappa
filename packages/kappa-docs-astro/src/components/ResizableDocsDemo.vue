<script setup lang="ts">
import { ref } from "vue";
import { Resizable } from "@dicehub/kappa/components/resizable";

type DemoVariant =
  | "preview"
  | "usage"
  | "vertical"
  | "handle"
  | "collapsible"
  | "nested"
  | "controlled";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const controlledSize = ref([42, 58]);
</script>

<template>
  <div class="resizable-demo" :data-resizable-demo="props.variant">
    <div v-if="props.variant === 'preview'" class="resizable-demo__frame">
      <Resizable.Root
        class="resizable-demo__root"
        :panels="[
          { id: 'navigation', minSize: 22 },
          { id: 'inspector', minSize: 32 },
        ]"
        :default-size="[36, 64]"
        aria-label="Workspace layout"
      >
        <Resizable.Panel id="navigation">Navigation</Resizable.Panel>
        <Resizable.Handle id="navigation:inspector" aria-label="Resize navigation and inspector" />
        <Resizable.Panel id="inspector">Inspector</Resizable.Panel>
      </Resizable.Root>
    </div>

    <div v-else-if="props.variant === 'usage'" class="resizable-demo__frame">
      <Resizable.Root
        class="resizable-demo__root"
        :panels="[
          { id: 'files', minSize: 25 },
          { id: 'preview', minSize: 30 },
        ]"
        :default-size="[32, 68]"
        aria-label="File preview layout"
      >
        <Resizable.Panel id="files">Files</Resizable.Panel>
        <Resizable.Handle id="files:preview" aria-label="Resize files and preview" />
        <Resizable.Panel id="preview">Preview</Resizable.Panel>
      </Resizable.Root>
    </div>

    <div v-else-if="props.variant === 'vertical'" class="resizable-demo__frame resizable-demo__frame--vertical">
      <Resizable.Root
        class="resizable-demo__root"
        orientation="vertical"
        :panels="[
          { id: 'chart', minSize: 30 },
          { id: 'events', minSize: 22 },
        ]"
        :default-size="[62, 38]"
        aria-label="Chart and events layout"
      >
        <Resizable.Panel id="chart">Chart</Resizable.Panel>
        <Resizable.Handle id="chart:events" aria-label="Resize chart and events" />
        <Resizable.Panel id="events">Events</Resizable.Panel>
      </Resizable.Root>
    </div>

    <div v-else-if="props.variant === 'handle'" class="resizable-demo__frame">
      <Resizable.Root
        class="resizable-demo__root"
        :panels="[
          { id: 'editor', minSize: 28 },
          { id: 'output', minSize: 28 },
        ]"
        :default-size="[58, 42]"
        aria-label="Editor and output layout"
      >
        <Resizable.Panel id="editor">Editor</Resizable.Panel>
        <Resizable.ResizeTrigger id="editor:output" aria-label="Resize editor and output">
          <Resizable.ResizeTriggerIndicator />
        </Resizable.ResizeTrigger>
        <Resizable.Panel id="output">Output</Resizable.Panel>
      </Resizable.Root>
    </div>

    <div v-else-if="props.variant === 'collapsible'" class="resizable-demo__frame">
      <Resizable.Root
        class="resizable-demo__root"
        :panels="[
          { id: 'details', minSize: 20, collapsible: true, collapsedSize: 8 },
          { id: 'summary', minSize: 28 },
        ]"
        :default-size="[34, 66]"
        aria-label="Summary and details layout"
      >
        <Resizable.Panel id="details">Details</Resizable.Panel>
        <Resizable.Handle id="details:summary" aria-label="Resize details and summary" />
        <Resizable.Panel id="summary">
          <Resizable.Context v-slot="api">
            <div class="resizable-demo__summary">
              <span>Summary</span>
              <div class="resizable-demo__actions">
                <button type="button" @click="api.expandPanel('details')">Expand details</button>
                <button type="button" @click="api.collapsePanel('details')">Collapse details</button>
              </div>
            </div>
          </Resizable.Context>
        </Resizable.Panel>
      </Resizable.Root>
    </div>

    <div v-else-if="props.variant === 'nested'" class="resizable-demo__frame resizable-demo__frame--nested">
      <Resizable.Root
        class="resizable-demo__root"
        :panels="[
          { id: 'outline', minSize: 22 },
          { id: 'workbench', minSize: 38 },
        ]"
        :default-size="[28, 72]"
        aria-label="Project outline and workbench"
      >
        <Resizable.Panel id="outline">Outline</Resizable.Panel>
        <Resizable.Handle id="outline:workbench" aria-label="Resize outline and workbench" />
        <Resizable.Panel id="workbench" class="resizable-demo__nested-host">
          <Resizable.Root
            class="resizable-demo__root resizable-demo__root--nested"
            orientation="vertical"
            :panels="[
              { id: 'code', minSize: 30 },
              { id: 'terminal', minSize: 24 },
            ]"
            :default-size="[64, 36]"
            aria-label="Code and terminal layout"
          >
            <Resizable.Panel id="code">Code</Resizable.Panel>
            <Resizable.Handle id="code:terminal" aria-label="Resize code and terminal" />
            <Resizable.Panel id="terminal">Terminal</Resizable.Panel>
          </Resizable.Root>
        </Resizable.Panel>
      </Resizable.Root>
    </div>

    <section v-else class="resizable-demo__controlled">
      <div class="resizable-demo__frame">
        <Resizable.Root
          v-model:size="controlledSize"
          class="resizable-demo__root"
          :panels="[
            { id: 'canvas', minSize: 25 },
            { id: 'metrics', minSize: 25 },
          ]"
          aria-label="Controlled canvas and metrics layout"
        >
          <Resizable.Panel id="canvas">Canvas · {{ controlledSize[0] }}%</Resizable.Panel>
          <Resizable.Handle id="canvas:metrics" aria-label="Resize canvas and metrics" />
          <Resizable.Panel id="metrics">Metrics · {{ controlledSize[1] }}%</Resizable.Panel>
        </Resizable.Root>
      </div>
      <div class="resizable-demo__actions resizable-demo__actions--controlled">
        <button type="button" @click="controlledSize = [28, 72]">28 / 72</button>
        <button type="button" @click="controlledSize = [60, 40]">60 / 40</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.resizable-demo {
  display: grid;
  inline-size: 100%;
  min-inline-size: 0;
  min-block-size: 15rem;
  place-items: center;
  color: var(--kappa-default, #17191f);
  font-family: var(--kappa-font-sans, inherit);
}

.resizable-demo__frame,
.resizable-demo__controlled {
  inline-size: min(100%, 42rem);
}

.resizable-demo__frame {
  block-size: 16rem;
  min-inline-size: 0;
}

.resizable-demo__frame--nested {
  block-size: 18rem;
}

.resizable-demo__root {
  inline-size: 100%;
  block-size: 100%;
}

.resizable-demo :deep([data-slot="resizable-panel"]) {
  display: grid;
  place-items: center;
  padding: 1rem;
  background: var(--kappa-control, #ffffff);
  font-size: 0.875rem;
  font-weight: 650;
  text-align: center;
}

.resizable-demo__root--nested {
  align-self: stretch;
  block-size: auto;
}

.resizable-demo :deep(.resizable-demo__nested-host) {
  place-items: stretch;
}

.resizable-demo__summary {
  display: grid;
  justify-items: center;
  gap: 0.75rem;
}

.resizable-demo__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}

.resizable-demo__actions button {
  border: 1px solid var(--kappa-line-strong, #c7cdd6);
  border-radius: 0.375rem;
  padding: 0.375rem 0.625rem;
  background: var(--kappa-control, #ffffff);
  color: var(--kappa-default, #17191f);
  cursor: pointer;
  font: inherit;
  font-size: 0.75rem;
  font-weight: 600;
}

.resizable-demo__actions button:hover {
  border-color: var(--kappa-accent-solid, #4356e8);
}

.resizable-demo__actions button:focus-visible {
  outline: 2px solid var(--kappa-focus, #4c63ff);
  outline-offset: 2px;
}

.resizable-demo__controlled {
  display: grid;
  gap: 0.75rem;
}

.resizable-demo__actions--controlled {
  justify-content: end;
}

@media (max-width: 36rem) {
  .resizable-demo__frame,
  .resizable-demo__controlled {
    inline-size: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .resizable-demo__actions button {
    transition: none;
  }
}
</style>
