import { useNumberInputContext } from "@ark-ui/vue/number-input";
import { computed, nextTick, onBeforeUnmount, ref, watch, type Ref } from "vue";
import { addNumberInputDecimalSteps } from "./number-input-decimal";
import { resolveNumberInputPointerStep, useNumberInputScrubSteps } from "./number-input-scrub-steps";
import type { NumberInputScrubSensitivity } from "./number-input";

interface ScrubbableNumberInputOptions {
  dragThreshold: Ref<number>;
  root: Ref<HTMLElement | null>;
  scrubSensitivity: Ref<NumberInputScrubSensitivity | undefined>;
}

export const useScrubbableNumberInput = ({ dragThreshold, root, scrubSensitivity }: ScrubbableNumberInputOptions) => {
  const numberInput = useNumberInputContext();
  const scrubSteps = useNumberInputScrubSteps();
  const dragging = ref(false);
  const editorFocused = ref(false);
  const pending = ref(false);

  let pointerId: number | null = null;
  let startX = 0;
  let lastX = 0;
  let startValue = "";
  let startValueAsNumber = Number.NaN;
  let interactionGeneration = 0;
  let interactionDocument: Document | null = null;
  let interactionWindow: Window | null = null;
  let lockGeneration = 0;
  let lockRequestPending = false;
  let pointerLockAcquired = false;
  let requestedLockElement: HTMLElement | null = null;

  const inputElement = () => root.value?.querySelector<HTMLInputElement>("input") ?? null;
  const inputProps = computed(() => numberInput.value.getInputProps());
  const editing = computed(() => editorFocused.value && !dragging.value);
  const displayValue = computed(() => numberInput.value.value);

  const handleInputBlur = () => {
    editorFocused.value = false;
  };

  const handleInputFocus = () => {
    editorFocused.value = true;
  };

  const focusAndSelect = () => {
    numberInput.value.focus();
    void nextTick(() => inputElement()?.select());
  };

  const removeListeners = () => {
    interactionDocument?.removeEventListener("pointermove", handlePointerMove);
    interactionDocument?.removeEventListener("pointerup", handlePointerUp);
    interactionDocument?.removeEventListener("pointercancel", handlePointerCancel);
    interactionDocument?.removeEventListener("pointerlockchange", handlePointerLockChange);
    interactionDocument?.removeEventListener("keydown", handleKeyDown, true);
    interactionDocument?.removeEventListener("visibilitychange", handleVisibilityChange);
    interactionWindow?.removeEventListener("blur", handleWindowBlur);
  };

  const releasePointer = () => {
    const element = root.value ?? requestedLockElement;
    const ownerDocument = interactionDocument ?? element?.ownerDocument;
    if (element && pointerId !== null && element.hasPointerCapture?.(pointerId)) {
      element.releasePointerCapture(pointerId);
    }
    if (element && ownerDocument?.pointerLockElement === element) {
      ownerDocument.exitPointerLock?.();
    }
    pointerLockAcquired = false;
    requestedLockElement = null;
    pointerId = null;
  };

  const restoreStartValue = () => {
    if (startValue === "") {
      numberInput.value.clearValue();
      return;
    }
    if (!Number.isNaN(startValueAsNumber)) {
      numberInput.value.setValue(startValueAsNumber);
    }
  };

  const finish = ({ edit = false, restore = false } = {}) => {
    if (!pending.value && !dragging.value) return;
    const wasDragging = dragging.value;

    if (restore) restoreStartValue();
    pending.value = false;
    dragging.value = false;
    interactionGeneration += 1;
    removeListeners();
    releasePointer();
    interactionDocument = null;
    interactionWindow = null;

    if (edit && !wasDragging) {
      focusAndSelect();
    } else if (wasDragging) {
      inputElement()?.blur();
    }
  };

  const requestPointerLock = (element: HTMLElement) => {
    if (typeof element.requestPointerLock !== "function" || lockRequestPending) return;
    const ownerDocument = element.ownerDocument;
    const generation = interactionGeneration;
    let settled = false;

    lockRequestPending = true;
    requestedLockElement = element;
    lockGeneration = generation;

    const cleanupRequest = () => {
      if (settled) return;
      settled = true;
      lockRequestPending = false;
      ownerDocument.removeEventListener("pointerlockchange", handleRequestChange);
      ownerDocument.removeEventListener("pointerlockerror", handleRequestError);
    };

    const handleRequestChange = () => {
      if (ownerDocument.pointerLockElement !== element) return;
      cleanupRequest();
      if (generation !== interactionGeneration || !dragging.value) {
        ownerDocument.exitPointerLock?.();
      }
    };

    const handleRequestError = () => {
      cleanupRequest();
      if (
        generation === lockGeneration &&
        requestedLockElement === element &&
        !pointerLockAcquired
      ) {
        requestedLockElement = null;
      }
    };

    ownerDocument.addEventListener("pointerlockchange", handleRequestChange);
    ownerDocument.addEventListener("pointerlockerror", handleRequestError);

    try {
      const lock = element.requestPointerLock();
      if (lock && typeof lock.then === "function") {
        void lock
          .then(() => {
            handleRequestChange();
            if (ownerDocument.pointerLockElement !== element) cleanupRequest();
          })
          .catch(handleRequestError);
      }
    } catch {
      cleanupRequest();
      requestedLockElement = null;
      // Pointer capture remains the fallback when Pointer Lock is unavailable.
    }
  };

  function handlePointerMove(event: PointerEvent) {
    if (pointerId !== event.pointerId) return;
    if (inputProps.value.disabled || inputProps.value.readonly) {
      finish({ restore: true });
      return;
    }

    if (!dragging.value) {
      if (Math.abs(event.clientX - startX) <= dragThreshold.value) return;
      dragging.value = true;
      lastX = event.clientX;
      numberInput.value.focus();

      const element = root.value;
      if (!element) return;
      requestPointerLock(element);
      return;
    }

    const movement = event.movementX || event.clientX - lastX;
    lastX = event.clientX;
    if (movement === 0) return;

    const activeStep = resolveNumberInputPointerStep(event, scrubSteps.value, scrubSensitivity.value);
    const direction = inputProps.value.dir === "rtl" ? -1 : 1;
    const currentValue = Number.isNaN(numberInput.value.valueAsNumber)
      ? 0
      : numberInput.value.valueAsNumber;
    const nextValue = addNumberInputDecimalSteps(
      currentValue,
      activeStep,
      movement * direction,
    );
    numberInput.value.setValue(nextValue);
  }

  function handlePointerUp(event: PointerEvent) {
    if (pointerId !== event.pointerId) return;
    finish({ edit: !dragging.value });
  }

  function handlePointerCancel(event: PointerEvent) {
    if (pointerId !== event.pointerId) return;
    finish();
  }

  function handlePointerLockChange() {
    const element = requestedLockElement;
    if (!element) return;
    const ownerDocument = interactionDocument ?? element.ownerDocument;

    if (ownerDocument.pointerLockElement === element) {
      pointerLockAcquired = true;
      if (!dragging.value || lockGeneration !== interactionGeneration) {
        ownerDocument.exitPointerLock?.();
      }
      return;
    }

    if (pointerLockAcquired && dragging.value) {
      pointerLockAcquired = false;
      finish({ restore: true });
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key !== "Escape" || !dragging.value) return;
    event.preventDefault();
    event.stopPropagation();
    finish({ restore: true });
  }

  function handleVisibilityChange() {
    if (interactionDocument?.visibilityState === "hidden") finish();
  }

  function handleWindowBlur() {
    finish();
  }

  const handlePointerDown = (event: PointerEvent) => {
    if (event.button !== 0 || !event.isPrimary) return;
    if (inputProps.value.disabled) return;
    if (editing.value) return;
    if (inputProps.value.readonly) {
      event.preventDefault();
      focusAndSelect();
      return;
    }
    if (event.pointerType === "touch") {
      event.preventDefault();
      focusAndSelect();
      return;
    }
    const element = root.value;
    if (!element) return;

    event.preventDefault();
    pending.value = true;
    dragging.value = false;
    interactionGeneration += 1;
    pointerId = event.pointerId;
    startX = event.clientX;
    lastX = event.clientX;
    startValue = numberInput.value.value;
    startValueAsNumber = numberInput.value.valueAsNumber;
    interactionDocument = element.ownerDocument;
    interactionWindow = interactionDocument.defaultView;
    element.setPointerCapture?.(event.pointerId);

    interactionDocument.addEventListener("pointermove", handlePointerMove);
    interactionDocument.addEventListener("pointerup", handlePointerUp);
    interactionDocument.addEventListener("pointercancel", handlePointerCancel);
    interactionDocument.addEventListener("pointerlockchange", handlePointerLockChange);
    interactionDocument.addEventListener("keydown", handleKeyDown, true);
    interactionDocument.addEventListener("visibilitychange", handleVisibilityChange);
    interactionWindow?.addEventListener("blur", handleWindowBlur);
  };

  watch(
    () => inputProps.value.disabled || inputProps.value.readonly,
    (blocked) => {
      if (blocked) finish({ restore: true });
    },
  );

  onBeforeUnmount(() => finish());

  return {
    displayValue,
    dragging,
    editing,
    handleInputBlur,
    handleInputFocus,
    handlePointerDown,
    inputProps,
    numberInput,
  };
};
