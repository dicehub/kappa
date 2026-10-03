<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import {
  FloatingPanel,
  type FloatingPanelPoint,
  type FloatingPanelResizeTriggerAxis,
  type FloatingPanelSize,
  type FloatingPanelStageChangeDetails,
} from "@dicehub/kappa/components/floating-panel";

const props = withDefaults(defineProps<{
  defaultOpen?: boolean;
  defaultPosition?: FloatingPanelPoint;
  defaultSize?: FloatingPanelSize;
  disabled?: boolean;
  draggable?: boolean;
  getBoundaryEl?: () => HTMLElement | null;
  label?: string;
  open?: boolean;
  persistRect?: boolean;
  position?: FloatingPanelPoint;
  resizable?: boolean;
  showTrigger?: boolean;
  size?: FloatingPanelSize;
  title: string;
}>(), {
  defaultOpen: true,
  disabled: false,
  draggable: true,
  label: undefined,
  open: undefined,
  persistRect: true,
  position: undefined,
  resizable: true,
  showTrigger: true,
  size: undefined,
});

const emit = defineEmits<{
  stageChange: [details: FloatingPanelStageChangeDetails];
  "update:open": [open: boolean];
  "update:position": [position: FloatingPanelPoint];
  "update:size": [size: FloatingPanelSize];
}>();

defineSlots<{
  default?: () => unknown;
  footer?: () => unknown;
  headerActions?: () => unknown;
}>();

const resizeAxes: FloatingPanelResizeTriggerAxis[] = [
  "n",
  "e",
  "s",
  "w",
  "ne",
  "nw",
  "se",
  "sw",
];

const localPosition = ref<FloatingPanelPoint>(props.defaultPosition ?? { x: 24, y: 24 });
const localSize = ref<FloatingPanelSize>(props.defaultSize ?? { width: 320, height: 240 });
const boundaryRect = ref({ width: 0, height: 0 });
const currentStage = ref<FloatingPanelStageChangeDetails["stage"]>("default");
const stagedLocalPosition = ref<FloatingPanelPoint>();
const pendingRestorePosition = ref<FloatingPanelPoint>();
let boundaryObserver: ResizeObserver | undefined;

const syncBoundaryRect = () => {
  const rect = props.getBoundaryEl?.()?.getBoundingClientRect();
  if (!rect) return;
  boundaryRect.value = {
    width: rect.width,
    height: rect.height,
  };
};

const requestedSize = computed(() => props.size ?? localSize.value);
const constrainSize = (size: FloatingPanelSize) => {
  const { width, height } = boundaryRect.value;
  if (width <= 0 || height <= 0) return size;
  return {
    width: Math.min(size.width, width),
    height: Math.min(size.height, height),
  };
};
const resolvedSize = computed(() => constrainSize(requestedSize.value));
const requestedLocalPosition = computed(() => props.position ?? localPosition.value);
const constrainPosition = (position: FloatingPanelPoint) => {
  const { width, height } = boundaryRect.value;
  if (width <= 0 || height <= 0) return position;
  return {
    x: Math.min(Math.max(position.x, 0), Math.max(width - resolvedSize.value.width, 0)),
    y: Math.min(Math.max(position.y, 0), Math.max(height - resolvedSize.value.height, 0)),
  };
};
const resolvedLocalPosition = computed(() => constrainPosition(requestedLocalPosition.value));

const handlePositionUpdate = (position: FloatingPanelPoint) => {
  const nextPosition = pendingRestorePosition.value ?? constrainPosition(position);
  pendingRestorePosition.value = undefined;
  if (props.position === undefined) localPosition.value = nextPosition;
  emit("update:position", nextPosition);
};

const handleSizeUpdate = (size: FloatingPanelSize) => {
  const nextSize = constrainSize(size);
  if (props.size === undefined) localSize.value = nextSize;
  emit("update:size", nextSize);
};

const handleStageChange = (details: FloatingPanelStageChangeDetails) => {
  if (currentStage.value === "default" && details.stage !== "default") {
    stagedLocalPosition.value = { ...resolvedLocalPosition.value };
  } else if (currentStage.value !== "default" && details.stage === "default") {
    const restorePosition = stagedLocalPosition.value;
    pendingRestorePosition.value = restorePosition;
    stagedLocalPosition.value = undefined;
    queueMicrotask(() => {
      if (pendingRestorePosition.value === restorePosition) {
        pendingRestorePosition.value = undefined;
      }
    });
  }
  currentStage.value = details.stage;
  emit("stageChange", details);
};

onMounted(() => {
  syncBoundaryRect();
  const boundary = props.getBoundaryEl?.();
  if (boundary) {
    boundaryObserver = new ResizeObserver(syncBoundaryRect);
    boundaryObserver.observe(boundary);
    if (document.documentElement !== boundary) {
      boundaryObserver.observe(document.documentElement);
    }
  }
  window.addEventListener("resize", syncBoundaryRect);
});

onBeforeUnmount(() => {
  boundaryObserver?.disconnect();
  window.removeEventListener("resize", syncBoundaryRect);
});
</script>

<template>
  <FloatingPanel.Root
    :default-open="props.defaultOpen"
    :default-size="props.defaultSize"
    allow-overflow
    :disabled="props.disabled"
    :draggable="props.draggable"
    :open="props.open"
    :persist-rect="props.persistRect"
    :position="resolvedLocalPosition"
    :resizable="props.resizable"
    :size="resolvedSize"
    strategy="absolute"
    @stage-change="handleStageChange"
    @update:open="emit('update:open', $event)"
    @update:position="handlePositionUpdate"
    @update:size="handleSizeUpdate"
  >
    <FloatingPanel.Trigger v-if="props.showTrigger" class="floating-panel-demo__open">
      Open {{ props.title }}
    </FloatingPanel.Trigger>
    <FloatingPanel.Positioner class="floating-panel-demo__positioner" :teleport="false">
      <FloatingPanel.Content :aria-label="props.label" :data-demo-window="props.title">
        <FloatingPanel.DragTrigger>
          <FloatingPanel.Header>
            <FloatingPanel.Title>{{ props.title }}</FloatingPanel.Title>
            <FloatingPanel.Control>
              <slot name="headerActions" />
              <template v-if="props.resizable">
                <FloatingPanel.StageTrigger stage="minimized" />
                <FloatingPanel.StageTrigger stage="maximized" />
                <FloatingPanel.StageTrigger stage="default" />
              </template>
              <FloatingPanel.Close />
            </FloatingPanel.Control>
          </FloatingPanel.Header>
        </FloatingPanel.DragTrigger>
        <FloatingPanel.Body :class="{ 'floating-panel-demo__body--with-footer': $slots.footer }">
          <div class="floating-panel-demo__body-content"><slot /></div>
          <footer v-if="$slots.footer" class="floating-panel-demo__footer" data-no-drag>
            <slot name="footer" />
          </footer>
        </FloatingPanel.Body>
        <template v-if="props.resizable">
          <FloatingPanel.ResizeTrigger
            v-for="axis in resizeAxes"
            :key="axis"
            :axis="axis"
          />
        </template>
      </FloatingPanel.Content>
    </FloatingPanel.Positioner>
  </FloatingPanel.Root>
</template>
