export const barrelCode = `import { ExpandableText } from "@dicehub/kappa";`;

export const granularCode = `import { ExpandableText } from "@dicehub/kappa/components/expandable-text";`;

export const previewCode = `<script setup>
import { ExpandableText } from "@dicehub/kappa/components/expandable-text";
</script>

<template>
  <ExpandableText :lines="3">
    <p>
      Run 184 reached the target residual after 1,240 iterations. The pressure
      field is stable, but the rear-wheel wake still changes between the final
      sampling windows. The drag coefficient varies by 1.8 percent after the
      residual plateau, and the separation point moves between the final three
      samples. Keep this result as the baseline, add one refinement level around
      the rear wheel and diffuser, then repeat the comparison with a longer
      averaging window.
    </p>
  </ExpandableText>
</template>`;

export const linesCode = `<script setup>
import { ExpandableText } from "@dicehub/kappa/components/expandable-text";

const summary = "The imported surface contains 48 patches and 2.6 million triangles. All edges are manifold, and three small gaps must be repaired before meshing starts.";
</script>

<template>
  <ExpandableText :lines="2">
    <p>{{ summary }}</p>
  </ExpandableText>

  <ExpandableText :lines="4">
    <p>{{ summary }}</p>
  </ExpandableText>
</template>`;

export const controlledCode = `<script setup>
import { ref } from "vue";
import { ExpandableText } from "@dicehub/kappa/components/expandable-text";

const open = ref(false);
const review = "The imported surface is valid, but three small gaps must be repaired before volume meshing starts.";
</script>

<template>
  <button type="button" @click="open = !open">
    {{ open ? "Collapse externally" : "Expand externally" }}
  </button>
  <ExpandableText v-model:open="open" :lines="2">
    <p>{{ review }}</p>
  </ExpandableText>
</template>`;

export const customTriggerCode = `<script setup>
import { ExpandableText } from "@dicehub/kappa/components/expandable-text";

const review = "The imported surface is valid, but three small gaps must be repaired before volume meshing starts.";
</script>

<template>
  <ExpandableText
    :lines="2"
    expand-label="Read run note"
    collapse-label="Close run note"
  >
    <p>{{ review }}</p>
    <template #trigger="{ open }">
      {{ open ? "Close run note" : "Read run note" }}
    </template>
  </ExpandableText>
</template>`;

export const shortContentCode = `<script setup>
import { ExpandableText } from "@dicehub/kappa/components/expandable-text";
</script>

<template>
  <ExpandableText :lines="3">
    <p>Mesh quality checks passed. The case is ready to run.</p>
  </ExpandableText>
</template>`;

export const expandableTextProps = [
  { name: "lines", type: "number", defaultValue: "3", description: "Number of visible lines while the content is collapsed." },
  { name: "defaultOpen", type: "boolean", defaultValue: "false", description: "Initial expanded state when the component is uncontrolled." },
  { name: "open / v-model:open", type: "boolean", defaultValue: "—", description: "Controls the expanded state." },
  { name: "disabled", type: "boolean", defaultValue: "false", description: "Prevents the disclosure control from changing state." },
  { name: "id", type: "string", defaultValue: "generated", description: "Stable identifier used for the Ark UI disclosure relationship." },
  { name: "expandLabel", type: "string", defaultValue: '"Show more"', description: "Visible and accessible label used while collapsed." },
  { name: "collapseLabel", type: "string", defaultValue: '"Show less"', description: "Visible and accessible label used while expanded." },
] as const;

export const slots = [
  ["default", "Text or simple prose content."],
  ["trigger", "Custom trigger label. Receives open and label values."],
] as const;

export const dataSlots = [
  ["expandable-text", "div", "Ark UI Collapsible root and consumer attribute target."],
  ["expandable-text-content", "div", "Measured and animated disclosure viewport."],
  ["expandable-text-body", "div", "Natural-height prose container."],
  ["expandable-text-trigger", "button", "Rendered only when the content exceeds the line limit."],
  ["expandable-text-indicator", "svg", "Chevron that follows the expanded state."],
] as const;

export const events = [
  ["update:open", "boolean", "Supports controlled Vue state."],
  ["openChange", "CollapsibleOpenChangeDetails", "Reports the Ark UI state change."],
] as const;

export const exportsList = [
  ["ExpandableText", "Measured line truncation with an accessible disclosure control."],
  ["ExpandableTextProps / ExpandableTextEmits / ExpandableTextSlots", "Public component contracts."],
  ["ExpandableTextTriggerSlotProps", "Scoped trigger-slot values."],
  ["EXPANDABLE_TEXT_DEFAULT_*", "Public line and label defaults."],
  ["resolveExpandableTextLines", "Normalizes line values to a positive integer."],
] as const;
