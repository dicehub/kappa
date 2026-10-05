<script setup lang="ts">
import { reactive } from "vue";
import { SettingsSection } from "@dicehub/kappa/blocks/settings-layout";
import { Button } from "@dicehub/kappa/components/button";
import { Switch } from "@dicehub/kappa/components/switch";
import SettingsSaveStatusDemo from "./SettingsSaveStatusDemo.vue";
import { useSettingsDemoSave } from "./use-settings-demo-save";

const { state, save } = useSettingsDemoSave();
const preferences = reactive([
  { id: "completed", title: "Completed runs", description: "Email me when a simulation finishes.", checked: true },
  { id: "failed", title: "Failed runs", description: "Email me when a simulation fails.", checked: true },
  { id: "summary", title: "Weekly activity summary", description: "Send a summary of my workspace activity.", checked: false },
]);
</script>

<template>
  <SettingsSection title="Email notifications" description="Choose which updates you receive." :collapsible="false" :heading-level="3">
    <div class="settings-demo__preferences" data-settings-notifications>
      <Switch.Root v-for="item in preferences" :key="item.id" v-model:checked="item.checked" class="settings-demo__preference-row" :disabled="state === 'saving'">
        <Switch.Label class="settings-demo__preference-label"><strong>{{ item.title }}</strong><span>{{ item.description }}</span></Switch.Label>
        <Switch.Control />
      </Switch.Root>
    </div>
    <div class="settings-demo__form-actions">
      <Button variant="primary" :loading="state === 'saving'" @click="save()">Save notifications</Button>
      <SettingsSaveStatusDemo :state="state" />
    </div>
  </SettingsSection>
</template>
