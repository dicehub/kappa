import type { HTMLAttributes, LiHTMLAttributes, VNodeChild } from "vue";

export const FLOW_ALIGNS = ["start", "center"] as const;
export const FLOW_ORIENTATIONS = ["horizontal", "vertical"] as const;
export const FLOW_PARALLEL_ALIGNS = ["start", "end"] as const;
export const FLOW_ANCHOR_TYPES = ["start", "end"] as const;
export const FLOW_CONNECTOR_TYPES = ["orthogonal", "spline"] as const;

export type FlowAlign = (typeof FLOW_ALIGNS)[number];
export type FlowOrientation = (typeof FLOW_ORIENTATIONS)[number];
export type FlowParallelAlign = (typeof FLOW_PARALLEL_ALIGNS)[number];
export type FlowAnchorType = (typeof FLOW_ANCHOR_TYPES)[number];
export type FlowConnectorType = (typeof FLOW_CONNECTOR_TYPES)[number];

export interface FlowPadding {
  x?: number;
  y?: number;
}

export interface FlowOverflow {
  x: boolean;
  y: boolean;
}

export interface FlowRootProps extends /* @vue-ignore */ HTMLAttributes {
  /** Cross-axis alignment of nodes in the active orientation. */
  align?: FlowAlign;
  /** Enables drag and wheel panning when the diagram overflows. */
  canvas?: boolean;
  /** Geometry used to draw connections between nodes. */
  connector?: FlowConnectorType;
  /** Called when horizontal or vertical overflow changes. */
  onOverflowChange?: (overflow: FlowOverflow) => void;
  /** Direction in which sequential nodes advance. */
  orientation?: FlowOrientation;
  /** Space around the measured diagram, in pixels. */
  padding?: FlowPadding;
}

export type FlowProps = FlowRootProps;

export interface FlowNodeProps extends /* @vue-ignore */ LiHTMLAttributes {
  /** Marks the node and its connectors as inactive. */
  disabled?: boolean;
  /** Stable identifier used by connector data attributes. */
  id?: string;
  /** Removes Kappa's node surface styles. */
  unstyled?: boolean;
}

export interface FlowAnchorProps extends /* @vue-ignore */ HTMLAttributes {
  /** Outgoing (`start`) or incoming (`end`) connector attachment point. Omit for both. */
  type?: FlowAnchorType;
}

export interface FlowParallelProps extends /* @vue-ignore */ LiHTMLAttributes {
  /** Cross-axis alignment of branches with different dimensions. */
  align?: FlowParallelAlign;
}

export type FlowListProps = LiHTMLAttributes;

export interface FlowSlots {
  default?: () => VNodeChild;
}

export type FlowRootSlots = FlowSlots;
export type FlowNodeSlots = FlowSlots;
export type FlowAnchorSlots = FlowSlots;
export type FlowParallelSlots = FlowSlots;
export type FlowListSlots = FlowSlots;

export interface FlowConnector {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  disabled?: boolean;
  single?: boolean;
  isBottom?: boolean;
  fromId?: string;
  toId?: string;
  path: string;
}

export type FlowTreeNode =
  | { kind: "list"; children: FlowTreeNode[] }
  | { kind: "parallel"; children: FlowTreeNode[]; align?: "end" }
  | { kind: "node"; id: string };

export type FlowNodeMeasurements = Record<
  string,
  {
    width: number;
    height: number;
    disabled?: boolean;
    startAnchorOffset?: number;
    endAnchorOffset?: number;
  }
>;

export interface FlowState {
  nodes: FlowNodeMeasurements;
  tree: FlowTreeNode;
  align: FlowAlign;
  orientation: FlowOrientation;
}

export type FlowEdges = [string, string][];
export type FlowNodePositions = Record<string, { x: number; y: number }>;
export type FlowDiagramRect = { width: number; height: number };

export const FLOW_DEFAULT_ALIGN = "start" satisfies FlowAlign;
export const FLOW_DEFAULT_CONNECTOR = "orthogonal" satisfies FlowConnectorType;
export const FLOW_DEFAULT_ORIENTATION = "horizontal" satisfies FlowOrientation;
export const FLOW_DEFAULT_PADDING = {
  x: 16,
  y: 64,
} as const satisfies Required<FlowPadding>;

const FLAT_THRESHOLD = 2;

export const createRoundedPath = (
  { x1, y1, x2, y2 }: Pick<FlowConnector, "x1" | "y1" | "x2" | "y2">,
  {
    cornerRadius: maxCornerRadius = 8,
    midOffset = 32,
    arrowheadOffset = 8,
    isBottom = false,
    single = false,
    orientation = FLOW_DEFAULT_ORIENTATION,
  }: {
    cornerRadius?: number;
    midOffset?: number;
    arrowheadOffset?: number;
    isBottom?: boolean;
    single?: boolean;
    orientation?: FlowOrientation;
  } = {},
) => {
  const cornerRadius = Math.min(
    maxCornerRadius,
    Math.abs(orientation === "horizontal" ? (y2 - y1) / 2 : (x2 - x1) / 2),
  );

  if (orientation === "horizontal") {
    if (Math.abs(y2 - y1) <= FLAT_THRESHOLD) {
      return `M ${x1} ${y1} L ${x2 - arrowheadOffset} ${y2}`;
    }

    const verticalX = single || isBottom ? x2 - midOffset : x1 + midOffset;
    const horizontalSign = x2 > x1 ? 1 : -1;
    const verticalSign = y2 > y1 ? 1 : -1;
    const firstHorizontalEnd = verticalX - horizontalSign * cornerRadius;
    const verticalStart = y1 + verticalSign * cornerRadius;
    const verticalEnd = y2 - verticalSign * cornerRadius;
    const secondHorizontalStart = verticalX + horizontalSign * cornerRadius;
    const pathEndX = x2 - horizontalSign * arrowheadOffset;

    const bottomCurveCommands = [
      `L ${firstHorizontalEnd} ${y1}`,
      `Q ${verticalX} ${y1} ${verticalX} ${verticalStart}`,
      single
        ? `L ${verticalX} ${verticalEnd} Q ${verticalX} ${y2} ${secondHorizontalStart} ${y2}`
        : `L ${verticalX} ${y2}`,
    ];
    const topCurveCommands = [
      single
        ? `L ${firstHorizontalEnd} ${y1} Q ${verticalX} ${y1} ${verticalX} ${verticalStart}`
        : `L ${verticalX} ${y1}`,
      `L ${verticalX} ${verticalEnd}`,
      `Q ${verticalX} ${y2} ${secondHorizontalStart} ${y2}`,
    ];

    return [
      `M ${x1} ${y1}`,
      ...(isBottom ? bottomCurveCommands : topCurveCommands),
      `L ${pathEndX} ${y2}`,
    ].join(" ");
  }

  if (Math.abs(x2 - x1) <= FLAT_THRESHOLD) {
    return `M ${x1} ${y1} L ${x2} ${y2 - arrowheadOffset}`;
  }

  const horizontalY = single || isBottom ? y2 - midOffset : y1 + midOffset;
  const horizontalSign = x2 > x1 ? 1 : -1;
  const verticalSign = y2 > y1 ? 1 : -1;
  const firstVerticalEnd = horizontalY - verticalSign * cornerRadius;
  const horizontalStart = x1 + horizontalSign * cornerRadius;
  const horizontalEnd = x2 - horizontalSign * cornerRadius;
  const secondVerticalStart = horizontalY + verticalSign * cornerRadius;
  const pathEndY = y2 - verticalSign * arrowheadOffset;

  const bottomCurveCommands = [
    `L ${x1} ${firstVerticalEnd}`,
    `Q ${x1} ${horizontalY} ${horizontalStart} ${horizontalY}`,
    single
      ? `L ${horizontalEnd} ${horizontalY} Q ${x2} ${horizontalY} ${x2} ${secondVerticalStart}`
      : `L ${x2} ${horizontalY}`,
  ];
  const topCurveCommands = [
    single
      ? `L ${x1} ${firstVerticalEnd} Q ${x1} ${horizontalY} ${horizontalStart} ${horizontalY}`
      : `L ${x1} ${horizontalY}`,
    `L ${horizontalEnd} ${horizontalY}`,
    `Q ${x2} ${horizontalY} ${x2} ${secondVerticalStart}`,
  ];

  return [
    `M ${x1} ${y1}`,
    ...(isBottom ? bottomCurveCommands : topCurveCommands),
    `L ${x2} ${pathEndY}`,
  ].join(" ");
};

export const createSplinePath = (
  { x1, y1, x2, y2 }: Pick<FlowConnector, "x1" | "y1" | "x2" | "y2">,
  {
    arrowheadOffset = 8,
    orientation = FLOW_DEFAULT_ORIENTATION,
  }: {
    arrowheadOffset?: number;
    orientation?: FlowOrientation;
  } = {},
) => {
  if (orientation === "horizontal") {
    const direction = Math.sign(x2 - x1) || 1;
    const endX = x2 - direction * Math.min(arrowheadOffset, Math.abs(x2 - x1));
    const handle = Math.abs(endX - x1) / 2;
    return `M ${x1} ${y1} C ${x1 + direction * handle} ${y1} ${endX - direction * handle} ${y2} ${endX} ${y2}`;
  }

  const direction = Math.sign(y2 - y1) || 1;
  const endY = y2 - direction * Math.min(arrowheadOffset, Math.abs(y2 - y1));
  const handle = Math.abs(endY - y1) / 2;
  return `M ${x1} ${y1} C ${x1} ${y1 + direction * handle} ${x2} ${endY - direction * handle} ${x2} ${endY}`;
};

const entryIds = (node: FlowTreeNode): string[] => {
  if (node.kind === "node") return [node.id];
  if (node.kind === "parallel") return node.children.flatMap(entryIds);
  return node.children.length > 0 ? entryIds(node.children[0]) : [];
};

const exitIds = (node: FlowTreeNode): string[] => {
  if (node.kind === "node") return [node.id];
  if (node.kind === "parallel") return node.children.flatMap(exitIds);
  return node.children.length > 0
    ? exitIds(node.children[node.children.length - 1])
    : [];
};

const collectEdges = (node: FlowTreeNode, edges: FlowEdges) => {
  if (node.kind === "node") return;

  if (node.kind === "parallel") {
    for (const child of node.children) collectEdges(child, edges);
    return;
  }

  for (const child of node.children) collectEdges(child, edges);

  for (let index = 0; index < node.children.length - 1; index += 1) {
    const current = node.children[index];
    const next = node.children[index + 1];
    if (current.kind === "parallel" && next.kind === "parallel") continue;

    for (const from of exitIds(current)) {
      for (const to of entryIds(next)) edges.push([from, to]);
    }
  }
};

export const computeEdges = (flowState: FlowState): FlowEdges => {
  const edges: FlowEdges = [];
  collectEdges(flowState.tree, edges);
  return edges;
};

export const computePositions = (
  flowState: FlowState,
  { columnGap = 64, rowGap = 16 } = {},
): FlowNodePositions => {
  const positions: FlowNodePositions = {};
  const { align, orientation } = flowState;

  const layout = (
    node: FlowTreeNode,
    originX: number,
    originY: number,
    output: FlowNodePositions,
  ): FlowDiagramRect => {
    if (node.kind === "node") {
      const measured = flowState.nodes[node.id];
      const width = measured?.width ?? 0;
      const height = measured?.height ?? 0;
      output[node.id] = { x: originX, y: originY };
      return { width, height };
    }

    if (node.kind === "list") {
      if (orientation === "vertical") {
        if (align === "center") {
          const sizes = node.children.map((child) => layout(child, 0, 0, {}));
          const columnWidth = sizes.reduce(
            (max, size) => Math.max(max, size.width),
            0,
          );
          let cursorY = originY;

          for (let index = 0; index < node.children.length; index += 1) {
            const childX = originX + (columnWidth - sizes[index].width) / 2;
            layout(node.children[index], childX, cursorY, output);
            cursorY += sizes[index].height;
            if (index < node.children.length - 1) cursorY += columnGap;
          }

          return { width: columnWidth, height: cursorY - originY };
        }

        let cursorY = originY;
        let totalWidth = 0;
        for (let index = 0; index < node.children.length; index += 1) {
          const { width, height } = layout(
            node.children[index],
            originX,
            cursorY,
            output,
          );
          cursorY += height;
          if (index < node.children.length - 1) cursorY += columnGap;
          totalWidth = Math.max(totalWidth, width);
        }
        return { width: totalWidth, height: cursorY - originY };
      }

      if (align === "center") {
        const sizes = node.children.map((child) => layout(child, 0, 0, {}));
        const rowHeight = sizes.reduce(
          (max, size) => Math.max(max, size.height),
          0,
        );
        let cursorX = originX;

        for (let index = 0; index < node.children.length; index += 1) {
          const childY = originY + (rowHeight - sizes[index].height) / 2;
          layout(node.children[index], cursorX, childY, output);
          cursorX += sizes[index].width;
          if (index < node.children.length - 1) cursorX += columnGap;
        }

        return { width: cursorX - originX, height: rowHeight };
      }

      let cursorX = originX;
      let totalHeight = 0;
      for (let index = 0; index < node.children.length; index += 1) {
        const { width, height } = layout(
          node.children[index],
          cursorX,
          originY,
          output,
        );
        cursorX += width;
        if (index < node.children.length - 1) cursorX += columnGap;
        totalHeight = Math.max(totalHeight, height);
      }
      return { width: cursorX - originX, height: totalHeight };
    }

    if (orientation === "vertical") {
      if (node.align === "end") {
        const sizes = node.children.map((child) => layout(child, 0, 0, {}));
        const maxHeight = sizes.reduce(
          (max, size) => Math.max(max, size.height),
          0,
        );
        let cursorX = originX;
        for (let index = 0; index < node.children.length; index += 1) {
          const childY = originY + maxHeight - sizes[index].height;
          layout(node.children[index], cursorX, childY, output);
          cursorX += sizes[index].width;
          if (index < node.children.length - 1) cursorX += rowGap;
        }
        return { width: cursorX - originX, height: maxHeight };
      }

      let cursorX = originX;
      let maxHeight = 0;
      for (let index = 0; index < node.children.length; index += 1) {
        const { width, height } = layout(
          node.children[index],
          cursorX,
          originY,
          output,
        );
        maxHeight = Math.max(maxHeight, height);
        cursorX += width;
        if (index < node.children.length - 1) cursorX += rowGap;
      }
      return { width: cursorX - originX, height: maxHeight };
    }

    if (node.align === "end") {
      const sizes = node.children.map((child) => layout(child, 0, 0, {}));
      const maxWidth = sizes.reduce(
        (max, size) => Math.max(max, size.width),
        0,
      );
      let cursorY = originY;
      for (let index = 0; index < node.children.length; index += 1) {
        const childX = originX + maxWidth - sizes[index].width;
        layout(node.children[index], childX, cursorY, output);
        cursorY += sizes[index].height;
        if (index < node.children.length - 1) cursorY += rowGap;
      }
      return { width: maxWidth, height: cursorY - originY };
    }

    let cursorY = originY;
    let maxWidth = 0;
    for (let index = 0; index < node.children.length; index += 1) {
      const { width, height } = layout(
        node.children[index],
        originX,
        cursorY,
        output,
      );
      maxWidth = Math.max(maxWidth, width);
      cursorY += height;
      if (index < node.children.length - 1) cursorY += rowGap;
    }
    return { width: maxWidth, height: cursorY - originY };
  };

  layout(flowState.tree, 0, 0, positions);
  return positions;
};

export const computeDiagramRect = (
  positions: FlowNodePositions,
  flowState: FlowState,
): FlowDiagramRect => {
  let width = 0;
  let height = 0;

  for (const [id, position] of Object.entries(positions)) {
    const node = flowState.nodes[id];
    if (!node) continue;
    width = Math.max(width, position.x + node.width);
    height = Math.max(height, position.y + node.height);
  }

  return { width, height };
};
