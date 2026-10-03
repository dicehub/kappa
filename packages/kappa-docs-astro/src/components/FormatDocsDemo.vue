<script setup lang="ts">
import { Format } from "@dicehub/kappa/components/format";

type DemoVariant = "preview" | "usage" | "locale" | "relative" | "time";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const indexedAt = new Date("2026-08-28T09:15:00.000Z");
</script>

<template>
  <div class="format-demo" :data-format-demo="props.variant">
    <Format v-if="props.variant === 'preview'" locale="en-US">
      <div class="format-demo__grid">
        <div class="format-demo__card" data-format-card="byte">
          <span class="format-demo__label">Artifact bundle</span>
          <Format.Byte :value="2684354560" unit-system="binary" />
          <code>build/output.tar</code>
        </div>
        <div class="format-demo__card" data-format-card="number">
          <span class="format-demo__label">Jobs completed</span>
          <Format.Number :value="128400" compact-display="short" notation="compact" />
          <code>worker/queue</code>
        </div>
        <div class="format-demo__card" data-format-card="relative-time">
          <span class="format-demo__label">Last indexed</span>
          <Format.RelativeTime :value="indexedAt" numeric="auto" />
          <code>search/index</code>
        </div>
        <div class="format-demo__card" data-format-card="time">
          <span class="format-demo__label">Next deploy window</span>
          <Format.Time value="14:05:22" format="24h" :with-seconds="true" />
          <code>release/eu-central</code>
        </div>
      </div>
    </Format>

    <Format v-else-if="props.variant === 'usage'" locale="en-US">
      <p class="format-demo__sentence">
        Worker pool processed
        <Format.Number :value="128400" notation="compact" />
        jobs and produced
        <Format.Byte :value="536870912" unit-system="binary" />
        of artifacts.
      </p>
    </Format>

    <Format v-else-if="props.variant === 'locale'" locale="de-DE">
      <div class="format-demo__locale" lang="de">
        <span>Regional dashboard</span>
        <strong><Format.Number :value="1234567.89" /></strong>
        <small><Format.Byte :value="1073741824" unit-system="binary" /></small>
      </div>
      <p class="format-demo__note">
        A child can override the provider when one value uses another locale:
        <Format.Number locale="en-US" :value="1234567.89" />.
      </p>
    </Format>

    <Format v-else-if="props.variant === 'relative'" locale="en-US">
      <div class="format-demo__relative">
        <span>Index snapshot</span>
        <Format.RelativeTime :value="indexedAt" numeric="auto" :style="'long'" />
      </div>
    </Format>

    <Format v-else locale="en-US">
      <div class="format-demo__times">
        <span>
          <small>24-hour</small>
          <Format.Time value="14:05:22" format="24h" :with-seconds="true" />
        </span>
        <span>
          <small>12-hour · nl-NL</small>
          <Format.Time locale="nl-NL" value="08:45" format="12h" />
        </span>
      </div>
    </Format>
  </div>
</template>

<style scoped>
.format-demo {
  display: flex;
  inline-size: 100%;
  min-inline-size: 0;
  min-block-size: 12rem;
  align-items: center;
  justify-content: center;
  color: var(--kappa-default, #17191f);
  font-family: var(--kappa-font-sans, inherit);
}

.format-demo__grid {
  display: grid;
  inline-size: min(100%, 42rem);
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.625rem;
}

.format-demo__card {
  display: grid;
  min-block-size: 6.5rem;
  align-content: center;
  gap: 0.3rem;
  padding: 0.9rem 1rem;
  border: 1px solid var(--kappa-border, #d7dce2);
  border-radius: 0.45rem;
  background: var(--kappa-control, #fff);
  box-shadow: var(--kappa-shadow-xs, 0 1px 2px rgb(23 25 31 / 8%));
}

.format-demo__label {
  color: var(--kappa-subtle, #6c7480);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.035em;
  line-height: 1.2;
  text-transform: uppercase;
}

.format-demo__card > .kappa-format {
  font-size: 1.15rem;
  font-weight: 650;
  line-height: 1.35;
}

.format-demo__card code {
  overflow: hidden;
  color: var(--kappa-subtle, #6c7480);
  font-size: 0.7rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.format-demo__sentence,
.format-demo__note {
  max-inline-size: 38rem;
  margin: 0;
  line-height: 1.75;
  text-align: center;
}

.format-demo__sentence .kappa-format {
  color: var(--kappa-accent, #3857d6);
  font-weight: 650;
}

.format-demo__locale {
  display: grid;
  min-inline-size: min(100%, 19rem);
  gap: 0.35rem;
  padding: 1.15rem 1.3rem;
  border-inline-start: 3px solid var(--kappa-accent, #3857d6);
  background: var(--kappa-control, #fff);
}

.format-demo__locale span,
.format-demo__locale small,
.format-demo__note {
  color: var(--kappa-subtle, #6c7480);
  font-size: 0.8rem;
}

.format-demo__locale strong {
  font-size: 1.5rem;
  line-height: 1.2;
}

.format-demo__note {
  margin-inline-start: 1rem;
  text-align: start;
}

.format-demo__relative,
.format-demo__times {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.format-demo__relative {
  flex-direction: column;
  min-inline-size: min(100%, 20rem);
  padding: 1.25rem;
  border: 1px solid var(--kappa-border, #d7dce2);
  border-radius: 0.45rem;
  background: var(--kappa-control, #fff);
}

.format-demo__relative > span {
  color: var(--kappa-subtle, #6c7480);
  font-size: 0.75rem;
  text-transform: uppercase;
}

.format-demo__relative .kappa-format,
.format-demo__times .kappa-format {
  font-size: 1.35rem;
  font-weight: 650;
}

.format-demo__times {
  flex-wrap: wrap;
  min-inline-size: min(100%, 18rem);
}

.format-demo__times > span {
  display: grid;
  gap: 0.25rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--kappa-border, #d7dce2);
  border-radius: 0.35rem;
  background: var(--kappa-control, #fff);
}

.format-demo__times small {
  color: var(--kappa-subtle, #6c7480);
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

@media (max-width: 34rem) {
  .format-demo__grid {
    grid-template-columns: 1fr;
  }

  .format-demo__note {
    margin-block-start: 0.75rem;
    margin-inline-start: 0;
  }
}
</style>
