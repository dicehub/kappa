const flowSfc = (template: string, style = "") => `<script setup>
import { Flow } from "@dicehub/kappa/components/flow";
</script>

<template>
${template}
</template>${style ? `\n\n<style>\n${style}\n</style>` : ""}`;

export const barrelCode = `import { Flow } from "@dicehub/kappa";`;
export const granularCode = `import { Flow } from "@dicehub/kappa/components/flow";`;

export const previewCode =
  flowSfc(`  <Flow.Root aria-label="Deployment workflow">
    <Flow.Node>Draft</Flow.Node>
    <Flow.Parallel>
      <Flow.List>
        <Flow.Node>Review</Flow.Node>
        <Flow.Node>Approve</Flow.Node>
      </Flow.List>
      <Flow.Node>Automated checks</Flow.Node>
      <Flow.Node>Preview build</Flow.Node>
    </Flow.Parallel>
    <Flow.Node>Release</Flow.Node>
  </Flow.Root>`);

export const usageCode = flowSfc(`  <Flow.Root aria-label="Publishing workflow">
    <Flow.Node>Collect</Flow.Node>
    <Flow.Node>Validate</Flow.Node>
    <Flow.Node>Publish</Flow.Node>
  </Flow.Root>`);

export const compositionCode = `<Flow.Root>
  <Flow.Node />
  <Flow.Parallel>
    <Flow.List>
      <Flow.Node />
      <Flow.Node />
    </Flow.List>
    <Flow.Node />
  </Flow.Parallel>
  <Flow.Node />
</Flow.Root>`;

const parallelCode = flowSfc(`  <Flow.Root aria-label="Parallel workflow">
    <Flow.Node>Start</Flow.Node>
    <Flow.Parallel>
      <Flow.List>
        <Flow.Node>Branch A1</Flow.Node>
        <Flow.Node>Branch A2</Flow.Node>
      </Flow.List>
      <Flow.Node>Branch B</Flow.Node>
      <Flow.Node>Branch C</Flow.Node>
    </Flow.Parallel>
    <Flow.Node>End</Flow.Node>
  </Flow.Root>`);

const splineCode =
  flowSfc(`  <Flow.Root connector="spline" aria-label="Content processing workflow">
    <Flow.Node>Upload</Flow.Node>
    <Flow.Parallel>
      <Flow.Node>Scan</Flow.Node>
      <Flow.Node>Extract</Flow.Node>
      <Flow.Node>Preview</Flow.Node>
    </Flow.Parallel>
    <Flow.Node>Ready</Flow.Node>
  </Flow.Root>`);

const verticalCode =
  flowSfc(`  <Flow.Root orientation="vertical" align="center" aria-label="Vertical workflow">
    <Flow.Node>Collect</Flow.Node>
    <Flow.Node>Validate</Flow.Node>
    <Flow.Node>Publish</Flow.Node>
  </Flow.Root>`);

const verticalParallelCode =
  flowSfc(`  <Flow.Root orientation="vertical" align="center">
    <Flow.Node>Start</Flow.Node>
    <Flow.Parallel>
      <Flow.Node>Branch A</Flow.Node>
      <Flow.Node>Branch B</Flow.Node>
      <Flow.Node>Branch C</Flow.Node>
    </Flow.Parallel>
    <Flow.Node>End</Flow.Node>
  </Flow.Root>`);

const customCode = flowSfc(
  `  <Flow.Root aria-label="Custom node workflow">
    <Flow.Node unstyled class="custom-dot" aria-label="Input" />
    <Flow.Node unstyled class="custom-node">Transform worker</Flow.Node>
  </Flow.Root>`,
  `.custom-dot {
  width: 1rem;
  height: 1rem;
  border-radius: 999px;
  background: var(--kappa-line);
}

.custom-node {
  padding: 0.5rem 0.75rem;
  border-radius: var(--kappa-radius-md);
  background: var(--kappa-emphasis);
  color: var(--kappa-accent-contrast);
  font-weight: 600;
}`,
);

const centeredCode =
  flowSfc(`  <Flow.Root align="center" aria-label="Centered workflow">
    <Flow.Node
      unstyled
      aria-label="Input"
      style="width: 1rem; height: 1rem; border-radius: 999px; background: var(--kappa-line);"
    />
    <Flow.Node>Transform worker</Flow.Node>
    <Flow.Node style="padding-block: 1.25rem; text-align: center;">
      Long-running<br />verification
    </Flow.Node>
  </Flow.Root>`);

const complexCode = flowSfc(`  <Flow.Root aria-label="Request workflow">
    <Flow.Parallel>
      <Flow.Node>HTTP trigger</Flow.Node>
      <Flow.Node>Schedule trigger</Flow.Node>
    </Flow.Parallel>
    <Flow.Node>Process request</Flow.Node>
    <Flow.Parallel>
      <Flow.Node>Write analytics</Flow.Node>
      <Flow.Node>Update cache</Flow.Node>
      <Flow.Node>Send notification</Flow.Node>
    </Flow.Parallel>
    <Flow.Node>Complete</Flow.Node>
  </Flow.Root>`);

const anchorCode = flowSfc(
  `  <Flow.Root aria-label="Service binding workflow">
    <Flow.Node>Load balancer</Flow.Node>
    <Flow.Node unstyled class="service-card">
      <Flow.Anchor type="end" class="service-card__header">
        Transform worker
      </Flow.Anchor>
      <Flow.Anchor type="start" class="service-card__binding">
        Bindings <span>2</span>
      </Flow.Anchor>
    </Flow.Node>
    <Flow.Parallel>
      <Flow.Node>Database</Flow.Node>
      <Flow.Node>Object store</Flow.Node>
    </Flow.Parallel>
  </Flow.Root>`,
  `.service-card {
  min-width: 10rem;
  overflow: hidden;
  border: 1px solid var(--kappa-line);
  border-radius: var(--kappa-radius-lg);
  background: var(--kappa-tint);
}

.service-card__header {
  display: flex;
  min-height: 2.5rem;
  align-items: center;
  padding-inline: 0.625rem;
}

.service-card__binding {
  display: flex;
  justify-content: space-between;
  margin: 0 0.375rem 0.375rem;
  padding: 0.375rem 0.5rem;
  border: 1px solid var(--kappa-line);
  border-radius: var(--kappa-radius-md);
  background: var(--kappa-control);
}`,
);

const panningCode = flowSfc(
  `  <Flow.Root class="large-flow" aria-label="Large workflow">
    <Flow.Node>Start</Flow.Node>
    <Flow.Node>Authenticate</Flow.Node>
    <Flow.Node>Validate</Flow.Node>
    <Flow.Node>Transform</Flow.Node>
    <Flow.Node>Process</Flow.Node>
    <Flow.Node>Store</Flow.Node>
    <Flow.Node>Notify</Flow.Node>
    <Flow.Node>Log</Flow.Node>
    <Flow.Node>Complete</Flow.Node>
    <Flow.Node>End</Flow.Node>
  </Flow.Root>`,
  `.large-flow {
  min-height: 13rem;
  border: 1px solid var(--kappa-line);
  border-radius: var(--kappa-radius-lg);
}`,
);

const disabledCode =
  flowSfc(`  <Flow.Root aria-label="Workflow with inactive branch">
    <Flow.Node>Request</Flow.Node>
    <Flow.Parallel>
      <Flow.Node>Primary handler</Flow.Node>
      <Flow.Node disabled>Backup handler</Flow.Node>
    </Flow.Parallel>
    <Flow.Node>Response</Flow.Node>
  </Flow.Root>`);

const parallelAlignCode =
  flowSfc(`  <Flow.Root aria-label="End-aligned parallel workflow">
    <Flow.Node>Start</Flow.Node>
    <Flow.Parallel align="end">
      <Flow.Node>Short</Flow.Node>
      <Flow.Node>Medium length</Flow.Node>
      <Flow.Node>Very long node name</Flow.Node>
    </Flow.Parallel>
    <Flow.Node>End</Flow.Node>
  </Flow.Root>`);

const nestedCode = flowSfc(`  <Flow.Root aria-label="Nested branch workflow">
    <Flow.Parallel>
      <Flow.List>
        <Flow.Node>Client users</Flow.Node>
        <Flow.Node>Engineering access</Flow.Node>
      </Flow.List>
      <Flow.List>
        <Flow.Parallel>
          <Flow.Node>Authenticated users</Flow.Node>
          <Flow.Node>Client users</Flow.Node>
          <Flow.Node>Site users</Flow.Node>
        </Flow.Parallel>
        <Flow.Node>Contractor access</Flow.Node>
      </Flow.List>
    </Flow.Parallel>
    <Flow.Node>Destinations</Flow.Node>
  </Flow.Root>`);

export const examples = [
  {
    id: "parallel-branches",
    title: "Parallel branches",
    variant: "parallel",
    description:
      "Group independent branches with Flow.Parallel. Use Flow.List for a multi-step branch.",
    code: parallelCode,
  },
  {
    id: "spline-connectors",
    title: "Spline connectors",
    variant: "spline",
    description:
      "Use spline connectors for smooth paths through parallel branches.",
    code: splineCode,
  },
  {
    id: "vertical-orientation",
    title: "Vertical orientation",
    variant: "vertical",
    description:
      "Set orientation to vertical and center the nodes for a straight top-to-bottom sequence.",
    code: verticalCode,
  },
  {
    id: "vertical-parallel",
    title: "Vertical parallel branches",
    variant: "vertical-parallel",
    description:
      "Parallel groups use columns in a vertical flow. Center alignment keeps the sequence balanced.",
    code: verticalParallelCode,
  },
  {
    id: "custom-node-styling",
    title: "Custom node styling",
    variant: "custom",
    description:
      "Set unstyled on a node when its shape and surface must come from consumer CSS.",
    code: customCode,
  },
  {
    id: "centered-alignment",
    title: "Centered alignment",
    variant: "centered",
    description:
      "Center nodes with different cross-axis dimensions in the same sequence.",
    code: centeredCode,
  },
  {
    id: "complex-flow",
    title: "Combined sequence and branches",
    variant: "complex",
    description:
      "Combine sequential and parallel groups to describe a larger process.",
    code: complexCode,
  },
  {
    id: "custom-anchor-points",
    title: "Custom anchor points",
    variant: "anchor",
    description:
      "Place incoming and outgoing connectors at meaningful positions inside a custom node.",
    code: anchorCode,
  },
  {
    id: "panning-large-diagrams",
    title: "Panning large diagrams",
    variant: "panning",
    description:
      "Drag the empty canvas or use the wheel when diagram content exceeds the viewport.",
    code: panningCode,
  },
  {
    id: "disabled-nodes",
    title: "Disabled nodes",
    variant: "disabled",
    description:
      "Disabled nodes and their connected paths show an inactive state.",
    code: disabledCode,
  },
  {
    id: "parallel-node-alignment",
    title: "Parallel node alignment",
    variant: "parallel-align",
    description:
      "Use end alignment to align parallel branches with different widths or heights.",
    code: parallelAlignCode,
  },
  {
    id: "nested-node-lists",
    title: "Nested node lists",
    variant: "nested",
    description:
      "Nest List and Parallel parts to model branches that contain their own sequence or split.",
    code: nestedCode,
  },
] as const;

export const rootProps = [
  {
    name: "align",
    type: '"start" | "center"',
    defaultValue: '"start"',
    description: "Cross-axis alignment of sequential nodes.",
  },
  {
    name: "orientation",
    type: '"horizontal" | "vertical"',
    defaultValue: '"horizontal"',
    description: "Direction in which sequential nodes advance.",
  },
  {
    name: "connector",
    type: '"orthogonal" | "spline"',
    defaultValue: '"orthogonal"',
    description: "Geometry used to draw connections between nodes.",
  },
  {
    name: "canvas",
    type: "boolean",
    defaultValue: "true",
    description: "Enables drag and wheel panning when content overflows.",
  },
  {
    name: "padding",
    type: "{ x?: number; y?: number }",
    defaultValue: "{ x: 16, y: 64 }",
    description: "Space around the measured diagram, in pixels.",
  },
  {
    name: "onOverflowChange",
    type: "(overflow: FlowOverflow) => void",
    defaultValue: "undefined",
    description: "Runs when horizontal or vertical overflow changes.",
  },
  {
    name: "default slot",
    type: "slot",
    defaultValue: "—",
    description: "Flow.Node, Flow.Parallel, or Flow.List children.",
  },
] as const;

export const nodeProps = [
  {
    name: "id",
    type: "string",
    defaultValue: "generated",
    description: "Stable DOM and connector identifier. Generated when omitted.",
  },
  {
    name: "disabled",
    type: "boolean",
    defaultValue: "false",
    description: "Marks the node and its connected paths as inactive.",
  },
  {
    name: "unstyled",
    type: "boolean",
    defaultValue: "false",
    description: "Removes Kappa's node surface styles.",
  },
  {
    name: "default slot",
    type: "slot",
    defaultValue: "—",
    description: "Node content.",
  },
] as const;

export const anchorProps = [
  {
    name: "type",
    type: '"start" | "end"',
    defaultValue: "both",
    description:
      "Selects an outgoing (start) or incoming (end) attachment point. Omit for both.",
  },
  {
    name: "default slot",
    type: "slot",
    defaultValue: "—",
    description: "Custom node region used as the attachment point.",
  },
] as const;

export const parallelProps = [
  {
    name: "align",
    type: '"start" | "end"',
    defaultValue: '"start"',
    description: "Cross-axis alignment of branches with different dimensions.",
  },
  {
    name: "default slot",
    type: "slot",
    defaultValue: "—",
    description: "Flow.Node or Flow.List branches.",
  },
] as const;

export const parts = [
  {
    name: "Flow.Root",
    element: "div",
    description: "Measures, lays out, connects, and pans the diagram.",
  },
  {
    name: "Flow.Node",
    element: "li",
    description: "One measured workflow node.",
  },
  {
    name: "Flow.Parallel",
    element: "li > ul",
    description: "A group of branches laid out in parallel.",
  },
  {
    name: "Flow.List",
    element: "li > ul",
    description: "A sequential branch nested in a parallel group.",
  },
  {
    name: "Flow.Anchor",
    element: "div",
    description: "A custom outgoing or incoming connector attachment point.",
  },
] as const;

export const exportsList = [
  {
    name: "Flow",
    description:
      "Compound root with Root, Node, Parallel, List, and Anchor parts.",
  },
  {
    name: "FlowRoot / FlowNode / FlowParallel / FlowList / FlowAnchor",
    description: "Named component exports.",
  },
  {
    name: "FlowRootProps / FlowNodeProps / FlowParallelProps / FlowListProps / FlowAnchorProps",
    description: "Public prop contracts.",
  },
  {
    name: "FlowAlign / FlowOrientation / FlowConnectorType / FlowParallelAlign / FlowAnchorType",
    description: "Supported layout values.",
  },
  {
    name: "FlowPadding / FlowOverflow",
    description: "Canvas padding and overflow value contracts.",
  },
  { name: "FLOW_DEFAULT_*", description: "Default layout constants." },
] as const;
