export const barrelCode = `import { Toggle } from "@dicehub/kappa";`;

export const granularCode = `import { Toggle } from "@dicehub/kappa/components/toggle";`;

export const previewCode = `<script setup>
import { Toggle } from "@dicehub/kappa/components/toggle";
import { Bookmark } from "@lucide/vue";
</script>

<template>
  <Toggle
    aria-label="Toggle bookmark"
    class="bookmark-toggle"
    size="sm"
    variant="outline"
  >
    <Bookmark aria-hidden="true" class="bookmark-toggle__icon" />
    Bookmark
  </Toggle>
</template>

<style scoped>
.bookmark-toggle[data-state="on"] .bookmark-toggle__icon {
  fill: currentColor;
}
</style>`;

export const usageCode = `<script setup>
import { Bold } from "@lucide/vue";
import { Toggle } from "@dicehub/kappa/components/toggle";
</script>

<template>
  <Toggle aria-label="Bold" default-pressed>
    <Bold aria-hidden="true" />
  </Toggle>
</template>`;

export const variantsCode = `<script setup>
import { Bold, Italic } from "@lucide/vue";
import { Toggle } from "@dicehub/kappa/components/toggle";
</script>

<template>
  <Toggle aria-label="Bold" default-pressed>
    <Bold aria-hidden="true" />
  </Toggle>
  <Toggle aria-label="Italic" variant="outline">
    <Italic aria-hidden="true" />
  </Toggle>
</template>`;

export const textCode = `<script setup>
import { Italic } from "@lucide/vue";
import { Toggle } from "@dicehub/kappa/components/toggle";
</script>

<template>
  <Toggle variant="outline">
    <Italic aria-hidden="true" />
    Italic
  </Toggle>
</template>`;

export const sizesCode = `<script setup>
import { Bookmark } from "@lucide/vue";
import { Toggle } from "@dicehub/kappa/components/toggle";
</script>

<template>
  <Toggle size="sm" variant="outline">
    <Bookmark aria-hidden="true" />
    Small
  </Toggle>
  <Toggle size="base" variant="outline">
    <Bookmark aria-hidden="true" />
    Base
  </Toggle>
  <Toggle size="lg" variant="outline">
    <Bookmark aria-hidden="true" />
    Large
  </Toggle>
</template>`;

export const controlledCode = `<script setup>
import { Bookmark } from "@lucide/vue";
import { ref } from "vue";
import { Toggle } from "@dicehub/kappa/components/toggle";

const saved = ref(true);
</script>

<template>
  <Toggle v-model:pressed="saved" aria-label="Save report" variant="outline">
    <Bookmark :fill="saved ? 'currentColor' : 'none'" aria-hidden="true" />
  </Toggle>
  <output aria-live="polite">{{ saved ? "Saved" : "Not saved" }}</output>
</template>`;

export const disabledCode = `<script setup>
import { Bold, Italic } from "@lucide/vue";
import { Toggle } from "@dicehub/kappa/components/toggle";
</script>

<template>
  <Toggle disabled aria-label="Bold unavailable">
    <Bold aria-hidden="true" />
  </Toggle>
  <Toggle disabled default-pressed aria-label="Italic enabled and unavailable">
    <Italic aria-hidden="true" />
  </Toggle>
</template>`;

export const rtlCode = `<script setup>
import { Bookmark } from "@lucide/vue";
import { Toggle } from "@dicehub/kappa/components/toggle";
</script>

<template>
  <div dir="rtl" lang="ar">
    <Toggle class="bookmark-toggle" variant="outline">
      <Bookmark aria-hidden="true" class="bookmark-toggle__icon" />
      حفظ
    </Toggle>
  </div>
</template>

<style scoped>
.bookmark-toggle[data-state="on"] .bookmark-toggle__icon {
  fill: currentColor;
}
</style>`;

export const toggleProps = [
  {
    name: "pressed",
    type: "boolean",
    defaultValue: "—",
    description: "Controls the pressed state. Use with v-model:pressed.",
  },
  {
    name: "defaultPressed",
    type: "boolean",
    defaultValue: "false",
    description: "Sets the initial state when the component is uncontrolled.",
  },
  {
    name: "variant",
    type: '"default" | "outline"',
    defaultValue: '"default"',
    description: "Selects the quiet or bordered visual treatment.",
  },
  {
    name: "size",
    type: '"sm" | "base" | "lg"',
    defaultValue: '"base"',
    description: "Selects compact control, icon, spacing, and text geometry.",
  },
  {
    name: "disabled",
    type: "boolean",
    defaultValue: "false",
    description: "Blocks focus and state changes with native button behavior.",
  },
  {
    name: "type",
    type: '"button" | "submit" | "reset"',
    defaultValue: '"button"',
    description: "Sets the native button type. The safe default prevents accidental form submission.",
  },
] as const;

export const events = [
  {
    name: "update:pressed",
    payload: "boolean",
    description: "Supports v-model:pressed and controlled state.",
  },
  {
    name: "pressedChange",
    payload: "boolean",
    description: "Reports the requested pressed state after activation.",
  },
] as const;

export const slots = [
  {
    name: "default",
    description: "Renders an icon, visible label, or both inside the button.",
  },
] as const;

export const dataAttributes = [
  {
    name: "data-slot",
    value: '"toggle"',
    description: "Identifies the root button.",
  },
  {
    name: "data-state",
    value: '"on" | "off"',
    description: "Exposes the resolved pressed state.",
  },
  {
    name: "data-pressed",
    value: "present",
    description: "Appears while the toggle is pressed.",
  },
  {
    name: "data-disabled",
    value: "present",
    description: "Appears while the native button is disabled.",
  },
  {
    name: "data-variant",
    value: '"default" | "outline"',
    description: "Exposes the resolved visual treatment.",
  },
  {
    name: "data-size",
    value: '"sm" | "base" | "lg"',
    description: "Exposes the resolved compact size.",
  },
] as const;

export const exportsList = [
  { name: "Toggle", description: "Native two-state pressed button." },
  {
    name: "ToggleProps / ToggleEmits / ToggleSlots",
    description: "Public Vue component, event, and slot contracts.",
  },
  {
    name: "ToggleVariant / ToggleSize / ToggleType",
    description: "Supported visual, size, and native button options.",
  },
  {
    name: "TOGGLE_VARIANTS / TOGGLE_SIZES / TOGGLE_TYPES",
    description: "Runtime option lists and safe defaults.",
  },
  {
    name: "TOGGLE_DEFAULT_VARIANT / TOGGLE_DEFAULT_SIZE / TOGGLE_DEFAULT_TYPE",
    description: "Published defaults for visual, size, and native button options.",
  },
  {
    name: "isToggle* / resolveToggle*",
    description: "Runtime guards and safe option resolvers.",
  },
] as const;

export const keyboardRows = [
  { key: "Space", description: "Toggles the focused button." },
  { key: "Enter", description: "Toggles the focused button." },
] as const;
