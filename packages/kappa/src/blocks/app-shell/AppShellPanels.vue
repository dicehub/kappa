<script setup lang="ts">
import { DEFAULT_LOCALE, LocaleProvider, useLocaleContext } from "@ark-ui/vue/locale";
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from "vue";
import { Dialog } from "../../components/dialog";
import { Resizable } from "../../components/resizable";
import type { AppShellPanelsProps, AppShellPanelsEmits, AppShellPanelsSlots } from "./app-shell";
import AppShellAsideResizeHandle from "./AppShellAsideResizeHandle.vue";

const props = withDefaults(defineProps<AppShellPanelsProps>(), {
  detailOpen: false, asideOpen: false, asideMaximized: undefined,
  splitAt: 1200, minSize: 30, detailLabel: "Details", asideLabel: "Activity", resizeLabel: "Resize panels", asideResizeLabel: "Resize side panel",
});
const emit = defineEmits<AppShellPanelsEmits>();
defineSlots<AppShellPanelsSlots>();
const body = ref<HTMLElement>();
const frame = ref<HTMLElement>();
const primary = ref<HTMLElement>();
const primaryWidth = ref(0);
const bodyWidth = ref(0);
const frameWidth = ref(0);
const frameId = `kappa-shell-panels-${useId()}`;
const locale = useLocaleContext(DEFAULT_LOCALE);
const rootWidth = ref(0);
const shellWidth = computed(() => rootWidth.value || bodyWidth.value);
let shell: Element | null = null;
const mode = computed(() => primaryWidth.value >= props.splitAt ? "split" : "overlay");
const asideMode = computed(() => shellWidth.value < 992 ? "overlay" : "inline");
const localMaximized = ref(false);
const requestedMaximized = computed(() => props.asideMaximized ?? localMaximized.value);
function setMaximized(value: boolean) {
  if (props.asideMaximized === undefined) localMaximized.value = value;
  emit("update:asideMaximized", value);
}
const maximized = computed(() => props.asideOpen && requestedMaximized.value && asideMode.value === "inline");
const coversPrimary = computed(() => maximized.value && shellWidth.value < 2560);
const asidePresent = ref(props.asideOpen);
const localAsideWidth = ref<number>();
const minAsideWidth = computed(() => Math.min(400, Math.floor(frameWidth.value || 400)));
const maxAsideWidth = computed(() => Math.floor(Math.max(minAsideWidth.value, Math.min(960, shellWidth.value * 0.6, frameWidth.value - 320))));
const defaultAsideWidth = computed(() => Math.max(400, Math.min(560, shellWidth.value * 0.2)));
const asideWidth = computed(() => Math.max(minAsideWidth.value, Math.min(maxAsideWidth.value, props.asideWidth ?? localAsideWidth.value ?? defaultAsideWidth.value)));
function resizeAside(width: number) {
  const next = Math.max(minAsideWidth.value, Math.min(maxAsideWidth.value, width));
  if (props.asideWidth === undefined) localAsideWidth.value = next;
  emit("update:asideWidth", next);
}
function resetAsideWidth() {
  localAsideWidth.value = undefined;
  emit("update:asideWidth", undefined);
}
const localSize = ref([50, 50]);
const size = computed(() => props.detailOpen && mode.value === "split" ? props.size ?? localSize.value : [100, 0]);
const definitions = computed(() => [
  { id: "primary", minSize: props.detailOpen && mode.value === "split" ? props.minSize : 0 },
  { id: "detail", minSize: props.detailOpen && mode.value === "split" ? props.minSize : 0 },
]);
function saveSize(value: number[]) {
  if (!props.detailOpen || mode.value !== "split" || value.some(part => part < props.minSize)) return;
  localSize.value = value;
  emit("update:size", value);
}
function closeDetail() { emit("update:detailOpen", false); }
function closeAside() { emit("update:asideOpen", false); }
function toggleMaximized() { setMaximized(!maximized.value); }
// Capture the opener before Ark moves focus. Keep this independent of app data.
let detailOpener: HTMLElement | null = null;
let asideOpener: HTMLElement | null = null;
watch(() => props.detailOpen, open => {
  if (open) detailOpener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
}, { flush: "sync" });
watch(() => props.asideOpen, open => {
  if (open) {
    asidePresent.value = true;
    asideOpener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  } else if (requestedMaximized.value) setMaximized(false);
}, { flush: "sync" });
watch(asideMode, value => { if (value === "overlay" && requestedMaximized.value) setMaximized(false); });
function restoreFocus(preferred: (() => HTMLElement | null) | undefined, fallback: HTMLElement | null) {
  const target = preferred?.() ?? fallback;
  if (target?.isConnected && target.getClientRects().length && !target.closest('[inert]')) target.focus({ preventScroll: true });
}
function detailExited() { if (!props.detailOpen) restoreFocus(props.finalDetailFocus, detailOpener); }
async function asideExited() {
  if (props.asideOpen) return;
  asidePresent.value = false;
  await nextTick();
  restoreFocus(props.finalAsideFocus, asideOpener);
}
let observer: ResizeObserver | undefined;
onMounted(() => {
  shell = body.value?.closest(".kappa-app-shell") ?? null;
  observer = new ResizeObserver(entries => {
    for (const entry of entries) {
      if (entry.target === primary.value) primaryWidth.value = entry.contentRect.width;
      if (entry.target === shell) rootWidth.value = entry.contentRect.width;
      if (entry.target === body.value) bodyWidth.value = entry.contentRect.width;
      if (entry.target === frame.value) frameWidth.value = entry.contentRect.width;
    }
  });
  if (primary.value) observer.observe(primary.value);
  if (body.value) observer.observe(body.value);
  if (frame.value) observer.observe(frame.value);
  if (shell) observer.observe(shell);
});
onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
  <div ref="body" class="kappa-app-shell__panels-body" :data-aside-mode="asideMode"
    :data-aside-open="props.asideOpen || undefined" :data-aside-present="asidePresent || undefined"
    :data-maximized="maximized || undefined" :data-wide="shellWidth >= 2560 || undefined">
    <div :id="frameId" ref="frame" class="kappa-app-shell__panel-frame" :style="{ '--kappa-shell-aside-width': `${asideWidth}px` }">
      <div :id="`${frameId}-primary`" ref="primary" class="kappa-app-shell__panels" :inert="coversPrimary || undefined"
        :data-panel-mode="mode" :data-detail-open="props.detailOpen || undefined">
        <Resizable.Root :size="size" :panels="definitions" class="kappa-app-shell__splitter" @update:size="saveSize">
          <Resizable.Panel id="primary" class="kappa-app-shell__primary">
            <slot name="header" />
            <slot />
          </Resizable.Panel>
          <Resizable.Handle v-if="props.detailOpen && mode === 'split'" id="primary:detail" :aria-label="props.resizeLabel" class="kappa-app-shell__resize" />
          <Resizable.Panel id="detail" class="kappa-app-shell__detail-region">
            <Dialog.Root :open="props.detailOpen" :restore-focus="false" :modal="false" :trap-focus="false"
              :prevent-scroll="false" :close-on-interact-outside="false" :initial-focus-el="props.initialDetailFocus"
              :aria-label="props.detailLabel" @update:open="emit('update:detailOpen', $event)" @exit-complete="detailExited">
              <Dialog.Content :teleport="false" :show-backdrop="false" :show-close-button="false"
                class="kappa-app-shell__detail" :aria-label="props.detailLabel" :inert="!props.detailOpen || undefined">
                <slot name="detail" :close="closeDetail" :mode="mode" />
              </Dialog.Content>
            </Dialog.Root>
          </Resizable.Panel>
        </Resizable.Root>
      </div>
      <div v-if="$slots.aside" :id="`${frameId}-aside`" class="kappa-app-shell__aside-region">
        <LocaleProvider v-if="props.asideOpen && asideMode === 'inline' && !maximized && bodyWidth > 0" locale="en-US">
          <AppShellAsideResizeHandle :frame-id="frameId" :primary-id="`${frameId}-primary`" :aside-id="`${frameId}-aside`"
            :direction="locale.dir" :width="asideWidth" :group-width="bodyWidth" :min-width="minAsideWidth" :max-width="maxAsideWidth"
            :label="props.asideResizeLabel" @resize="resizeAside" @reset="resetAsideWidth" />
        </LocaleProvider>
        <Dialog.Root :open="props.asideOpen" :restore-focus="false" :modal="false" :trap-focus="false"
          :prevent-scroll="false" :close-on-interact-outside="false" :initial-focus-el="props.initialAsideFocus"
          :aria-label="props.asideLabel" @update:open="emit('update:asideOpen', $event)" @exit-complete="asideExited">
          <Dialog.Content :teleport="false" :show-backdrop="false" :show-close-button="false" class="kappa-app-shell__aside"
            :aria-label="props.asideLabel" :inert="!props.asideOpen || undefined">
            <slot name="aside" :close="closeAside" :toggle-maximized="toggleMaximized" :maximized="maximized" :can-maximize="asideMode === 'inline'" />
          </Dialog.Content>
        </Dialog.Root>
      </div>
    </div>
  </div>
</template>
<style src="./app-shell-panels.css"></style>
