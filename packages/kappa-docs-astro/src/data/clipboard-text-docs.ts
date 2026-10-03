export const barrelCode = `import {
  ClipboardText,
  ClipboardTextRoot,
  ClipboardTextRootProvider,
  ClipboardTextLabel,
  ClipboardTextControl,
  ClipboardTextInput,
  ClipboardTextTrigger,
  ClipboardTextIndicator,
  ClipboardTextValueText,
  ClipboardTextContext,
} from "@dicehub/kappa";`;

export const granularCode = `import {
  ClipboardText,
  ClipboardTextRoot,
  ClipboardTextRootProvider,
  ClipboardTextLabel,
  ClipboardTextControl,
  ClipboardTextInput,
  ClipboardTextTrigger,
  ClipboardTextIndicator,
  ClipboardTextValueText,
  ClipboardTextContext,
} from "@dicehub/kappa/components/clipboard-text";`;

export const previewCode = `<script setup>
import { ClipboardText } from "@dicehub/kappa/components/clipboard-text";
</script>

<template>
  <ClipboardText.Root default-value="ws_01J9X4A8C2E6G0K4M8P2R6T0V4">
    <ClipboardText.Label>Workspace ID</ClipboardText.Label>
    <ClipboardText.Control>
      <ClipboardText.Input />
      <ClipboardText.Trigger aria-label="Copy workspace ID" />
    </ClipboardText.Control>
  </ClipboardText.Root>
</template>`;

export const usageCode = `<script setup>
import { ClipboardText } from "@dicehub/kappa/components/clipboard-text";
</script>

<template>
  <ClipboardText.Root default-value="https://example.com/docs/components/clipboard-text">
    <ClipboardText.Label>Documentation URL</ClipboardText.Label>
    <ClipboardText.Control>
      <ClipboardText.Input />
      <ClipboardText.Trigger aria-label="Copy documentation URL" />
    </ClipboardText.Control>
  </ClipboardText.Root>
</template>`;

export const compositionCode = `<script setup>
import {
  ClipboardTextRoot,
  ClipboardTextControl,
  ClipboardTextInput,
  ClipboardTextTrigger,
  ClipboardTextIndicator,
} from "@dicehub/kappa/components/clipboard-text";
</script>

<template>
  <ClipboardTextRoot default-value="custom-marks">
    <ClipboardTextControl>
      <ClipboardTextInput />
      <ClipboardTextTrigger aria-label="Copy value">
        <ClipboardTextIndicator>
          <CopyIcon />
          <template #copied><CheckIcon /></template>
        </ClipboardTextIndicator>
      </ClipboardTextTrigger>
    </ClipboardTextControl>
  </ClipboardTextRoot>
</template>`;

export const valueTextCode = `<script setup>
import { ClipboardText } from "@dicehub/kappa/components/clipboard-text";
</script>

<template>
  <ClipboardText.Root default-value="demo_access_token_not_valid">
    <ClipboardText.ValueText />
    <ClipboardText.Trigger aria-label="Copy access token" />
  </ClipboardText.Root>
</template>`;

export const timeoutCode = `<script setup>
import { ClipboardText } from "@dicehub/kappa/components/clipboard-text";
</script>

<template>
  <ClipboardText.Root default-value="token_short_feedback" :timeout="800">
    <ClipboardText.Label>Short feedback window (800 ms)</ClipboardText.Label>
    <ClipboardText.Control>
      <ClipboardText.Input />
      <ClipboardText.Trigger aria-label="Copy token" />
    </ClipboardText.Control>
  </ClipboardText.Root>
</template>`;

export const controlledCode = `<script setup>
import { ref } from "vue";
import { ClipboardText } from "@dicehub/kappa/components/clipboard-text";

const runId = ref("run_01J9X7KQ2M4V8N6P3R5T7W9Y0B");
const lastCopied = ref("none");
</script>

<template>
  <ClipboardText.Root
    v-model="runId"
    @status-change="lastCopied = $event.copied ? runId : lastCopied"
  >
    <ClipboardText.Label>Run ID</ClipboardText.Label>
    <ClipboardText.Control>
      <ClipboardText.Input />
      <ClipboardText.Trigger aria-label="Copy run ID" />
    </ClipboardText.Control>
  </ClipboardText.Root>
  <p>Last copied: {{ lastCopied }}</p>
</template>`;

export const rootProps = [
  { name: "modelValue", type: "string", defaultValue: "-", description: "Controlled value to copy; supports v-model." },
  { name: "defaultValue", type: "string", defaultValue: "-", description: "Value to copy for uncontrolled use." },
  { name: "timeout", type: "number", defaultValue: "3000", description: "Milliseconds the copied feedback state stays active." },
  { name: "translations", type: "IntlTranslations", defaultValue: "localized", description: "Accessible names for the copy trigger and status announcements." },
  { name: "id", type: "string", defaultValue: "generated", description: "Stable identifier for the clipboard state machine." },
  { name: "ids", type: "ClipboardTextRootProps['ids']", defaultValue: "generated", description: "Overrides generated root, input, and label IDs." },
  { name: "asChild", type: "boolean", defaultValue: "false", description: "Merges root behavior into the single child element." },
] as const;

export const parts = [
  { name: "Label", element: "label", description: "Names the field and focuses the value input on click." },
  { name: "Control", element: "div", description: "Bordered box grouping the value input and copy trigger." },
  { name: "Input", element: "input", description: "Read-only monospaced value; selectable for manual copying." },
  { name: "Trigger", element: "button", description: "Copies on click; renders copy and check icons by default." },
  { name: "Indicator", element: "div", description: "Switches between its default and copied slots on feedback." },
  { name: "ValueText", element: "span", description: "Inline value display for compositions without the control box." },
  { name: "Context", element: "renderless", description: "Exposes the clipboard API to its slot." },
  { name: "RootProvider", element: "div", description: "Root driven by an external useClipboard machine." },
] as const;

export const events = [
  { name: "statusChange", payload: "{ copied: boolean }", description: "Emitted when the copied feedback state flips." },
  { name: "update:modelValue", payload: "string", description: "Emitted when the value changes; drives v-model." },
  { name: "valueChange", payload: "{ value: string }", description: "Ark UI detail for value edits." },
] as const;

export const exportsList = [
  { name: "ClipboardText", description: "Compound API exposing every named part." },
  { name: "ClipboardTextRoot", description: "Unaugmented root state machine host." },
  { name: "ClipboardTextTrigger", description: "Copy button with default icon swap." },
  { name: "ClipboardTextIndicator", description: "Default/copied slot switch." },
  { name: "ClipboardTextProps", description: "Public root props and Ark UI state contract." },
  { name: "ClipboardTextEmits", description: "Root event contract." },
  { name: "ClipboardCopyStatusDetails", description: "Payload for statusChange." },
  { name: "useClipboard", description: "Ark UI machine hook for external state control." },
  { name: "clipboardAnatomy", description: "Ark UI part anatomy metadata." },
] as const;
