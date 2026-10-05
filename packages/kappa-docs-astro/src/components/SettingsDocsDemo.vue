<script setup lang="ts">
import { onMounted, ref } from "vue";
import { SettingsLayout, SettingsSection } from "@dicehub/kappa/blocks/settings-layout";
import { Button } from "@dicehub/kappa/components/button";
import { Tabs } from "@dicehub/kappa/components/tabs";
import { Switch } from "@dicehub/kappa/components/switch";
import { DeleteResource } from "@dicehub/kappa/blocks/delete-resource";
import { DirectionProvider } from "@dicehub/kappa/components/direction-provider";
import SettingsFieldDemo from "./SettingsFieldDemo.vue";
import SettingsNotificationsDemo from "./SettingsNotificationsDemo.vue";
import SettingsPrivacyDemo from "./SettingsPrivacyDemo.vue";
import SettingsEmailsDemo from "./SettingsEmailsDemo.vue";
import SettingsLinkedAccountsDemo from "./SettingsLinkedAccountsDemo.vue";
import { accountSettings, settingsTabs } from "../data/settings-demo-fields";

const props = withDefaults(defineProps<{
  variant?: "account" | "preferences" | "controlled";
  standalone?: boolean;
  rtl?: boolean;
}>(), { variant: "account", standalone: false, rtl: false });
const tab = ref("account");
const isRtl = ref(props.rtl);
onMounted(() => {
  if (props.standalone) isRtl.value = props.rtl || new URLSearchParams(window.location.search).get("dir") === "rtl";
});
const controlledOpen = ref(false);
const rejectedRequests = ref(0);
const deleteOpen = ref(false);
const deleted = ref(false);
const notifications = ref(true);

function confirmDeletion() {
  deleteOpen.value = false;
  deleted.value = true;
}
</script>

<template>
  <DirectionProvider :locale="isRtl ? 'ar' : 'en-US'">
    <div class="settings-demo" :data-settings-demo="variant" :data-standalone="standalone ? '' : undefined" :dir="isRtl ? 'rtl' : 'ltr'">
      <template v-if="variant === 'account'">
        <Tabs.Root v-model="tab" class="settings-demo__tabs" :dir="isRtl ? 'rtl' : 'ltr'">
          <SettingsLayout :title="standalone ? 'User settings' : undefined">
            <template #navigation>
              <Tabs.List variant="line" aria-label="User settings">
                <Tabs.Trigger v-for="item in settingsTabs" :key="item.value" :value="item.value">{{ item.label }}</Tabs.Trigger>
                <Tabs.Indicator />
              </Tabs.List>
            </template>
            <Tabs.Content value="account">
              <SettingsFieldDemo v-for="field in accountSettings" :key="field.id" :field="field" />
              <SettingsSection title="Delete account" description="Permanently remove your account and its data." :heading-level="3" data-setting="delete">
                <DeleteResource v-model:open="deleteOpen" resource-name="avery" require-name title="Delete account?" confirm-label="Delete account" @confirm="confirmDeletion">
                  <template #trigger><Button variant="destructive-outline">Delete account</Button></template>
                  <p>This example shows the confirmation step. No account data is removed.</p>
                </DeleteResource>
                <p class="settings-demo__status" role="status">{{ deleted ? 'Deletion confirmed in this example.' : '' }}</p>
              </SettingsSection>
            </Tabs.Content>
            <Tabs.Content value="notifications">
              <SettingsNotificationsDemo />
            </Tabs.Content>
            <Tabs.Content value="privacy">
              <SettingsPrivacyDemo />
            </Tabs.Content>
            <Tabs.Content value="emails">
              <SettingsEmailsDemo />
            </Tabs.Content>
            <Tabs.Content value="linked">
              <SettingsLinkedAccountsDemo />
            </Tabs.Content>
          </SettingsLayout>
        </Tabs.Root>
      </template>
      <SettingsLayout v-else-if="variant === 'preferences'" title="Preferences" description="Set the time zone and formats used in your workspace.">
        <SettingsFieldDemo v-for="field in accountSettings.slice(3)" :key="field.id" :field="{ ...field, defaultOpen: true }" />
      </SettingsLayout>
      <SettingsLayout v-else title="Controlled section">
        <template #actions><Button size="sm" @click="controlledOpen = true">Open section</Button><Button size="sm" @click="controlledOpen = false">Close section</Button></template>
        <SettingsLayout.Section v-model:open="controlledOpen" title="Email notifications" description="Control the section from another part of the page." :heading-level="3">
          <Switch.Root v-model:checked="notifications"><Switch.Control /><Switch.Label>Simulation updates</Switch.Label></Switch.Root>
        </SettingsLayout.Section>
        <SettingsSection title="Read-only setting" description="Managed by your organization." disabled :heading-level="3"><p>Contact an administrator to change this setting.</p></SettingsSection>
        <SettingsSection title="Always open" description="A section without a toggle." :collapsible="false" :heading-level="3"><p>Keep short settings visible.</p></SettingsSection>
        <SettingsSection title="Initially open" default-open :heading-level="3"><p>Uncontrolled sections can open by default.</p></SettingsSection>
        <SettingsSection title="Fixed section" :open="true" close-label="Done" :heading-level="3" @open-change="rejectedRequests += 1">
          <Button variant="outline">Keep editing</Button>
          <p class="settings-demo__status" role="status">Ignored close requests: {{ rejectedRequests }}</p>
        </SettingsSection>
      </SettingsLayout>
    </div>
  </DirectionProvider>
</template>

<style src="./settings-docs-demo.css"></style>
