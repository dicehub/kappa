import type {
  FlowNodeMeasurements,
  FlowNodePositions,
  FlowOrientation,
  FlowTreeNode,
} from "./flow";

const isFlowItem = (element: Element): element is HTMLElement =>
  element instanceof HTMLElement && element.hasAttribute("data-flow-item");

const directItems = (container: Element | null | undefined) =>
  container ? Array.from(container.children).filter(isFlowItem) : [];

const flowNodeId = (item: HTMLElement) =>
  item.dataset.flowId || item.dataset.nodeId || "";

const treeFromItem = (item: HTMLElement): FlowTreeNode | null => {
  if (item.dataset.flowType === "node") {
    const id = flowNodeId(item);
    return id ? { kind: "node", id } : null;
  }

  if (item.dataset.flowType === "parallel") {
    const branchList = item.querySelector<HTMLElement>(
      ":scope > [data-flow-parallel-list]",
    );
    return {
      kind: "parallel",
      align: item.dataset.flowAlign === "end" ? "end" : undefined,
      children: directItems(branchList)
        .map(treeFromItem)
        .filter((node): node is FlowTreeNode => Boolean(node)),
    };
  }

  if (item.dataset.flowType === "list") {
    const list = item.querySelector<HTMLElement>(":scope > [data-flow-list]");
    return {
      kind: "list",
      children: directItems(list)
        .map(treeFromItem)
        .filter((node): node is FlowTreeNode => Boolean(node)),
    };
  }

  return null;
};

export const buildFlowTree = (content: HTMLElement): FlowTreeNode => ({
  kind: "list",
  children: directItems(
    content.querySelector<HTMLElement>(":scope > [data-flow-list]"),
  )
    .map(treeFromItem)
    .filter((node): node is FlowTreeNode => Boolean(node)),
});

const itemDisabled = (item: HTMLElement) =>
  item.dataset.flowDisabled === "true" ||
  Boolean(item.querySelector('[data-flow-disabled="true"]'));

const anchorOffset = (
  item: HTMLElement,
  type: "start" | "end",
  orientation: FlowOrientation,
) => {
  const anchor = item.querySelector<HTMLElement>(
    `[data-flow-anchor~="${type}"]`,
  );
  if (!anchor) return undefined;

  const anchorRect = anchor.getBoundingClientRect();
  const itemRect = item.getBoundingClientRect();
  return orientation === "vertical"
    ? anchorRect.left - itemRect.left + anchorRect.width / 2
    : anchorRect.top - itemRect.top + anchorRect.height / 2;
};

export const collectFlowNodeMeasurements = (
  content: HTMLElement,
  orientation: FlowOrientation,
): FlowNodeMeasurements => {
  const nodes: FlowNodeMeasurements = {};
  const elements = content.querySelectorAll<HTMLElement>(
    '[data-flow-type="node"]',
  );

  for (const element of elements) {
    const id = flowNodeId(element);
    if (!id) continue;
    const rect = element.getBoundingClientRect();
    nodes[id] = {
      width: rect.width,
      height: rect.height,
      disabled: itemDisabled(element),
      startAnchorOffset: anchorOffset(element, "start", orientation),
      endAnchorOffset: anchorOffset(element, "end", orientation),
    };
  }

  return nodes;
};

export const applyFlowNodePositions = (
  content: HTMLElement,
  positions: FlowNodePositions,
) => {
  const elements = content.querySelectorAll<HTMLElement>(
    '[data-flow-type="node"]',
  );

  for (const element of elements) {
    const position = positions[flowNodeId(element)];
    if (!position) {
      element.removeAttribute("data-flow-positioned");
      continue;
    }
    element.style.left = `${position.x}px`;
    element.style.top = `${position.y}px`;
    element.setAttribute("data-flow-positioned", "true");
  }
};
