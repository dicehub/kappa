<script setup lang="ts">
import { ref } from "vue";
import { useFocusVisible } from "@ark-ui/vue/interaction";
import { Avatar } from "@dicehub/kappa/components/avatar";
import { Dropdown } from "@dicehub/kappa/components/dropdown";
import type { DropdownProps } from "@dicehub/kappa/components/dropdown";
import { CircleHelp, LogOut, Settings2, SunMoon, UserRoundPen } from "@lucide/vue";
import { usePaneledTheme } from "./use-paneled-theme";

const emit = defineEmits<{ navigate: [page: string] }>();
const isFocusVisible = useFocusVisible();
const { theme, setTheme } = usePaneledTheme();
// Ark keeps DOM focus on the menu while the pointer changes its highlighted item.
const pointerHover = ref(false);
// Native clicks are cancelable, so keyboard activation can retain the local view.
const activateLink: NonNullable<DropdownProps["navigate"]> = ({ node }) => {
  queueMicrotask(() => node.click());
};
const profileHref = "/examples/appshell/paneled-workspace?view=Profile";
function hasModifier(event: MouseEvent) {
  return event.ctrlKey || event.metaKey || event.shiftKey || event.altKey;
}
function followModifiedLink(event: MouseEvent) {
  // Let the browser follow modified clicks without opening the current menu.
  if (hasModifier(event)) event.stopImmediatePropagation();
}
function navigate(page: string, event: MouseEvent) {
  if (event.button || hasModifier(event)) return;
  event.preventDefault();
  emit("navigate", page);
}
// Ark adds half the 8px arrow to the gutter: the panel starts 8px below the avatar.
const positioning = {
  placement: "bottom-end",
  strategy: "fixed",
  gutter: 4,
  fitViewport: true,
  overflowPadding: 8,
} as const;
const themePositioning = { placement: "left-start", gutter: 4, fitViewport: true, overflowPadding: 8 } as const;
</script>

<template>
  <Dropdown.Root :positioning="positioning" :navigate="activateLink" @open-change="pointerHover = false">
    <!-- Cancel navigation after Ark handles an unmodified trigger click. -->
    <div class="paneled-profile__toggle" @click.exact.prevent>
      <Dropdown.Trigger as-child>
        <a
          :href="profileHref"
          class="paneled-profile__trigger"
          aria-label="Profile: Alex Morgan"
          @click.capture="followModifiedLink"
        >
          <Avatar.Root class="paneled-profile__avatar" aria-hidden="true">
            <Avatar.Image src="/avatars/ros-space-astronaut.webp" alt="" />
            <Avatar.Fallback>AM</Avatar.Fallback>
          </Avatar.Root>
        </a>
      </Dropdown.Trigger>
    </div>
    <Dropdown.Content
      class="paneled-profile__menu"
      :data-keyboard-focus="isFocusVisible && !pointerHover || undefined"
      @pointermove.capture="pointerHover = true"
      @keydown.capture="pointerHover = false"
    >
      <Dropdown.Arrow />
      <div class="paneled-profile__scroll">
        <Dropdown.LinkItem
          :href="profileHref"
          value="profile"
          value-text="Alex Morgan"
          class="paneled-profile__identity"
          @click="navigate('Profile', $event)"
        >
          <strong>Alex Morgan</strong>
          <span>@alexmorgan</span>
        </Dropdown.LinkItem>
        <Dropdown.Separator />
        <Dropdown.LinkItem :href="profileHref" value="edit-profile" :icon="UserRoundPen" @click="navigate('Profile', $event)">
          Edit profile
        </Dropdown.LinkItem>
        <Dropdown.LinkItem href="/examples/appshell/paneled-workspace?view=Settings" value="preferences" :icon="Settings2" @click="navigate('Settings', $event)">
          Preferences
        </Dropdown.LinkItem>
        <Dropdown.Sub aria-label="Theme" :positioning="themePositioning">
          <Dropdown.SubTrigger :icon="SunMoon">Theme</Dropdown.SubTrigger>
          <Dropdown.SubContent>
            <Dropdown.RadioGroup :model-value="theme" aria-label="Theme" @update:model-value="setTheme">
              <Dropdown.RadioItem value="light">Light mode</Dropdown.RadioItem>
              <Dropdown.RadioItem value="dark">Dark mode</Dropdown.RadioItem>
              <Dropdown.RadioItem value="system">System</Dropdown.RadioItem>
            </Dropdown.RadioGroup>
          </Dropdown.SubContent>
        </Dropdown.Sub>
        <Dropdown.Separator />
        <Dropdown.LinkItem href="/examples/appshell/paneled-workspace?view=Help" value="help" :icon="CircleHelp" @click="navigate('Help', $event)">
          Help and resources
        </Dropdown.LinkItem>
        <Dropdown.Separator />
        <Dropdown.Item value="logout" :icon="LogOut" @select="emit('navigate', 'Log out')">
          Log out
        </Dropdown.Item>
      </div>
    </Dropdown.Content>
  </Dropdown.Root>
</template>

<style src="./paneled-workspace-profile-menu.css"></style>
