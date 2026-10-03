import FlowRoot from "./Flow.vue";
import FlowAnchor from "./FlowAnchor.vue";
import FlowList from "./FlowList.vue";
import FlowNode from "./FlowNode.vue";
import FlowParallel from "./FlowParallel.vue";

export const Flow = Object.assign(FlowRoot, {
  Root: FlowRoot,
  Node: FlowNode,
  Anchor: FlowAnchor,
  Parallel: FlowParallel,
  List: FlowList,
});

export { FlowAnchor, FlowList, FlowNode, FlowParallel, FlowRoot };

export {
  FLOW_ALIGNS,
  FLOW_ANCHOR_TYPES,
  FLOW_DEFAULT_ALIGN,
  FLOW_DEFAULT_CONNECTOR,
  FLOW_DEFAULT_ORIENTATION,
  FLOW_DEFAULT_PADDING,
  FLOW_CONNECTOR_TYPES,
  FLOW_ORIENTATIONS,
  FLOW_PARALLEL_ALIGNS,
  createRoundedPath,
  createSplinePath,
  type FlowAlign,
  type FlowAnchorProps,
  type FlowAnchorSlots,
  type FlowAnchorType,
  type FlowConnector,
  type FlowConnectorType,
  type FlowListProps,
  type FlowListSlots,
  type FlowNodeProps,
  type FlowNodeSlots,
  type FlowOrientation,
  type FlowOverflow,
  type FlowPadding,
  type FlowParallelAlign,
  type FlowParallelProps,
  type FlowParallelSlots,
  type FlowProps,
  type FlowRootProps,
  type FlowRootSlots,
  type FlowSlots,
} from "./flow";

export { createFlowConnectors } from "./flow-connectors";
