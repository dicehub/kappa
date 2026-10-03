<script setup lang="ts">
import { ref } from "vue";
import { Radio } from "@dicehub/kappa/components/radio";

type DemoVariant =
  | "preview"
  | "usage"
  | "basic"
  | "descriptions"
  | "horizontal"
  | "cards"
  | "controlled"
  | "indicator"
  | "states";

withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const density = ref("comfortable");
const visibility = ref("team");
const view = ref("board");
const delivery = ref<string | null>(null);

const backupOptions = [
  { value: "hourly", label: "Hourly", description: "Keep the latest 24 restore points." },
  { value: "daily", label: "Daily", description: "Keep one restore point for 30 days." },
  { value: "weekly", label: "Weekly", description: "Keep one restore point for 12 weeks." },
];

const planOptions = [
  { value: "starter", label: "Starter", description: "5 GB for personal projects." },
  { value: "team", label: "Team", description: "100 GB with shared access." },
  { value: "business", label: "Business", description: "1 TB with audit history." },
];
</script>

<template>
  <div class="radio-demo" :data-radio-demo="variant">
    <section v-if="variant === 'preview'" class="radio-demo__preview">
      <Radio.Root v-model="density" name="interface-density">
        <Radio.Label>Interface density</Radio.Label>
        <Radio.Item value="compact">
          <Radio.ItemControl />
          <Radio.ItemText>Compact</Radio.ItemText>
        </Radio.Item>
        <Radio.Item value="comfortable">
          <Radio.ItemControl />
          <Radio.ItemText>Comfortable</Radio.ItemText>
        </Radio.Item>
        <Radio.Item value="spacious">
          <Radio.ItemControl />
          <Radio.ItemText>Spacious</Radio.ItemText>
        </Radio.Item>
      </Radio.Root>
      <output class="radio-demo__readout" aria-live="polite">
        Selected: <strong>{{ density }}</strong>
      </output>
    </section>

    <Radio.Root v-else-if="variant === 'usage'" default-value="email" name="notification-channel">
      <Radio.Label>Notification channel</Radio.Label>
      <Radio.Item value="email">
        <Radio.ItemControl />
        <Radio.ItemText>Email</Radio.ItemText>
      </Radio.Item>
      <Radio.Item value="sms">
        <Radio.ItemControl />
        <Radio.ItemText>SMS</Radio.ItemText>
      </Radio.Item>
      <Radio.Item value="push">
        <Radio.ItemControl />
        <Radio.ItemText>Push notification</Radio.ItemText>
      </Radio.Item>
    </Radio.Root>

    <Radio.Root v-else-if="variant === 'basic'" default-value="system" name="theme">
      <Radio.Label>Theme</Radio.Label>
      <Radio.Item value="light">
        <Radio.ItemControl />
        <Radio.ItemText>Light</Radio.ItemText>
      </Radio.Item>
      <Radio.Item value="dark">
        <Radio.ItemControl />
        <Radio.ItemText>Dark</Radio.ItemText>
      </Radio.Item>
      <Radio.Item value="system">
        <Radio.ItemControl />
        <Radio.ItemText>System</Radio.ItemText>
      </Radio.Item>
    </Radio.Root>

    <Radio.Root v-else-if="variant === 'descriptions'" default-value="daily" name="backup-frequency">
      <Radio.Label>Backup frequency</Radio.Label>
      <Radio.Item v-for="option in backupOptions" :key="option.value" :value="option.value">
        <Radio.ItemControl />
        <Radio.ItemText class="radio-demo__option-copy">
          <span class="radio-demo__option-title">{{ option.label }}</span>
          <span class="radio-demo__option-description">{{ option.description }}</span>
        </Radio.ItemText>
      </Radio.Item>
    </Radio.Root>

    <Radio.Root v-else-if="variant === 'horizontal'" default-value="newest" name="sort-order" orientation="horizontal">
      <Radio.Label>Sort order</Radio.Label>
      <Radio.Item value="newest">
        <Radio.ItemControl />
        <Radio.ItemText>Newest</Radio.ItemText>
      </Radio.Item>
      <Radio.Item value="oldest">
        <Radio.ItemControl />
        <Radio.ItemText>Oldest</Radio.ItemText>
      </Radio.Item>
      <Radio.Item value="name">
        <Radio.ItemControl />
        <Radio.ItemText>Name</Radio.ItemText>
      </Radio.Item>
    </Radio.Root>

    <Radio.Root v-else-if="variant === 'cards'" default-value="team" name="storage-plan" class="radio-demo__cards">
      <Radio.Label>Storage plan</Radio.Label>
      <Radio.Item v-for="option in planOptions" :key="option.value" :value="option.value" class="radio-demo__card">
        <Radio.ItemControl />
        <Radio.ItemText class="radio-demo__option-copy">
          <span class="radio-demo__option-title">{{ option.label }}</span>
          <span class="radio-demo__option-description">{{ option.description }}</span>
        </Radio.ItemText>
      </Radio.Item>
    </Radio.Root>

    <section v-else-if="variant === 'controlled'" class="radio-demo__stack">
      <Radio.Root v-model="visibility" name="visibility">
        <Radio.Label>Visibility</Radio.Label>
        <Radio.Item value="private">
          <Radio.ItemControl />
          <Radio.ItemText>Private</Radio.ItemText>
        </Radio.Item>
        <Radio.Item value="team">
          <Radio.ItemControl />
          <Radio.ItemText>Team</Radio.ItemText>
        </Radio.Item>
        <Radio.Item value="public">
          <Radio.ItemControl />
          <Radio.ItemText>Public</Radio.ItemText>
        </Radio.Item>
      </Radio.Root>
      <output class="radio-demo__readout" aria-live="polite">
        Visibility: <strong>{{ visibility }}</strong>
      </output>
    </section>

    <Radio.Root
      v-else-if="variant === 'indicator'"
      v-model="view"
      aria-label="View"
      class="radio-demo__segmented"
      name="view"
      orientation="horizontal"
    >
      <Radio.Indicator />
      <Radio.Item v-for="option in ['list', 'board', 'timeline']" :key="option" :value="option" class="radio-demo__segment">
        <Radio.ItemText>{{ option[0]?.toUpperCase() }}{{ option.slice(1) }}</Radio.ItemText>
      </Radio.Item>
    </Radio.Root>

    <div v-else class="radio-demo__states">
      <Radio.Root default-value="email" disabled name="disabled-channel">
        <Radio.Label>Disabled group</Radio.Label>
        <Radio.Item value="email">
          <Radio.ItemControl />
          <Radio.ItemText>Email</Radio.ItemText>
        </Radio.Item>
        <Radio.Item value="sms">
          <Radio.ItemControl />
          <Radio.ItemText>SMS</Radio.ItemText>
        </Radio.Item>
      </Radio.Root>

      <Radio.Root default-value="automatic" read-only name="readonly-sync">
        <Radio.Label>Read-only group</Radio.Label>
        <Radio.Item value="automatic">
          <Radio.ItemControl />
          <Radio.ItemText>Automatic</Radio.ItemText>
        </Radio.Item>
        <Radio.Item value="manual">
          <Radio.ItemControl />
          <Radio.ItemText>Manual</Radio.ItemText>
        </Radio.Item>
      </Radio.Root>

      <div class="radio-demo__invalid">
        <Radio.Root v-model="delivery" invalid required name="delivery" aria-describedby="delivery-error">
          <Radio.Label>Delivery method</Radio.Label>
          <Radio.Item value="standard">
            <Radio.ItemControl />
            <Radio.ItemText>Standard</Radio.ItemText>
          </Radio.Item>
          <Radio.Item value="express">
            <Radio.ItemControl />
            <Radio.ItemText>Express</Radio.ItemText>
          </Radio.Item>
        </Radio.Root>
        <p id="delivery-error" class="radio-demo__error">Choose a delivery method.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.radio-demo {
  display: grid;
  width: min(100%, 40rem);
  min-width: 0;
  min-height: 7rem;
  place-items: center;
  color: var(--docs-default);
  font-family: var(--docs-font-sans, "Geist", sans-serif);
}

.radio-demo__preview,
.radio-demo__stack {
  display: grid;
  width: min(100%, 22rem);
  gap: 0.75rem;
}

.radio-demo__readout {
  margin: 0;
  color: var(--docs-subtle);
  font-size: 0.75rem;
}

.radio-demo__readout strong {
  color: var(--docs-default);
}

.radio-demo__option-copy {
  display: grid;
  gap: 0.125rem;
}

.radio-demo__option-title {
  font-weight: 500;
}

.radio-demo__option-description {
  color: var(--docs-subtle);
  font-size: 0.75rem;
}

.radio-demo :deep(.radio-demo__cards.kappa-radio) {
  width: min(100%, 26rem);
}

.radio-demo__card {
  inline-size: 100%;
  border: 1px solid var(--docs-line);
  border-radius: 0.5rem;
  padding: 0.75rem;
  transition:
    border-color 140ms ease,
    background-color 140ms ease;
}

.radio-demo__card[data-hover]:not([data-disabled]) {
  border-color: var(--docs-subtle);
}

.radio-demo__card[data-state="checked"] {
  border-color: var(--kappa-accent, #4356e8);
  background: color-mix(in oklab, var(--kappa-accent, #4356e8) 5%, transparent);
}

.radio-demo :deep(.radio-demo__segmented.kappa-radio) {
  display: inline-grid;
  grid-auto-columns: minmax(5.5rem, 1fr);
  grid-auto-flow: column;
  gap: 0;
  border: 1px solid var(--docs-line);
  border-radius: 0.625rem;
  padding: 0.25rem;
  background: var(--kappa-overlay);
}

.radio-demo :deep(.radio-demo__segmented .kappa-radio__indicator) {
  border-radius: 0.375rem;
  background: var(--kappa-control);
  box-shadow:
    inset 0 0 0 1px var(--kappa-line),
    var(--kappa-shadow);
}

.radio-demo__segment {
  inline-size: 100%;
  justify-content: center;
  padding: 0.375rem 0.625rem;
  border-radius: 0.375rem;
  font-weight: 500;
}

.radio-demo__states {
  display: grid;
  width: min(100%, 36rem);
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5rem;
  align-items: start;
}

.radio-demo__invalid {
  display: grid;
  gap: 0.25rem;
}

.radio-demo__error {
  margin: 0;
  color: var(--kappa-danger-text, #b42318);
  font-size: 0.75rem;
}

@media (max-width: 640px) {
  .radio-demo__states {
    grid-template-columns: 1fr;
  }

  .radio-demo :deep(.radio-demo__segmented.kappa-radio) {
    width: 100%;
    grid-auto-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .radio-demo__card {
    transition: none;
  }
}
</style>
