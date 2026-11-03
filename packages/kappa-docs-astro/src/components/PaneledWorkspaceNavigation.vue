<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, useId, watch, type ComponentPublicInstance } from "vue";
import { Sidebar } from "@dicehub/kappa/components/sidebar";
import { HoverCard } from "@dicehub/kappa/components/hover-card";
import { ChevronRight } from "@lucide/vue";
import { workspaceCategories } from "./paneled-workspace-navigation";
import { usePaneledFlyoutIntent } from "./use-paneled-flyout-intent";

const props = defineProps<{
  categories: typeof workspaceCategories;
  view: string;
  active: boolean;
  iconCollapsed: boolean;
  isMobile: boolean;
  menuOpen: boolean;
  runCount: number;
  label: string;
  hrefForPage: (page: string) => string;
  pageLabel?: (page: string) => string;
}>();
const emit = defineEmits<{ navigate: [page: string, event: MouseEvent] }>();
const root = ref<ComponentPublicInstance>();
const groupsOpen = ref<Record<string, boolean>>({ Projects: true, Simulation: true });
const flyout = ref("");
const flyoutOwner = useId();
const { corridor, pointTrigger, leaveTrigger, enterContent } = usePaneledFlyoutIntent(flyout, flyoutOwner);
let focusFrame = 0;
const navigationLabel = (page: string) => page === "All projects" || page === "All templates" ? "Overview" : props.pageLabel?.(page) ?? page;
watch(() => [props.active, props.iconCollapsed, props.isMobile, props.menuOpen, props.view], () => { flyout.value = ""; });
watch(() => props.view, page => {
  if (props.active) for (const group of props.categories) if (group.pages.includes(page)) groupsOpen.value[group.label] = true;
}, { immediate: true });
async function updateFlyout(label: string, open: boolean) {
  if (open) { if (props.active) flyout.value = label; return; }
  // Trigger blur precedes the link's focus event. Keep the flyout open while a link has focus.
  await nextTick();
  const content = document.querySelector<HTMLElement>(`[data-flyout-owner="${flyoutOwner}"][data-paneled-flyout="${label}"]`);
  // A short close timer can finish during the trigger-to-content event handoff.
  if (!content?.matches(":hover") && !content?.contains(document.activeElement) && flyout.value === label) flyout.value = "";
}
function closeFlyout(label: string) {
  flyout.value = "";
  const element = root.value?.$el as HTMLElement | undefined;
  element?.querySelector<HTMLElement>(`[data-paneled-group="${label}"]`)?.focus();
}
function focusFlyout(label: string) {
  flyout.value = label;
  cancelAnimationFrame(focusFrame);
  if (!props.categories.find(group => group.label === label)?.pages.length) return;
  // Ark presence reveals the links on a later frame. Focus only after they can receive it.
  const focusLink = () => {
    if (flyout.value !== label || (!props.iconCollapsed && groupsOpen.value[label])) return;
    const link = document.querySelector<HTMLElement>(`[data-flyout-owner="${flyoutOwner}"][data-paneled-flyout="${label}"] a`);
    if (link?.getClientRects().length && getComputedStyle(link).visibility === "visible") {
      link.focus();
      if (document.activeElement === link) return;
    }
    focusFrame = requestAnimationFrame(focusLink);
  };
  focusLink();
}
onBeforeUnmount(() => cancelAnimationFrame(focusFrame));
</script>

<template>
  <Sidebar.Content ref="root" :aria-label="label">
    <Sidebar.Menu><slot /></Sidebar.Menu>
    <div v-for="group in categories" :key="group.label" class="paneled-workspace-demo__nav-group">
      <HoverCard.Root :open="active && flyout === group.label && !isMobile && (iconCollapsed || !groupsOpen[group.label])" :disabled="!active || isMobile || (!iconCollapsed && groupsOpen[group.label])" :open-delay="0" :close-delay="5" :positioning="{ placement: 'right-start', strategy: 'fixed', gutter: 10 }" @update:open="updateFlyout(group.label, $event)">
        <HoverCard.Trigger v-if="iconCollapsed" as-child><Sidebar.MenuButton :icon="group.icon" :aria-label="group.label" :data-paneled-group="group.label" @pointermove="pointTrigger(group.label, $event)" @pointerleave="leaveTrigger" :data-active-descendant="group.pages.includes(view) || undefined" :data-flyout-open="flyout === group.label || undefined" :aria-expanded="flyout === group.label" @click="flyout = group.label" @keydown.down.capture.prevent="focusFlyout(group.label)" @keydown.esc.stop.prevent="closeFlyout(group.label)">{{ group.label }}</Sidebar.MenuButton></HoverCard.Trigger>
        <Sidebar.Collapsible v-else :open="groupsOpen[group.label]" @update:open="groupsOpen[group.label] = $event; flyout = ''">
          <HoverCard.Trigger as-child><Sidebar.CollapsibleTrigger as-child><Sidebar.MenuButton :icon="group.icon" class="paneled-workspace-demo__group-toggle" :data-paneled-group="group.label" @pointermove="pointTrigger(group.label, $event)" @pointerleave="leaveTrigger" :data-active-descendant="!groupsOpen[group.label] && group.pages.includes(view) || undefined" :data-flyout-open="!groupsOpen[group.label] && flyout === group.label || undefined" @keydown.down.capture="!isMobile && !groupsOpen[group.label] && ($event.preventDefault(), focusFlyout(group.label))" @keydown.esc="flyout === group.label && ($event.stopPropagation(), $event.preventDefault(), closeFlyout(group.label))"><span>{{ group.label }}</span><ChevronRight aria-hidden="true" /></Sidebar.MenuButton></Sidebar.CollapsibleTrigger></HoverCard.Trigger>
          <Sidebar.CollapsibleContent><Sidebar.MenuSub>
            <Sidebar.MenuSubItem v-for="page in group.pages" :key="page">
              <Sidebar.MenuButton :href="hrefForPage(page)" :active="view === page" @click="emit('navigate', page, $event)"><span :title="navigationLabel(page)">{{ navigationLabel(page) }}</span><span v-if="page === 'Simulation runs'" class="paneled-workspace-demo__count" aria-hidden="true">{{ runCount }}</span></Sidebar.MenuButton>
            </Sidebar.MenuSubItem>
          </Sidebar.MenuSub></Sidebar.CollapsibleContent>
        </Sidebar.Collapsible>
        <HoverCard.Content :show-arrow="false" class="paneled-workspace-demo__flyout" :data-paneled-flyout="group.label" :data-flyout-owner="flyoutOwner" @pointermove="enterContent" @keydown.esc.stop.prevent="closeFlyout(group.label)">
          <div v-if="flyout === group.label && corridor" data-flyout-corridor class="paneled-workspace-demo__flyout-corridor" :style="corridor" aria-hidden="true" />
          <template v-if="iconCollapsed">
            <h3 class="paneled-workspace-demo__flyout-title">{{ group.label }}</h3>
            <hr class="paneled-workspace-demo__flyout-divider" aria-hidden="true" />
          </template>
          <nav :aria-label="`${group.label} pages`">
            <a v-for="page in group.pages" :key="page" :href="hrefForPage(page)" :aria-current="view === page ? 'page' : undefined" @click="emit('navigate', page, $event)"><span :title="navigationLabel(page)">{{ navigationLabel(page) }}</span><span v-if="page === 'Simulation runs'" class="paneled-workspace-demo__count" aria-hidden="true">{{ runCount }}</span></a>
          </nav>
        </HoverCard.Content>
      </HoverCard.Root>
    </div>
  </Sidebar.Content>
</template>
