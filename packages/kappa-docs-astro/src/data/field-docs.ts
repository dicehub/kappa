export const barrelCode = `import { Field } from "@dicehub/kappa";`;

export const granularCode = `import { Field } from "@dicehub/kappa/components/field";`;

export const previewCode = `<script setup>
import { ref } from "vue";
import { Field } from "@dicehub/kappa/components/field";
import { Button } from "@dicehub/kappa/components/button";

const name = ref("Northstar");
const region = ref("eu-central");
</script>

<template>
  <form @submit.prevent>
    <Field.Root id="workspace-name" required>
      <Field.Label>
        Workspace name
        <Field.RequiredIndicator />
      </Field.Label>
      <Field.Input v-model="name" autocomplete="organization" />
      <Field.HelperText>Use a short name that is easy to scan.</Field.HelperText>
    </Field.Root>

    <Field.Root id="workspace-region">
      <Field.Label>Data region</Field.Label>
      <Field.Select v-model="region">
        <option value="eu-central">Europe Central</option>
        <option value="us-east">US East</option>
      </Field.Select>
    </Field.Root>

    <Button type="submit">Create workspace</Button>
  </form>
</template>`;

export const usageCode = `<script setup>
import { Field } from "@dicehub/kappa/components/field";
</script>

<template>
  <Field.Root id="email">
    <Field.Label>Email address</Field.Label>
    <Field.Input type="email" autocomplete="email" />
    <Field.HelperText>We will only use this address for account messages.</Field.HelperText>
  </Field.Root>
</template>`;

export const basicCode = `<Field.Root id="contact-email">
  <Field.Label>Email address</Field.Label>
  <Field.Input type="email" placeholder="name@example.com" />
  <Field.HelperText>We will only use this address for account messages.</Field.HelperText>
</Field.Root>`;

export const textareaCode = `<script setup>
import { ref } from "vue";
import { Field } from "@dicehub/kappa/components/field";

const notes = ref("Bring the accessibility report to the review.");
</script>

<template>
  <Field.Root id="review-notes">
    <Field.Label>Review notes</Field.Label>
    <Field.Textarea v-model="notes" autoresize :rows="3" />
    <Field.HelperText>{{ notes.length }}/200 characters</Field.HelperText>
  </Field.Root>
</template>`;

export const selectCode = `<Field.Root id="timezone">
  <Field.Label>Timezone</Field.Label>
  <Field.Select v-model="timezone">
    <option value="Europe/Berlin">Berlin (UTC+2)</option>
    <option value="America/New_York">New York (UTC-4)</option>
    <option value="Asia/Singapore">Singapore (UTC+8)</option>
  </Field.Select>
  <Field.HelperText>Dates and reminders use this timezone.</Field.HelperText>
</Field.Root>`;

export const validationCode = `<script setup>
import { computed, ref } from "vue";
import { Field } from "@dicehub/kappa/components/field";

const password = ref("short");
const errors = computed(() => {
  const messages = [];
  if (password.value.length < 8) messages.push("Use at least 8 characters.");
  if (!/[A-Z]/.test(password.value)) messages.push("Add one uppercase letter.");
  if (!/\\d/.test(password.value)) messages.push("Add one number.");
  return messages;
});
</script>

<template>
  <Field.Root id="password" required :invalid="errors.length > 0">
    <Field.Label>Password <Field.RequiredIndicator /></Field.Label>
    <Field.Input v-model="password" type="password" />
    <Field.HelperText>Use a unique password for this account.</Field.HelperText>
    <Field.ErrorText>
      <ul><li v-for="error in errors" :key="error">{{ error }}</li></ul>
    </Field.ErrorText>
  </Field.Root>
</template>`;

export const requiredCode = `<Field.Root id="contact-name" required>
  <Field.Label>Contact name <Field.RequiredIndicator /></Field.Label>
  <Field.Input />
</Field.Root>

<Field.Root id="company-name">
  <Field.Label>
    Company
    <Field.RequiredIndicator>
      <template #fallback><span>(optional)</span></template>
    </Field.RequiredIndicator>
  </Field.Label>
  <Field.Input />
</Field.Root>`;

export const checkboxCode = `<script setup>
import { Checkbox } from "@dicehub/kappa/components/checkbox";
import { Field } from "@dicehub/kappa/components/field";
</script>

<template>
  <Field.Root id="product-updates">
    <Checkbox.Root default-checked name="product-updates">
      <Checkbox.Control />
      <Field.Label as-child>
        <Checkbox.Label>Send me product updates</Checkbox.Label>
      </Field.Label>
    </Checkbox.Root>
    <Field.HelperText>One short email each month.</Field.HelperText>
  </Field.Root>
</template>`;

export const multipleCode = `<Field.Root id="monthly-budget" target="amount">
  <Field.Label>Monthly budget</Field.Label>
  <div class="budget-control">
    <Field.Item value="currency">
      <Field.Label class="visually-hidden">Currency</Field.Label>
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
</Field.Root>`;

export const orientationCode = `<Field.Root id="account-alias" orientation="horizontal">
  <Field.Label>Account alias</Field.Label>
  <Field.Input />
  <Field.HelperText>Shown in account menus.</Field.HelperText>
</Field.Root>

<Field.Root id="language" orientation="responsive">
  <Field.Label>Language</Field.Label>
  <Field.Select>
    <option>English</option>
    <option>Deutsch</option>
  </Field.Select>
  <Field.HelperText>Stacks below 40 rem.</Field.HelperText>
</Field.Root>`;

export const statesCode = `<Field.Root id="customer-id" disabled>
  <Field.Label>Customer ID</Field.Label>
  <Field.Input model-value="CUS-40218" />
  <Field.HelperText>Disabled while the account is pending.</Field.HelperText>
</Field.Root>

<Field.Root id="account-owner" read-only>
  <Field.Label>Account owner</Field.Label>
  <Field.Input model-value="Avery Chen" />
  <Field.HelperText>Contact support to change the owner.</Field.HelperText>
</Field.Root>`;

export const rootProps = [
  {
    name: "orientation",
    type: '"vertical" | "horizontal" | "responsive"',
    defaultValue: '"vertical"',
    description: "Controls the Kappa label and control layout. Responsive becomes horizontal at 40 rem.",
  },
  {
    name: "required",
    type: "boolean",
    defaultValue: "false",
    description: "Marks native controls as required and exposes required state to all parts.",
  },
  {
    name: "invalid",
    type: "boolean",
    defaultValue: "false",
    description: "Marks controls as invalid and renders ErrorText with a polite live region.",
  },
  {
    name: "disabled",
    type: "boolean",
    defaultValue: "false",
    description: "Disables native controls and exposes disabled state to all parts.",
  },
  {
    name: "readOnly",
    type: "boolean",
    defaultValue: "false",
    description: "Makes supported controls read-only while they remain focusable.",
  },
  {
    name: "id",
    type: "string",
    defaultValue: "generated",
    description: "Sets the control ID and the base for generated part IDs.",
  },
  {
    name: "ids",
    type: "{ root?; control?; label?; errorText?; helperText? }",
    defaultValue: "generated",
    description: "Overrides generated IDs for integration with an existing form system.",
  },
  {
    name: "target",
    type: "string",
    defaultValue: "—",
    description: "Points the root label at one Field.Item in a multi-control field.",
  },
  {
    name: "asChild",
    type: "boolean",
    defaultValue: "false",
    description: "Merges root behavior and attributes into one child element.",
  },
] as const;

export const controlProps = [
  {
    part: "Input / Textarea / Select",
    prop: "modelValue",
    type: "string | number",
    description: "Controls the native value through v-model.",
  },
  {
    part: "Textarea",
    prop: "autoresize",
    type: "boolean",
    description: "Grows the textarea with its content and disables manual resize.",
  },
  {
    part: "All rendered parts",
    prop: "asChild",
    type: "boolean",
    description: "Merges the Ark UI part into one child element.",
  },
] as const;

export const parts = [
  { name: "Root", description: "Owns field IDs, state, ARIA relationships, and layout." },
  { name: "RootProvider", description: "Renders a field from a useField machine." },
  { name: "Label", description: "Labels the field control or one Item." },
  { name: "Input", description: "Native text input connected to field state." },
  { name: "Textarea", description: "Native textarea with optional automatic resize." },
  { name: "Select", description: "Native select connected to field state." },
  { name: "HelperText", description: "Persistent guidance referenced by the control." },
  { name: "ErrorText", description: "Invalid-state message with polite live semantics." },
  { name: "RequiredIndicator", description: "Required mark with an optional fallback slot." },
  { name: "Item", description: "Renderless context for one control in a multi-control field." },
  { name: "Context", description: "Exposes the current Ark field context to a scoped slot." },
] as const;

export const exportsList = [
  { name: "Field", description: "Compound Field component and Root alias." },
  { name: "FieldRoot", description: "Named root component." },
  { name: "FieldRootProvider", description: "Root that consumes an external field machine." },
  { name: "FieldLabel", description: "Native field label." },
  { name: "FieldInput", description: "Connected native input." },
  { name: "FieldTextarea", description: "Connected native textarea." },
  { name: "FieldSelect", description: "Connected native select." },
  { name: "FieldHelperText", description: "Connected helper text." },
  { name: "FieldErrorText", description: "Connected invalid-state text." },
  { name: "FieldRequiredIndicator", description: "Required or optional state text." },
  { name: "FieldItem", description: "Multi-control field context." },
  { name: "FieldContext", description: "Scoped field context slot." },
  { name: "useField", description: "Creates an Ark field machine for RootProvider." },
  { name: "useFieldContext", description: "Reads the closest field context." },
  { name: "fieldAnatomy", description: "Ark UI field anatomy metadata." },
  { name: "FIELD_ORIENTATIONS", description: "Supported Kappa layout values." },
  { name: "resolveFieldOrientation", description: "Safe runtime layout resolver." },
] as const;
