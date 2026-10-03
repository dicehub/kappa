<script setup lang="ts">
import { Text } from "@dicehub/kappa/components/text";

type DemoVariant =
  | "preview"
  | "usage"
  | "overview"
  | "variants"
  | "sizes"
  | "semantic"
  | "inline"
  | "monospace"
  | "truncate"
  | "rtl";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});
</script>

<template>
  <div class="text-demo" :data-text-demo="props.variant">
    <Text v-if="props.variant === 'preview'">
      Clear copy keeps an interface easy to scan.
    </Text>

    <Text v-else-if="props.variant === 'usage'">
      Changes are saved automatically.
    </Text>

    <div v-else-if="props.variant === 'overview'" class="text-demo__overview">
      <div class="text-demo__overview-row" data-text-overview-row="heading">
        <Text variant="mono-secondary" class="text-demo__overview-token">heading · base</Text>
        <Text variant="heading" as="span" data-overview-sample>Heading</Text>
        <Text variant="mono-secondary" class="text-demo__overview-meta">16 px · 650</Text>
      </div>
      <div class="text-demo__overview-row" data-text-overview-row="heading-lg">
        <Text variant="mono-secondary" class="text-demo__overview-token">heading · lg</Text>
        <Text variant="heading" size="lg" as="span" data-overview-sample>Heading large</Text>
        <Text variant="mono-secondary" class="text-demo__overview-meta">20 px · 650</Text>
      </div>
      <div class="text-demo__overview-row" data-text-overview-row="body-xs">
        <Text variant="mono-secondary" class="text-demo__overview-token">body · xs</Text>
        <Text size="xs" data-overview-sample>Body extra small</Text>
        <Text variant="mono-secondary" class="text-demo__overview-meta">12 px · 400</Text>
      </div>
      <div class="text-demo__overview-row" data-text-overview-row="body-sm">
        <Text variant="mono-secondary" class="text-demo__overview-token">body · sm</Text>
        <Text size="sm" data-overview-sample>Body small</Text>
        <Text variant="mono-secondary" class="text-demo__overview-meta">13 px · 400</Text>
      </div>
      <div class="text-demo__overview-row" data-text-overview-row="body-base">
        <Text variant="mono-secondary" class="text-demo__overview-token">body · base</Text>
        <Text data-overview-sample>Body</Text>
        <Text variant="mono-secondary" class="text-demo__overview-meta">14 px · 400</Text>
      </div>
      <div class="text-demo__overview-row" data-text-overview-row="body-lg">
        <Text variant="mono-secondary" class="text-demo__overview-token">body · lg</Text>
        <Text size="lg" data-overview-sample>Body large</Text>
        <Text variant="mono-secondary" class="text-demo__overview-meta">16 px · 400</Text>
      </div>
      <div class="text-demo__overview-row" data-text-overview-row="body-bold">
        <Text variant="mono-secondary" class="text-demo__overview-token">body · bold</Text>
        <Text bold data-overview-sample>Body bold</Text>
        <Text variant="mono-secondary" class="text-demo__overview-meta">14 px · 550</Text>
      </div>
      <div class="text-demo__overview-row" data-text-overview-row="secondary">
        <Text variant="mono-secondary" class="text-demo__overview-token">secondary</Text>
        <Text variant="secondary" data-overview-sample>Secondary</Text>
        <Text variant="mono-secondary" class="text-demo__overview-meta">14 px · 400</Text>
      </div>
      <div class="text-demo__overview-row" data-text-overview-row="mono">
        <Text variant="mono-secondary" class="text-demo__overview-token">mono · base</Text>
        <Text variant="mono" data-overview-sample>Monospace</Text>
        <Text variant="mono-secondary" class="text-demo__overview-meta">13 px · 400</Text>
      </div>
      <div class="text-demo__overview-row" data-text-overview-row="mono-lg">
        <Text variant="mono-secondary" class="text-demo__overview-token">mono · lg</Text>
        <Text variant="mono" size="lg" data-overview-sample>Monospace large</Text>
        <Text variant="mono-secondary" class="text-demo__overview-meta">14 px · 400</Text>
      </div>
      <div class="text-demo__overview-row" data-text-overview-row="mono-secondary">
        <Text variant="mono-secondary" class="text-demo__overview-token">mono-secondary</Text>
        <Text variant="mono-secondary" data-overview-sample>Monospace secondary</Text>
        <Text variant="mono-secondary" class="text-demo__overview-meta">13 px · 400</Text>
      </div>
      <div class="text-demo__overview-row" data-text-overview-row="success">
        <Text variant="mono-secondary" class="text-demo__overview-token">success</Text>
        <Text variant="success" data-overview-sample>Success</Text>
        <Text variant="mono-secondary" class="text-demo__overview-meta">14 px · 400</Text>
      </div>
      <div class="text-demo__overview-row" data-text-overview-row="error">
        <Text variant="mono-secondary" class="text-demo__overview-token">error</Text>
        <Text variant="error" data-overview-sample>Error</Text>
        <Text variant="mono-secondary" class="text-demo__overview-meta">14 px · 400</Text>
      </div>
    </div>

    <div v-else-if="props.variant === 'variants'" class="text-demo__specimen">
      <div class="text-demo__row">
        <Text variant="mono-secondary">heading</Text>
        <Text variant="heading" as="h3">Project status</Text>
      </div>
      <div class="text-demo__row">
        <Text variant="mono-secondary">body</Text>
        <Text>All systems are available.</Text>
      </div>
      <div class="text-demo__row">
        <Text variant="mono-secondary">secondary</Text>
        <Text variant="secondary">Checked a few seconds ago</Text>
      </div>
      <div class="text-demo__row">
        <Text variant="mono-secondary">success</Text>
        <Text variant="success">Connection restored</Text>
      </div>
      <div class="text-demo__row">
        <Text variant="mono-secondary">error</Text>
        <Text variant="error">Connection failed</Text>
      </div>
    </div>

    <div v-else-if="props.variant === 'sizes'" class="text-demo__scale">
      <Text size="xs"><span>xs</span>Extra small · 12 px</Text>
      <Text size="sm"><span>sm</span>Small · 13 px</Text>
      <Text size="base"><span>base</span>Base · 14 px</Text>
      <Text size="lg"><span>lg</span>Large · 16 px</Text>
    </div>

    <section v-else-if="props.variant === 'semantic'" class="text-demo__semantic">
      <Text variant="heading" size="lg" as="h2">Account security</Text>
      <Text as="p">Review active sessions and recovery methods.</Text>
    </section>

    <p v-else-if="props.variant === 'inline'" class="text-demo__sentence">
      The export finished in
      <Text as="span" variant="success" bold>42 seconds</Text>.
    </p>

    <div v-else-if="props.variant === 'monospace'" class="text-demo__mono">
      <Text variant="mono" as="code">job_01K41Q7Z</Text>
      <Text
        variant="mono-secondary"
        as="time"
        datetime="2026-08-28T16:40:00+02:00"
      >
        2026-08-28 16:40 CEST
      </Text>
    </div>

    <div v-else-if="props.variant === 'truncate'" class="text-demo__truncate">
      <Text
        truncate
        title="This is a long piece of text that will be truncated with an ellipsis when it overflows its container."
      >
        This is a long piece of text that will be truncated with an ellipsis when it overflows its
        container.
      </Text>
    </div>

    <div v-else class="text-demo__rtl" dir="rtl" lang="ar">
      <Text variant="heading" as="h3">حالة المشروع</Text>
      <Text variant="secondary">تم التحديث قبل لحظات</Text>
    </div>
  </div>
</template>

<style scoped>
.text-demo {
  display: grid;
  inline-size: 100%;
  min-inline-size: 0;
  min-block-size: 7rem;
  place-items: center;
  color: var(--kappa-default, #17191f);
  font-family: var(--kappa-font-sans, inherit);
}

.text-demo__specimen {
  inline-size: min(100%, 30rem);
  border-block: 1px solid var(--kappa-line, #e3e6eb);
}

.text-demo__overview {
  inline-size: min(100%, 38rem);
  overflow: hidden;
  border: 1px solid var(--kappa-line, #e3e6eb);
  border-radius: 0.5rem;
}

.text-demo__overview-row {
  display: grid;
  grid-template-columns: 8.75rem minmax(0, 1fr) auto;
  align-items: baseline;
  gap: 1rem;
  min-block-size: 3rem;
  padding: 0.625rem 0.875rem;
}

.text-demo__overview-row + .text-demo__overview-row {
  border-block-start: 1px solid var(--kappa-line, #e3e6eb);
}

.text-demo__overview-token,
.text-demo__overview-meta {
  font-size: 0.6875rem;
  line-height: 1rem;
}

.text-demo__overview-meta {
  justify-self: end;
  white-space: nowrap;
}

.text-demo__row {
  display: grid;
  grid-template-columns: 6.5rem minmax(0, 1fr);
  align-items: baseline;
  gap: 1rem;
  padding-block: 0.625rem;
}

.text-demo__row + .text-demo__row {
  border-block-start: 1px solid var(--kappa-line, #e3e6eb);
}

.text-demo__scale,
.text-demo__semantic,
.text-demo__mono,
.text-demo__rtl {
  display: grid;
  inline-size: min(100%, 27rem);
  gap: 0.625rem;
}

.text-demo__scale :deep(.kappa-text) {
  display: grid;
  grid-template-columns: 3rem minmax(0, 1fr);
  align-items: baseline;
  gap: 0.75rem;
}

.text-demo__scale span {
  color: var(--kappa-subtle, #6c7480);
  font-family: var(--kappa-font-mono, ui-monospace, monospace);
  font-size: 0.6875rem;
}

.text-demo__semantic {
  gap: 0.25rem;
}

.text-demo__sentence {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
}

.text-demo__mono {
  inline-size: fit-content;
  gap: 0.375rem;
  justify-items: start;
}

.text-demo__truncate {
  inline-size: min(16rem, 100%);
  padding: 1rem;
  border: 1px solid var(--kappa-line, #e3e6eb);
  border-radius: 0.5rem;
}

.text-demo__rtl {
  justify-items: start;
}

@media (max-width: 30rem) {
  .text-demo__overview-row {
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 0.25rem 0.75rem;
  }

  .text-demo__overview-token {
    grid-column: 1 / -1;
  }

  .text-demo__row {
    grid-template-columns: 5rem minmax(0, 1fr);
    gap: 0.625rem;
  }
}
</style>
