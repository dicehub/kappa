<script setup lang="ts">
import { reactive, ref } from "vue";
import { SettingsSection } from "@dicehub/kappa/blocks/settings-layout";
import { Table } from "@dicehub/kappa/components/table";
import { Button } from "@dicehub/kappa/components/button";
import SettingsSaveStatusDemo from "./SettingsSaveStatusDemo.vue";
import { useSettingsDemoSave } from "./use-settings-demo-save";

const accounts = reactive([
  { provider: "GitHub", connected: false },
  { provider: "GitLab", connected: true },
  { provider: "Google", connected: false },
]);
const activeProvider = ref("");
const message = ref("");
const { state, save } = useSettingsDemoSave();

function toggle(provider: string) {
  if (state.value === "saving") return;
  const account = accounts.find(item => item.provider === provider);
  if (!account) return;
  activeProvider.value = provider;
  save(() => {
    account.connected = !account.connected;
    message.value = provider + (account.connected ? " connected in this example." : " disconnected in this example.");
  });
}
</script>

<template>
  <SettingsSection title="Linked accounts" description="Manage the accounts you use to sign in." :collapsible="false" :heading-level="3">
    <div class="settings-demo__table-scroll" role="region" aria-label="Linked accounts table" tabindex="0">
      <Table aria-label="Linked accounts" class="settings-demo__table">
        <Table.Header><Table.Row>
          <Table.Head scope="col">Account type</Table.Head><Table.Head scope="col">Name</Table.Head><Table.Head scope="col">Email</Table.Head><Table.Head scope="col">Actions</Table.Head>
        </Table.Row></Table.Header>
        <Table.Body>
          <Table.Row v-for="account in accounts" :key="account.provider">
            <Table.Cell><div class="settings-demo__provider"><strong>{{ account.provider }}</strong><span :data-connected="account.connected ? '' : undefined">{{ account.connected ? "Connected" : "Not connected" }}</span></div></Table.Cell>
            <Table.Cell>{{ account.connected ? "Avery North" : "—" }}</Table.Cell>
            <Table.Cell>{{ account.connected ? "avery@example.com" : "—" }}</Table.Cell>
            <Table.Cell><div class="settings-demo__table-actions"><Button size="sm" :variant="account.connected ? 'destructive-outline' : 'outline'" :aria-label="(account.connected ? 'Disconnect ' : 'Connect ') + account.provider" :disabled="state === 'saving'" :loading="state === 'saving' && activeProvider === account.provider" @click="toggle(account.provider)">{{ account.connected ? "Disconnect" : "Connect" }}</Button></div></Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
    <SettingsSaveStatusDemo :state="state" :saved-text="message" />
  </SettingsSection>
</template>
