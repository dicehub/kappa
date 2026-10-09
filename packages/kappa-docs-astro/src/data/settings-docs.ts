export const settingsExamples = [
  { id: "account", title: "Account", description: "Account tabs, current values, and a separate form for each setting." },
  { id: "preferences", title: "Preferences", description: "Time zone and date formats in sections that start open." },
  { id: "controlled", title: "Controlled sections", description: "Open a section from another control, disable it, or keep it visible." },
] as const;

export const settingsUsage = `<script setup lang="ts">
import { ref } from "vue"
import { Button, Field, SettingsLayout, SettingsSection } from "@dicehub/kappa"

const username = ref("avery")
const savedUsername = ref("avery")
const saveUsername = () => { savedUsername.value = username.value.trim() }
</script>

<template>
  <SettingsLayout title="User settings">
    <SettingsSection
      title="Username"
      :description="\`Your current username is @\${savedUsername}.\`"
      default-open
    >
      <form @submit.prevent="saveUsername">
        <Field.Root required>
          <Field.Label>Username</Field.Label>
          <Field.Input v-model="username" autocomplete="username" />
        </Field.Root>
        <Button type="submit" variant="primary">Save username</Button>
      </form>
    </SettingsSection>
  </SettingsLayout>
</template>`;

export const settingsSource = (id: typeof settingsExamples[number]["id"]) => {
  if (id === "account") return `<script setup lang="ts">
import { SettingsLayout, SettingsSection, Tabs } from "@dicehub/kappa"
</script>

<template>
  <Tabs.Root default-value="account">
    <SettingsLayout>
      <template #navigation>
        <Tabs.List variant="line" aria-label="User settings">
          <Tabs.Trigger value="account">Account</Tabs.Trigger>
          <Tabs.Trigger value="notifications">Notifications</Tabs.Trigger>
          <Tabs.Indicator />
        </Tabs.List>
      </template>
      <Tabs.Content value="account">
        <SettingsSection title="Username" description="Current username: @avery" default-open>
          <slot name="username-form" />
        </SettingsSection>
        <SettingsSection title="Email address" description="avery@example.com">
          <slot name="email-form" />
        </SettingsSection>
      </Tabs.Content>
      <Tabs.Content value="notifications">
        <SettingsSection title="Notifications" :collapsible="false">
          <slot name="notification-form" />
        </SettingsSection>
      </Tabs.Content>
    </SettingsLayout>
  </Tabs.Root>
</template>`;
  if (id === "preferences") return `<script setup lang="ts">
import { SettingsLayout, SettingsSection } from "@dicehub/kappa"
</script>

<template>
  <SettingsLayout title="Preferences">
    <SettingsSection title="Time zone" description="Europe/Berlin" default-open>
      <slot name="timezone-form" />
    </SettingsSection>
    <SettingsSection title="Date format" description="05 Oct 2026" default-open>
      <slot name="date-format-form" />
    </SettingsSection>
  </SettingsLayout>
</template>`;
  return `<script setup lang="ts">
import { ref } from "vue"
import { Button, SettingsLayout, SettingsSection } from "@dicehub/kappa"
const open = ref(false)
</script>

<template>
  <SettingsLayout title="Notifications">
    <template #actions>
      <Button @click="open = true">Open section</Button>
      <Button @click="open = false">Close section</Button>
    </template>
    <SettingsSection v-model:open="open" title="Email notifications">
      <slot name="notification-form" />
    </SettingsSection>
  </SettingsLayout>
</template>`;
};
