<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { Sidebar } from "@dicehub/kappa/components/sidebar";
import { Popover } from "@dicehub/kappa/components/popover";
import { ChevronRight, Pin } from "@lucide/vue";
import PaneledWorkspacePinAction from "./PaneledWorkspacePinAction.vue";
import { pinnableWorkspacePages } from "./use-paneled-workspace-pins";
import { workspaceExplorePages } from "./paneled-workspace-navigation";

const props = defineProps<{
  compact: boolean;
  isMobile: boolean;
  active: boolean;
  view: string;
  hrefForPage: (page: string) => string;
}>();
const pinned = defineModel<string[]>("pages", { required: true });
const emit = defineEmits<{ navigate: [page: string, event: MouseEvent] }>();
const expanded = ref(true);
const popupOpen = ref(false);
const root = ref<HTMLElement>();
const content = ref<HTMLElement>();
const open = computed({ get: () => props.compact ? popupOpen.value : expanded.value, set: value => {
  if (props.compact) popupOpen.value = value;
  else expanded.value = value;
} });
const pageLabel = (page: string) => pinnableWorkspacePages.find(item => item.page === page)?.label ?? page;
const isCurrentPage = (page: string) => props.view === page || page === "Explore" && workspaceExplorePages.includes(props.view);
function finalPopupFocus() {
  if (props.active) return root.value?.querySelector<HTMLElement>('[aria-label="Pinned"]') ?? null;
  const navigation = root.value?.closest('.paneled-workspace-demo__navigation');
  return [...navigation?.querySelectorAll<HTMLElement>('a[aria-current="page"]') ?? []]
    .find(link => !link.closest('[inert]') && link.getClientRects().length) ?? null;
}
watch(() => [props.active, props.compact, props.isMobile, props.view], () => { popupOpen.value = false; });
async function unpin(page: string) {
  const index = pinned.value.indexOf(page);
  pinned.value = pinned.value.filter(item => item !== page);
  await nextTick();
  const links = content.value?.querySelectorAll<HTMLAnchorElement>('a');
  const next = links?.[Math.min(index, links.length - 1)];
  if (next) next.focus({ preventScroll: true });
  else if (props.compact) popupOpen.value = false;
  else root.value?.querySelector<HTMLButtonElement>('[aria-label="Pinned"]')?.focus({ preventScroll: true });
}
function navigate(page: string, event: MouseEvent) {
  if (event.button || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  popupOpen.value = false;
  emit("navigate", page, event);
}
</script>

<template>
  <div ref="root" class="paneled-pinned">
  <component :is="compact ? Popover.Root : Sidebar.Collapsible" v-model:open="open"
    v-bind="compact ? { positioning: { placement: 'right-start', strategy: 'fixed', gutter: 10, overflowPadding: 8 }, portalled: !isMobile, finalFocusEl: finalPopupFocus } : {}">
    <component :is="compact ? Popover.Trigger : Sidebar.CollapsibleTrigger" as-child>
      <Sidebar.MenuButton :icon="Pin" aria-label="Pinned" class="paneled-pinned__trigger">
        <span>Pinned</span><ChevronRight v-if="!compact" aria-hidden="true" />
      </Sidebar.MenuButton>
    </component>
    <component :is="compact ? Popover.Content : Sidebar.CollapsibleContent" :class="{ 'paneled-pinned__popup': compact, 'paneled-pinned__content': !compact }"
      v-bind="compact ? { 'aria-label': 'Pinned pages', teleport: !isMobile, showArrow: false } : {}">
      <div ref="content" class="paneled-pinned__body" :data-compact="compact || undefined">
        <p v-if="compact" class="paneled-pinned__title">Pinned</p>
        <Sidebar.MenuSub aria-label="Pinned pages" class="paneled-pinned__list">
          <Sidebar.MenuSubItem v-for="page in pinned" :key="page" class="paneled-pin-row">
            <Sidebar.MenuButton :href="hrefForPage(page)" :active="isCurrentPage(page)" @click="navigate(page, $event)">{{ pageLabel(page) }}</Sidebar.MenuButton>
            <PaneledWorkspacePinAction :page="page" :label="pageLabel(page)" pinned @toggle="unpin" />
          </Sidebar.MenuSubItem>
        </Sidebar.MenuSub>
        <p v-if="!pinned.length" class="paneled-pinned__empty">{{ compact ? 'No pinned pages. Expand the sidebar to pin workspace pages.' : 'No pinned pages. Use the pin beside a workspace page.' }}</p>
      </div>
    </component>
  </component>
  </div>
  <Sidebar.Separator class="paneled-pinned__separator" aria-hidden="true" />
</template>

<style src="./paneled-workspace-pinned.css"></style>
