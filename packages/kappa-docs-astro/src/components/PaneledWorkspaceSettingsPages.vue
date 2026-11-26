<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { Avatar } from "@dicehub/kappa/components/avatar";
import { Badge } from "@dicehub/kappa/components/badge";
import { Button } from "@dicehub/kappa/components/button";
import { Dialog } from "@dicehub/kappa/components/dialog";
import { Field } from "@dicehub/kappa/components/field";
import { Table } from "@dicehub/kappa/components/table";
import PaneledWorkspaceComputePages from "./PaneledWorkspaceComputePages.vue";
import { runningJobs, type WorkspaceCompute } from "./paneled-workspace-compute";
import { settingsNavigation } from "./paneled-workspace-settings";

const props = defineProps<{ page: string; namespace: string; compute: WorkspaceCompute; projectCount: number }>();
const description = computed(() => settingsNavigation.find(item => item.page === props.page)?.description);
const email = ref("alex@example.test");
const username = ref("alexmorgan");
const password = ref("");
const fullName = ref("Alex Morgan");
const bio = ref("CFD engineer working on aerodynamic design and simulation.");
const initialsOnly = ref(false);
const characters = new Intl.Segmenter(undefined, { granularity: "grapheme" });
const initials = computed(() => fullName.value.trim().split(/\s+/).slice(0, 2).map(part => characters.segment(part)[Symbol.iterator]().next().value?.segment ?? "").join("").toUpperCase());
const message = ref("");
const activeRuns = computed(() => runningJobs(props.compute.runs));
const limits = computed(() => [
  { label: "Concurrent runs", usage: activeRuns.value.length, limit: 8 },
  { label: "Active vCPUs", usage: activeRuns.value.reduce((total, run) => total + run.cpus, 0), limit: 256 },
  { label: "Projects", usage: props.projectCount, limit: 100 },
  { label: "Storage", usage: "4.8 GB", limit: "100 GB" },
]);
const sessions = ref([
  { id: "current", device: "Chrome on Linux", location: "Current session", current: true },
  { id: "laptop", device: "Firefox on Linux", location: "Last active yesterday", current: false },
]);
const keys = ref([
  { id: 1, name: "Simulation CI", prefix: "demo_ci_••••", access: "Run simulations", lastUsed: "Today" },
  { id: 2, name: "Results exporter", prefix: "demo_export_••••", access: "Read results", lastUsed: "Yesterday" },
]);
const keyDialog = ref(false);
const keyName = ref("");
const createKeyButton = ref<InstanceType<typeof Button>>();
let nextKey = 3;
function save() {
  password.value = "";
  message.value = `${props.page} saved for this preview.`;
}
function createKey() {
  if (!keyName.value.trim()) return;
  keys.value.push({ id: nextKey++, name: keyName.value.trim(), prefix: "demo_key_••••", access: "Read results", lastUsed: "Never" });
  keyDialog.value = false;
  keyName.value = "";
  message.value = "Demo key added. This preview does not issue access credentials.";
}
async function revokeKey(id: number) {
  keys.value = keys.value.filter(key => key.id !== id);
  message.value = "Demo key revoked.";
  await nextTick();
  createKeyButton.value?.$el.focus({ preventScroll: true });
}
function signOutOthers() {
  sessions.value = sessions.value.filter(session => session.current);
  message.value = "Other demo sessions signed out.";
}
watch(() => props.page, () => { message.value = ""; password.value = ""; keyDialog.value = false; });
</script>

<template>
  <Dialog.Root v-model:open="keyDialog">
  <div class="paneled-settings">
    <p class="paneled-settings__intro">{{ description }}</p>
    <form v-if="page === 'Account details'" class="paneled-settings__form" @submit.prevent="save" @input="message = ''">
      <Field.Root required><Field.Label>Email address</Field.Label><Field.Input v-model="email" type="email" autocomplete="email" required /></Field.Root>
      <Field.Root required><Field.Label>Username</Field.Label><Field.Input v-model="username" autocomplete="username" required /></Field.Root>
      <Field.Root><Field.Label>New password</Field.Label><Field.Input v-model="password" type="password" autocomplete="new-password" :minlength="12" /><Field.HelperText>Use at least 12 characters. Leave blank to keep the current password.</Field.HelperText></Field.Root>
      <Button type="submit" size="sm" :disabled="!email.trim() || !username.trim()">Save changes</Button>
    </form>
    <form v-else-if="page === 'Profile settings'" class="paneled-settings__form" @submit.prevent="save" @input="message = ''">
      <div class="paneled-settings__avatar-row">
        <Avatar.Root size="lg"><Avatar.Image v-if="!initialsOnly" src="/avatars/ros-space-astronaut.webp" alt="Profile picture" /><Avatar.Fallback>{{ initials || 'AM' }}</Avatar.Fallback></Avatar.Root>
        <div><strong>Profile picture</strong><Button variant="outline" size="sm" @click="initialsOnly = !initialsOnly; message = ''">{{ initialsOnly ? 'Use profile image' : 'Use initials' }}</Button></div>
      </div>
      <Field.Root required><Field.Label>Full name</Field.Label><Field.Input v-model="fullName" autocomplete="name" required /></Field.Root>
      <Field.Root><Field.Label>Bio</Field.Label><Field.Textarea v-model="bio" :rows="3" :maxlength="240" /><Field.HelperText>A short introduction for people you work with.</Field.HelperText></Field.Root>
      <Button type="submit" size="sm" :disabled="!fullName.trim()">Save changes</Button>
    </form>
    <template v-else-if="page === 'Limits'">
      <div class="paneled-settings__table">
        <Table compact aria-label="Resource limits">
          <Table.Header><Table.Row><Table.Head scope="col">Resource</Table.Head><Table.Head scope="col">Current usage</Table.Head><Table.Head scope="col">Limit</Table.Head></Table.Row></Table.Header>
          <Table.Body><Table.Row v-for="limit in limits" :key="limit.label"><Table.Cell>{{ limit.label }}</Table.Cell><Table.Cell>{{ limit.usage }}</Table.Cell><Table.Cell>{{ limit.limit }}</Table.Cell></Table.Row></Table.Body>
        </Table>
      </div>
      <p class="paneled-settings__note">Queued runs do not use CPU capacity. Storage and account limits are sample values.</p>
    </template>
    <PaneledWorkspaceComputePages v-else-if="page === 'Billing'" page="Billing" :namespace="namespace" :compute="compute" />
    <template v-else-if="page === 'Security'">
      <section class="paneled-settings__section">
        <div class="paneled-settings__section-title"><h3>Two-factor authentication</h3><Badge variant="success">Enabled</Badge></div>
        <p>Sign-in is protected by an authenticator app in this example.</p>
      </section>
      <section class="paneled-settings__section">
        <div class="paneled-settings__section-title"><h3>Active sessions</h3><Button size="sm" variant="outline" :disabled="sessions.length === 1" @click="signOutOthers">Sign out other sessions</Button></div>
        <div class="paneled-settings__table">
          <Table compact aria-label="Active sessions"><Table.Header><Table.Row><Table.Head scope="col">Device</Table.Head><Table.Head scope="col">Activity</Table.Head></Table.Row></Table.Header>
            <Table.Body><Table.Row v-for="session in sessions" :key="session.id"><Table.Cell>{{ session.device }}</Table.Cell><Table.Cell>{{ session.location }}</Table.Cell></Table.Row></Table.Body>
          </Table>
        </div>
      </section>
    </template>
    <template v-else-if="page === 'API keys'">
      <div class="paneled-settings__section-title"><h3>Your API keys</h3><Dialog.Trigger as-child><Button ref="createKeyButton" size="sm">Create API key</Button></Dialog.Trigger></div>
      <div class="paneled-settings__table">
        <Table compact aria-label="API keys"><Table.Header><Table.Row><Table.Head scope="col">Name</Table.Head><Table.Head scope="col">Access</Table.Head><Table.Head scope="col">Last used</Table.Head><Table.Head scope="col">Action</Table.Head></Table.Row></Table.Header>
          <Table.Body><Table.Row v-for="key in keys" :key="key.id"><Table.Cell><strong>{{ key.name }}</strong><small>{{ key.prefix }}</small></Table.Cell><Table.Cell>{{ key.access }}</Table.Cell><Table.Cell>{{ key.lastUsed }}</Table.Cell><Table.Cell><Button variant="ghost" size="sm" :aria-label="`Revoke ${key.name}`" @click="revokeKey(key.id)">Revoke</Button></Table.Cell></Table.Row></Table.Body>
        </Table>
      </div>
      <p v-if="!keys.length" class="paneled-settings__note">No API keys. Create a key for a script or integration.</p>
    </template>
    <p v-if="message" role="status" class="paneled-settings__status">{{ message }}</p>
    <p class="paneled-settings__note">Local example data. Changes apply to this Settings preview only.</p>
      <Dialog.Content>
        <Dialog.Title>Create API key</Dialog.Title>
        <Dialog.Description>Add a sample key with read access to simulation results. No access credentials are issued.</Dialog.Description>
        <form class="paneled-settings__form" @submit.prevent="createKey">
          <Field.Root required><Field.Label>Key name</Field.Label><Field.Input v-model="keyName" required :maxlength="80" placeholder="For example, Results exporter" /></Field.Root>
          <Dialog.Footer><Button variant="outline" @click="keyDialog = false">Cancel</Button><Button type="submit" :disabled="!keyName.trim()">Create key</Button></Dialog.Footer>
        </form>
      </Dialog.Content>
  </div>
  </Dialog.Root>
</template>

<style src="./paneled-workspace-settings.css"></style>
