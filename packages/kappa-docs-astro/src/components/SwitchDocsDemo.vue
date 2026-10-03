<script setup lang="ts">
import { Button } from "@dicehub/kappa/components/button";
import { Field } from "@dicehub/kappa/components/field";
import { Switch } from "@dicehub/kappa/components/switch";
import { ref } from "vue";

type DemoVariant =
  | "preview"
  | "usage"
  | "description"
  | "choice-card"
  | "controlled"
  | "context"
  | "states"
  | "sizes"
  | "form"
  | "rtl";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const airplaneMode = ref(false);
const focusMode = ref(true);
const formResult = ref("Submit the form to inspect its value.");

const handleFormSubmit = (event: Event) => {
  const form = event.currentTarget;
  if (!(form instanceof HTMLFormElement)) return;
  const data = new FormData(form);
  formResult.value = data.has("product-updates")
    ? "Product updates enabled"
    : "Product updates disabled";
};
</script>

<template>
  <div class="switch-demo" :data-switch-demo="props.variant">
    <Switch.Root v-if="props.variant === 'preview'" v-model:checked="airplaneMode">
      <Switch.Control />
      <Switch.Label>Airplane mode</Switch.Label>
    </Switch.Root>

    <Switch.Root
      v-else-if="props.variant === 'usage'"
      default-checked
      name="automatic-updates"
      value="enabled"
    >
      <Switch.Control />
      <Switch.Label>Automatic updates</Switch.Label>
    </Switch.Root>

    <Switch.Root
      v-else-if="props.variant === 'description'"
      class="switch-demo__setting"
      default-checked
    >
      <Switch.Label class="switch-demo__copy">
        <span class="switch-demo__title">Share across devices</span>
        <span class="switch-demo__description">
          Keep preferences synchronized on signed-in devices.
        </span>
      </Switch.Label>
      <Switch.Control />
    </Switch.Root>

    <Switch.Root
      v-else-if="props.variant === 'choice-card'"
      class="switch-demo__choice-card"
      default-checked
    >
      <Switch.Label class="switch-demo__copy">
        <span class="switch-demo__title">Enable notifications</span>
        <span class="switch-demo__description">
          Receive a message when important activity needs attention.
        </span>
      </Switch.Label>
      <Switch.Control />
    </Switch.Root>

    <div v-else-if="props.variant === 'controlled'" class="switch-demo__stack">
      <Switch.Root v-model:checked="focusMode">
        <Switch.Control />
        <Switch.Label>Focus mode</Switch.Label>
      </Switch.Root>
      <output class="switch-demo__output" aria-live="polite">
        State: <strong>{{ focusMode ? "on" : "off" }}</strong>
      </output>
    </div>

    <Switch.Root v-else-if="props.variant === 'context'" default-checked>
      <Switch.Control />
      <Switch.Label class="switch-demo__context-label">
        Wi-Fi
        <Switch.Context v-slot="{ checked }">
          <span class="switch-demo__state">{{ checked ? "On" : "Off" }}</span>
        </Switch.Context>
      </Switch.Label>
    </Switch.Root>

    <div v-else-if="props.variant === 'states'" class="switch-demo__states">
      <Switch.Root disabled>
        <Switch.Control />
        <Switch.Label>Disabled</Switch.Label>
      </Switch.Root>
      <Switch.Root disabled default-checked>
        <Switch.Control />
        <Switch.Label>Disabled and on</Switch.Label>
      </Switch.Root>
      <Switch.Root read-only default-checked>
        <Switch.Control />
        <Switch.Label>Read-only</Switch.Label>
      </Switch.Root>
      <Field.Root id="switch-terms" invalid class="switch-demo__invalid">
        <Switch.Root invalid required>
          <Switch.Control />
          <Switch.Label>Accept the terms</Switch.Label>
        </Switch.Root>
        <Field.ErrorText>You must accept the terms to continue.</Field.ErrorText>
      </Field.Root>
    </div>

    <div v-else-if="props.variant === 'sizes'" class="switch-demo__sizes">
      <Switch.Root size="sm" default-checked>
        <Switch.Control />
        <Switch.Label>Small</Switch.Label>
      </Switch.Root>
      <Switch.Root size="base" default-checked>
        <Switch.Control />
        <Switch.Label>Base</Switch.Label>
      </Switch.Root>
      <Switch.Root size="lg" default-checked>
        <Switch.Control />
        <Switch.Label>Large</Switch.Label>
      </Switch.Root>
    </div>

    <form v-else-if="props.variant === 'form'" class="switch-demo__form" @submit.prevent="handleFormSubmit">
      <Switch.Root name="product-updates" value="enabled" default-checked>
        <Switch.Control />
        <Switch.Label>Product updates</Switch.Label>
      </Switch.Root>
      <Button type="submit" variant="primary">Save preferences</Button>
      <output class="switch-demo__output" aria-live="polite">{{ formResult }}</output>
    </form>

    <div v-else class="switch-demo__rtl" dir="rtl" lang="ar">
      <Switch.Root dir="rtl" default-checked>
        <Switch.Control />
        <Switch.Label>تفعيل الإشعارات</Switch.Label>
      </Switch.Root>
    </div>
  </div>
</template>

<style scoped>
.switch-demo {
  display: grid;
  inline-size: 100%;
  min-inline-size: 0;
  min-block-size: 7rem;
  place-items: center;
  color: var(--kappa-default, #17191f);
  font-family: var(--kappa-font-sans, inherit);
}

.switch-demo :deep(.switch-demo__setting),
.switch-demo :deep(.switch-demo__choice-card) {
  inline-size: min(100%, 25rem);
  align-items: flex-start;
  justify-content: space-between;
}

.switch-demo__copy {
  display: grid;
  max-inline-size: 20rem;
  gap: 0.125rem;
}

.switch-demo__title {
  font-weight: 600;
}

.switch-demo__description,
.switch-demo__output {
  color: var(--kappa-subtle, #6c7480);
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.35;
}

.switch-demo :deep(.switch-demo__choice-card) {
  padding: 0.875rem;
  border: 1px solid var(--kappa-line, #e3e6eb);
  border-radius: 0.625rem;
  background: var(--kappa-control, #ffffff);
  transition:
    background-color 120ms ease,
    border-color 120ms ease;
}

.switch-demo :deep(.switch-demo__choice-card:hover:not([data-disabled])) {
  border-color: var(--kappa-subtle, #6c7480);
}

.switch-demo :deep(.switch-demo__choice-card:has([data-state="checked"])) {
  border-color: var(--kappa-accent, #4356e8);
  background: color-mix(in oklab, var(--kappa-accent, #4356e8) 4%, var(--kappa-control, #ffffff));
}

.switch-demo__stack,
.switch-demo__states,
.switch-demo__sizes,
.switch-demo__form {
  display: grid;
  inline-size: min(100%, 22rem);
  gap: 0.75rem;
}

.switch-demo__output {
  margin: 0;
}

.switch-demo__output strong {
  color: var(--kappa-default, #17191f);
}

.switch-demo__context-label {
  display: inline-flex;
  align-items: baseline;
  gap: 0.5rem;
}

.switch-demo__state {
  min-inline-size: 2.25rem;
  padding-block: 0.0625rem;
  padding-inline: 0.375rem;
  border-radius: 999px;
  background: var(--kappa-overlay, #e9edf2);
  color: var(--kappa-subtle, #6c7480);
  font-size: 0.6875rem;
  font-weight: 600;
  text-align: center;
}

.switch-demo__invalid {
  gap: 0.25rem;
}

.switch-demo__invalid :deep(.kappa-field__error-text) {
  padding-inline-start: 2.5rem;
}

.switch-demo__form :deep(.kappa-button) {
  justify-self: start;
}

.switch-demo__rtl {
  inline-size: min(100%, 22rem);
}

@media (max-width: 30rem) {
  .switch-demo :deep(.switch-demo__setting),
  .switch-demo :deep(.switch-demo__choice-card) {
    align-items: flex-start;
  }
}

@media (prefers-reduced-motion: reduce) {
  .switch-demo__choice-card {
    transition: none;
  }
}
</style>
