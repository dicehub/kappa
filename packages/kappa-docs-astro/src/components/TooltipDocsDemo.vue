<script setup lang="ts">
import { Info, Plus, Save } from "@lucide/vue";
import { ref } from "vue";
import { Button } from "@dicehub/kappa/components/button";
import { Tooltip } from "@dicehub/kappa/components/tooltip";
import type { TooltipPositioningOptions } from "@dicehub/kappa/components/tooltip";

type DemoVariant =
  | "preview"
  | "usage"
  | "sides"
  | "shortcut"
  | "disabled"
  | "delay"
  | "overflow"
  | "controlled";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const controlledOpen = ref(false);
const sides = [
  { label: "Left", placement: "left" },
  { label: "Top", placement: "top" },
  { label: "Bottom", placement: "bottom" },
  { label: "Right", placement: "right" },
] as const satisfies ReadonlyArray<{
  label: string;
  placement: TooltipPositioningOptions["placement"];
}>;

const longContent =
  "This explanation stays inside the viewport and wraps when the available width becomes narrow.";
const edgeTriggers = [
  { id: "left", label: "Near left edge" },
  { id: "center", label: "Centered" },
  { id: "right", label: "Near right edge" },
] as const;
</script>

<template>
  <div class="tooltip-demo" :data-tooltip-demo="props.variant">
    <Tooltip.Root v-if="props.variant === 'preview'" id="tooltip-demo-preview">
      <Tooltip.Trigger as-child>
        <Button :icon="Plus" shape="square" variant="outline" aria-label="Add item" />
      </Tooltip.Trigger>
      <Tooltip.Content>Add item</Tooltip.Content>
    </Tooltip.Root>

    <Tooltip.Root v-else-if="props.variant === 'usage'" id="tooltip-demo-usage">
      <Tooltip.Trigger as-child>
        <Button variant="outline">Hover or focus</Button>
      </Tooltip.Trigger>
      <Tooltip.Content>Review component details</Tooltip.Content>
    </Tooltip.Root>

    <div v-else-if="props.variant === 'sides'" class="tooltip-demo__group">
      <Tooltip.Root
        v-for="side in sides"
        :key="side.placement"
        :id="`tooltip-demo-side-${side.placement}`"
        :positioning="{ placement: side.placement }"
      >
        <Tooltip.Trigger as-child>
          <Button size="sm" variant="outline">{{ side.label }}</Button>
        </Tooltip.Trigger>
        <Tooltip.Content>{{ side.label }} tooltip</Tooltip.Content>
      </Tooltip.Root>
    </div>

    <Tooltip.Root v-else-if="props.variant === 'shortcut'" id="tooltip-demo-shortcut">
      <Tooltip.Trigger as-child>
        <Button :icon="Save" variant="outline">Save changes</Button>
      </Tooltip.Trigger>
      <Tooltip.Content>
        <span>Save changes</span>
        <kbd>Ctrl S</kbd>
      </Tooltip.Content>
    </Tooltip.Root>

    <Tooltip.Root v-else-if="props.variant === 'disabled'" id="tooltip-demo-disabled">
      <Tooltip.Trigger as-child>
        <span class="tooltip-demo__disabled-trigger" tabindex="0">
          <Button disabled>Deploy update</Button>
        </span>
      </Tooltip.Trigger>
      <Tooltip.Content>Available after validation passes</Tooltip.Content>
    </Tooltip.Root>

    <div v-else-if="props.variant === 'delay'" class="tooltip-demo__group">
      <Tooltip.Root id="tooltip-demo-delay-instant" :open-delay="0">
        <Tooltip.Trigger as-child><Button size="sm" variant="outline">Instant</Button></Tooltip.Trigger>
        <Tooltip.Content>Opens without delay</Tooltip.Content>
      </Tooltip.Root>
      <Tooltip.Root id="tooltip-demo-delay-default">
        <Tooltip.Trigger as-child><Button size="sm" variant="outline">Default</Button></Tooltip.Trigger>
        <Tooltip.Content>Opens after 400 ms</Tooltip.Content>
      </Tooltip.Root>
      <Tooltip.Root id="tooltip-demo-delay-custom" :open-delay="900">
        <Tooltip.Trigger as-child><Button size="sm" variant="outline">900 ms</Button></Tooltip.Trigger>
        <Tooltip.Content>Opens after 900 ms</Tooltip.Content>
      </Tooltip.Root>
    </div>

    <div v-else-if="props.variant === 'overflow'" class="tooltip-demo__edge-row">
      <Tooltip.Root
        v-for="trigger in edgeTriggers"
        :key="trigger.id"
        :id="`tooltip-demo-overflow-${trigger.id}`"
        :positioning="{ placement: 'bottom' }"
      >
        <Tooltip.Trigger as-child>
          <Button size="sm" variant="outline">{{ trigger.label }}</Button>
        </Tooltip.Trigger>
        <Tooltip.Content>{{ longContent }}</Tooltip.Content>
      </Tooltip.Root>
    </div>

    <div v-else class="tooltip-demo__controlled">
      <Tooltip.Root
        id="tooltip-demo-controlled"
        v-model:open="controlledOpen"
        :open-delay="0"
      >
        <Tooltip.Trigger as-child>
          <Button :icon="Info" variant="outline">Focus state</Button>
        </Tooltip.Trigger>
        <Tooltip.Content>The open state is synchronized with Vue.</Tooltip.Content>
      </Tooltip.Root>
      <output aria-live="polite">Tooltip: {{ controlledOpen ? "open" : "closed" }}</output>
    </div>
  </div>
</template>

<style scoped src="./TooltipDocsDemo.css"></style>
