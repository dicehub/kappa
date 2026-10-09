<script setup lang="ts">
import { nextTick, ref, useId } from "vue";
import { SettingsSection } from "@dicehub/kappa/blocks/settings-layout";
import { Table } from "@dicehub/kappa/components/table";
import { Badge } from "@dicehub/kappa/components/badge";
import { Button } from "@dicehub/kappa/components/button";
import { Field } from "@dicehub/kappa/components/field";
import SettingsSaveStatusDemo from "./SettingsSaveStatusDemo.vue";
import { useSettingsDemoSave } from "./use-settings-demo-save";

const id = useId();
const emails = ref([
  { address: "avery@example.com", primary: true, verified: true },
  { address: "avery.work@example.com", primary: false, verified: false },
]);
const address = ref("");
const error = ref("");
const message = ref("");
const activeAction = ref("");
const form = ref<HTMLElement | null>(null);
const { state, save } = useSettingsDemoSave();

function addEmail() {
  if (state.value === "saving") return;
  const value = address.value.trim();
  error.value = "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error.value = "Enter a valid email address.";
  else if (emails.value.some(email => email.address.toLowerCase() === value.toLowerCase())) error.value = "This email address is already listed.";
  if (error.value) return;
  activeAction.value = "add";
  save(() => {
    emails.value.push({ address: value, primary: false, verified: false });
    address.value = "";
    message.value = "Email address added.";
  });
}

function resend(value: string) {
  if (state.value === "saving") return;
  activeAction.value = "resend:" + value;
  save(() => { message.value = "Verification email sent in this example."; });
}

function removeEmail(value: string) {
  if (state.value === "saving" || emails.value.find(email => email.address === value)?.primary) return;
  const document = form.value?.ownerDocument;
  const trigger = document?.activeElement;
  const restoreFocus = trigger?.getAttribute("aria-label") === "Remove " + value;
  activeAction.value = "remove:" + value;
  save(() => {
    const focused = document?.activeElement;
    emails.value = emails.value.filter(email => email.address !== value);
    message.value = "Email address removed.";
    if (restoreFocus && (focused === trigger || focused === document?.body)) {
      void nextTick(() => form.value?.querySelector<HTMLInputElement>("input")?.focus());
    }
  });
}
</script>

<template>
  <SettingsSection title="Current emails" description="Manage the email addresses for your account." :collapsible="false" :heading-level="3">
    <div class="settings-demo__table-scroll" role="region" aria-label="Email addresses table" tabindex="0">
      <Table aria-label="Email addresses" class="settings-demo__table">
        <Table.Header><Table.Row>
          <Table.Head scope="col">Email</Table.Head><Table.Head scope="col">Status</Table.Head><Table.Head scope="col">Actions</Table.Head>
        </Table.Row></Table.Header>
        <Table.Body>
          <Table.Row v-for="email in emails" :key="email.address">
            <Table.Cell><div class="settings-demo__email"><span>{{ email.address }}</span><Badge v-if="email.primary">Primary</Badge></div></Table.Cell>
            <Table.Cell><Badge :variant="email.verified ? 'success' : 'warning'">{{ email.verified ? "Verified" : "Unverified" }}</Badge></Table.Cell>
            <Table.Cell><div class="settings-demo__table-actions">
              <Button v-if="!email.verified" size="sm" variant="outline" :aria-label="'Resend verification for ' + email.address" :disabled="state === 'saving'" :loading="state === 'saving' && activeAction === 'resend:' + email.address" @click="resend(email.address)">Resend verification</Button>
              <Button v-if="!email.primary" size="sm" variant="destructive-outline" :aria-label="'Remove ' + email.address" :disabled="state === 'saving'" :loading="state === 'saving' && activeAction === 'remove:' + email.address" @click="removeEmail(email.address)">Remove</Button>
            </div></Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
    <SettingsSaveStatusDemo :state="state" :saved-text="message" />
  </SettingsSection>
  <SettingsSection title="Add email address" description="Add an alternative address to your account." :collapsible="false" :heading-level="3">
    <form ref="form" class="settings-demo__form" novalidate :aria-busy="state === 'saving'" @submit.prevent="addEmail">
      <Field.Root :id="'settings-add-email-' + id" :invalid="Boolean(error)" :disabled="state === 'saving'" required>
        <Field.Label>New email address</Field.Label><Field.Input v-model="address" type="email" autocomplete="email" />
        <Field.ErrorText v-if="error">{{ error }}</Field.ErrorText>
      </Field.Root>
      <div class="settings-demo__form-actions"><Button type="submit" variant="primary" :disabled="state === 'saving'" :loading="state === 'saving' && activeAction === 'add'">Add email address</Button></div>
    </form>
  </SettingsSection>
</template>
