<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useId } from "vue";
import { SettingsSection } from "@dicehub/kappa/blocks/settings-layout";
import { Button } from "@dicehub/kappa/components/button";
import { Field } from "@dicehub/kappa/components/field";
import SettingsTimeZoneDemo from "./SettingsTimeZoneDemo.vue";
import type { SettingsDemoField } from "../data/settings-demo-fields";

const props = defineProps<{ field: SettingsDemoField }>();
const id = useId();
const current = ref(props.field.value);
const draft = ref(props.field.value);
const open = ref(props.field.defaultOpen ?? false);
const error = ref("");
const currentPassword = ref("");
const confirmation = ref("");
const passwordError = ref("");
const confirmationError = ref("");
const result = ref("");
const saving = ref(false);
const changedPassword = ref(false);
const saveLabel = computed(() => {
  const label = props.field.saveLabel?.trim();
  return label && label.length <= 32 ? label : "Save";
});
let timer: ReturnType<typeof setTimeout> | undefined;
const summary = computed(() => props.field.type === "password"
  ? (changedPassword.value ? "Last changed just now." : props.field.description)
  : `${props.field.description} ${props.field.id === "username" ? "@" : ""}${current.value}.`);

function save() {
  if (saving.value) return;
  error.value = "";
  passwordError.value = "";
  confirmationError.value = "";
  result.value = "";
  const value = props.field.type === "password" ? draft.value : draft.value.trim();
  if (!value) error.value = `Enter ${props.field.title.toLowerCase()}.`;
  else if (props.field.id === "username" && !/^[a-z0-9_-]{3,}$/i.test(value)) error.value = "Use at least 3 letters, numbers, underscores, or hyphens.";
  else if (props.field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error.value = "Enter a valid email address.";
  else if (props.field.type === "password" && value.length < 12) error.value = "Use at least 12 characters in this example.";
  if (props.field.type === "password") {
    if (!currentPassword.value) passwordError.value = "Enter your current password.";
    if (value !== confirmation.value) confirmationError.value = "The passwords do not match.";
  }
  if (error.value || passwordError.value || confirmationError.value) return;
  saving.value = true;
  timer = setTimeout(() => {
    if (props.field.type === "password") {
      changedPassword.value = true;
      draft.value = "";
      currentPassword.value = "";
      confirmation.value = "";
    } else current.value = value;
    saving.value = false;
    result.value = `${props.field.title} saved in this example.`;
  }, 500);
}

onBeforeUnmount(() => clearTimeout(timer));
</script>

<template>
  <SettingsSection v-model:open="open" :title="field.title" :description="summary" :heading-level="3" :disabled="saving" :data-setting="field.id">
    <form class="settings-demo__form" novalidate :aria-busy="saving" @submit.prevent="save">
      <Field.Root v-if="field.type === 'password'" :id="'settings-current-' + id" :invalid="Boolean(passwordError)" :disabled="saving" required>
        <Field.Label>Current password</Field.Label>
        <Field.Input v-model="currentPassword" type="password" autocomplete="current-password" />
        <Field.ErrorText v-if="passwordError">{{ passwordError }}</Field.ErrorText>
      </Field.Root>
      <SettingsTimeZoneDemo v-if="field.id === 'timezone'" v-model="draft" :disabled="saving" :error="error" />
      <Field.Root v-else :id="'settings-' + id" :invalid="Boolean(error)" :disabled="saving" required>
        <Field.Label>{{ field.type === 'password' ? 'New password' : field.title }}</Field.Label>
        <Field.Select v-if="field.options" v-model="draft"><option v-for="option in field.options" :key="option" :value="option">{{ option }}</option></Field.Select>
        <Field.Input v-else v-model="draft" :type="field.type ?? 'text'" :autocomplete="field.type === 'password' ? 'new-password' : field.id === 'username' ? 'username' : 'email'" />
        <Field.ErrorText v-if="error">{{ error }}</Field.ErrorText>
      </Field.Root>
      <Field.Root v-if="field.type === 'password'" :id="'settings-confirm-' + id" :invalid="Boolean(confirmationError)" :disabled="saving" required>
        <Field.Label>Confirm new password</Field.Label>
        <Field.Input v-model="confirmation" type="password" autocomplete="new-password" />
        <Field.ErrorText v-if="confirmationError">{{ confirmationError }}</Field.ErrorText>
      </Field.Root>
      <div class="settings-demo__form-actions">
        <Button type="submit" variant="primary" :loading="saving">{{ saveLabel }}</Button>
      </div>
      <p class="settings-demo__status" role="status">{{ result }}</p>
    </form>
  </SettingsSection>
</template>
