<script setup lang="ts">
import { computed, ref } from "vue";
import {
  Accordion,
  AccordionContent,
  AccordionIndicator,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger,
} from "@dicehub/kappa/components/accordion";

type DemoVariant =
  | "preview"
  | "usage"
  | "composition"
  | "basic"
  | "multiple"
  | "disabled"
  | "controlled"
  | "rtl"
  | "lazy";

withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const previewItems = [
  {
    value: "mesh",
    title: "Mesh",
    detail:
      "The volume mesh contains 2.4 million cells across 24 partitions. Quality checks passed with a maximum non-orthogonality of 48.2°.",
  },
  {
    value: "solver",
    title: "Solver",
    detail:
      "The transient PIMPLE solver runs six correctors with an adaptive time step. Residual controls stop converged iterations early.",
  },
  {
    value: "results",
    title: "Results",
    detail:
      "Pressure, velocity, and force histories are available for review. The latest write completed at 2.4 seconds.",
  },
];

const controlledValue = ref(["residuals"]);
const controlledFeedback = computed(() => controlledValue.value.join(", ") || "none");
</script>

<template>
  <div class="accordion-demo" :data-accordion-demo="variant">
    <Accordion.Root v-if="variant === 'preview'" :default-value="['mesh']">
      <Accordion.Item v-for="item in previewItems" :key="item.value" :value="item.value">
        <Accordion.Trigger>{{ item.title }}</Accordion.Trigger>
        <Accordion.Content><p class="accordion-demo__copy">{{ item.detail }}</p></Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>

    <Accordion.Root v-else-if="variant === 'usage'" :default-value="['setup']">
      <Accordion.Item value="setup">
        <Accordion.Trigger>Case setup</Accordion.Trigger>
        <Accordion.Content>
          <p class="accordion-demo__copy">
            Select the mesh, solver, and boundary conditions for this run. The section can contain
            links, settings, tables, or any other Vue content.
          </p>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>

    <AccordionRoot v-else-if="variant === 'composition'" :default-value="['quality']">
      <AccordionItem value="quality">
        <AccordionTrigger>
          Mesh quality
          <template #indicator><AccordionIndicator /></template>
        </AccordionTrigger>
        <AccordionContent>
          <p class="accordion-demo__copy">
            Maximum non-orthogonality is 48.2° and maximum skewness is 1.84. Both values remain
            inside the accepted quality limits.
          </p>
        </AccordionContent>
      </AccordionItem>
    </AccordionRoot>

    <Accordion.Root v-else-if="variant === 'basic'" :default-value="['geometry']">
      <Accordion.Item value="geometry">
        <Accordion.Trigger>Geometry</Accordion.Trigger>
        <Accordion.Content>
          <p class="accordion-demo__copy">
            The geometry contains 12 watertight regions. Surface checks found no open edges or
            self-intersections.
          </p>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="mesh">
        <Accordion.Trigger>Mesh</Accordion.Trigger>
        <Accordion.Content>
          <p class="accordion-demo__copy">
            The volume mesh contains 2.4 million cells across 24 partitions. All quality checks
            passed before decomposition.
          </p>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="solver">
        <Accordion.Trigger>Solver</Accordion.Trigger>
        <Accordion.Content>
          <p class="accordion-demo__copy">
            The transient PIMPLE solver uses an adaptive time step. Six pressure correctors run
            during every outer iteration.
          </p>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>

    <Accordion.Root
      v-else-if="variant === 'multiple'"
      :default-value="['mesh', 'boundaries']"
      multiple
      collapsible
    >
      <Accordion.Item value="mesh">
        <Accordion.Trigger>Mesh summary</Accordion.Trigger>
        <Accordion.Content>
          <p class="accordion-demo__copy">
            The mesh contains 2.4 million cells across 24 balanced partitions. The largest load
            imbalance is 1.7%.
          </p>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="boundaries">
        <Accordion.Trigger>Boundary summary</Accordion.Trigger>
        <Accordion.Content>
          <p class="accordion-demo__copy">
            Seven boundary patches are ready for review. Inlet, outlet, and wall conditions are
            assigned to every face.
          </p>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="numerics">
        <Accordion.Trigger>Numerics</Accordion.Trigger>
        <Accordion.Content>
          <p class="accordion-demo__copy">
            Second-order spatial schemes are active. Automatic time-step control keeps the maximum
            Courant number below 0.8.
          </p>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>

    <Accordion.Root v-else-if="variant === 'disabled'" :default-value="['mesh']">
      <Accordion.Item value="mesh">
        <Accordion.Trigger>Mesh</Accordion.Trigger>
        <Accordion.Content>
          <p class="accordion-demo__copy">
            Mesh diagnostics are available. Review cell quality, patch coverage, and partition
            balance before starting the run.
          </p>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="decomposition" disabled>
        <Accordion.Trigger>Domain decomposition</Accordion.Trigger>
        <Accordion.Content>
          <p class="accordion-demo__copy">
            Decomposition is unavailable while meshing. It becomes available after the mesh passes
            its final quality check.
          </p>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="solver">
        <Accordion.Trigger>Solver</Accordion.Trigger>
        <Accordion.Content>
          <p class="accordion-demo__copy">
            Solver controls are ready. The selected tolerances and relaxation factors have been
            validated for this case.
          </p>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="results">
        <Accordion.Trigger>Results</Accordion.Trigger>
        <Accordion.Content>
          <p class="accordion-demo__copy">
            Result fields become available after the first write. Pressure, velocity, and force
            histories can then be inspected together.
          </p>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>

    <div v-else-if="variant === 'controlled'" class="accordion-demo__stack">
      <Accordion.Root v-model="controlledValue" collapsible>
        <Accordion.Item value="residuals">
          <Accordion.Trigger>Residuals</Accordion.Trigger>
          <Accordion.Content>
            <p class="accordion-demo__copy">
              All normalized residuals are below 1e-5. Pressure has fallen by more than four orders
              of magnitude since the first iteration.
            </p>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="forces">
          <Accordion.Trigger>Forces</Accordion.Trigger>
          <Accordion.Content>
            <p class="accordion-demo__copy">
              The mean drag coefficient is 0.31 over the latest sampling window. Oscillation remains
              below 0.6%.
            </p>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
      <p class="accordion-demo__meta" data-controlled-feedback aria-live="polite">
        Open panels: <strong>{{ controlledFeedback }}</strong>
      </p>
    </div>

    <div v-else-if="variant === 'rtl'" class="accordion-demo__rtl" dir="rtl">
      <Accordion.Root :default-value="['results']" collapsible dir="rtl">
        <Accordion.Item value="results">
          <Accordion.Trigger>نتائج المحاكاة</Accordion.Trigger>
          <Accordion.Content>
            <p class="accordion-demo__copy">
              الضغط والسرعة جاهزان للمراجعة. اكتملت آخر عملية كتابة عند ٢٫٤ ثانية.
            </p>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="mesh">
          <Accordion.Trigger>جودة الشبكة</Accordion.Trigger>
          <Accordion.Content>
            <p class="accordion-demo__copy">
              اجتازت الشبكة جميع فحوصات الجودة. تحتوي الحالة على ٢٫٤ مليون خلية موزعة على ٢٤ قسمًا.
            </p>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>

    <Accordion.Root v-else lazy-mount unmount-on-exit collapsible>
      <Accordion.Item value="plots">
        <Accordion.Trigger>Residual plots</Accordion.Trigger>
        <Accordion.Content>
          <p class="accordion-demo__copy">
            Residual plots mount only while this item is open. Closing the section removes the chart
            from the document and releases its observers.
          </p>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  </div>
</template>

<style scoped>
.accordion-demo {
  display: grid;
  width: 100%;
  min-width: 0;
  min-height: 12rem;
  align-content: center;
  color: var(--docs-default);
  font-family: var(--docs-font-sans, "Geist", sans-serif);
}

.accordion-demo > :deep(.kappa-accordion),
.accordion-demo__stack,
.accordion-demo__rtl {
  width: min(100%, 38rem);
  min-width: 0;
  margin-inline: auto;
}

.accordion-demo__stack {
  display: grid;
  gap: 0.75rem;
}

.accordion-demo__copy,
.accordion-demo__meta {
  margin: 0;
}

.accordion-demo__copy {
  color: var(--docs-subtle);
}

.accordion-demo__meta {
  color: var(--docs-subtle);
  font-size: 0.75rem;
  text-align: end;
}

.accordion-demo__meta strong {
  color: var(--docs-default);
  font-weight: 600;
}

@media (max-width: 620px) {
  .accordion-demo {
    min-height: 14rem;
  }
}
</style>
