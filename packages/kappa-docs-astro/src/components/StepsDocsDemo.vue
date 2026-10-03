<script setup lang="ts">
import { ref } from "vue";
import { Steps } from "@dicehub/kappa/components/steps";

type DemoVariant =
  | "preview"
  | "usage"
  | "composition"
  | "basic"
  | "vertical"
  | "sizes"
  | "controlled";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const labels = ["Configuration", "Review", "Run"];
const descriptions = [
  "Set the solver and mesh inputs.",
  "Check the case before submission.",
  "Submit the case to the compute queue.",
];
const controlledStep = ref(1);
const indicatorClicks = ref(0);
</script>

<template>
  <div
    class="steps-demo"
    :data-steps-demo="props.variant"
    :data-indicator-clicks="props.variant === 'composition' ? indicatorClicks : undefined"
  >
    <Steps.Root
      v-if="props.variant === 'preview' || props.variant === 'usage' || props.variant === 'basic'"
      :id="`steps-${props.variant}`"
      :count="labels.length"
      :default-step="0"
    >
      <Steps.Progress />
      <Steps.List aria-label="Case setup progress">
        <Steps.Item v-for="(label, index) in labels" :key="label" :index="index">
          <Steps.Trigger>
            <Steps.Indicator v-slot="{ completed }">
              <span aria-hidden="true">{{ completed ? "✓" : index + 1 }}</span>
            </Steps.Indicator>
            <span>{{ label }}</span>
          </Steps.Trigger>
          <Steps.Separator v-if="index < labels.length - 1" />
        </Steps.Item>
      </Steps.List>

      <Steps.Content v-for="(description, index) in descriptions" :key="description" :index="index">
        <strong>{{ labels[index] }}</strong>
        <p>{{ description }}</p>
      </Steps.Content>
      <Steps.CompletedContent aria-label="Case setup complete">
        <strong>Ready to run</strong>
        <p>All case inputs are complete.</p>
      </Steps.CompletedContent>

      <div class="steps-demo__actions">
        <Steps.PrevTrigger>Back</Steps.PrevTrigger>
        <Steps.Context v-slot="{ isCompleted, resetStep }">
          <button v-if="isCompleted" type="button" data-reset-step @click="resetStep">Reset</button>
          <Steps.NextTrigger v-else>Next</Steps.NextTrigger>
        </Steps.Context>
      </div>
    </Steps.Root>

    <Steps.Root
      v-else-if="props.variant === 'composition'"
      id="steps-composition"
      :count="2"
      :default-step="0"
    >
      <Steps.List aria-label="Import progress">
        <Steps.Item :index="0">
          <Steps.Trigger>
            <Steps.Indicator as-child @click="indicatorClicks += 1">
              <span data-custom-indicator>1</span>
            </Steps.Indicator>
            <span>Upload</span>
          </Steps.Trigger>
          <Steps.Separator />
        </Steps.Item>
        <Steps.Item :index="1">
          <Steps.Trigger>
            <Steps.Indicator>2</Steps.Indicator>
            <span>Map fields</span>
          </Steps.Trigger>
        </Steps.Item>
      </Steps.List>
      <Steps.Content :index="0">Choose a supported case archive.</Steps.Content>
      <Steps.Content :index="1">Map the imported fields.</Steps.Content>
      <Steps.CompletedContent aria-label="Import complete">Import complete.</Steps.CompletedContent>
    </Steps.Root>

    <Steps.Root
      v-else-if="props.variant === 'vertical'"
      id="steps-vertical"
      class="steps-demo__vertical"
      :count="labels.length"
      :default-step="1"
      orientation="vertical"
    >
      <Steps.List aria-label="Deployment progress">
        <Steps.Item v-for="(label, index) in labels" :key="label" :index="index">
          <Steps.Trigger>
            <Steps.Indicator v-slot="{ completed }">
              <span aria-hidden="true">{{ completed ? "✓" : index + 1 }}</span>
            </Steps.Indicator>
            <span>{{ label }}</span>
          </Steps.Trigger>
          <Steps.Separator v-if="index < labels.length - 1" />
        </Steps.Item>
      </Steps.List>
      <div class="steps-demo__vertical-panel">
        <Steps.Content v-for="(description, index) in descriptions" :key="description" :index="index">
          <strong>{{ labels[index] }}</strong>
          <p>{{ description }}</p>
        </Steps.Content>
        <Steps.CompletedContent aria-label="Deployment complete">Deployment complete.</Steps.CompletedContent>
        <div class="steps-demo__actions">
          <Steps.PrevTrigger>Back</Steps.PrevTrigger>
          <Steps.NextTrigger>Next</Steps.NextTrigger>
        </div>
      </div>
    </Steps.Root>

    <div v-else-if="props.variant === 'sizes'" class="steps-demo__stack">
      <section v-for="size in ['base', 'sm'] as const" :key="size" class="steps-demo__group">
        <span class="steps-demo__label">{{ size === "base" ? "Base" : "Small" }}</span>
        <Steps.Root :id="`steps-size-${size}`" :count="3" :default-step="1">
          <Steps.List :size="size" :aria-label="`${size} steps`">
            <Steps.Item v-for="(label, index) in labels" :key="label" :index="index">
              <Steps.Trigger>
                <Steps.Indicator v-slot="{ completed }">
                  <span aria-hidden="true">{{ completed ? "✓" : index + 1 }}</span>
                </Steps.Indicator>
                <span>{{ label }}</span>
              </Steps.Trigger>
              <Steps.Separator v-if="index < labels.length - 1" />
            </Steps.Item>
          </Steps.List>
          <Steps.Content v-for="(label, index) in labels" :key="label" :index="index">
            {{ label }} is active.
          </Steps.Content>
          <Steps.CompletedContent :aria-label="`${size} example complete`">Complete.</Steps.CompletedContent>
        </Steps.Root>
      </section>
    </div>

    <section v-else class="steps-demo__controlled">
      <Steps.Root id="steps-controlled" v-model:step="controlledStep" :count="3">
        <Steps.List aria-label="Controlled progress">
          <Steps.Item v-for="(label, index) in labels" :key="label" :index="index">
            <Steps.Trigger>
              <Steps.Indicator v-slot="{ completed }">
                <span aria-hidden="true">{{ completed ? "✓" : index + 1 }}</span>
              </Steps.Indicator>
              <span>{{ label }}</span>
            </Steps.Trigger>
            <Steps.Separator v-if="index < labels.length - 1" />
          </Steps.Item>
        </Steps.List>
        <Steps.Content v-for="(description, index) in descriptions" :key="description" :index="index">
          {{ description }}
        </Steps.Content>
        <Steps.CompletedContent aria-label="Controlled example complete">Complete.</Steps.CompletedContent>
        <div class="steps-demo__actions">
          <button type="button" @click="controlledStep = 0">Reset</button>
          <Steps.NextTrigger>Next</Steps.NextTrigger>
        </div>
      </Steps.Root>
      <output class="steps-demo__readout" data-controlled-step aria-live="polite">
        Step: {{ controlledStep }}
      </output>
    </section>
  </div>
</template>

<style src="./StepsDocsDemo.css"></style>
