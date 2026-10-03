<script setup lang="ts">
import { ref } from "vue";
import { InputOtp } from "@dicehub/kappa/components/input-otp";

type DemoVariant =
  | "preview"
  | "usage"
  | "pattern"
  | "mask"
  | "states"
  | "blur"
  | "controlled";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const controlledValue = ref(["4", "0", "2", "8", "1", "6"]);
const completedValue = ref("");
const patternValue = ref<string[]>([]);

const onComplete = (details: { valueAsString: string }) => {
  completedValue.value = details.valueAsString;
};
</script>

<template>
  <div class="input-otp-demo" :data-input-otp-demo="props.variant">
    <InputOtp.Root
      v-if="props.variant === 'preview'"
      aria-label="Verification code"
      :count="6"
      otp
    >
      <InputOtp.Label>Verification code</InputOtp.Label>
      <InputOtp.Control>
        <InputOtp.Input v-for="index in 6" :key="index" :index="index - 1" />
      </InputOtp.Control>
      <InputOtp.HiddenInput name="verification-code" />
    </InputOtp.Root>

    <InputOtp.Root
      v-else-if="props.variant === 'usage'"
      aria-label="Deploy confirmation code"
      :count="6"
      otp
      placeholder="·"
    >
      <InputOtp.Label>Deploy confirmation code</InputOtp.Label>
      <InputOtp.Control>
        <InputOtp.Input v-for="index in 6" :key="index" :index="index - 1" />
      </InputOtp.Control>
      <InputOtp.HiddenInput name="deploy-code" />
    </InputOtp.Root>

    <InputOtp.Root
      v-else-if="props.variant === 'pattern'"
      v-model="patternValue"
      aria-label="Numeric code"
      :count="6"
      pattern="[0-9]"
      placeholder="○"
      type="numeric"
    >
      <InputOtp.Label>Numeric code</InputOtp.Label>
      <InputOtp.Control>
        <InputOtp.Input v-for="index in 6" :key="index" :index="index - 1" />
      </InputOtp.Control>
      <InputOtp.HiddenInput name="numeric-code" />
    </InputOtp.Root>

    <InputOtp.Root
      v-else-if="props.variant === 'mask'"
      aria-label="Masked access code"
      :count="6"
      mask
      otp
    >
      <InputOtp.Label>Masked access code</InputOtp.Label>
      <InputOtp.Control>
        <InputOtp.Input v-for="index in 6" :key="index" :index="index - 1" />
      </InputOtp.Control>
      <InputOtp.HiddenInput name="masked-code" />
    </InputOtp.Root>

    <div v-else-if="props.variant === 'states'" class="input-otp-demo__stack">
      <InputOtp.Root aria-label="Invalid verification code" :count="6" invalid>
        <InputOtp.Label>Invalid verification code</InputOtp.Label>
        <InputOtp.Control>
          <InputOtp.Input v-for="index in 6" :key="index" :index="index - 1" />
        </InputOtp.Control>
        <InputOtp.HiddenInput name="invalid-code" />
      </InputOtp.Root>
      <InputOtp.Root
        aria-label="Disabled verification code"
        :count="6"
        :default-value="['4', '0', '2', '8', '1', '6']"
        disabled
      >
        <InputOtp.Label>Disabled verification code</InputOtp.Label>
        <InputOtp.Control>
          <InputOtp.Input v-for="index in 6" :key="index" :index="index - 1" />
        </InputOtp.Control>
        <InputOtp.HiddenInput name="disabled-code" />
      </InputOtp.Root>
    </div>

    <div v-else-if="props.variant === 'blur'" class="input-otp-demo__stack">
      <InputOtp.Root
        aria-label="Auto-submit code"
        :count="6"
        blur-on-complete
        otp
        @value-complete="onComplete"
      >
        <InputOtp.Label>Auto-submit code</InputOtp.Label>
        <InputOtp.Control>
          <InputOtp.Input v-for="index in 6" :key="index" :index="index - 1" />
        </InputOtp.Control>
        <InputOtp.HiddenInput name="auto-submit-code" />
      </InputOtp.Root>
      <output class="input-otp-demo__status" role="status">
        {{ completedValue ? `Completed ${completedValue}` : "Focus leaves the last cell when complete." }}
      </output>
    </div>

    <div v-else class="input-otp-demo__stack">
      <InputOtp.Root
        v-model="controlledValue"
        aria-label="Controlled verification code"
        :count="6"
        otp
        @value-complete="onComplete"
      >
        <InputOtp.Label>Controlled verification code</InputOtp.Label>
        <InputOtp.Control>
          <InputOtp.Input v-for="index in 6" :key="index" :index="index - 1" />
        </InputOtp.Control>
        <InputOtp.HiddenInput name="controlled-code" />
      </InputOtp.Root>
      <output class="input-otp-demo__status" role="status">Value: {{ controlledValue.join("") }}</output>
    </div>
  </div>
</template>

<style scoped>
.input-otp-demo {
  display: flex;
  inline-size: 100%;
  min-inline-size: 0;
  justify-content: center;
  color: var(--kappa-default, #17191f);
  font-family: var(--kappa-font-sans, inherit);
}

.input-otp-demo > .input-otp-demo__stack {
  inline-size: min(100%, 28rem);
}

.input-otp-demo__stack {
  display: grid;
  min-inline-size: 0;
  justify-items: center;
  gap: 0.875rem;
}

.input-otp-demo__status {
  margin: 0;
  color: var(--kappa-subtle, #6c7480);
  font-family: var(--kappa-font-mono, monospace);
  font-size: 0.75rem;
  line-height: 1.4;
}
</style>
