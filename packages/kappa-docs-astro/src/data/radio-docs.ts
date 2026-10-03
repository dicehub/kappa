export const barrelCode = `import { Radio } from "@dicehub/kappa";`;

export const granularCode = `import { Radio } from "@dicehub/kappa/components/radio";`;

export const previewCode = `<script setup>
import { ref } from "vue";
import { Radio } from "@dicehub/kappa/components/radio";

const density = ref("comfortable");
</script>

<template>
  <Radio.Root v-model="density" name="interface-density">
    <Radio.Label>Interface density</Radio.Label>
    <Radio.Item value="compact">
      <Radio.ItemControl />
      <Radio.ItemText>Compact</Radio.ItemText>
    </Radio.Item>
    <Radio.Item value="comfortable">
      <Radio.ItemControl />
      <Radio.ItemText>Comfortable</Radio.ItemText>
    </Radio.Item>
    <Radio.Item value="spacious">
      <Radio.ItemControl />
      <Radio.ItemText>Spacious</Radio.ItemText>
    </Radio.Item>
  </Radio.Root>
</template>`;

export const usageCode = `<script setup>
import { Radio } from "@dicehub/kappa/components/radio";
</script>

<template>
  <Radio.Root default-value="email" name="notification-channel">
    <Radio.Label>Notification channel</Radio.Label>
    <Radio.Item value="email">
      <Radio.ItemControl />
      <Radio.ItemText>Email</Radio.ItemText>
    </Radio.Item>
    <Radio.Item value="sms">
      <Radio.ItemControl />
      <Radio.ItemText>SMS</Radio.ItemText>
    </Radio.Item>
    <Radio.Item value="push">
      <Radio.ItemControl />
      <Radio.ItemText>Push notification</Radio.ItemText>
    </Radio.Item>
  </Radio.Root>
</template>`;

export const compositionCode = `<Radio.Root>
  <Radio.Label />
  <Radio.Indicator />
  <Radio.Item value="option">
    <!-- Native radio input renders automatically. -->
    <Radio.ItemControl />
    <Radio.ItemText />
  </Radio.Item>
  <Radio.Context />
</Radio.Root>`;

export const basicCode = `<script setup>
import { Radio } from "@dicehub/kappa/components/radio";
</script>

<template>
  <Radio.Root default-value="system" name="theme">
    <Radio.Label>Theme</Radio.Label>
    <Radio.Item value="light">
      <Radio.ItemControl />
      <Radio.ItemText>Light</Radio.ItemText>
    </Radio.Item>
    <Radio.Item value="dark">
      <Radio.ItemControl />
      <Radio.ItemText>Dark</Radio.ItemText>
    </Radio.Item>
    <Radio.Item value="system">
      <Radio.ItemControl />
      <Radio.ItemText>System</Radio.ItemText>
    </Radio.Item>
  </Radio.Root>
</template>`;

export const descriptionsCode = `<script setup>
import { Radio } from "@dicehub/kappa/components/radio";

const options = [
  { value: "hourly", label: "Hourly", description: "Keep the latest 24 restore points." },
  { value: "daily", label: "Daily", description: "Keep one restore point for 30 days." },
  { value: "weekly", label: "Weekly", description: "Keep one restore point for 12 weeks." },
];
</script>

<template>
  <Radio.Root default-value="daily" name="backup-frequency">
    <Radio.Label>Backup frequency</Radio.Label>
    <Radio.Item v-for="option in options" :key="option.value" :value="option.value">
      <Radio.ItemControl />
      <Radio.ItemText class="option-copy">
        <span class="option-title">{{ option.label }}</span>
        <span class="option-description">{{ option.description }}</span>
      </Radio.ItemText>
    </Radio.Item>
  </Radio.Root>
</template>

<style scoped>
.option-copy { display: grid; gap: 0.125rem; }
.option-title { font-weight: 500; }
.option-description { color: var(--kappa-subtle); font-size: 0.75rem; }
</style>`;

export const horizontalCode = `<script setup>
import { Radio } from "@dicehub/kappa/components/radio";
</script>

<template>
  <Radio.Root default-value="newest" name="sort-order" orientation="horizontal">
    <Radio.Label>Sort order</Radio.Label>
    <Radio.Item value="newest"><Radio.ItemControl /><Radio.ItemText>Newest</Radio.ItemText></Radio.Item>
    <Radio.Item value="oldest"><Radio.ItemControl /><Radio.ItemText>Oldest</Radio.ItemText></Radio.Item>
    <Radio.Item value="name"><Radio.ItemControl /><Radio.ItemText>Name</Radio.ItemText></Radio.Item>
  </Radio.Root>
</template>`;

export const cardsCode = `<script setup>
import { Radio } from "@dicehub/kappa/components/radio";

const plans = [
  { value: "starter", label: "Starter", description: "5 GB for personal projects." },
  { value: "team", label: "Team", description: "100 GB with shared access." },
  { value: "business", label: "Business", description: "1 TB with audit history." },
];
</script>

<template>
  <Radio.Root default-value="team" name="storage-plan" class="choice-cards">
    <Radio.Label>Storage plan</Radio.Label>
    <Radio.Item v-for="plan in plans" :key="plan.value" :value="plan.value" class="choice-card">
      <Radio.ItemControl />
      <Radio.ItemText class="choice-card__copy">
        <strong>{{ plan.label }}</strong>
        <span>{{ plan.description }}</span>
      </Radio.ItemText>
    </Radio.Item>
  </Radio.Root>
</template>

<style scoped>
:deep(.choice-cards.kappa-radio) { width: min(100%, 26rem); }
:deep(.choice-card) {
  width: 100%;
  border: 1px solid var(--kappa-line);
  border-radius: 0.5rem;
  padding: 0.75rem;
}
:deep(.choice-card[data-state="checked"]) {
  border-color: var(--kappa-accent);
  background: color-mix(in oklab, var(--kappa-accent) 5%, transparent);
}
:deep(.choice-card__copy) { display: grid; gap: 0.125rem; }
:deep(.choice-card__copy span) { color: var(--kappa-subtle); font-size: 0.75rem; }
</style>`;

export const controlledCode = `<script setup>
import { ref } from "vue";
import { Radio } from "@dicehub/kappa/components/radio";

const visibility = ref("team");
</script>

<template>
  <Radio.Root v-model="visibility" name="visibility">
    <Radio.Label>Visibility</Radio.Label>
    <Radio.Item value="private"><Radio.ItemControl /><Radio.ItemText>Private</Radio.ItemText></Radio.Item>
    <Radio.Item value="team"><Radio.ItemControl /><Radio.ItemText>Team</Radio.ItemText></Radio.Item>
    <Radio.Item value="public"><Radio.ItemControl /><Radio.ItemText>Public</Radio.ItemText></Radio.Item>
  </Radio.Root>
  <output aria-live="polite">Visibility: {{ visibility }}</output>
</template>`;

export const indicatorCode = `<script setup>
import { ref } from "vue";
import { Radio } from "@dicehub/kappa/components/radio";

const view = ref("board");
</script>

<template>
  <Radio.Root v-model="view" aria-label="View" name="view" orientation="horizontal" class="view-switcher">
    <Radio.Indicator />
    <Radio.Item v-for="option in ['list', 'board', 'timeline']" :key="option" :value="option" class="view-switcher__item">
      <Radio.ItemText>{{ option }}</Radio.ItemText>
    </Radio.Item>
  </Radio.Root>
</template>

<style scoped>
:deep(.view-switcher.kappa-radio) {
  display: inline-grid;
  grid-auto-columns: minmax(5.5rem, 1fr);
  grid-auto-flow: column;
  gap: 0;
  border: 1px solid var(--kappa-line);
  border-radius: 0.625rem;
  padding: 0.25rem;
  background: var(--kappa-overlay);
}
:deep(.view-switcher .kappa-radio__indicator) {
  background: var(--kappa-control);
  box-shadow: inset 0 0 0 1px var(--kappa-line), var(--kappa-shadow);
}
:deep(.view-switcher__item) {
  width: 100%;
  justify-content: center;
  padding: 0.375rem 0.625rem;
}
</style>`;

export const statesCode = `<script setup>
import { Radio } from "@dicehub/kappa/components/radio";
</script>

<template>
  <Radio.Root default-value="email" disabled name="disabled-channel">
    <Radio.Label>Disabled group</Radio.Label>
    <Radio.Item value="email"><Radio.ItemControl /><Radio.ItemText>Email</Radio.ItemText></Radio.Item>
    <Radio.Item value="sms"><Radio.ItemControl /><Radio.ItemText>SMS</Radio.ItemText></Radio.Item>
  </Radio.Root>

  <Radio.Root default-value="automatic" read-only name="readonly-sync">
    <Radio.Label>Read-only group</Radio.Label>
    <Radio.Item value="automatic"><Radio.ItemControl /><Radio.ItemText>Automatic</Radio.ItemText></Radio.Item>
    <Radio.Item value="manual"><Radio.ItemControl /><Radio.ItemText>Manual</Radio.ItemText></Radio.Item>
  </Radio.Root>

  <Radio.Root invalid required name="delivery" aria-describedby="delivery-error">
    <Radio.Label>Delivery method</Radio.Label>
    <Radio.Item value="standard"><Radio.ItemControl /><Radio.ItemText>Standard</Radio.ItemText></Radio.Item>
    <Radio.Item value="express"><Radio.ItemControl /><Radio.ItemText>Express</Radio.ItemText></Radio.Item>
  </Radio.Root>
  <p id="delivery-error">Choose a delivery method.</p>
</template>`;

export const examples = [
  { id: "basic", title: "Basic", description: "Use one root for one mutually exclusive set of options.", variant: "basic", code: basicCode },
  { id: "descriptions", title: "Descriptions", description: "Compose titles and supporting text inside ItemText when each choice needs more context.", variant: "descriptions", code: descriptionsCode },
  { id: "horizontal", title: "Horizontal", description: "Set orientation to horizontal for a short set that can wrap safely.", variant: "horizontal", code: horizontalCode },
  { id: "choice-cards", title: "Choice Cards", description: "Style each Item as a bordered row when the choice needs a larger click target and description.", variant: "cards", code: cardsCode },
  { id: "controlled", title: "Controlled", description: "Use v-model when application state must own the selected value.", variant: "controlled", code: controlledCode },
  { id: "sliding-indicator", title: "Sliding Indicator", description: "Add Indicator for a compact segmented choice. Ark UI measures and moves it to the selected item.", variant: "indicator", code: indicatorCode },
  { id: "states", title: "States", description: "Disabled blocks the group, read-only preserves the value, and invalid needs clear error text.", variant: "states", code: statesCode },
] as const;

export const rootProps = [
  { name: "modelValue", type: "string | null", defaultValue: "-", description: "Controlled selected value; supports v-model." },
  { name: "defaultValue", type: "string | null", defaultValue: "null", description: "Initial selected value for uncontrolled use." },
  { name: "name", type: "string", defaultValue: "generated id", description: "Shared native form name for every item input." },
  { name: "orientation", type: '"vertical" | "horizontal"', defaultValue: '"vertical"', description: "Sets layout and arrow-key movement." },
  { name: "disabled", type: "boolean", defaultValue: "false", description: "Disables every item in the group." },
  { name: "readOnly", type: "boolean", defaultValue: "false", description: "Keeps the selected value but blocks changes." },
  { name: "required", type: "boolean", defaultValue: "false", description: "Marks the native radio inputs as required." },
  { name: "invalid", type: "boolean", defaultValue: "false", description: "Marks the group and item controls invalid." },
  { name: "form", type: "string", defaultValue: "-", description: "Associates item inputs with an external form id." },
  { name: "dir", type: '"ltr" | "rtl"', defaultValue: "inherited", description: "Overrides the inherited direction used by keyboard navigation." },
  { name: "id", type: "string", defaultValue: "generated", description: "Stable identifier for the radio-group machine." },
  { name: "ids", type: "RadioRootProps['ids']", defaultValue: "generated", description: "Overrides generated root, label, indicator, item, control, text, and input IDs." },
  { name: "asChild", type: "boolean", defaultValue: "false", description: "Merges root behavior into one custom child element." },
] as const;

export const itemProps = [
  { name: "value", type: "string", defaultValue: "required", description: "Unique value selected and submitted by this item." },
  { name: "disabled", type: "boolean", defaultValue: "false", description: "Disables only this item." },
  { name: "invalid", type: "boolean", defaultValue: "false", description: "Marks only this item invalid." },
] as const;

export const parts = [
  { name: "Label", element: "span", description: "Accessible name for the radio group; clicking it focuses the group." },
  { name: "Item", element: "label", description: "Selectable option that renders its native hidden input automatically." },
  { name: "ItemControl", element: "div", description: "Visual circle with a default selected-state dot." },
  { name: "ItemText", element: "span", description: "Accessible item label and composable text content." },
  { name: "Indicator", element: "div", description: "Optional measured surface that follows the selected item." },
  { name: "Context", element: "renderless", description: "Exposes the root radio-group API to its slot." },
  { name: "ItemContext", element: "renderless", description: "Exposes checked, focused, hovered, active, disabled, and invalid item state." },
  { name: "RootProvider", element: "div", description: "Root variant driven by an external useRadioGroup machine." },
] as const;

export const events = [
  { name: "update:modelValue", payload: "string | null", description: "Emitted when selection changes; drives v-model." },
  { name: "valueChange", payload: "{ value: string | null }", description: "Ark UI detail emitted after selection changes." },
] as const;

export const exportsList = [
  { name: "Radio", description: "Compound API exposing Root, RootProvider, Label, Indicator, Item, ItemControl, ItemText, Context, and ItemContext." },
  { name: "RadioRoot", description: "Unaugmented group root with controlled and uncontrolled state." },
  { name: "RadioRootProvider", description: "Group root driven by an external useRadioGroup machine." },
  { name: "RadioLabel", description: "Accessible group label." },
  { name: "RadioIndicator", description: "Optional moving selection surface." },
  { name: "RadioItem", description: "Radio option with an automatic native hidden input." },
  { name: "RadioItemControl", description: "Visual radio control with a default dot." },
  { name: "RadioItemText", description: "Accessible option text." },
  { name: "RadioContext", description: "Renderless root context consumer." },
  { name: "RadioItemContext", description: "Renderless item-state context consumer." },
  { name: "RadioProps", description: "Public root prop contract." },
  { name: "RadioItemProps", description: "Public item prop contract." },
  { name: "RadioGroupValueChangeDetails", description: "Payload for valueChange." },
  { name: "useRadioGroup", description: "Ark UI machine hook for external state control." },
  { name: "useRadioGroupContext", description: "Ark UI root context hook." },
  { name: "useRadioGroupItemContext", description: "Ark UI item-state context hook." },
  { name: "radioGroupAnatomy", description: "Ark UI part anatomy metadata." },
] as const;
