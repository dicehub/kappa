<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useAttrs,
  useId,
  watch,
} from "vue";
import FlowConnectorLayer from "./FlowConnectorLayer.vue";
import {
  computeDiagramRect,
  computePositions,
  FLOW_DEFAULT_ALIGN,
  FLOW_DEFAULT_CONNECTOR,
  FLOW_DEFAULT_ORIENTATION,
  FLOW_DEFAULT_PADDING,
  type FlowConnector,
  type FlowOverflow,
  type FlowRootProps,
  type FlowRootSlots,
  type FlowState,
} from "./flow";
import { createFlowConnectors } from "./flow-connectors";
import {
  applyFlowNodePositions,
  buildFlowTree,
  collectFlowNodeMeasurements,
} from "./flow-dom";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<FlowRootProps>(), {
  align: FLOW_DEFAULT_ALIGN,
  canvas: true,
  connector: FLOW_DEFAULT_CONNECTOR,
  orientation: FLOW_DEFAULT_ORIENTATION,
});

defineSlots<FlowRootSlots>();

const attrs = useAttrs();
const viewportRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);
const connectors = ref<FlowConnector[]>([]);
const markerId = `kappa-flow-arrow-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
const offset = ref({ x: 0, y: 0 });
const bounds = ref({ x: 0, y: 0 });
const canPan = ref(false);
const isPanning = ref(false);
const scrollThumb = ref({ width: 0, height: 0 });
const diagramRect = ref({ width: 0, height: 0 });

let resizeObserver: ResizeObserver | undefined;
let mutationObserver: MutationObserver | undefined;
let animationFrame = 0;
let observedElements = new Set<Element>();
let lastOverflow: FlowOverflow | undefined;
let dragState:
  | {
      pointerId: number;
      startX: number;
      startY: number;
      originX: number;
      originY: number;
    }
  | undefined;

const resolvedPadding = computed(() => ({
  x: props.padding?.x ?? FLOW_DEFAULT_PADDING.x,
  y: props.padding?.y ?? FLOW_DEFAULT_PADDING.y,
}));

const contentStyle = computed(() => ({
  transform: `translate3d(${offset.value.x}px, ${offset.value.y}px, 0)`,
  width:
    diagramRect.value.width > 0 ? `${diagramRect.value.width}px` : undefined,
  height:
    diagramRect.value.height > 0 ? `${diagramRect.value.height}px` : undefined,
}));

const scrollX = computed(() => ({
  width: scrollThumb.value.width,
  left:
    bounds.value.x < 0
      ? (Math.abs(offset.value.x) / Math.abs(bounds.value.x)) *
        (100 - scrollThumb.value.width)
      : 0,
}));

const scrollY = computed(() => ({
  height: scrollThumb.value.height,
  top:
    bounds.value.y < 0
      ? (Math.abs(offset.value.y) / Math.abs(bounds.value.y)) *
        (100 - scrollThumb.value.height)
      : 0,
}));

const resolvedTabindex = computed(() => {
  const value = attrs.tabindex;
  return typeof value === "string" || typeof value === "number"
    ? value
    : canPan.value
      ? 0
      : undefined;
});

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const clampOffset = (nextX = offset.value.x, nextY = offset.value.y) => {
  offset.value = {
    x: clamp(nextX, bounds.value.x, 0),
    y: clamp(nextY, bounds.value.y, 0),
  };
};

const reportOverflow = (overflow: FlowOverflow) => {
  if (lastOverflow?.x === overflow.x && lastOverflow.y === overflow.y) return;
  lastOverflow = overflow;
  props.onOverflowChange?.(overflow);
};

const updateLayout = () => {
  const content = contentRef.value;
  if (!content) {
    connectors.value = [];
    diagramRect.value = { width: 0, height: 0 };
    return;
  }

  const flowState: FlowState = {
    nodes: collectFlowNodeMeasurements(content, props.orientation),
    tree: buildFlowTree(content),
    align: props.align,
    orientation: props.orientation,
  };
  const positions = computePositions(flowState);
  diagramRect.value = computeDiagramRect(positions, flowState);
  applyFlowNodePositions(content, positions);
  connectors.value = createFlowConnectors(
    flowState,
    positions,
    props.connector,
  );
};

const updateBounds = () => {
  const viewport = viewportRef.value;
  const content = contentRef.value;
  if (!viewport || !content || !props.canvas) {
    canPan.value = false;
    bounds.value = { x: 0, y: 0 };
    offset.value = { x: 0, y: 0 };
    scrollThumb.value = { width: 0, height: 0 };
    reportOverflow({ x: false, y: false });
    return;
  }

  const viewportWidth = Math.max(
    0,
    viewport.clientWidth - resolvedPadding.value.x * 2,
  );
  const viewportHeight = Math.max(
    0,
    viewport.clientHeight - resolvedPadding.value.y * 2,
  );
  const contentWidth = diagramRect.value.width || content.offsetWidth;
  const contentHeight = diagramRect.value.height || content.offsetHeight;
  const nextBounds = {
    x: Math.min(0, viewportWidth - contentWidth),
    y: Math.min(0, viewportHeight - contentHeight),
  };

  bounds.value = nextBounds;
  canPan.value = nextBounds.x < 0 || nextBounds.y < 0;
  scrollThumb.value = {
    width:
      contentWidth > 0
        ? Math.min(100, Math.max(10, (viewportWidth / contentWidth) * 100))
        : 0,
    height:
      contentHeight > 0
        ? Math.min(100, Math.max(10, (viewportHeight / contentHeight) * 100))
        : 0,
  };
  clampOffset();
  reportOverflow({ x: nextBounds.x < 0, y: nextBounds.y < 0 });
};

const syncObservedElements = () => {
  if (!resizeObserver) return;

  const nextObserved = new Set<Element>();
  if (viewportRef.value) nextObserved.add(viewportRef.value);
  if (contentRef.value) {
    nextObserved.add(contentRef.value);
    for (const element of contentRef.value.querySelectorAll(
      '[data-flow-type="node"], [data-flow-anchor]',
    )) {
      nextObserved.add(element);
    }
  }

  const changed =
    nextObserved.size !== observedElements.size ||
    Array.from(nextObserved).some((element) => !observedElements.has(element));
  if (!changed) return;

  resizeObserver.disconnect();
  for (const element of nextObserved) resizeObserver.observe(element);
  observedElements = nextObserved;
};

const scheduleMeasure = () => {
  if (animationFrame) cancelAnimationFrame(animationFrame);
  animationFrame = requestAnimationFrame(() => {
    animationFrame = 0;
    syncObservedElements();
    updateLayout();
    updateBounds();
  });
};

const onPointerDown = (event: PointerEvent) => {
  if (!props.canvas || !canPan.value || event.button !== 0) return;
  if (
    event.target instanceof Element &&
    event.target.closest("[data-flow-item]")
  )
    return;

  dragState = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    originX: offset.value.x,
    originY: offset.value.y,
  };
  isPanning.value = true;
  viewportRef.value?.setPointerCapture(event.pointerId);
};

const onPointerMove = (event: PointerEvent) => {
  if (!dragState || dragState.pointerId !== event.pointerId) return;
  clampOffset(
    dragState.originX + event.clientX - dragState.startX,
    dragState.originY + event.clientY - dragState.startY,
  );
};

const onPointerEnd = (event: PointerEvent) => {
  if (dragState?.pointerId !== event.pointerId) return;
  if (viewportRef.value?.hasPointerCapture(event.pointerId)) {
    viewportRef.value.releasePointerCapture(event.pointerId);
  }
  dragState = undefined;
  isPanning.value = false;
};

const onWheel = (event: WheelEvent) => {
  if (!props.canvas || !canPan.value) return;
  const horizontalDelta =
    event.deltaX || (bounds.value.y === 0 ? event.deltaY : 0);
  const nextX =
    bounds.value.x < 0 ? offset.value.x - horizontalDelta : offset.value.x;
  const nextY =
    bounds.value.y < 0 ? offset.value.y - event.deltaY : offset.value.y;
  if (nextX === offset.value.x && nextY === offset.value.y) return;
  event.preventDefault();
  clampOffset(nextX, nextY);
};

const onKeydown = (event: KeyboardEvent) => {
  if (!props.canvas || !canPan.value) return;
  const step = event.shiftKey ? 96 : 40;
  const next = { ...offset.value };
  if (event.key === "ArrowLeft") next.x += step;
  else if (event.key === "ArrowRight") next.x -= step;
  else if (event.key === "ArrowUp") next.y += step;
  else if (event.key === "ArrowDown") next.y -= step;
  else if (event.key === "Home") Object.assign(next, { x: 0, y: 0 });
  else if (event.key === "End") Object.assign(next, bounds.value);
  else return;
  event.preventDefault();
  clampOffset(next.x, next.y);
};

onMounted(async () => {
  await nextTick();
  resizeObserver = new ResizeObserver(scheduleMeasure);
  if (contentRef.value) {
    mutationObserver = new MutationObserver(scheduleMeasure);
    mutationObserver.observe(contentRef.value, {
      attributes: true,
      attributeFilter: [
        "data-flow-align",
        "data-flow-anchor",
        "data-flow-disabled",
        "data-flow-id",
        "data-node-id",
      ],
      characterData: true,
      childList: true,
      subtree: true,
    });
  }
  scheduleMeasure();
  window.addEventListener("resize", scheduleMeasure, { passive: true });
  window.addEventListener("scroll", scheduleMeasure, {
    capture: true,
    passive: true,
  });
});

onBeforeUnmount(() => {
  if (animationFrame) cancelAnimationFrame(animationFrame);
  resizeObserver?.disconnect();
  mutationObserver?.disconnect();
  window.removeEventListener("resize", scheduleMeasure);
  window.removeEventListener("scroll", scheduleMeasure, { capture: true });
});

watch(
  () => [
    props.align,
    props.canvas,
    props.connector,
    props.orientation,
    props.padding?.x,
    props.padding?.y,
  ],
  scheduleMeasure,
);
</script>

<template>
  <div
    v-bind="$attrs"
    ref="viewportRef"
    class="kappa-flow"
    :class="[
      `kappa-flow--${props.orientation}`,
      `kappa-flow--align-${props.align}`,
      {
        'kappa-flow--canvas': props.canvas,
        'kappa-flow--can-pan': canPan,
        'kappa-flow--panning': isPanning,
      },
    ]"
    :style="{
      '--kappa-flow-padding-x': `${resolvedPadding.x}px`,
      '--kappa-flow-padding-y': `${resolvedPadding.y}px`,
    }"
    data-flow-root
    data-slot="flow"
    :data-align="props.align"
    :data-canvas="props.canvas ? '' : undefined"
    :data-connector="props.connector"
    :data-orientation="props.orientation"
    :tabindex="resolvedTabindex"
    @keydown="onKeydown"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerEnd"
    @pointercancel="onPointerEnd"
    @lostpointercapture="onPointerEnd"
    @wheel="onWheel"
  >
    <div
      ref="contentRef"
      class="kappa-flow__content"
      data-flow-content
      data-slot="flow-content"
      :style="contentStyle"
    >
      <ul
        class="kappa-flow__list kappa-flow__list--root"
        data-flow-list
        data-slot="flow-list-root"
        :data-flow-align="props.align"
      >
        <slot />
      </ul>

      <FlowConnectorLayer :connectors="connectors" :marker-id="markerId" />
    </div>

    <div
      v-if="bounds.y < 0"
      class="kappa-flow__scrollbar kappa-flow__scrollbar--y"
      aria-hidden="true"
      data-slot="flow-scrollbar-y"
    >
      <span :style="{ height: `${scrollY.height}%`, top: `${scrollY.top}%` }" />
    </div>
    <div
      v-if="bounds.x < 0"
      class="kappa-flow__scrollbar kappa-flow__scrollbar--x"
      aria-hidden="true"
      data-slot="flow-scrollbar-x"
    >
      <span :style="{ width: `${scrollX.width}%`, left: `${scrollX.left}%` }" />
    </div>
  </div>
</template>

<style src="./flow.css"></style>
