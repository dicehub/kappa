<script setup lang="ts">
import { Dropdown, type DropdownProps } from "@dicehub/kappa/components/dropdown";
import { ToolbarButton } from "@dicehub/kappa/components/button";
import { Kbd } from "@dicehub/kappa/components/kbd";
import { BookOpen, CircleHelp, FileText, Keyboard, MessageSquare, Sparkles } from "@lucide/vue";

defineProps<{ isMobile: boolean; iconCollapsed: boolean; hrefForPage: (page: string) => string }>();
const emit = defineEmits<{ navigate: [page: string] }>();
const resources = [
  { label: "Help", icon: CircleHelp },
  { label: "Support", icon: MessageSquare },
  { label: "Documentation", icon: BookOpen },
];
const policies = ["Terms of service", "Privacy policy"];
const activateLink: NonNullable<DropdownProps["navigate"]> = ({ node }) => {
  queueMicrotask(() => node.click());
};
</script>

<template>
  <Dropdown.Root aria-label="Help" :navigate="activateLink"
    :positioning="{ placement: iconCollapsed ? 'right-end' : 'top-end', strategy: 'fixed', gutter: 4, fitViewport: true, overflowPadding: 8 }">
    <Dropdown.Trigger as-child>
      <ToolbarButton :icon="CircleHelp" :size="iconCollapsed ? 'sm' : 'base'" tooltip="Help" class="paneled-workspace-demo__help" />
    </Dropdown.Trigger>
    <Dropdown.Context v-slot="menu">
      <Dropdown.Content show-arrow :teleport="!isMobile" :inert="!menu.open || undefined">
        <Dropdown.Group>
          <Dropdown.Label>Version 0.1.2</Dropdown.Label>
          <Dropdown.Separator />
          <Dropdown.LinkItem v-for="item in resources" :key="item.label" :value="item.label" :icon="item.icon"
            :href="hrefForPage(item.label)" target="_blank">
            {{ item.label }}
          </Dropdown.LinkItem>
          <Dropdown.Item value="download-cli" :icon="BookOpen" @select="emit('navigate', 'Download the CLI')">Download the CLI</Dropdown.Item>
        </Dropdown.Group>
        <Dropdown.Separator />
        <Dropdown.Group>
          <Dropdown.LinkItem v-for="label in policies" :key="label" :value="label" :icon="FileText"
            :href="hrefForPage(label)" target="_blank">
            {{ label }}
          </Dropdown.LinkItem>
        </Dropdown.Group>
        <Dropdown.Separator />
        <Dropdown.Group>
          <Dropdown.Item value="shortcuts" :icon="Keyboard" aria-keyshortcuts="?" @select="emit('navigate', 'Keyboard shortcuts')">
            Keyboard shortcuts
            <Dropdown.Shortcut aria-hidden="true"><Kbd>?</Kbd></Dropdown.Shortcut>
          </Dropdown.Item>
          <Dropdown.Item value="whats-new" :icon="Sparkles" @select="emit('navigate', `What's new`)">What's new</Dropdown.Item>
        </Dropdown.Group>
      </Dropdown.Content>
    </Dropdown.Context>
  </Dropdown.Root>
</template>
