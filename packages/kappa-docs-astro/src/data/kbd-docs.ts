export const barrelCode = `import { Kbd, KbdGroup } from "@dicehub/kappa";`;

export const granularCode = `import { Kbd, KbdGroup } from "@dicehub/kappa/components/kbd";`;

export const previewCode = `<script setup>
import { Kbd, KbdGroup } from "@dicehub/kappa/components/kbd";
</script>

<template>
  <Kbd><span aria-hidden="true">⌘</span><span class="visually-hidden">Command</span></Kbd>
  <Kbd><span aria-hidden="true">⇧</span><span class="visually-hidden">Shift</span></Kbd>
  <Kbd><span aria-hidden="true">⌥</span><span class="visually-hidden">Option</span></Kbd>
  <Kbd><span aria-hidden="true">⌃</span><span class="visually-hidden">Control</span></Kbd>
  <KbdGroup>
    <Kbd>Ctrl</Kbd>
    <span>+</span>
    <Kbd>B</Kbd>
  </KbdGroup>
</template>

<style scoped>
.visually-hidden {
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
</style>`;

export const usageCode = `<script setup>
import { Kbd } from "@dicehub/kappa/components/kbd";
</script>

<template>
  <Kbd>Enter</Kbd>
</template>`;

export const groupCode = `<KbdGroup>
  <Kbd>Ctrl</Kbd>
  <span>+</span>
  <Kbd>K</Kbd>
</KbdGroup>`;

export const buttonCode = `<script setup>
import { Button } from "@dicehub/kappa/components/button";
import { Kbd } from "@dicehub/kappa/components/kbd";
</script>

<template>
  <Button variant="outline">
    Accept
    <Kbd>Enter</Kbd>
  </Button>
</template>`;

export const tooltipCode = `<script setup>
import { Button } from "@dicehub/kappa/components/button";
import { Kbd, KbdGroup } from "@dicehub/kappa/components/kbd";
import { Tooltip } from "@dicehub/kappa/components/tooltip";
</script>

<template>
  <Tooltip.Root>
    <Tooltip.Trigger as-child>
      <Button variant="outline">Save changes</Button>
    </Tooltip.Trigger>
    <Tooltip.Content>
      Save changes
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <span>+</span>
        <Kbd>S</Kbd>
      </KbdGroup>
    </Tooltip.Content>
  </Tooltip.Root>
</template>`;

export const inlineCode = `<p>
  Press <Kbd>Esc</Kbd> to close the panel, or use
  <KbdGroup>
    <Kbd>Ctrl</Kbd>
    <span>+</span>
    <Kbd>Enter</Kbd>
  </KbdGroup>
  to open the result in a new tab.
</p>`;

export const rtlCode = `<p dir="rtl" lang="ar">
  اضغط
  <KbdGroup dir="ltr">
    <Kbd>Ctrl</Kbd>
    <span>+</span>
    <Kbd>K</Kbd>
  </KbdGroup>
  لفتح البحث
</p>`;

export const dataSlots = [
  { name: "kbd", element: "kbd", description: "Semantic keyboard-input keycap." },
  { name: "kbd-group", element: "span", description: "Inline shortcut grouping element." },
] as const;

export const slots = [
  { component: "Kbd", name: "default", description: "Visible key name or symbol." },
  {
    component: "KbdGroup",
    name: "default",
    description: "Keys and optional visible separators in one inline group.",
  },
] as const;

export const exportsList = [
  { name: "Kbd", description: "Semantic keyboard-input keycap." },
  { name: "KbdGroup", description: "Inline group for keys and visible separators." },
  { name: "KbdProps / KbdSlots", description: "Public Kbd prop and slot contracts." },
  {
    name: "KbdGroupProps / KbdGroupSlots",
    description: "Public KbdGroup prop and slot contracts.",
  },
] as const;
