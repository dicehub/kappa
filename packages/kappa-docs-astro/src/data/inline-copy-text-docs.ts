export const barrelCode = `import { InlineCopyText } from "@dicehub/kappa";`;
export const granularCode = `import { InlineCopyText } from "@dicehub/kappa/components/inline-copy-text";`;

const example = (template: string) => `<script setup>
import { InlineCopyText } from "@dicehub/kappa/components/inline-copy-text";
</script>

<template>
${template}
</template>`;

export const previewCode = example(`  <p>
    Use <InlineCopyText value="ws_8f2c4a91" copy-label="Copy workspace ID" /> in your request.
  </p>`);
export const rowCode = example(`  <div data-kappa-copy-group>
    <a href="/workspaces/ws_8f2c4a91">Simulation workspace</a>
    <InlineCopyText value="ws_8f2c4a91" copy-label="Copy workspace ID" />
  </div>`);
export const customCode = example(`  <InlineCopyText value="run_20261004_0842_eu_central" copy-label="Copy full run ID">
    run_<strong>0842</strong>…
  </InlineCopyText>`);
export const stylesCode = example(`  <InlineCopyText value="build_0842" variant="body" size="base" bold icon-visibility="always" />
  <InlineCopyText value="eu-central" variant="secondary" size="xs" />
  <InlineCopyText
    value="run_20261004_0842_eu_central_simulation"
    copy-label="Copy long run ID"
    truncate
    style="max-inline-size: 12rem"
  />`);
export const statesCode = `<script setup>
import { ref } from "vue";
import { InlineCopyText } from "@dicehub/kappa/components/inline-copy-text";

const value = ref("job_0842");
const copyCount = ref(0);
</script>

<template>
  <label>Job ID <input v-model="value" /></label>
  <InlineCopyText
    :value="value"
    copy-label="Copy job ID"
    copied-label="Job ID copied"
    :timeout="800"
    @status-change="copyCount++"
  />
  <span>Copies: {{ copyCount }}</span>
  <InlineCopyText value="job_pending" copy-label="Copy pending job ID" disabled />
  <InlineCopyText
    value="auftrag_0842"
    copy-label="Auftrags-ID kopieren"
    copied-label="Kopiert"
    lang="de"
  />
</template>`;

export const props = [
  { name: "value", type: "string", defaultValue: "required", description: "Exact text to copy. Also displayed without a default slot." },
  { name: "copyLabel", type: "string", defaultValue: '"Copy to clipboard"', description: "Accessible action prefix and tooltip text. The visible text remains in the button's name." },
  { name: "copiedLabel", type: "string", defaultValue: '"Copied"', description: "Copied tooltip and live announcement." },
  { name: "disabled", type: "boolean", defaultValue: "false", description: "Prevents activation and removes the control from the tab order." },
  { name: "iconVisibility", type: '"hover" | "always"', defaultValue: '"hover"', description: "Shows the icon on hover, focus, or copied feedback. Touch devices always show it." },
  { name: "variant", type: '"body" | "secondary" | "mono" | "mono-secondary"', defaultValue: '"mono-secondary"', description: "Text font and color." },
  { name: "size", type: '"xs" | "sm" | "base" | "lg"', defaultValue: '"sm"', description: "Text size for all variants, including monospace." },
  { name: "bold", type: "boolean", defaultValue: "false", description: "Uses the medium text weight." },
  { name: "truncate", type: "boolean", defaultValue: "false", description: "Clips display text to one line. Set a width on the control or its container." },
  { name: "timeout", type: "number", defaultValue: "3000", description: "Milliseconds before Ark UI resets copied feedback." },
] as const;

export const examples = [
  { id: "row-hover", title: "Row hover", variant: "row", code: rowCode, description: "Add data-kappa-copy-group to a parent to reveal its copy icons on hover or focus within. Keep links and other controls beside the copy button." },
  { id: "custom-display", title: "Custom display", variant: "custom", code: customCode, description: "The default slot changes the display. The value prop always supplies the copied text. Use text and inline markup in this slot." },
  { id: "text-styles", title: "Text styles", variant: "styles", code: stylesCode, description: "Choose a font, size, and weight. Truncation preserves the full copy value and reserves space for the icon." },
  { id: "states", title: "Values and states", variant: "states", code: statesCode, description: "Bind value to application data. Set copyLabel and copiedLabel to localize feedback. Disable the control when its value is not available." },
] as const;
