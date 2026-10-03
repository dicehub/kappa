<script setup lang="ts">
import { computed, ref } from "vue";
import { Button } from "@dicehub/kappa/components/button";
import { Checkbox } from "@dicehub/kappa/components/checkbox";
import { Field } from "@dicehub/kappa/components/field";

type DemoVariant =
  | "preview"
  | "usage"
  | "basic"
  | "textarea"
  | "select"
  | "validation"
  | "required"
  | "checkbox"
  | "multiple"
  | "orientation"
  | "states";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const workspaceName = ref("Northstar");
const workspaceDescription = ref("Product research and launch planning.");
const region = ref("eu-central");
const email = ref("");
const notes = ref("Bring the accessibility report to the review.");
const timezone = ref("Europe/Berlin");
const password = ref("short");
const company = ref("");
const contactName = ref("Avery Chen");
const currency = ref("EUR");
const budget = ref("2400");
const alias = ref("northstar-prod");
const language = ref("English");

const passwordErrors = computed(() => {
  const errors: string[] = [];
  if (password.value.length < 8) errors.push("Use at least 8 characters.");
  if (!/[A-Z]/.test(password.value)) errors.push("Add one uppercase letter.");
  if (!/\d/.test(password.value)) errors.push("Add one number.");
  return errors;
});
</script>

<template>
  <div class="field-demo" :data-field-demo="props.variant">
    <section v-if="props.variant === 'preview'" class="field-demo__panel">
      <header class="field-demo__panel-header">
        <span>Workspace setup</span>
        <h3>Create a workspace</h3>
        <p>Set the details your team will see.</p>
      </header>

      <form class="field-demo__form" @submit.prevent>
        <Field.Root id="workspace-name" required>
          <Field.Label>
            Workspace name
            <Field.RequiredIndicator />
          </Field.Label>
          <Field.Input v-model="workspaceName" autocomplete="organization" />
          <Field.HelperText>Use a short name that is easy to scan.</Field.HelperText>
        </Field.Root>

        <Field.Root id="workspace-description">
          <Field.Label>
            Description
            <Field.RequiredIndicator>
              <template #fallback><span class="field-demo__optional">(optional)</span></template>
            </Field.RequiredIndicator>
          </Field.Label>
          <Field.Textarea v-model="workspaceDescription" :rows="2" />
        </Field.Root>

        <Field.Root id="workspace-region">
          <Field.Label>Data region</Field.Label>
          <Field.Select v-model="region">
            <option value="eu-central">Europe Central</option>
            <option value="us-east">US East</option>
            <option value="ap-southeast">Asia Pacific</option>
          </Field.Select>
          <Field.HelperText>This setting cannot change after creation.</Field.HelperText>
        </Field.Root>

        <div class="field-demo__actions">
          <Button type="button" variant="outline">Cancel</Button>
          <Button type="submit" variant="primary">Create workspace</Button>
        </div>
      </form>
    </section>

    <Field.Root v-else-if="props.variant === 'usage'" id="usage-email">
      <Field.Label>Email address</Field.Label>
      <Field.Input v-model="email" type="email" autocomplete="email" placeholder="name@example.com" />
      <Field.HelperText>We will only use this address for account messages.</Field.HelperText>
    </Field.Root>

    <Field.Root v-else-if="props.variant === 'basic'" id="contact-email">
      <Field.Label>Email address</Field.Label>
      <Field.Input v-model="email" type="email" autocomplete="email" placeholder="name@example.com" />
      <Field.HelperText>We will only use this address for account messages.</Field.HelperText>
    </Field.Root>

    <Field.Root v-else-if="props.variant === 'textarea'" id="review-notes">
      <Field.Label>Review notes</Field.Label>
      <Field.Textarea v-model="notes" autoresize :rows="3" />
      <Field.HelperText>{{ notes.length }}/200 characters</Field.HelperText>
    </Field.Root>

    <Field.Root v-else-if="props.variant === 'select'" id="timezone">
      <Field.Label>Timezone</Field.Label>
      <Field.Select v-model="timezone">
        <option value="Europe/Berlin">Berlin (UTC+2)</option>
        <option value="America/New_York">New York (UTC-4)</option>
        <option value="Asia/Singapore">Singapore (UTC+8)</option>
      </Field.Select>
      <Field.HelperText>Dates and reminders use this timezone.</Field.HelperText>
    </Field.Root>

    <Field.Root
      v-else-if="props.variant === 'validation'"
      id="account-password"
      required
      :invalid="passwordErrors.length > 0"
    >
      <Field.Label>
        Password
        <Field.RequiredIndicator />
      </Field.Label>
      <Field.Input v-model="password" type="password" autocomplete="new-password" />
      <Field.HelperText>Use a unique password for this account.</Field.HelperText>
      <Field.ErrorText>
        <ul>
          <li v-for="error in passwordErrors" :key="error">{{ error }}</li>
        </ul>
      </Field.ErrorText>
    </Field.Root>

    <div v-else-if="props.variant === 'required'" class="field-demo__stack">
      <Field.Root id="contact-name" required>
        <Field.Label>
          Contact name
          <Field.RequiredIndicator />
        </Field.Label>
        <Field.Input v-model="contactName" />
      </Field.Root>

      <Field.Root id="company-name">
        <Field.Label>
          Company
          <Field.RequiredIndicator>
            <template #fallback><span class="field-demo__optional">(optional)</span></template>
          </Field.RequiredIndicator>
        </Field.Label>
        <Field.Input v-model="company" />
      </Field.Root>
    </div>

    <Field.Root v-else-if="props.variant === 'checkbox'" id="product-updates">
      <Checkbox.Root default-checked name="product-updates">
        <Checkbox.Control />
        <Field.Label as-child>
          <Checkbox.Label>Send me product updates</Checkbox.Label>
        </Field.Label>
      </Checkbox.Root>
      <Field.HelperText>One short email each month. Unsubscribe at any time.</Field.HelperText>
    </Field.Root>

    <Field.Root
      v-else-if="props.variant === 'multiple'"
      id="monthly-budget"
      target="amount"
    >
      <Field.Label>Monthly budget</Field.Label>
      <div class="field-demo__compound-control">
        <Field.Item value="currency">
          <Field.Label class="docs-visually-hidden">Currency</Field.Label>
          <Field.Select v-model="currency" aria-label="Currency">
            <option>EUR</option>
            <option>USD</option>
            <option>GBP</option>
          </Field.Select>
        </Field.Item>
        <Field.Item value="amount">
          <Field.Input v-model="budget" inputmode="decimal" />
        </Field.Item>
      </div>
      <Field.HelperText>Set the limit used for monthly alerts.</Field.HelperText>
    </Field.Root>

    <div v-else-if="props.variant === 'orientation'" class="field-demo__stack field-demo__stack--wide">
      <Field.Root id="account-alias" orientation="horizontal">
        <Field.Label>Account alias</Field.Label>
        <Field.Input v-model="alias" />
        <Field.HelperText>Shown in account menus.</Field.HelperText>
      </Field.Root>

      <Field.Root id="language" orientation="responsive">
        <Field.Label>Language</Field.Label>
        <Field.Select v-model="language">
          <option>English</option>
          <option>Deutsch</option>
          <option>Français</option>
        </Field.Select>
        <Field.HelperText>Stacks below 40 rem.</Field.HelperText>
      </Field.Root>
    </div>

    <div v-else class="field-demo__stack">
      <Field.Root id="customer-id" disabled>
        <Field.Label>Customer ID</Field.Label>
        <Field.Input model-value="CUS-40218" />
        <Field.HelperText>Disabled while the account is pending.</Field.HelperText>
      </Field.Root>

      <Field.Root id="account-owner" read-only>
        <Field.Label>Account owner</Field.Label>
        <Field.Input model-value="Avery Chen" />
        <Field.HelperText>Contact support to change the owner.</Field.HelperText>
      </Field.Root>
    </div>
  </div>
</template>

<style scoped>
.field-demo {
  display: flex;
  inline-size: 100%;
  min-inline-size: 0;
  align-items: center;
  justify-content: center;
  color: var(--kappa-default, #17191f);
  font-family: var(--kappa-font-sans, inherit);
}

.field-demo > .kappa-field,
.field-demo__stack {
  inline-size: min(100%, 26rem);
}

.field-demo__panel {
  box-sizing: border-box;
  inline-size: min(100%, 31rem);
  overflow: hidden;
  border: 1px solid var(--kappa-line, #e3e6eb);
  border-radius: 0.75rem;
  background: var(--kappa-control, #ffffff);
  box-shadow: var(--kappa-shadow, 0 1px 2px rgb(16 24 40 / 5%));
}

.field-demo__panel-header {
  padding-block: 1.125rem 1rem;
  padding-inline: 1.25rem;
  border-block-end: 1px solid var(--kappa-line, #e3e6eb);
}

.field-demo__panel-header span {
  display: block;
  margin-block-end: 0.25rem;
  color: var(--kappa-accent, #4356e8);
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  line-height: 1rem;
  text-transform: uppercase;
}

.field-demo__panel-header h3,
.field-demo__panel-header p {
  margin: 0;
}

.field-demo__panel-header h3 {
  font-size: 1rem;
  font-weight: 650;
  line-height: 1.5rem;
}

.field-demo__panel-header p {
  margin-block-start: 0.125rem;
  color: var(--kappa-subtle, #6c7480);
  font-size: 0.75rem;
  line-height: 1.125rem;
}

.field-demo__form {
  display: grid;
  gap: 1rem;
  padding: 1.25rem;
}

.field-demo__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding-block-start: 0.125rem;
}

.field-demo__optional {
  color: var(--kappa-subtle, #6c7480);
  font-size: 0.75rem;
  font-weight: 450;
}

.field-demo__stack {
  display: grid;
  gap: 1.25rem;
}

.field-demo__stack--wide {
  inline-size: min(100%, 37rem);
}

.field-demo__compound-control {
  display: grid;
  grid-template-columns: 6.5rem minmax(0, 1fr);
  gap: 0.5rem;
}

@media (max-width: 30rem) {
  .field-demo__panel-header,
  .field-demo__form {
    padding: 1rem;
  }

  .field-demo__compound-control {
    grid-template-columns: 5.5rem minmax(0, 1fr);
  }
}
</style>
