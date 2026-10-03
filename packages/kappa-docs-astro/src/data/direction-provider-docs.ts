export const barrelCode = `import { DirectionProvider } from "@dicehub/kappa";`;

export const granularCode = `import { DirectionProvider } from "@dicehub/kappa/components/direction-provider";`;

export const previewCode = `<script setup lang="ts">
import { computed, ref } from "vue";
import { Button } from "@dicehub/kappa/components/button";
import { DirectionProvider } from "@dicehub/kappa/components/direction-provider";
import { Radio } from "@dicehub/kappa/components/radio";

type DemoLocale = "en-US" | "ar";

const messages = {
  "en-US": {
    direction: "ltr",
    label: "Message priority",
    options: [
      { value: "low", label: "Low" },
      { value: "normal", label: "Normal" },
      { value: "high", label: "High" },
    ],
  },
  ar: {
    direction: "rtl",
    label: "أولوية الرسالة",
    options: [
      { value: "low", label: "منخفضة" },
      { value: "normal", label: "عادية" },
      { value: "high", label: "عالية" },
    ],
  },
} as const;

const locale = ref<DemoLocale>("en-US");
const priority = ref("normal");
const content = computed(() => messages[locale.value]);
</script>

<template>
  <section class="direction-example">
    <div class="direction-example__languages" role="group" aria-label="Interface language">
      <Button
        size="sm"
        :variant="locale === 'en-US' ? 'primary' : 'outline'"
        :aria-pressed="locale === 'en-US'"
        @click="locale = 'en-US'"
      >
        English
      </Button>
      <Button
        size="sm"
        :variant="locale === 'ar' ? 'primary' : 'outline'"
        :aria-pressed="locale === 'ar'"
        @click="locale = 'ar'"
      >
        العربية
      </Button>
    </div>

    <section class="direction-example__surface" :dir="content.direction" :lang="locale">
      <DirectionProvider :locale="locale">
        <Radio.Root
          v-model="priority"
          name="direction-preview-priority"
          orientation="horizontal"
        >
          <Radio.Label>{{ content.label }}</Radio.Label>
          <Radio.Item
            v-for="option in content.options"
            :key="option.value"
            :value="option.value"
          >
            <Radio.ItemControl />
            <Radio.ItemText>{{ option.label }}</Radio.ItemText>
          </Radio.Item>
        </Radio.Root>
      </DirectionProvider>
    </section>
  </section>
</template>

<style scoped>
.direction-example {
  display: grid;
  inline-size: min(100%, 32rem);
  gap: 1rem;
}

.direction-example__languages {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  direction: ltr;
}

.direction-example__surface {
  padding: 1rem;
  border: 1px solid var(--kappa-line);
  border-radius: 0.75rem;
  background: var(--kappa-control);
}
</style>`;

export const usageCode = `<script setup lang="ts">
import { DirectionProvider } from "@dicehub/kappa/components/direction-provider";
import { Radio } from "@dicehub/kappa/components/radio";
</script>

<template>
  <section class="direction-scope" dir="rtl" lang="ar">
    <DirectionProvider locale="ar">
      <Radio.Root default-value="list" name="direction-usage-view" orientation="horizontal">
        <Radio.Label>طريقة العرض</Radio.Label>
        <Radio.Item value="list">
          <Radio.ItemControl />
          <Radio.ItemText>قائمة</Radio.ItemText>
        </Radio.Item>
        <Radio.Item value="grid">
          <Radio.ItemControl />
          <Radio.ItemText>شبكة</Radio.ItemText>
        </Radio.Item>
      </Radio.Root>
    </DirectionProvider>
  </section>
</template>

<style scoped>
.direction-scope {
  inline-size: min(100%, 32rem);
  padding: 1rem;
  border: 1px solid var(--kappa-line);
  border-radius: 0.75rem;
  background: var(--kappa-control);
}
</style>`;

export const nestedCode = `<script setup lang="ts">
import { DirectionProvider } from "@dicehub/kappa/components/direction-provider";
import { Radio } from "@dicehub/kappa/components/radio";
</script>

<template>
  <section class="direction-scopes" dir="rtl" lang="ar">
    <DirectionProvider locale="ar">
      <Radio.Root default-value="recent" name="direction-outer-sort" orientation="horizontal">
        <Radio.Label>ترتيب النتائج</Radio.Label>
        <Radio.Item value="recent">
          <Radio.ItemControl />
          <Radio.ItemText>الأحدث</Radio.ItemText>
        </Radio.Item>
        <Radio.Item value="name">
          <Radio.ItemControl />
          <Radio.ItemText>الاسم</Radio.ItemText>
        </Radio.Item>
      </Radio.Root>

      <section class="direction-scopes__nested" dir="ltr" lang="en">
        <DirectionProvider locale="en-US">
          <Radio.Root default-value="recent" name="direction-inner-sort" orientation="horizontal">
            <Radio.Label>Result order</Radio.Label>
            <Radio.Item value="recent">
              <Radio.ItemControl />
              <Radio.ItemText>Most recent</Radio.ItemText>
            </Radio.Item>
            <Radio.Item value="name">
              <Radio.ItemControl />
              <Radio.ItemText>Name</Radio.ItemText>
            </Radio.Item>
          </Radio.Root>
        </DirectionProvider>
      </section>
    </DirectionProvider>
  </section>
</template>

<style scoped>
.direction-scopes {
  display: grid;
  inline-size: min(100%, 32rem);
  gap: 1rem;
  padding: 1rem;
  border: 1px solid var(--kappa-line);
  border-radius: 0.75rem;
  background: var(--kappa-control);
}

.direction-scopes__nested {
  padding: 0.875rem;
  border: 1px solid var(--kappa-line);
  border-radius: 0.5rem;
  background: var(--kappa-tint);
}
</style>`;

export const useDirectionCode = `<!-- DirectionValue.vue -->
<script setup lang="ts">
import { useDirection } from "@dicehub/kappa/components/direction-provider";

const direction = useDirection();
</script>

<template>
  <output class="direction-value" data-direction-value aria-live="polite">
    Current direction: <strong>{{ direction.toUpperCase() }}</strong>
  </output>
</template>

<!-- App.vue -->
<script setup lang="ts">
import { DirectionProvider } from "@dicehub/kappa/components/direction-provider";
import DirectionValue from "./DirectionValue.vue";
</script>

<template>
  <section class="direction-scope direction-scope--value" dir="rtl" lang="he">
    <DirectionProvider locale="he">
      <span>עברית</span>
      <DirectionValue />
    </DirectionProvider>
  </section>
</template>

<style scoped>
.direction-scope {
  inline-size: min(100%, 32rem);
  padding: 1rem;
  border: 1px solid var(--kappa-line);
  border-radius: 0.75rem;
  background: var(--kappa-control);
}

.direction-scope--value {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.direction-value {
  color: var(--kappa-subtle);
  font-size: 0.8125rem;
}
</style>`;

export const providerProps = [
  {
    name: "locale",
    type: "string",
    defaultValue: '"en-US"',
    description: "BCP 47 locale from which Ark UI derives direction and locale behavior.",
  },
] as const;

export const slots = [
  {
    name: "default",
    description: "Application or region content that receives the Ark UI locale context.",
  },
] as const;

export const exportsList = [
  { name: "DirectionProvider", description: "Headless Ark UI locale-context provider." },
  { name: "useDirection", description: "Returns a computed ltr or rtl value from the nearest provider." },
  { name: "Direction", description: "The ltr and rtl direction union." },
  { name: "DirectionProviderProps", description: "Public locale prop contract." },
  { name: "DirectionProviderSlots", description: "Default content slot contract." },
  { name: "DIRECTION_PROVIDER_DEFAULT_LOCALE", description: "The en-US fallback locale." },
] as const;
