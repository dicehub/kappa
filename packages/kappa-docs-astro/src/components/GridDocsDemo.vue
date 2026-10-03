<script setup lang="ts">
import { Grid, GridItem } from "@dicehub/kappa/components/grid";

type DemoVariant = "preview" | "usage" | "variants" | "asymmetric" | "gaps" | "mobile-divider" | "semantic";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const variantExamples = [
  { variant: "2up", count: 2 },
  { variant: "3up", count: 3 },
  { variant: "4up", count: 4 },
] as const;

const gapExamples = ["none", "sm", "base", "lg"] as const;

const people = [
  ["Avery Morgan", "Product"],
  ["Jordan Lee", "Design"],
  ["Sam Rivera", "Engineering"],
] as const;
</script>

<template>
  <div class="grid-demo" :data-grid-demo="props.variant">
    <Grid v-if="props.variant === 'preview'" variant="2up" gap="base">
      <GridItem>
        <article class="grid-demo__tile">
          <span class="grid-demo__index">01 / PLAN</span>
          <strong>Project brief</strong>
          <p>Set scope, owners, and delivery milestones.</p>
        </article>
      </GridItem>
      <GridItem>
        <article class="grid-demo__tile">
          <span class="grid-demo__index">02 / REVIEW</span>
          <strong>Decision log</strong>
          <p>Track feedback, decisions, and final approval.</p>
        </article>
      </GridItem>
    </Grid>

    <Grid v-else-if="props.variant === 'usage'" variant="2up">
      <GridItem><div class="grid-demo__tile grid-demo__tile--compact">Primary content</div></GridItem>
      <GridItem><div class="grid-demo__tile grid-demo__tile--compact">Supporting content</div></GridItem>
    </Grid>

    <div v-else-if="props.variant === 'variants'" class="grid-demo__stack">
      <section v-for="({ variant, count }) in variantExamples" :key="variant">
        <code>variant="{{ variant }}"</code>
        <Grid :variant="variant" gap="sm">
          <GridItem v-for="item in count" :key="item">
            <div class="grid-demo__tile grid-demo__tile--number">{{ item }}</div>
          </GridItem>
        </Grid>
      </section>
    </div>

    <div v-else-if="props.variant === 'asymmetric'" class="grid-demo__stack">
      <section>
        <code>variant="2-1"</code>
        <Grid variant="2-1" gap="sm">
          <GridItem as="article"><div class="grid-demo__tile"><strong>Main</strong><p>Two-thirds region</p></div></GridItem>
          <GridItem as="section"><div class="grid-demo__tile"><strong>Side</strong><p>One-third region</p></div></GridItem>
        </Grid>
      </section>
      <section>
        <code>variant="1-2"</code>
        <Grid variant="1-2" gap="sm">
          <GridItem as="section"><div class="grid-demo__tile"><strong>Side</strong><p>One-third region</p></div></GridItem>
          <GridItem as="article"><div class="grid-demo__tile"><strong>Main</strong><p>Two-thirds region</p></div></GridItem>
        </Grid>
      </section>
    </div>

    <div v-else-if="props.variant === 'gaps'" class="grid-demo__stack">
      <section v-for="gap in gapExamples" :key="gap">
        <code>gap="{{ gap }}"</code>
        <Grid variant="side-by-side" :gap="gap">
          <GridItem><div class="grid-demo__tile grid-demo__tile--number">1</div></GridItem>
          <GridItem><div class="grid-demo__tile grid-demo__tile--number">2</div></GridItem>
        </Grid>
      </section>
    </div>

    <Grid v-else-if="props.variant === 'mobile-divider'" variant="4up" gap="base" mobile-divider>
      <GridItem v-for="(label, index) in ['Research', 'Design', 'Build', 'Release']" :key="label">
        <div class="grid-demo__phase">
          <span>{{ String(index + 1).padStart(2, '0') }}</span>
          <strong>{{ label }}</strong>
        </div>
      </GridItem>
    </Grid>

    <Grid v-else as="ul" variant="3up" gap="sm" aria-label="Team members" class="grid-demo__people">
      <GridItem v-for="([name, discipline], index) in people" :key="name" as="li">
        <span class="grid-demo__avatar" aria-hidden="true">{{ name.split(' ').map((part) => part[0]).join('') }}</span>
        <span><strong>{{ name }}</strong><small>{{ discipline }} · 0{{ index + 1 }}</small></span>
      </GridItem>
    </Grid>
  </div>
</template>

<style scoped>
.grid-demo {
  inline-size: min(100%, 44rem);
  min-inline-size: 0;
  color: var(--kappa-default, #17191f);
  font-family: var(--kappa-font-sans, inherit);
  font-size: 0.8125rem;
}

.grid-demo :is(p, ul) {
  margin: 0;
}

.grid-demo__tile {
  min-block-size: 7.25rem;
  padding: 1rem;
  border: 1px solid var(--kappa-line, rgba(15, 23, 42, 0.08));
  border-radius: 0.375rem;
  background: var(--kappa-base, #fff);
  box-shadow: var(--kappa-shadow, 0 1px 2px rgba(16, 24, 40, 0.05));
}

.grid-demo__tile strong,
.grid-demo__people strong,
.grid-demo__phase strong {
  display: block;
  color: var(--kappa-strong, #111827);
  font-weight: 650;
}

.grid-demo__tile p {
  margin-block-start: 0.35rem;
  color: var(--kappa-subtle, #6c7480);
  line-height: 1.5;
}

.grid-demo__index,
.grid-demo__phase > span,
.grid-demo__people small,
.grid-demo__stack code {
  color: var(--kappa-subtle, #6c7480);
  font-family: var(--kappa-font-mono, monospace);
  font-size: 0.6875rem;
  letter-spacing: 0.04em;
}

.grid-demo__index {
  display: block;
  margin-block-end: 1.25rem;
}

.grid-demo__tile--compact,
.grid-demo__tile--number {
  display: grid;
  min-block-size: 3rem;
  place-items: center;
}

.grid-demo__tile--number {
  padding: 0.75rem;
  font-family: var(--kappa-font-mono, monospace);
  font-weight: 650;
}

.grid-demo__stack {
  display: grid;
  gap: 2rem;
}

.grid-demo__stack section {
  min-inline-size: 0;
}

.grid-demo__stack code {
  display: block;
  margin-block-end: 0.5rem;
}

.grid-demo__phase {
  display: grid;
  min-block-size: 3rem;
  align-content: center;
  gap: 0.25rem;
}

.grid-demo__people {
  padding: 0;
  list-style: none;
}

.grid-demo__people > li {
  display: flex;
  min-inline-size: 0;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem;
  border: 1px solid var(--kappa-line, rgba(15, 23, 42, 0.08));
  border-radius: 0.375rem;
  background: var(--kappa-base, #fff);
}

.grid-demo__people > li > span:last-child {
  min-inline-size: 0;
}

.grid-demo__people small {
  display: block;
  margin-block-start: 0.2rem;
}

.grid-demo__avatar {
  display: grid;
  inline-size: 2.25rem;
  block-size: 2.25rem;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid var(--kappa-line, rgba(15, 23, 42, 0.08));
  border-radius: 50%;
  background: var(--kappa-tint, #f3f4f6);
  color: var(--kappa-default, #17191f);
  font-family: var(--kappa-font-mono, monospace);
  font-size: 0.6875rem;
}

@media (max-width: 47.99rem) {
  .grid-demo__tile {
    min-block-size: auto;
  }
}

@media (forced-colors: active) {
  .grid-demo__tile,
  .grid-demo__people > li,
  .grid-demo__avatar {
    border-color: CanvasText;
  }
}
</style>
