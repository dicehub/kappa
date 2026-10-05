<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import { Button } from "../../components/button";
import { Dropdown } from "../../components/dropdown";
import WorkspaceSwitcherBadge from "./WorkspaceSwitcherBadge.vue";
import WorkspaceSwitcherActions from "./WorkspaceSwitcherActions.vue";
import { WORKSPACE_SWITCHER_DEFAULT_POSITIONING, type WorkspaceSwitcherEmits, type WorkspaceSwitcherProps, type WorkspaceSwitcherSlots } from "./workspace-switcher";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<WorkspaceSwitcherProps>(), {
  label: "Workspaces", placeholder: "Select workspace", disabled: false,
  open: undefined, defaultOpen: false, dir: undefined, teleport: true,
  positioning: () => ({ ...WORKSPACE_SWITCHER_DEFAULT_POSITIONING }),
  actions: () => [], workspaceActions: () => [], footerActions: () => [],
});
const emit = defineEmits<WorkspaceSwitcherEmits>();
defineSlots<WorkspaceSwitcherSlots>();
const scrollBody = ref<HTMLElement>();
const current = computed(() => props.items.find(item => item.value === props.modelValue));
const workspacePrefix = "workspace:";
const menuValue = computed(() => workspacePrefix + props.modelValue);
const positioning = computed(() => ({ ...WORKSPACE_SWITCHER_DEFAULT_POSITIONING, ...props.positioning }));
const triggerLabel = computed(() => props.triggerLabel ?? (current.value ? `${props.label}: ${current.value.name}` : props.placeholder));
async function scrollHighlighted(details: { highlightedValue: string | null }) {
  await nextTick();
  const body = scrollBody.value;
  if (!body || details.highlightedValue === null) return;
  const item = Array.from(body.querySelectorAll<HTMLElement>('[data-part="item"]'))
    .find(item => item.dataset.value === details.highlightedValue && item.hasAttribute("data-highlighted"));
  if (!item) return;
  const bounds = body.getBoundingClientRect();
  const row = item.getBoundingClientRect();
  if (row.top < bounds.top || row.bottom > bounds.bottom) item.scrollIntoView({ block: "nearest", inline: "nearest" });
}
</script>

<template>
  <Dropdown.Root :open="props.open" :default-open="props.defaultOpen" :dir="props.dir" :positioning="positioning"
    :lazy-mount="!props.teleport" :unmount-on-exit="!props.teleport"
    :aria-label="props.label" @update:open="emit('update:open', $event)" @open-change="emit('openChange', $event)"
    @highlight-change="scrollHighlighted">
    <Dropdown.Trigger as-child>
      <slot name="trigger" :workspace="current" :disabled="props.disabled">
        <Button variant="ghost" :disabled="props.disabled" :aria-label="triggerLabel" class="kappa-workspace-switcher__trigger">
          <WorkspaceSwitcherBadge v-if="current" :item="current" />
          <span class="kappa-workspace-switcher__trigger-name">{{ current?.name ?? props.placeholder }}</span>
          <svg class="kappa-workspace-switcher__chevron" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="m5 6 3-3 3 3M5 10l3 3 3-3" /></svg>
        </Button>
      </slot>
    </Dropdown.Trigger>
    <Dropdown.Context v-slot="menu">
      <Dropdown.Content v-bind="$attrs" :teleport="props.teleport" :inert="!menu.open || undefined"
        class="kappa-workspace-switcher" data-workspace-switcher>
        <div ref="scrollBody" class="kappa-workspace-switcher__body">
          <div v-if="current" class="kappa-workspace-switcher__current" data-slot="workspace-switcher-current">
            <WorkspaceSwitcherBadge :item="current" large />
            <div class="kappa-workspace-switcher__identity"><strong>{{ current.name }}</strong><span v-if="current.description">{{ current.description }}</span></div>
          </div>
          <template v-if="props.actions.length">
            <Dropdown.Separator />
            <WorkspaceSwitcherActions :items="props.actions" section="primary" @action="emit('action', $event)" />
          </template>
          <Dropdown.Separator v-if="current || props.actions.length" />
          <Dropdown.RadioGroup :model-value="menuValue" @update:model-value="emit('update:modelValue', $event.slice(workspacePrefix.length))">
            <Dropdown.Label class="kappa-workspace-switcher__label">{{ props.accountLabel ?? props.label }}</Dropdown.Label>
            <Dropdown.RadioItem v-for="item in props.items" :key="item.value" :value="workspacePrefix + item.value" :value-text="item.name"
              :aria-label="item.name" :aria-keyshortcuts="item.ariaKeyshortcuts" :disabled="item.disabled" close-on-select
              class="kappa-workspace-switcher__option">
              <template #indicator><svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="m3 8.25 3 3 7-7" /></svg></template>
              <WorkspaceSwitcherBadge :item="item" />
              <span class="kappa-workspace-switcher__name">{{ item.name }}</span>
              <Dropdown.Shortcut v-if="item.shortcut" aria-hidden="true">{{ item.shortcut }}</Dropdown.Shortcut>
            </Dropdown.RadioItem>
          </Dropdown.RadioGroup>
          <WorkspaceSwitcherActions v-if="props.workspaceActions.length" :items="props.workspaceActions" section="workspace" @action="emit('action', $event)" />
        </div>
        <WorkspaceSwitcherActions v-if="props.footerActions.length" :items="props.footerActions" section="footer"
          class="kappa-workspace-switcher__footer" @action="emit('action', $event)" />
      </Dropdown.Content>
    </Dropdown.Context>
  </Dropdown.Root>
</template>

<style src="./workspace-switcher.css"></style>
