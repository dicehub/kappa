<script setup lang="ts">
import { computed, ref } from "vue";
import { WorkspaceSwitcher, type WorkspaceSwitcherAction, type WorkspaceSwitcherItem } from "@dicehub/kappa/blocks/workspace-switcher";
import { DirectionProvider } from "@dicehub/kappa/components/direction-provider";
import { Button } from "@dicehub/kappa/components/button";
import { namespaceSwitcherItems, namespaceSwitcherActions, namespaceSwitcherFooterActions, namespaceSwitcherWorkspaceActions } from "../data/workspace-switcher-demo";

const props = withDefaults(defineProps<{ variant?: string }>(), { variant: "preview" });
const selected = ref("ros");
const locked = ref(props.variant === "controlled");
const requested = ref("");
const action = ref("");
const items = computed<WorkspaceSwitcherItem[]>(() => [
  { value: "ros", name: "Ros.Space", description: "Free plan · 1 member", avatarSrc: "/avatars/ros-space-astronaut.webp", initials: "RS" },
  ...namespaceSwitcherItems.map(item => item.value === "Engineering" ? { ...item, value: "workspace-action:primary:settings" } : item),
  { value: "restricted", name: "Restricted workspace", disabled: true, initials: "RW" },
  ...(props.variant === "long" ? Array.from({ length: 35 }, (_, n) => ({ value: `workspace-${n}`, name: `Workspace ${n + 1}` })) : []),
]);
const actions = computed(() => namespaceSwitcherActions.map(action => ({ ...action, disabled: props.variant === "states" && ["upgrade", "invite"].includes(action.value) })));
const footerActions = computed<WorkspaceSwitcherAction[]>(() => props.variant === "states" ? [
  { value: "settings", label: "Remove workspace", variant: "destructive", accent: true },
  { value: "log-out", label: "Log out", disabled: true },
] : namespaceSwitcherFooterActions);
const selectedName = computed(() => items.value.find(item => item.value === selected.value)?.name);
const requestedName = computed(() => items.value.find(item => item.value === requested.value)?.name);
function select(value: string) {
  requested.value = value;
  if (!locked.value) selected.value = value;
}
function activate(value: WorkspaceSwitcherAction) { action.value = value.label; }
</script>

<template>
  <DirectionProvider :locale="props.variant === 'rtl' ? 'ar' : 'en'">
    <div class="workspace-switcher-demo" :dir="props.variant === 'rtl' ? 'rtl' : 'ltr'" :data-workspace-demo="props.variant" :data-selected-value="selected">
      <Button v-if="props.variant === 'controlled'" variant="secondary" size="sm" :aria-pressed="locked" @click="locked = !locked">{{ locked ? 'Unlock selection' : 'Lock selection' }}</Button>
      <WorkspaceSwitcher :model-value="selected" :items="items" account-label="ros@example.test"
        :actions="actions" :workspace-actions="namespaceSwitcherWorkspaceActions" :footer-actions="footerActions"
        data-example-attribute="forwarded" @update:model-value="select" @action="activate" />
      <p role="status">{{ action ? `${action} preview.` : `Selected: ${selectedName}` }}<template v-if="locked && requested"> · Requested: {{ requestedName }}</template></p>
    </div>
  </DirectionProvider>
</template>

<style>
.workspace-switcher-demo { display: flex; flex-wrap: wrap; align-items: center; gap: 1rem; inline-size: 100%; padding: 1.5rem; }
.workspace-switcher-demo p { margin: 0 !important; color: var(--kappa-subtle); font-size: 0.8125rem !important; }
</style>
