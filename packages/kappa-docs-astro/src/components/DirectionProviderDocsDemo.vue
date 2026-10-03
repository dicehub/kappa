<script setup lang="ts">
import { computed, ref } from "vue";
import { Button } from "@dicehub/kappa/components/button";
import { DirectionProvider } from "@dicehub/kappa/components/direction-provider";
import { Radio } from "@dicehub/kappa/components/radio";
import DirectionValueDemo from "./DirectionValueDemo.vue";

type DemoVariant = "preview" | "usage" | "nested" | "composable";
type DemoLocale = "en-US" | "ar";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

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
  <div class="direction-provider-demo" :data-direction-provider-demo="props.variant">
    <section v-if="props.variant === 'preview'" class="direction-example">
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

      <section
        class="direction-example__surface"
        :dir="content.direction"
        :lang="locale"
      >
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

    <section
      v-else-if="props.variant === 'usage'"
      class="direction-scope"
      dir="rtl"
      lang="ar"
    >
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

    <section
      v-else-if="props.variant === 'nested'"
      class="direction-scopes"
      dir="rtl"
      lang="ar"
    >
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

    <section v-else class="direction-scope direction-scope--value" dir="rtl" lang="he">
      <DirectionProvider locale="he">
        <span>עברית</span>
        <DirectionValueDemo />
      </DirectionProvider>
    </section>
  </div>
</template>

<style scoped>
.direction-provider-demo {
  display: grid;
  inline-size: min(100%, 40rem);
  min-inline-size: 0;
  min-block-size: 9rem;
  place-items: center;
  color: var(--kappa-default, #17191f);
  font-family: var(--kappa-font-sans, inherit);
}

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

.direction-example__surface,
.direction-scope,
.direction-scopes {
  box-sizing: border-box;
  inline-size: min(100%, 32rem);
  padding: 1rem;
  border: 1px solid var(--kappa-line, #e3e6eb);
  border-radius: 0.75rem;
  background: var(--kappa-control, #ffffff);
}

.direction-scopes {
  display: grid;
  gap: 1rem;
}

.direction-scopes__nested {
  padding: 0.875rem;
  border: 1px solid var(--kappa-line, #e3e6eb);
  border-radius: 0.5rem;
  background: var(--kappa-tint, #f4f6f9);
}

.direction-scope--value {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

:deep(.direction-value) {
  color: var(--kappa-subtle, #6c7480);
  font-size: 0.8125rem;
}

:deep(.direction-value strong) {
  color: var(--kappa-default, #17191f);
  font-weight: 650;
}

@media (max-width: 30rem) {
  .direction-example__surface,
  .direction-scope,
  .direction-scopes {
    padding: 0.875rem;
  }
}

@media (forced-colors: active) {
  .direction-example__surface,
  .direction-scope,
  .direction-scopes,
  .direction-scopes__nested {
    border-color: CanvasText;
  }
}
</style>
