<script setup lang="ts">
import { computed, onMounted, ref, useId } from "vue";
import { Combobox } from "@dicehub/kappa/components/combobox";
import { settingsTimeZoneOptions, type SettingsTimeZoneOption } from "../lib/settings-timezones";

const props = defineProps<{ disabled?: boolean; error?: string }>();
const id = useId();
const model = defineModel<string>({ required: true });
const zones = ref<SettingsTimeZoneOption[]>([...new Set(["UTC", model.value])].map(value => ({ value, label: value, offset: 0 })));
const selected = computed({
  get: () => [model.value],
  set: (value: string[]) => { model.value = value[0] ?? ""; },
});

onMounted(() => {
  zones.value = settingsTimeZoneOptions(["UTC", model.value, ...Intl.supportedValuesOf("timeZone")], new Date());
});
</script>

<template>
  <Combobox
    :id="'settings-timezone-' + id"
    v-model="selected"
    label="Time zone"
    placeholder="Search time zones"
    :items="zones"
    :disabled="props.disabled"
    :error="props.error"
    :clearable="false"
    :data-timezone-count="zones.length"
    required
  >
    <Combobox.TriggerInput placeholder="Search time zones" :clearable="false" />
    <Combobox.Content class="settings-demo__timezone-options">
      <Combobox.Empty>No time zones found.</Combobox.Empty>
      <Combobox.List v-slot="{ item }">
        <Combobox.Item :item="item">{{ (item as SettingsTimeZoneOption).label }}</Combobox.Item>
      </Combobox.List>
    </Combobox.Content>
  </Combobox>
</template>
