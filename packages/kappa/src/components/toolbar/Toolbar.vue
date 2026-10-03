<script setup lang="ts">
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  onUpdated,
  ref,
  useAttrs,
} from "vue";
import { provideToolbarContext } from "./context";
import {
  TOOLBAR_DEFAULT_LOOP_FOCUS,
  TOOLBAR_DEFAULT_ORIENTATION,
  TOOLBAR_DEFAULT_SIZE,
  resolveToolbarOrientation,
  resolveToolbarSize,
  type ToolbarProps,
  type ToolbarSlots,
} from "./toolbar";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ToolbarProps>(), {
  disabled: false,
  loopFocus: TOOLBAR_DEFAULT_LOOP_FOCUS,
  orientation: TOOLBAR_DEFAULT_ORIENTATION,
  size: TOOLBAR_DEFAULT_SIZE,
});

defineSlots<ToolbarSlots>();

const attrs = useAttrs();
const rootRef = ref<HTMLElement | null>(null);
const rovingTarget = ref<HTMLElement | null>(null);
let childObserver: MutationObserver | undefined;

const resolvedOrientation = computed(() =>
  resolveToolbarOrientation(props.orientation),
);
const resolvedSize = computed(() => resolveToolbarSize(props.size));
const resolvedDisabled = computed(
  () =>
    props.disabled ||
    attrs["aria-disabled"] === true ||
    attrs["aria-disabled"] === "true",
);
const resolvedAriaDisabled = computed(() =>
  resolvedDisabled.value
    ? "true"
    : attrs["aria-disabled"] === false || attrs["aria-disabled"] === "false"
      ? "false"
      : undefined,
);

provideToolbarContext({
  disabled: resolvedDisabled,
  orientation: resolvedOrientation,
  size: resolvedSize,
});

const focusableSelector = 'button, input, select, textarea, a[href], [tabindex]';
const toolbarItemSelector = "[data-kappa-toolbar-item]";
const toolbarInputGroupSelector = "[data-kappa-toolbar-input-group]";

type ToolbarEntry = {
  container: HTMLElement;
  enabled: boolean;
  target: HTMLElement;
};

const isHidden = (element: HTMLElement) => {
  if (
    element.hidden ||
    Boolean(
      element.closest("[hidden], [aria-hidden='true'], [inert]") ||
        element.matches("[inert]"),
    )
  ) {
    return true;
  }

  const style = element.ownerDocument.defaultView?.getComputedStyle(element);
  return style?.display === "none" ||
    style?.visibility === "hidden" ||
    style?.visibility === "collapse";
};

const isDisabled = (element: HTMLElement, container: HTMLElement) =>
  element.matches(":disabled, [aria-disabled='true']") ||
  container.matches(":disabled, [aria-disabled='true']") ||
  Boolean(element.closest("[aria-disabled='true']"));

const targetFor = (container: HTMLElement) => {
  if (container.matches(focusableSelector)) return container;
  return container.querySelector<HTMLElement>(focusableSelector);
};

const getEntries = (root: HTMLElement): ToolbarEntry[] => {
  const marked = Array.from(
    root.querySelectorAll<HTMLElement>(toolbarItemSelector),
  );
  const entries = marked.flatMap((container) => {
    if (isHidden(container)) return [];
    const targets = container.matches(toolbarInputGroupSelector)
      ? Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter(
          (target) => target.closest(toolbarItemSelector) === container,
        )
      : (() => {
          const target = targetFor(container);
          return target ? [target] : [];
        })();

    return targets
      .filter((target) => !isHidden(target))
      .map((target) => ({
        container,
        enabled: !isDisabled(target, container),
        target,
      }));
  });

  // A native control can still participate when a consumer composes one
  // directly inside Root. Marked non-group parts remain one toolbar item.
  const unmarked = Array.from(
    root.querySelectorAll<HTMLElement>(focusableSelector),
  )
    .filter((target) => !target.closest(toolbarItemSelector))
    .filter((target) => !isHidden(target))
    .map((target) => ({
      container: target,
      enabled: !isDisabled(target, target),
      target,
    }));

  return [...entries, ...unmarked].sort((left, right) => {
    if (left.target === right.target) return 0;
    return left.target.compareDocumentPosition(right.target) &
      Node.DOCUMENT_POSITION_FOLLOWING
      ? -1
      : 1;
  });
};

const syncTabStops = () => {
  const root = rootRef.value;
  if (!root) return;

  const entries = getEntries(root);
  const enabled = resolvedDisabled.value ? [] : entries.filter((entry) => entry.enabled);
  const activeElement = root.ownerDocument.activeElement;
  const focusedIndex = enabled.findIndex(
    (entry) =>
      entry.target === activeElement || entry.target.contains(activeElement),
  );
  const rovingIndex = enabled.findIndex(
    (entry) => entry.target === rovingTarget.value,
  );
  const selected = enabled[focusedIndex >= 0 ? focusedIndex : rovingIndex >= 0 ? rovingIndex : 0];

  for (const entry of entries) {
    const tabindex = selected && entry.target === selected.target ? "0" : "-1";
    if (entry.target.getAttribute("tabindex") !== tabindex) {
      entry.target.setAttribute("tabindex", tabindex);
    }
  }
  rovingTarget.value = selected?.target ?? null;
};

const getDirection = (element: HTMLElement) => {
  const computedDirection = element.ownerDocument.defaultView?.getComputedStyle(
    element,
  ).direction;
  if (computedDirection === "rtl" || computedDirection === "ltr") {
    return computedDirection;
  }
  return element.closest<HTMLElement>("[dir]")?.getAttribute("dir") === "rtl"
    ? "rtl"
    : "ltr";
};

const shouldKeepTextCursor = (event: KeyboardEvent, target: EventTarget | null) => {
  if (!(target instanceof HTMLTextAreaElement || target instanceof HTMLInputElement)) {
    return false;
  }

  const selectionStart = target.selectionStart;
  const selectionEnd = target.selectionEnd;
  if (selectionStart === null || selectionEnd === null) return false;
  const hasSelection = selectionStart !== selectionEnd;
  if (hasSelection) return true;

  const direction = getDirection(target);
  const value = target.value;
  const lineStart = target instanceof HTMLTextAreaElement
    ? value.lastIndexOf("\n", selectionStart - 1) + 1
    : 0;
  const lineBreak = target instanceof HTMLTextAreaElement
    ? value.indexOf("\n", selectionStart)
    : -1;
  const lineEnd = lineBreak === -1 ? value.length : lineBreak;

  if (event.key === "ArrowLeft") {
    return direction === "rtl" ? selectionEnd < lineEnd : selectionStart > lineStart;
  }
  if (event.key === "ArrowRight") {
    return direction === "rtl" ? selectionStart > lineStart : selectionEnd < lineEnd;
  }
  if (event.key === "ArrowUp") {
    return target instanceof HTMLTextAreaElement && lineStart > 0;
  }
  if (event.key === "ArrowDown") {
    return target instanceof HTMLTextAreaElement && lineEnd < value.length;
  }
  if (event.key === "Home") return selectionStart > lineStart;
  if (event.key === "End") return selectionEnd < lineEnd;
  return false;
};

const shouldKeepNativeArrowKey = (
  event: KeyboardEvent,
  target: EventTarget | null,
) => {
  if (target instanceof HTMLSelectElement) {
    if (!["ArrowUp", "ArrowDown"].includes(event.key)) return false;
    const selectedIndex = target.selectedIndex;
    if (selectedIndex < 0) return true;
    return event.key === "ArrowUp"
      ? selectedIndex > 0
      : selectedIndex < target.options.length - 1;
  }

  if (!(target instanceof HTMLInputElement)) return false;
  const inputType = target.type.toLowerCase();
  if (!["number", "range"].includes(inputType)) return false;

  const value = target.valueAsNumber;
  if (Number.isNaN(value)) return true;

  if (inputType === "number") {
    if (!["ArrowUp", "ArrowDown"].includes(event.key)) return false;
    const step = target.step === "any" ? 1 : Number(target.step) || 1;
    const nextValue = event.key === "ArrowUp" ? value + step : value - step;
    const min = target.min === "" ? undefined : Number(target.min);
    const max = target.max === "" ? undefined : Number(target.max);
    return (min === undefined || nextValue >= min) &&
      (max === undefined || nextValue <= max);
  }

  if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
    return false;
  }
  const min = target.min === "" ? 0 : Number(target.min);
  const max = target.max === "" ? 100 : Number(target.max);
  const isRtl = getDirection(target) === "rtl";
  const increases = event.key === "ArrowUp" ||
    (event.key === "ArrowRight" && !isRtl) ||
    (event.key === "ArrowLeft" && isRtl);
  return increases ? value < max : value > min;
};

const handleKeydown = (event: KeyboardEvent) => {
  if (resolvedDisabled.value || event.altKey || event.ctrlKey || event.metaKey) return;
  if (!(event.currentTarget instanceof HTMLElement)) return;
  if (event.defaultPrevented) return;

  const isHorizontal = resolvedOrientation.value === "horizontal";
  const isRtl = getDirection(event.currentTarget) === "rtl";
  const forwardKey = isHorizontal
    ? isRtl
      ? "ArrowLeft"
      : "ArrowRight"
    : "ArrowDown";
  const backwardKey = isHorizontal
    ? isRtl
      ? "ArrowRight"
      : "ArrowLeft"
    : "ArrowUp";
  const isForward = event.key === forwardKey;
  const isBackward = event.key === backwardKey;
  const isHome = event.key === "Home";
  const isEnd = event.key === "End";

  if (!isForward && !isBackward && !isHome && !isEnd) return;
  if (
    shouldKeepTextCursor(event, event.target) ||
    shouldKeepNativeArrowKey(event, event.target)
  ) {
    return;
  }

  const enabled = getEntries(event.currentTarget).filter(
    (entry) => entry.enabled,
  );
  if (enabled.length === 0 || !(event.target instanceof Node)) return;

  const currentIndex = enabled.findIndex(
    (entry) =>
      entry.target === event.target || entry.target.contains(event.target as Node),
  );
  if (currentIndex < 0) return;

  const lastIndex = enabled.length - 1;
  let nextIndex = currentIndex;
  if (isHome) nextIndex = 0;
  else if (isEnd) nextIndex = lastIndex;
  else if (isBackward) {
    nextIndex = props.loopFocus
      ? (currentIndex - 1 + enabled.length) % enabled.length
      : Math.max(0, currentIndex - 1);
  } else if (isForward) {
    nextIndex = props.loopFocus
      ? (currentIndex + 1) % enabled.length
      : Math.min(lastIndex, currentIndex + 1);
  }

  event.preventDefault();
  const nextTarget = enabled[nextIndex]?.target;
  if (!nextTarget) return;
  rovingTarget.value = nextTarget;
  nextTarget.focus();
  syncTabStops();
};

const handleFocusin = (event: FocusEvent) => {
  if (resolvedDisabled.value || !(event.target instanceof Node)) return;
  const root = rootRef.value;
  if (!root) return;
  const entry = getEntries(root).find((candidate) =>
    candidate.target === event.target || candidate.target.contains(event.target as Node),
  );
  if (!entry?.enabled) return;
  rovingTarget.value = entry.target;
  syncTabStops();
};

onMounted(() => {
  syncTabStops();
  childObserver = new MutationObserver(() => syncTabStops());
  childObserver.observe(rootRef.value as Node, {
    attributes: true,
    attributeFilter: [
      "aria-disabled",
      "aria-hidden",
      "class",
      "disabled",
      "hidden",
      "inert",
      "style",
      "tabindex",
    ],
    childList: true,
    subtree: true,
  });
  void nextTick(syncTabStops);
});

onUpdated(syncTabStops);

onUnmounted(() => {
  childObserver?.disconnect();
});
</script>

<template>
  <div
    ref="rootRef"
    v-bind="$attrs"
    class="kappa-toolbar"
    data-slot="toolbar"
    :data-disabled="resolvedDisabled ? '' : undefined"
    :data-orientation="resolvedOrientation"
    :data-size="resolvedSize"
    role="toolbar"
    :aria-disabled="resolvedAriaDisabled"
    :aria-orientation="resolvedOrientation"
    @focusin="handleFocusin"
    @keydown="handleKeydown"
  >
    <slot />
  </div>
</template>

<style src="./toolbar.css"></style>
