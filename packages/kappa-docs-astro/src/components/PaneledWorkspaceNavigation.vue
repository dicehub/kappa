<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, useId, watch, type ComponentPublicInstance } from "vue";
import { Sidebar } from "@dicehub/kappa/components/sidebar";
import { Avatar } from "@dicehub/kappa/components/avatar";
import { ToolbarButton } from "@dicehub/kappa/components/button";
import { HoverCard } from "@dicehub/kappa/components/hover-card";
import { ChevronDown, ChevronRight, Folders } from "@lucide/vue";
import type { NavigationCategory } from "./paneled-workspace-navigation";
import { usePaneledFlyoutIntent } from "./use-paneled-flyout-intent";

const props = defineProps<{
  categories: NavigationCategory[];
  view: string;
  active: boolean;
  iconCollapsed: boolean;
  isMobile: boolean;
  menuOpen: boolean;
  runCount: number;
  label: string;
  hrefForPage: (page: string) => string;
  pageLabel?: (page: string) => string;
  pageAvatar?: (page: string) => { name: string; avatarSrc?: string } | undefined;
  projectGuide?: boolean;
}>();
const emit = defineEmits<{ navigate: [page: string, event: MouseEvent]; showMore: [category: string]; groupAction: [category: string] }>();
const root = ref<ComponentPublicInstance>();
const groupsOpen = ref<Record<string, boolean>>({});
const isGroupOpen = (group: NavigationCategory) => group.collapsible === false || groupsOpen.value[group.label];
const isGroupPage = (group: NavigationCategory) => props.view === (group.page ?? group.label);
const flyout = ref("");
const flyoutOwner = useId();
const { corridor, pointTrigger, leaveTrigger, enterContent } = usePaneledFlyoutIntent(flyout, flyoutOwner);
let focusFrame = 0;
const navigationLabel = (page: string) => page === "All projects" ? "Overview" : props.pageLabel?.(page) ?? page;
const characters = new Intl.Segmenter(undefined, { granularity: "grapheme" });
const avatarInitial = (page: string) => characters.segment(props.pageAvatar?.(page)?.name.trim() ?? "")[Symbol.iterator]().next().value?.segment.toUpperCase() ?? "";
function runGroupAction(group: NavigationCategory) {
  if (flyout.value === group.label) closeFlyout(group.label);
  else flyout.value = "";
  emit("groupAction", group.label);
}
async function showMore(group: NavigationCategory, event: MouseEvent) {
  const list = (event.currentTarget as HTMLElement).closest("ul, nav");
  const firstNewIndex = group.pages.length;
  emit("showMore", group.label);
  await nextTick();
  const firstNewLink = list?.querySelectorAll<HTMLAnchorElement>("a")[firstNewIndex];
  firstNewLink?.focus({ preventScroll: true });
  firstNewLink?.scrollIntoView({ block: "nearest", inline: "nearest" });
}
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
  const group = props.categories.find(group => group.label === label);
  if (!group?.pages.length) return;
  // Ark presence reveals the links on a later frame. Focus only after they can receive it.
  const focusLink = () => {
    if (flyout.value !== label || (!props.iconCollapsed && isGroupOpen(group))) return;
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
      <HoverCard.Root :open="active && flyout === group.label && !isMobile && (iconCollapsed || !isGroupOpen(group))" :disabled="!active || isMobile || (!iconCollapsed && isGroupOpen(group))" :open-delay="0" :close-delay="5" :positioning="{ placement: 'right-start', strategy: 'fixed', gutter: 10 }" @update:open="updateFlyout(group.label, $event)">
        <HoverCard.Trigger v-if="iconCollapsed" as-child><Sidebar.MenuButton :icon="group.icon" :aria-label="group.label" :href="group.page ? hrefForPage(group.page) : undefined" :active="isGroupPage(group)" :data-paneled-group="group.label" @pointermove="pointTrigger(group.label, $event)" @pointerleave="leaveTrigger" :data-active-descendant="group.pages.includes(view) || undefined" :data-flyout-open="flyout === group.label || undefined" :aria-expanded="flyout === group.label" @click="group.page ? emit('navigate', group.page, $event) : flyout = group.label" @keydown.down.capture.prevent="focusFlyout(group.label)" @keydown.esc.stop.prevent="closeFlyout(group.label)">{{ group.label }}</Sidebar.MenuButton></HoverCard.Trigger>
        <component :is="group.collapsible === false ? 'div' : Sidebar.Collapsible" v-else v-bind="group.collapsible === false ? {} : { open: groupsOpen[group.label] }" @update:open="groupsOpen[group.label] = $event; flyout = ''">
          <div v-if="group.collapsible === false" class="paneled-workspace-demo__group-heading" :class="{ 'paneled-workspace-demo__section-heading': group.headingOnly }">
            <h3 v-if="group.headingOnly" :data-paneled-section-title="group.label" tabindex="-1">{{ group.label }}</h3>
            <Sidebar.MenuButton v-else-if="group.page" :icon="group.icon" :href="hrefForPage(group.page)" :active="isGroupPage(group)" @click="emit('navigate', group.page, $event)">{{ group.label }}</Sidebar.MenuButton>
            <h3 v-else><span aria-hidden="true"><component :is="group.icon" focusable="false" /></span>{{ group.label }}</h3>
            <ToolbarButton v-if="group.action" size="sm" :icon="group.action.icon" :tooltip="group.action.label" @click="runGroupAction(group)" />
          </div>
          <HoverCard.Trigger v-else as-child><Sidebar.CollapsibleTrigger as-child><Sidebar.MenuButton :icon="group.icon" :active="isGroupPage(group)" class="paneled-workspace-demo__group-toggle" :data-paneled-group="group.label" @pointermove="pointTrigger(group.label, $event)" @pointerleave="leaveTrigger" :data-active-descendant="!groupsOpen[group.label] && group.pages.includes(view) || undefined" :data-flyout-open="!groupsOpen[group.label] && flyout === group.label || undefined" @keydown.down.capture="!isMobile && !groupsOpen[group.label] && ($event.preventDefault(), focusFlyout(group.label))" @keydown.esc="flyout === group.label && ($event.stopPropagation(), $event.preventDefault(), closeFlyout(group.label))"><span>{{ group.label }}</span><ChevronRight aria-hidden="true" /></Sidebar.MenuButton></Sidebar.CollapsibleTrigger></HoverCard.Trigger>
          <component :is="group.collapsible === false ? 'div' : Sidebar.CollapsibleContent" class="paneled-workspace-demo__group-content"><Sidebar.MenuSub :data-project-guide="group.label === 'Projects' && projectGuide || undefined">
            <Sidebar.MenuSubItem v-for="page in group.pages" :key="page">
              <Sidebar.MenuButton :href="hrefForPage(page)" :icon="!projectGuide && page === 'All projects' ? Folders : undefined" :active="view === page && (group.headingOnly || page !== group.page)" :class="{ 'paneled-workspace-demo__project-entry': pageAvatar?.(page) || page === 'All projects' }" @click="emit('navigate', page, $event)">
                <template v-if="!projectGuide && pageAvatar?.(page)" #icon>
                  <Avatar.Root class="paneled-workspace-demo__project-avatar kappa-app-shell__project-avatar" aria-hidden="true">
                    <Avatar.Image v-if="pageAvatar?.(page)?.avatarSrc" :src="pageAvatar?.(page)?.avatarSrc" alt="" />
                    <Avatar.Fallback>{{ avatarInitial(page) }}</Avatar.Fallback>
                  </Avatar.Root>
                </template>
                <span :title="navigationLabel(page)">{{ navigationLabel(page) }}</span><span v-if="page === 'Simulation runs'" class="paneled-workspace-demo__count" aria-hidden="true">{{ runCount }}</span>
              </Sidebar.MenuButton>
            </Sidebar.MenuSubItem>
            <Sidebar.MenuSubItem v-if="group.remainingCount">
              <Sidebar.MenuButton :icon="ChevronDown" class="paneled-workspace-demo__show-more" @click="showMore(group, $event)">Show more ({{ group.remainingCount }})</Sidebar.MenuButton>
            </Sidebar.MenuSubItem>
          </Sidebar.MenuSub></component>
        </component>
        <HoverCard.Content :show-arrow="false" class="paneled-workspace-demo__flyout" :data-paneled-flyout="group.label" :data-flyout-owner="flyoutOwner" @pointermove="enterContent" @keydown.esc.stop.prevent="closeFlyout(group.label)">
          <div v-if="flyout === group.label && corridor" data-flyout-corridor class="paneled-workspace-demo__flyout-corridor" :style="corridor" aria-hidden="true" />
          <template v-if="iconCollapsed">
            <div class="paneled-workspace-demo__flyout-heading" :class="{ 'paneled-workspace-demo__section-heading': group.headingOnly }">
              <h3 class="paneled-workspace-demo__flyout-title"><a v-if="group.page && !group.headingOnly" :href="hrefForPage(group.page)" :aria-current="view === group.page ? 'page' : undefined" @click="emit('navigate', group.page, $event)">{{ group.label }}</a><template v-else>{{ group.label }}</template></h3>
              <ToolbarButton v-if="group.action" size="sm" :icon="group.action.icon" :tooltip="group.action.label" @click="runGroupAction(group)" />
            </div>
            <hr class="paneled-workspace-demo__flyout-divider" aria-hidden="true" />
          </template>
          <nav :aria-label="`${group.label} pages`">
            <a v-for="page in group.pages" :key="page" :href="hrefForPage(page)" :aria-current="view === page && (group.headingOnly || page !== group.page) ? 'page' : undefined" @click="emit('navigate', page, $event)">
              <Folders v-if="!projectGuide && page === 'All projects'" class="paneled-workspace-demo__overview-icon" aria-hidden="true" />
              <Avatar.Root v-if="!projectGuide && pageAvatar?.(page)" class="paneled-workspace-demo__project-avatar kappa-app-shell__project-avatar" aria-hidden="true">
                <Avatar.Image v-if="pageAvatar?.(page)?.avatarSrc" :src="pageAvatar?.(page)?.avatarSrc" alt="" />
                <Avatar.Fallback>{{ avatarInitial(page) }}</Avatar.Fallback>
              </Avatar.Root>
              <span :title="navigationLabel(page)">{{ navigationLabel(page) }}</span><span v-if="page === 'Simulation runs'" class="paneled-workspace-demo__count" aria-hidden="true">{{ runCount }}</span>
            </a>
            <Sidebar.MenuButton v-if="group.remainingCount" :icon="ChevronDown" class="paneled-workspace-demo__show-more" @click="showMore(group, $event)">Show more ({{ group.remainingCount }})</Sidebar.MenuButton>
          </nav>
        </HoverCard.Content>
      </HoverCard.Root>
    </div>
    <Sidebar.Menu v-if="$slots.after" class="paneled-workspace-demo__nav-footer"><slot name="after" /></Sidebar.Menu>
  </Sidebar.Content>
</template>
