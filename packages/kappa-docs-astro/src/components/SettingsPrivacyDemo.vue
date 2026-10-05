<script setup lang="ts">
import { ref, useId } from "vue";
import { SettingsSection } from "@dicehub/kappa/blocks/settings-layout";
import { Checkbox } from "@dicehub/kappa/components/checkbox";
import SettingsSaveStatusDemo from "./SettingsSaveStatusDemo.vue";
import { useSettingsDemoSave } from "./use-settings-demo-save";

const id = useId();
const profile = ref(["profile"]);
const activity = ref<string[]>([]);
const { state: profileState, save: saveProfile } = useSettingsDemoSave();
const { state: activityState, save: saveActivity } = useSettingsDemoSave();
const groups = [
  {
    id: "profile", title: "Profile information", description: "Choose what other members can see.",
    items: [
      { value: "profile", title: "Show my profile", description: "Let other members view my profile." },
      { value: "email", title: "Show my email address", description: "Display my email address on my profile." },
    ],
  },
  {
    id: "activity", title: "Activity and usage", description: "Choose which activity you share.",
    items: [
      { value: "activity", title: "Show my recent activity", description: "Display recent public activity on my profile." },
      { value: "usage", title: "Share anonymous usage data", description: "Help improve the app with anonymous usage data." },
    ],
  },
];
</script>

<template>
  <SettingsSection v-for="group in groups" :key="group.id" :title="group.title" :description="group.description" :collapsible="false" :heading-level="3" :data-privacy-group="group.id">
    <template #actions><SettingsSaveStatusDemo :state="group.id === 'profile' ? profileState : activityState" /></template>
    <fieldset class="settings-demo__fieldset">
      <legend :id="'privacy-' + id + '-' + group.id" class="settings-demo__sr-only">{{ group.title }}</legend>
      <Checkbox.Group
        :model-value="group.id === 'profile' ? profile : activity"
        class="settings-demo__preferences"
        @update:model-value="value => { if (group.id === 'profile') { profile = value; saveProfile(); } else { activity = value; saveActivity(); } }"
      >
        <Checkbox.Root v-for="item in group.items" :key="item.value" :value="item.value" class="settings-demo__checkbox-row">
          <Checkbox.Control />
          <Checkbox.Label class="settings-demo__preference-label"><strong>{{ item.title }}</strong><span>{{ item.description }}</span></Checkbox.Label>
        </Checkbox.Root>
      </Checkbox.Group>
    </fieldset>
  </SettingsSection>
</template>
