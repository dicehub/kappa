<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@dicehub/kappa/components/button";
import { SensitiveInput } from "@dicehub/kappa/components/sensitive-input";

type DemoVariant =
  | "preview"
  | "usage"
  | "sizes"
  | "controlled"
  | "states"
  | "interaction";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const previewValue = ref("");
const controlledValue = ref("dh_secret_4b8f2c");
const copied = ref(false);

const replaceValue = () => {
  controlledValue.value = "dh_secret_rotor_42";
};
</script>

<template>
  <div class="sensitive-input-demo" :data-sensitive-input-demo="props.variant">
    <SensitiveInput
      v-if="props.variant === 'preview'"
      id="sensitive-input-preview"
      label="Access token"
      v-model="previewValue"
      autocomplete="off"
      placeholder="dh_live_…"
      description="Stored encrypted and shown only when you choose to reveal it."
    />

    <SensitiveInput
      v-else-if="props.variant === 'usage'"
      aria-label="Webhook signing secret"
      default-value="whsec_7f29b1d0"
      name="webhook-secret"
      autocomplete="off"
    />

    <div v-else-if="props.variant === 'sizes'" class="sensitive-input-demo__sizes">
      <SensitiveInput
        v-for="size in ['xs', 'sm', 'base', 'lg'] as const"
        :key="size"
        :aria-label="`${size} secret`"
        :size="size"
        :default-value="`${size}-density-secret`"
      />
    </div>

    <div v-else-if="props.variant === 'controlled'" class="sensitive-input-demo__stack">
      <SensitiveInput
        id="sensitive-input-controlled"
        v-model="controlledValue"
        label="Controlled secret"
        autocomplete="off"
      />
      <output for="sensitive-input-controlled" class="sensitive-input-demo__value">
        Current value: <code>{{ controlledValue }}</code>
      </output>
      <div class="sensitive-input-demo__actions">
        <Button type="button" size="sm" @click="replaceValue">Replace value</Button>
        <Button type="button" size="sm" variant="outline" @click="controlledValue = ''">Clear</Button>
      </div>
    </div>

    <div v-else-if="props.variant === 'states'" class="sensitive-input-demo__stack">
      <SensitiveInput
        label="Invalid token"
        default-value="bad_token"
        error="This token is not valid for the selected workspace."
        invalid
      />
      <SensitiveInput label="Disabled token" default-value="archived_secret" disabled />
      <SensitiveInput label="Read-only token" default-value="view_only_secret" read-only />
    </div>

    <div v-else class="sensitive-input-demo__stack">
      <SensitiveInput
        aria-label="Signing secret"
        default-value="signing_secret_89ac"
        @copy="copied = true"
      />
      <p v-if="copied" class="sensitive-input-demo__status" role="status">
        Secret copied to the clipboard.
      </p>
      <p v-else class="sensitive-input-demo__hint">
        Tab to the control, press Enter while masked, then use Escape to mask it again.
      </p>
    </div>
  </div>
</template>

<style scoped>
.sensitive-input-demo {
  display: flex;
  inline-size: 100%;
  min-inline-size: 0;
  justify-content: center;
  color: var(--kappa-default, #17191f);
  font-family: var(--kappa-font-sans, inherit);
}

.sensitive-input-demo > :is(.kappa-sensitive-input, .sensitive-input-demo__stack, .sensitive-input-demo__sizes) {
  inline-size: min(100%, 28rem);
}

.sensitive-input-demo__sizes,
.sensitive-input-demo__stack {
  display: grid;
  min-inline-size: 0;
  gap: 0.875rem;
}

.sensitive-input-demo__value,
.sensitive-input-demo__hint,
.sensitive-input-demo__status {
  margin: 0;
  color: var(--kappa-subtle, #6c7480);
  font-size: 0.75rem;
  line-height: 1.4;
}

.sensitive-input-demo__value code {
  color: var(--kappa-default, #17191f);
  font-family: var(--kappa-font-mono, monospace);
  overflow-wrap: anywhere;
}

.sensitive-input-demo__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.sensitive-input-demo__status {
  color: var(--kappa-success-text, #027a48);
}
</style>
