export const barrelCode = `import { Text } from "@dicehub/kappa";`;

export const granularCode = `import { Text } from "@dicehub/kappa/components/text";`;

export const previewCode = `<script setup>
import { Text } from "@dicehub/kappa/components/text";
</script>

<template>
  <Text>Clear copy keeps an interface easy to scan.</Text>
</template>`;

export const usageCode = `<script setup>
import { Text } from "@dicehub/kappa/components/text";
</script>

<template>
  <Text>Changes are saved automatically.</Text>
</template>`;

export const overviewCode = `<script setup>
import { Text } from "@dicehub/kappa/components/text";
</script>

<template>
  <div class="text-overview">
    <Text variant="heading" as="h3">Heading</Text>
    <Text variant="heading" size="lg" as="h3">Heading large</Text>
    <Text size="xs">Body extra small</Text>
    <Text size="sm">Body small</Text>
    <Text>Body</Text>
    <Text size="lg">Body large</Text>
    <Text bold>Body bold</Text>
    <Text variant="secondary">Secondary</Text>
    <Text variant="mono">Monospace</Text>
    <Text variant="mono" size="lg">Monospace large</Text>
    <Text variant="mono-secondary">Monospace secondary</Text>
    <Text variant="success">Success</Text>
    <Text variant="error">Error</Text>
  </div>
</template>

<style scoped>
.text-overview {
  display: grid;
  gap: 0.75rem;
}
</style>`;

export const variantsCode = `<script setup>
import { Text } from "@dicehub/kappa/components/text";
</script>

<template>
  <div class="text-stack">
    <Text variant="heading" as="h3">Project status</Text>
    <Text>All systems are available.</Text>
    <Text variant="secondary">Checked a few seconds ago</Text>
    <Text variant="success">Connection restored</Text>
    <Text variant="error">Connection failed</Text>
  </div>
</template>`;

export const sizesCode = `<script setup>
import { Text } from "@dicehub/kappa/components/text";
</script>

<template>
  <div class="text-stack">
    <Text size="xs">Extra small · 12 px</Text>
    <Text size="sm">Small · 13 px</Text>
    <Text size="base">Base · 14 px</Text>
    <Text size="lg">Large · 16 px</Text>
  </div>
</template>`;

export const semanticCode = `<script setup>
import { Text } from "@dicehub/kappa/components/text";
</script>

<template>
  <section>
    <Text variant="heading" size="lg" as="h2">Account security</Text>
    <Text as="p">Review active sessions and recovery methods.</Text>
  </section>
</template>`;

export const inlineCode = `<script setup>
import { Text } from "@dicehub/kappa/components/text";
</script>

<template>
  <p>
    The export finished in
    <Text as="span" variant="success" bold>42 seconds</Text>.
  </p>
</template>`;

export const monospaceCode = `<script setup>
import { Text } from "@dicehub/kappa/components/text";
</script>

<template>
  <div class="text-stack">
    <Text variant="mono" as="code">job_01K41Q7Z</Text>
    <Text variant="mono-secondary" as="time" datetime="2026-08-28T16:40:00+02:00">
      2026-08-28 16:40 CEST
    </Text>
  </div>
</template>`;

export const truncateCode = `<script setup>
import { Text } from "@dicehub/kappa/components/text";
</script>

<template>
  <div class="truncate-demo">
    <Text
      truncate
      title="This is a long piece of text that will be truncated with an ellipsis when it overflows its container."
    >
      This is a long piece of text that will be truncated with an ellipsis when it overflows its
      container.
    </Text>
  </div>
</template>

<style scoped>
.truncate-demo {
  inline-size: 16rem;
  padding: 1rem;
  border: 1px solid var(--kappa-line);
  border-radius: 0.5rem;
}
</style>`;

export const rtlCode = `<script setup>
import { Text } from "@dicehub/kappa/components/text";
</script>

<template>
  <div dir="rtl" lang="ar">
    <Text variant="heading" as="h3">حالة المشروع</Text>
    <Text variant="secondary">تم التحديث قبل لحظات</Text>
  </div>
</template>`;

export const textProps = [
  {
    name: "variant",
    type: '"heading" | "body" | "secondary" | "success" | "error" | "mono" | "mono-secondary" | deprecated numbered headings',
    defaultValue: '"body"',
    description: "Sets visual typography only. It does not set document structure.",
  },
  {
    name: "size",
    type: '"xs" | "sm" | "base" | "lg"',
    defaultValue: '"base"',
    description: "Sets compact copy size. Heading and monospace variants accept only their documented large option.",
  },
  {
    name: "bold",
    type: "boolean",
    defaultValue: "false",
    description: "Uses medium weight on body, secondary, success, or error copy.",
  },
  {
    name: "truncate",
    type: "boolean",
    defaultValue: "false",
    description: "Clips one overflowing line and shows an ellipsis.",
  },
  {
    name: "as",
    type: '"h1"–"h6" | "p" | "span" | supported semantic text element',
    defaultValue: '"p" or "span"',
    description: "Selects a guarded native element. Body copy defaults to p; heading and monospace copy default to span.",
  },
] as const;

export const slots = [
  { name: "default", description: "Text content and inline semantic markup." },
] as const;

export const dataSlots = [
  { name: "text", element: "selected native element", description: "Polymorphic text root." },
] as const;

export const exportsList = [
  { name: "Text", description: "Polymorphic interface-text component." },
  { name: "TextProps / TextSlots", description: "Public Vue prop and slot contracts." },
  { name: "TextVariant / TextSize / TextElement", description: "Public variant, size, and element unions." },
  { name: "TEXT_VARIANTS / TEXT_SIZES / TEXT_ELEMENTS", description: "Supported public values." },
  { name: "TEXT_DEFAULT_VARIANTS / KAPPA_TEXT_DEFAULT_VARIANTS", description: "Default body and base-size values." },
  { name: "KAPPA_TEXT_VARIANTS / KAPPA_TEXT_STYLING", description: "Structured typography metadata." },
  { name: "textVariants", description: "Builds deterministic Kappa Text classes." },
  { name: "isTextVariant / isTextSize / isTextElement", description: "Public value guards." },
  { name: "resolveTextVariant / resolveTextSize / resolveTextElement", description: "Safe runtime resolvers." },
] as const;
