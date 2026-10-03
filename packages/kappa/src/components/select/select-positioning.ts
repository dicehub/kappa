import type { SelectPositioningOptions } from "./select";

const ALIGNMENT_PROPERTY = "--kappa-select-item-alignment";
const DEFAULT_OVERFLOW_PADDING = 8;

export interface SelectItemAlignmentGeometry {
  floatingHeight: number;
  floatingTop: number;
  overflowPadding: number;
  selectedCenter: number;
  triggerCenter: number;
  viewportHeight: number;
}

export const resolveSelectItemAlignmentOffset = ({
  floatingHeight,
  floatingTop,
  overflowPadding,
  selectedCenter,
  triggerCenter,
  viewportHeight,
}: SelectItemAlignmentGeometry): number | undefined => {
  const offset = triggerCenter - selectedCenter;
  const padding = Math.max(0, overflowPadding);
  const candidateTop = floatingTop + offset;
  const candidateBottom = candidateTop + floatingHeight;

  if (candidateTop < padding || candidateBottom > viewportHeight - padding) return undefined;
  return Math.round(offset * 100) / 100;
};

const getBlockCenterWithin = (element: HTMLElement, ancestor: HTMLElement) => {
  let center = element.offsetHeight / 2;
  let offsetElement: HTMLElement | null = element;

  while (offsetElement && offsetElement !== ancestor) {
    center += offsetElement.offsetTop;
    offsetElement = offsetElement.offsetParent as HTMLElement | null;
  }
  if (offsetElement !== ancestor) return undefined;

  let parent = element.parentElement;
  while (parent && parent !== ancestor) {
    center -= parent.scrollTop;
    parent = parent.parentElement;
  }
  return center;
};

const prepareAlignment = (floatingElement: HTMLElement | null) => {
  if (!floatingElement) return;
  floatingElement.setAttribute("data-align-item-with-trigger", "");
  floatingElement.setAttribute("data-item-alignment", "anchored");
  floatingElement.style.setProperty(ALIGNMENT_PROPERTY, "0px");
};

const alignSelectedItem = (
  floatingElement: HTMLElement | null,
  triggerElement: HTMLElement | null,
  overflowPadding: number,
) => {
  if (!floatingElement?.isConnected || !triggerElement?.isConnected) return;

  prepareAlignment(floatingElement);
  const selectedItem =
    floatingElement.querySelector<HTMLElement>(
      '[data-slot="select-item"][data-state="checked"][data-highlighted]',
    ) ??
    floatingElement.querySelector<HTMLElement>(
      '[data-slot="select-item"][data-state="checked"]',
    );
  if (!selectedItem) return;

  const selectedCenterWithin = getBlockCenterWithin(selectedItem, floatingElement);
  const view = floatingElement.ownerDocument.defaultView;
  if (selectedCenterWithin === undefined || !view) return;

  const floatingTop = floatingElement.getBoundingClientRect().top;
  const triggerRect = triggerElement.getBoundingClientRect();
  const offset = resolveSelectItemAlignmentOffset({
    floatingHeight: floatingElement.offsetHeight,
    floatingTop,
    overflowPadding,
    selectedCenter: floatingTop + selectedCenterWithin,
    triggerCenter: triggerRect.top + triggerRect.height / 2,
    viewportHeight: view.innerHeight,
  });
  if (offset === undefined) return;

  floatingElement.style.setProperty(ALIGNMENT_PROPERTY, `${offset}px`);
  floatingElement.setAttribute("data-item-alignment", "selected");
};

type PositionUpdateDetails = Parameters<
  NonNullable<SelectPositioningOptions["updatePosition"]>
>[0];

export const withSelectItemAlignment = (
  positioning: SelectPositioningOptions,
  getTriggerElement: (floatingElement: HTMLElement) => HTMLElement | null,
): SelectPositioningOptions => {
  const customUpdatePosition = positioning.updatePosition;
  const overflowPadding = positioning.overflowPadding ?? DEFAULT_OVERFLOW_PADDING;

  return {
    ...positioning,
    updatePosition: async ({ updatePosition, floatingElement }: PositionUpdateDetails) => {
      const updateAndAlign = async () => {
        prepareAlignment(floatingElement);
        await updatePosition();
        if (!floatingElement) return;

        const align = () =>
          alignSelectedItem(
            floatingElement,
            getTriggerElement(floatingElement),
            overflowPadding,
          );
        align();
        floatingElement.ownerDocument.defaultView?.requestAnimationFrame(align);
      };

      if (customUpdatePosition) {
        await customUpdatePosition({ updatePosition: updateAndAlign, floatingElement });
        return;
      }
      await updateAndAlign();
    },
  };
};
