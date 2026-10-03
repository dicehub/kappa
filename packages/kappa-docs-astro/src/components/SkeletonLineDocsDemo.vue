<script setup lang="ts">
import { SkeletonLine } from "@dicehub/kappa/components/skeleton-line";

type DemoVariant =
  | "preview"
  | "basic"
  | "widths"
  | "heights"
  | "block-height"
  | "card"
  | "table"
  | "static";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});
</script>

<template>
  <div class="skeleton-line-demo" :data-skeleton-line-demo="props.variant">
    <section
      v-if="props.variant === 'preview'"
      class="skeleton-line-demo__activity"
      aria-busy="true"
    >
      <span class="docs-visually-hidden" role="status">Loading recent activity</span>
      <div class="skeleton-line-demo__activity-header">
        <SkeletonLine :height="12" width="7.5rem" />
        <SkeletonLine :height="8" width="4rem" />
      </div>
      <article v-for="item in 3" :key="item" class="skeleton-line-demo__activity-row">
        <SkeletonLine :height="40" :width="40" class="skeleton-line-demo__avatar" />
        <div class="skeleton-line-demo__activity-copy">
          <SkeletonLine :width="item === 2 ? '64%' : '76%'" />
          <SkeletonLine :width="item === 3 ? '42%' : '52%'" />
        </div>
        <SkeletonLine :height="8" :width="item === 1 ? 52 : 40" />
      </article>
    </section>

    <div v-else-if="props.variant === 'basic'" class="skeleton-line-demo__stack" aria-busy="true">
      <span class="docs-visually-hidden" role="status">Loading article</span>
      <SkeletonLine />
      <SkeletonLine width="78%" />
      <SkeletonLine width="52%" />
    </div>

    <div v-else-if="props.variant === 'widths'" class="skeleton-line-demo__stack">
      <SkeletonLine />
      <SkeletonLine width="78%" />
      <SkeletonLine width="52%" />
      <SkeletonLine :width="112" data-exact-width />
    </div>

    <div v-else-if="props.variant === 'heights'" class="skeleton-line-demo__stack">
      <SkeletonLine :height="8" />
      <SkeletonLine :height="12" />
      <SkeletonLine :height="20" />
    </div>

    <div v-else-if="props.variant === 'block-height'" class="skeleton-line-demo__blocks">
      <div class="skeleton-line-demo__block-row">
        <code>32 px</code><SkeletonLine :block-height="32" width="64%" />
      </div>
      <div class="skeleton-line-demo__block-row">
        <code>48 px</code><SkeletonLine :block-height="48" width="72%" />
      </div>
      <div class="skeleton-line-demo__block-row">
        <code>4 rem</code><SkeletonLine block-height="4rem" width="56%" />
      </div>
    </div>

    <section v-else-if="props.variant === 'card'" class="skeleton-line-demo__card" aria-busy="true">
      <span class="docs-visually-hidden" role="status">Loading profile</span>
      <SkeletonLine :height="48" :width="48" class="skeleton-line-demo__avatar" />
      <div class="skeleton-line-demo__profile-copy">
        <SkeletonLine :height="12" width="9rem" />
        <SkeletonLine width="6rem" />
      </div>
      <SkeletonLine :height="28" width="4.75rem" class="skeleton-line-demo__button" />
    </section>

    <div v-else-if="props.variant === 'table'" class="skeleton-line-demo__table" aria-busy="true">
      <span class="docs-visually-hidden" role="status">Loading records</span>
      <div v-for="row in 4" :key="row" class="skeleton-line-demo__table-row">
        <SkeletonLine width="55%" />
        <SkeletonLine width="38%" />
        <SkeletonLine width="62%" />
      </div>
    </div>

    <SkeletonLine v-else :animated="false" width="72%" />
  </div>
</template>

<style scoped>
.skeleton-line-demo {
  display: flex;
  inline-size: 100%;
  min-inline-size: 0;
  min-block-size: 10rem;
  align-items: center;
  justify-content: center;
  color: var(--kappa-default, #17191f);
  font-family: var(--kappa-font-sans, inherit);
}

.skeleton-line-demo__stack,
.skeleton-line-demo__activity,
.skeleton-line-demo__blocks,
.skeleton-line-demo__table {
  inline-size: min(100%, 28rem);
}

.skeleton-line-demo__stack {
  display: grid;
  gap: 0.75rem;
}

.skeleton-line-demo__activity,
.skeleton-line-demo__card,
.skeleton-line-demo__table {
  box-sizing: border-box;
  border: 1px solid var(--kappa-line, #e3e6eb);
  border-radius: 0.75rem;
  background: var(--kappa-control, #ffffff);
  box-shadow: var(--kappa-shadow-sm, 0 1px 2px rgb(16 24 40 / 6%));
}

.skeleton-line-demo__activity {
  padding: 0.375rem 1rem;
}

.skeleton-line-demo__activity-header,
.skeleton-line-demo__activity-row {
  display: flex;
  align-items: center;
}

.skeleton-line-demo__activity-header {
  justify-content: space-between;
  padding-block: 0.75rem;
  border-block-end: 1px solid var(--kappa-line, #e3e6eb);
}

.skeleton-line-demo__activity-row {
  gap: 0.75rem;
  padding-block: 0.75rem;
}

.skeleton-line-demo__activity-row + .skeleton-line-demo__activity-row {
  border-block-start: 1px solid var(--kappa-line, #e3e6eb);
}

.skeleton-line-demo__activity-copy,
.skeleton-line-demo__profile-copy {
  display: grid;
  min-inline-size: 0;
  flex: 1;
  gap: 0.5rem;
}

.skeleton-line-demo__avatar {
  --kappa-skeleton-line-radius: 999px;
}

.skeleton-line-demo__blocks {
  display: grid;
  gap: 0.375rem;
}

.skeleton-line-demo__block-row {
  display: grid;
  grid-template-columns: 3.5rem minmax(0, 1fr);
  align-items: center;
  gap: 0.75rem;
}

.skeleton-line-demo__block-row code {
  color: var(--kappa-subtle, #6c7480);
  font-family: var(--kappa-font-mono, monospace);
  font-size: 0.6875rem;
}

.skeleton-line-demo__card {
  display: flex;
  inline-size: min(100%, 26rem);
  align-items: center;
  gap: 0.875rem;
  padding: 1rem;
}

.skeleton-line-demo__button {
  --kappa-skeleton-line-radius: 0.375rem;
}

.skeleton-line-demo__table {
  display: grid;
  overflow: hidden;
}

.skeleton-line-demo__table-row {
  display: grid;
  grid-template-columns: 1.3fr 0.8fr 1fr;
  gap: 1rem;
  padding: 0.875rem 1rem;
}

.skeleton-line-demo__table-row + .skeleton-line-demo__table-row {
  border-block-start: 1px solid var(--kappa-line, #e3e6eb);
}

@media (max-width: 30rem) {
  .skeleton-line-demo {
    min-block-size: 12rem;
  }

  .skeleton-line-demo__activity-row {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
  }

  .skeleton-line-demo__activity-row > :last-child {
    display: none;
  }

  .skeleton-line-demo__card {
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .skeleton-line-demo__button {
    margin-inline-start: 3.875rem;
  }

  .skeleton-line-demo__table-row {
    grid-template-columns: 1.2fr 0.8fr;
  }

  .skeleton-line-demo__table-row > :last-child {
    display: none;
  }
}
</style>
