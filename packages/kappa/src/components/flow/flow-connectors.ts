import {
  computeEdges,
  createRoundedPath,
  createSplinePath,
  FLOW_DEFAULT_CONNECTOR,
  type FlowConnector,
  type FlowConnectorType,
  type FlowNodePositions,
  type FlowState,
} from "./flow";

export const createFlowConnectors = (
  flowState: FlowState,
  positions: FlowNodePositions,
  connector: FlowConnectorType = FLOW_DEFAULT_CONNECTOR,
): FlowConnector[] =>
  computeEdges(flowState)
    .map(([fromId, toId]): FlowConnector | null => {
      const fromPosition = positions[fromId];
      const toPosition = positions[toId];
      const fromNode = flowState.nodes[fromId];
      const toNode = flowState.nodes[toId];
      if (!fromPosition || !toPosition || !fromNode || !toNode) return null;

      const points =
        flowState.orientation === "vertical"
          ? {
              x1:
                fromPosition.x +
                (fromNode.startAnchorOffset ?? fromNode.width / 2),
              y1: fromPosition.y + fromNode.height,
              x2: toPosition.x + (toNode.endAnchorOffset ?? toNode.width / 2),
              y2: toPosition.y,
            }
          : {
              x1: fromPosition.x + fromNode.width,
              y1:
                fromPosition.y +
                (fromNode.startAnchorOffset ?? fromNode.height / 2),
              x2: toPosition.x,
              y2: toPosition.y + (toNode.endAnchorOffset ?? toNode.height / 2),
            };

      return {
        ...points,
        disabled: fromNode.disabled || toNode.disabled,
        fromId,
        toId,
        single: true,
        path:
          connector === "spline"
            ? createSplinePath(points, { orientation: flowState.orientation })
            : createRoundedPath(points, {
                orientation: flowState.orientation,
                single: true,
              }),
      };
    })
    .filter((item): item is FlowConnector => Boolean(item))
    .sort((a, b) => Number(Boolean(b.disabled)) - Number(Boolean(a.disabled)));
