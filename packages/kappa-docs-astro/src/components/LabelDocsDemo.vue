<script setup lang="ts">
import { ref } from "vue";
import { Checkbox } from "@dicehub/kappa/components/checkbox";
import { Label } from "@dicehub/kappa/components/label";

type DemoVariant =
  | "preview"
  | "basic"
  | "optional"
  | "association"
  | "wrapped"
  | "content"
  | "guidance"
  | "disabled"
  | "rtl";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const username = ref("jordanlee");
const email = ref("");
const extension = ref("");
const nickname = ref("");
const accountName = ref("Northwind");
const rememberDevice = ref(true);
const inviteCode = ref("");
const city = ref("عمّان");
</script>

<template>
  <div class="label-demo" :data-label-demo="props.variant">
    <div v-if="props.variant === 'preview'" class="label-demo__field">
      <Label for="label-preview-username">Username</Label>
      <input
        id="label-preview-username"
        v-model="username"
        class="label-demo__input"
        name="username"
        autocomplete="username"
      />
    </div>

    <div v-else-if="props.variant === 'basic'" class="label-demo__field">
      <Label for="label-basic-email">Email address</Label>
      <input
        id="label-basic-email"
        v-model="email"
        class="label-demo__input"
        name="email"
        type="email"
        autocomplete="email"
        placeholder="name@example.com"
      />
    </div>

    <div v-else-if="props.variant === 'optional'" class="label-demo__stack">
      <div class="label-demo__field">
        <Label for="label-optional-extension" show-optional>Extension</Label>
        <input
          id="label-optional-extension"
          v-model="extension"
          class="label-demo__input"
          name="extension"
          inputmode="numeric"
          placeholder="104"
        />
      </div>
      <div class="label-demo__field" lang="fr">
        <Label for="label-optional-nickname" show-optional optional-text="facultatif">
          Surnom
        </Label>
        <input
          id="label-optional-nickname"
          v-model="nickname"
          class="label-demo__input"
          name="nickname"
          placeholder="Jo"
        />
      </div>
    </div>

    <div v-else-if="props.variant === 'association'" class="label-demo__field">
      <Label html-for="label-association-account">Account name</Label>
      <input
        id="label-association-account"
        v-model="accountName"
        class="label-demo__input"
        name="account-name"
      />
    </div>

    <Label v-else-if="props.variant === 'wrapped'" class="label-demo__check-row">
      <input v-model="rememberDevice" name="remember-device" type="checkbox" />
      <span>Remember this device</span>
    </Label>

    <Checkbox.Root
      v-else-if="props.variant === 'content'"
      class="label-demo__checkbox"
      default-checked
      name="analytics"
    >
      <Checkbox.Control />
      <Checkbox.Label>
        <Label as-content>Share anonymous usage data</Label>
      </Checkbox.Label>
    </Checkbox.Root>

    <div v-else-if="props.variant === 'guidance'" class="label-demo__field">
      <Label for="label-guidance-code">Invite code</Label>
      <input
        id="label-guidance-code"
        v-model="inviteCode"
        class="label-demo__input"
        name="invite-code"
        aria-describedby="label-guidance-help"
        placeholder="AB12CD34"
      />
      <p id="label-guidance-help">Use the 8-character code from your invitation email.</p>
    </div>

    <div v-else-if="props.variant === 'disabled'" class="label-demo__field">
      <Label for="label-disabled-member" data-disabled>Member ID</Label>
      <input
        id="label-disabled-member"
        class="label-demo__input"
        name="member-id"
        value="MBR-2841"
        disabled
      />
    </div>

    <div v-else class="label-demo__field" dir="rtl" lang="ar">
      <Label for="label-rtl-city" show-optional optional-text="اختياري">المدينة</Label>
      <input
        id="label-rtl-city"
        v-model="city"
        class="label-demo__input"
        name="city"
      />
    </div>
  </div>
</template>

<style scoped>
.label-demo {
  display: flex;
  inline-size: 100%;
  min-inline-size: 0;
  align-items: center;
  justify-content: center;
  color: var(--kappa-default, #17191f);
  font-family: var(--kappa-font-sans, inherit);
}

.label-demo > :is(.label-demo__field, .label-demo__stack) {
  inline-size: min(100%, 26rem);
}

.label-demo__field > p {
  color: var(--kappa-subtle, #6c7480);
  font-size: 0.75rem;
  line-height: 1.4;
}

.label-demo__stack {
  display: grid;
  gap: 1rem;
}

.label-demo__field {
  display: grid;
  min-inline-size: 0;
  gap: 0.4375rem;
}

.label-demo__field > p {
  margin: 0;
}

.label-demo__input {
  box-sizing: border-box;
  inline-size: 100%;
  min-inline-size: 0;
  min-block-size: 2.25rem;
  padding-block: 0.4375rem;
  padding-inline: 0.625rem;
  border: 1px solid var(--kappa-line, #e3e6eb);
  border-radius: 0.5rem;
  background: var(--kappa-control, #ffffff);
  color: var(--kappa-default, #17191f);
  font: inherit;
  font-size: 0.8125rem;
  line-height: 1.35;
  outline: 2px solid transparent;
  outline-offset: 1px;
  transition: border-color 120ms ease, outline-color 120ms ease;
}

.label-demo__input::placeholder {
  color: var(--kappa-muted, #9aa2ae);
  opacity: 1;
}

.label-demo__input:hover:not(:disabled) {
  border-color: var(--kappa-subtle, #6c7480);
}

.label-demo__input:focus-visible {
  border-color: var(--kappa-focus, #4c63ff);
  outline-color: var(--kappa-focus, #4c63ff);
}

.label-demo__input:disabled {
  background: var(--kappa-disabled-surface, var(--kappa-tint, #f4f6f9));
  color: var(--kappa-subtle, #6c7480);
  cursor: not-allowed;
  opacity: 0.62;
}

.label-demo__check-row {
  align-items: center;
  cursor: pointer;
}

.label-demo__check-row input {
  inline-size: 1rem;
  block-size: 1rem;
  margin: 0;
  accent-color: var(--kappa-accent, #4356e8);
}

.label-demo__checkbox {
  inline-size: min(100%, 26rem);
}

@media (prefers-reduced-motion: reduce) {
  .label-demo__input {
    transition: none;
  }
}

@media (forced-colors: active) {
  .label-demo__input:focus-visible {
    border-color: Highlight;
    outline-color: Highlight;
  }
}
</style>
