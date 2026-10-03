<script setup lang="ts">
import { Separator } from "@dicehub/kappa/components/separator";

type DemoVariant = "preview" | "basic" | "vertical" | "list" | "semantic";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const details = [
  ["Status", "Active"],
  ["Region", "Europe"],
  ["Plan", "Standard"],
] as const;
</script>

<template>
  <div class="separator-demo" :data-separator-demo="props.variant">
    <section v-if="props.variant === 'preview'" class="separator-demo__summary">
      <div>
        <strong>Project Atlas</strong>
        <p>Shared workspace for product documentation.</p>
      </div>
      <Separator />
      <div class="separator-demo__metadata">
        <span>12 members</span>
        <Separator orientation="vertical" />
        <span>8 projects</span>
        <Separator orientation="vertical" />
        <span>Updated today</span>
      </div>
    </section>

    <section v-else-if="props.variant === 'basic'" class="separator-demo__basic">
      <strong>Account</strong>
      <Separator />
      <p>Manage profile details and sign-in preferences.</p>
    </section>

    <nav
      v-else-if="props.variant === 'vertical'"
      class="separator-demo__navigation"
      aria-label="Project sections"
    >
      <a href="#overview">Overview</a>
      <Separator orientation="vertical" />
      <a href="#activity">Activity</a>
      <Separator orientation="vertical" />
      <a href="#settings">Settings</a>
    </nav>

    <dl v-else-if="props.variant === 'list'" class="separator-demo__list">
      <template v-for="([term, value], index) in details" :key="term">
        <div class="separator-demo__row">
          <dt>{{ term }}</dt>
          <dd>{{ value }}</dd>
        </div>
        <Separator v-if="index < details.length - 1" />
      </template>
    </dl>

    <section v-else class="separator-demo__semantic">
      <div>
        <strong>Service status</strong>
        <p>All systems are operational.</p>
      </div>
      <Separator :decorative="false" aria-label="Deployment details" />
      <div>
        <strong>Last deployment</strong>
        <p>Today at 09:42 UTC</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.separator-demo {
  display: flex;
  inline-size: 100%;
  min-inline-size: 0;
  min-block-size: 10rem;
  align-items: center;
  justify-content: center;
  color: var(--kappa-default, #17191f);
  font-family: var(--kappa-font-sans, inherit);
  font-size: 0.8125rem;
}

.separator-demo :is(p, dl, dd) {
  margin: 0;
}

.separator-demo p,
.separator-demo dt {
  color: var(--kappa-subtle, #6c7480);
}

.separator-demo__summary,
.separator-demo__basic,
.separator-demo__list,
.separator-demo__semantic {
  inline-size: min(100%, 27rem);
}

.separator-demo__summary,
.separator-demo__basic,
.separator-demo__semantic {
  display: grid;
  gap: 0.875rem;
}

.separator-demo__summary > div:first-child,
.separator-demo__semantic > div {
  display: grid;
  gap: 0.25rem;
}

.separator-demo__metadata,
.separator-demo__navigation {
  display: flex;
  min-block-size: 1.125rem;
  align-items: center;
  gap: 0.75rem;
  color: var(--kappa-subtle, #6c7480);
  font-size: 0.75rem;
}

.separator-demo__navigation {
  min-block-size: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.separator-demo__navigation a {
  color: var(--kappa-default, #17191f);
  text-decoration-color: transparent;
  text-underline-offset: 0.2em;
}

.separator-demo__navigation a:hover {
  text-decoration-color: currentColor;
}

.separator-demo__navigation a:focus-visible {
  border-radius: 0.125rem;
  outline: 2px solid var(--kappa-focus, #4c63ff);
  outline-offset: 0.1875rem;
}

.separator-demo__list {
  display: grid;
}

.separator-demo__row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  padding-block: 0.75rem;
}

.separator-demo__row:first-child {
  padding-block-start: 0;
}

.separator-demo__row:last-child {
  padding-block-end: 0;
}

.separator-demo__row dd {
  font-weight: 600;
}

@media (max-width: 30rem) {
  .separator-demo__metadata {
    gap: 0.5rem;
    font-size: 0.6875rem;
  }
}

@media (forced-colors: active) {
  .separator-demo__navigation a:focus-visible {
    outline-color: Highlight;
  }
}
</style>
