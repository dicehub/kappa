<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { Slider } from "@dicehub/kappa/components/slider";
import { ExternalLink } from "@lucide/vue";

const props = defineProps<{ variant: "mobile" | "full-screen-mobile" }>();
const frame = ref<HTMLIFrameElement>();
const stage = ref<HTMLElement>();
const requestedWidth = ref([390]);
const availableWidth = ref(640);
const maxWidth = computed(() => Math.min(640, Math.floor(availableWidth.value)));
const minWidth = computed(() => Math.min(320, maxWidth.value));
const width = computed(() => Math.min(requestedWidth.value[0], maxWidth.value));
const src = computed(() => `/examples/components/sidebar/${props.variant}`);
const title = computed(() => props.variant === "mobile" ? "Mobile sidebar preview" : "Full-screen mobile sidebar preview");
let resizeObserver: ResizeObserver | undefined;
let themeObserver: MutationObserver | undefined;

function syncTheme() {
  const root = frame.value?.contentDocument?.documentElement;
  if (!root) return;
  const mode = document.documentElement.dataset.mode === "dark" ? "dark" : "light";
  root.dataset.mode = mode;
  root.dataset.kappaTheme = mode;
  root.style.colorScheme = mode;
}
onMounted(() => {
  resizeObserver = new ResizeObserver(([entry]) => { availableWidth.value = Math.max(1, entry.contentRect.width - 2); });
  if (stage.value) resizeObserver.observe(stage.value);
  themeObserver = new MutationObserver(syncTheme);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-mode"] });
  syncTheme();
});
onUnmounted(() => { resizeObserver?.disconnect(); themeObserver?.disconnect(); });
</script>

<template>
  <div class="sidebar-mobile-preview" :data-sidebar-demo="props.variant">
    <div class="sidebar-mobile-preview__toolbar">
      <Slider.Root v-if="maxWidth > 320" :model-value="[width]" :min="minWidth" :max="maxWidth" :step="1" size="sm"
        class="sidebar-mobile-preview__slider"
        @update:model-value="requestedWidth = $event">
        <Slider.Label>Viewport</Slider.Label>
        <Slider.Control><Slider.Track><Slider.Range /></Slider.Track><Slider.Thumb :index="0"><Slider.HiddenInput /></Slider.Thumb></Slider.Control>
      </Slider.Root>
      <span v-else class="sidebar-mobile-preview__width">Viewport</span>
      <output class="sidebar-mobile-preview__width">{{ width }}px</output>
      <a :href="src" target="_blank" rel="noopener" class="sidebar-mobile-preview__link">Open example <ExternalLink aria-hidden="true" /></a>
    </div>
    <div ref="stage" class="sidebar-mobile-preview__stage">
      <iframe ref="frame" :src="src" :title="title" :data-sidebar-frame="props.variant"
        class="sidebar-mobile-preview__frame" :style="{ inlineSize: `${width}px` }" @load="syncTheme" />
    </div>
    <p class="sidebar-mobile-preview__hint">{{ props.variant === 'mobile' ? 'The drawer leaves space for the backdrop. Click that space to close it.' : 'The drawer fills this viewport. Use Close or Escape to return to the page.' }}</p>
  </div>
</template>

<style src="./sidebar-mobile-preview.css"></style>
