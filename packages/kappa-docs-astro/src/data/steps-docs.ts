export const barrelCode = `import { Steps } from "@dicehub/kappa";`;

export const granularCode = `import { Steps } from "@dicehub/kappa/components/steps";`;

export const basicCode = `<script setup>
import { Steps } from "@dicehub/kappa/components/steps";

const steps = ["Configuration", "Review", "Run"];
</script>

<template>
  <Steps.Root :count="steps.length" :default-step="0">
    <Steps.Progress />
    <Steps.List aria-label="Case setup progress">
      <Steps.Item v-for="(label, index) in steps" :key="label" :index="index">
        <Steps.Trigger>
          <Steps.Indicator v-slot="{ completed }">
            {{ completed ? "✓" : index + 1 }}
          </Steps.Indicator>
          <span>{{ label }}</span>
        </Steps.Trigger>
        <Steps.Separator v-if="index < steps.length - 1" />
      </Steps.Item>
    </Steps.List>

    <Steps.Content v-for="(label, index) in steps" :key="label" :index="index">
      {{ label }} settings.
    </Steps.Content>
    <Steps.CompletedContent aria-label="Case setup complete">
      Ready to run.
    </Steps.CompletedContent>

    <Steps.PrevTrigger>Back</Steps.PrevTrigger>
    <Steps.Context v-slot="{ isCompleted, resetStep }">
      <button v-if="isCompleted" type="button" @click="resetStep">Reset</button>
      <Steps.NextTrigger v-else>Next</Steps.NextTrigger>
    </Steps.Context>
  </Steps.Root>
</template>`;

export const previewCode = basicCode;
export const usageCode = basicCode;

export const compositionCode = `<script setup>
import {
  StepsCompletedContent,
  StepsContent,
  StepsIndicator,
  StepsItem,
  StepsList,
  StepsRoot,
  StepsSeparator,
  StepsTrigger,
} from "@dicehub/kappa/components/steps";
</script>

<template>
  <StepsRoot :count="2" :default-step="0">
    <StepsList aria-label="Import progress">
      <StepsItem :index="0">
        <StepsTrigger>
          <StepsIndicator as-child><span>1</span></StepsIndicator>
          Upload
        </StepsTrigger>
        <StepsSeparator />
      </StepsItem>
      <StepsItem :index="1">
        <StepsTrigger><StepsIndicator>2</StepsIndicator>Map fields</StepsTrigger>
      </StepsItem>
    </StepsList>
    <StepsContent :index="0">Choose a case archive.</StepsContent>
    <StepsContent :index="1">Map the imported fields.</StepsContent>
    <StepsCompletedContent aria-label="Import complete">Import complete.</StepsCompletedContent>
  </StepsRoot>
</template>`;

export const verticalCode = `<Steps.Root :count="3" :default-step="1" orientation="vertical">
  <Steps.List aria-label="Deployment progress">
    <Steps.Item v-for="(label, index) in steps" :key="label" :index="index">
      <Steps.Trigger>
        <Steps.Indicator>{{ index + 1 }}</Steps.Indicator>
        <span>{{ label }}</span>
      </Steps.Trigger>
      <Steps.Separator v-if="index < steps.length - 1" />
    </Steps.Item>
  </Steps.List>
  <Steps.Content v-for="(label, index) in steps" :key="label" :index="index">
    {{ label }} settings.
  </Steps.Content>
  <Steps.CompletedContent aria-label="Deployment complete">Complete.</Steps.CompletedContent>
</Steps.Root>`;

export const sizesCode = `<Steps.Root :count="3" :default-step="1">
  <Steps.List size="base" aria-label="Base steps">...</Steps.List>
</Steps.Root>

<Steps.Root :count="3" :default-step="1">
  <Steps.List size="sm" aria-label="Small steps">...</Steps.List>
</Steps.Root>`;

export const controlledCode = `<script setup>
import { ref } from "vue";
import { Steps } from "@dicehub/kappa/components/steps";

const step = ref(1);
</script>

<template>
  <Steps.Root v-model:step="step" :count="3">
    <Steps.List aria-label="Controlled progress">...</Steps.List>
    <Steps.Content :index="0">Configuration</Steps.Content>
    <Steps.Content :index="1">Review</Steps.Content>
    <Steps.Content :index="2">Run</Steps.Content>
    <Steps.CompletedContent aria-label="Process complete">Complete.</Steps.CompletedContent>
    <button type="button" @click="step = 0">Reset</button>
    <Steps.NextTrigger>Next</Steps.NextTrigger>
  </Steps.Root>
  <output aria-live="polite">Step: {{ step }}</output>
</template>`;

export const examples = [
  {
    id: "basic",
    title: "Basic",
    description: "Connect indexed items and panels, then use the built-in navigation triggers.",
    variant: "basic",
    code: basicCode,
  },
  {
    id: "vertical",
    title: "Vertical",
    description: "Use a vertical list when labels need more room or the flow sits beside its panel.",
    variant: "vertical",
    code: verticalCode,
  },
  {
    id: "sizes",
    title: "Sizes",
    description: "Use the small size for dense workflows and the base size for standard forms.",
    variant: "sizes",
    code: sizesCode,
  },
  {
    id: "controlled",
    title: "Controlled",
    description: "Bind step when the application must reset or coordinate the active stage.",
    variant: "controlled",
    code: controlledCode,
  },
] as const;

export const rootProps = [
  { name: "count", type: "number", defaultValue: "—", description: "Total number of indexed steps." },
  { name: "step", type: "number", defaultValue: "—", description: "Controlled zero-based step. Completion is count." },
  { name: "defaultStep", type: "number", defaultValue: "0", description: "Initial uncontrolled step." },
  { name: "orientation", type: '"horizontal" | "vertical"', defaultValue: '"horizontal"', description: "List direction." },
  { name: "linear", type: "boolean", defaultValue: "false", description: "Requires progress through the navigation API in order." },
  { name: "isStepValid", type: "(index: number) => boolean", defaultValue: "—", description: "Checks a step before forward movement." },
  { name: "isStepSkippable", type: "(index: number) => boolean", defaultValue: "—", description: "Allows forward movement without validation for a step." },
  { name: "dir", type: '"ltr" | "rtl"', defaultValue: "inherited", description: "Overrides the inherited direction." },
];

export const listProps = [
  { name: "size", type: '"sm" | "base"', defaultValue: '"base"', description: "Marker and label density." },
  { name: "asChild", type: "boolean", defaultValue: "false", description: "Merges list behavior into its child." },
];

export const itemProps = [
  { name: "index", type: "number", defaultValue: "—", description: "Required zero-based step index." },
  { name: "asChild", type: "boolean", defaultValue: "false", description: "Merges part behavior into its child." },
];

export const events = [
  { name: "stepChange", payload: "StepChangeDetails", description: "Runs when the active step changes." },
  { name: "stepComplete", payload: "void", description: "Runs when the value reaches count." },
  { name: "stepInvalid", payload: "StepsInvalidDetails", description: "Runs when validation blocks forward movement." },
  { name: "update:step", payload: "number", description: "Supports v-model:step." },
];

export const parts = [
  { name: "Root", element: "div", description: "Owns the step state." },
  { name: "List", element: "div", description: "Contains the indexed items." },
  { name: "Item", element: "div", description: "Provides one index to its parts." },
  { name: "Trigger", element: "button", description: "Selects an item in non-linear mode." },
  { name: "Indicator", element: "div", description: "Shows current, complete, or incomplete state." },
  { name: "Separator", element: "div", description: "Connects adjacent items." },
  { name: "Content", element: "div", description: "Panel for one indexed item." },
  { name: "CompletedContent", element: "div", description: "Panel shown when step equals count." },
  { name: "PrevTrigger", element: "button", description: "Moves to the previous step." },
  { name: "NextTrigger", element: "button", description: "Moves to the next step." },
  { name: "Progress", element: "div", description: "Reports and shows completion percentage." },
];

export const correspondence = [
  { reference: "Kumo", component: "None", role: "No corresponding component." },
  { reference: "Ark UI", component: "Steps", role: "Behavior, state, and accessibility base." },
  { reference: "shadcn", component: "None", role: "No official Steps component." },
];

export const exportsList = [
  { name: "Steps", description: "Root component with all compound parts." },
  { name: "StepsRoot … StepsItemContext", description: "Named component exports." },
  { name: "useSteps", description: "Creates a controlled Ark UI steps machine." },
  { name: "useStepsContext", description: "Reads the root machine." },
  { name: "useStepsItemContext", description: "Reads state for the current item." },
  { name: "STEPS_SIZES", description: "Supported list sizes." },
];
