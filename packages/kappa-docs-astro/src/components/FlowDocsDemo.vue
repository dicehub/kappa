<script setup lang="ts">
import { Flow } from "@dicehub/kappa/components/flow";

type DemoVariant =
  | "preview"
  | "usage"
  | "parallel"
  | "spline"
  | "vertical"
  | "vertical-parallel"
  | "custom"
  | "centered"
  | "complex"
  | "anchor"
  | "panning"
  | "disabled"
  | "parallel-align"
  | "nested";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});
</script>

<template>
  <div class="flow-demo" :data-flow-demo="props.variant">
    <Flow.Root
      v-if="props.variant === 'preview'"
      aria-label="Deployment workflow"
    >
      <Flow.Node id="draft">Draft</Flow.Node>
      <Flow.Parallel>
        <Flow.List>
          <Flow.Node id="review">Review</Flow.Node>
          <Flow.Node id="approve">Approve</Flow.Node>
        </Flow.List>
        <Flow.Node id="checks">Automated checks</Flow.Node>
        <Flow.Node id="preview-build">Preview build</Flow.Node>
      </Flow.Parallel>
      <Flow.Node id="release">Release</Flow.Node>
    </Flow.Root>

    <Flow.Root
      v-else-if="props.variant === 'usage'"
      aria-label="Sequential workflow"
    >
      <Flow.Node>Collect</Flow.Node>
      <Flow.Node>Validate</Flow.Node>
      <Flow.Node>Publish</Flow.Node>
    </Flow.Root>

    <Flow.Root
      v-else-if="props.variant === 'parallel'"
      aria-label="Parallel workflow"
    >
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
    </Flow.Root>

    <Flow.Root
      v-else-if="props.variant === 'spline'"
      aria-label="Content processing workflow"
      connector="spline"
    >
      <Flow.Node>Upload</Flow.Node>
      <Flow.Parallel>
        <Flow.Node>Scan</Flow.Node>
        <Flow.Node>Extract</Flow.Node>
        <Flow.Node>Preview</Flow.Node>
      </Flow.Parallel>
      <Flow.Node>Ready</Flow.Node>
    </Flow.Root>

    <Flow.Root
      v-else-if="props.variant === 'vertical'"
      align="center"
      aria-label="Vertical workflow"
      orientation="vertical"
    >
      <Flow.Node>Collect</Flow.Node>
      <Flow.Node>Validate</Flow.Node>
      <Flow.Node>Publish</Flow.Node>
    </Flow.Root>

    <Flow.Root
      v-else-if="props.variant === 'vertical-parallel'"
      align="center"
      aria-label="Vertical parallel workflow"
      orientation="vertical"
    >
      <Flow.Node>Start</Flow.Node>
      <Flow.Parallel>
        <Flow.Node>Branch A</Flow.Node>
        <Flow.Node>Branch B</Flow.Node>
        <Flow.Node>Branch C</Flow.Node>
      </Flow.Parallel>
      <Flow.Node>End</Flow.Node>
    </Flow.Root>

    <Flow.Root
      v-else-if="props.variant === 'custom'"
      aria-label="Custom node workflow"
    >
      <Flow.Node unstyled class="flow-demo__dot" aria-label="Input" />
      <Flow.Node unstyled class="flow-demo__worker">Transform worker</Flow.Node>
    </Flow.Root>

    <Flow.Root
      v-else-if="props.variant === 'centered'"
      align="center"
      aria-label="Centered workflow"
    >
      <Flow.Node unstyled class="flow-demo__dot" aria-label="Input" />
      <Flow.Node>Transform worker</Flow.Node>
      <Flow.Node class="flow-demo__tall-node"
        >Long-running<br />verification</Flow.Node
      >
    </Flow.Root>

    <Flow.Root
      v-else-if="props.variant === 'complex'"
      aria-label="Request workflow"
    >
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
    </Flow.Root>

    <Flow.Root
      v-else-if="props.variant === 'anchor'"
      aria-label="Service binding workflow"
    >
      <Flow.Node>Load balancer</Flow.Node>
      <Flow.Node unstyled class="flow-demo__anchor-card">
        <Flow.Anchor type="end" class="flow-demo__anchor-header">
          Transform worker
        </Flow.Anchor>
        <Flow.Anchor type="start" class="flow-demo__anchor-binding">
          Bindings <span>2</span>
        </Flow.Anchor>
      </Flow.Node>
      <Flow.Parallel>
        <Flow.Node>Database</Flow.Node>
        <Flow.Node>Object store</Flow.Node>
      </Flow.Parallel>
    </Flow.Root>

    <Flow.Root
      v-else-if="props.variant === 'panning'"
      class="flow-demo__panning"
      aria-label="Large pannable workflow"
    >
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
    </Flow.Root>

    <Flow.Root
      v-else-if="props.variant === 'disabled'"
      aria-label="Workflow with inactive branch"
    >
      <Flow.Node>Request</Flow.Node>
      <Flow.Parallel>
        <Flow.Node>Primary handler</Flow.Node>
        <Flow.Node disabled>Backup handler</Flow.Node>
      </Flow.Parallel>
      <Flow.Node>Response</Flow.Node>
    </Flow.Root>

    <Flow.Root
      v-else-if="props.variant === 'parallel-align'"
      aria-label="End-aligned parallel workflow"
    >
      <Flow.Node>Start</Flow.Node>
      <Flow.Parallel align="end">
        <Flow.Node>Short</Flow.Node>
        <Flow.Node>Medium length</Flow.Node>
        <Flow.Node>Very long node name</Flow.Node>
      </Flow.Parallel>
      <Flow.Node>End</Flow.Node>
    </Flow.Root>

    <Flow.Root v-else aria-label="Nested branch workflow">
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
    </Flow.Root>
  </div>
</template>

<style scoped src="./FlowDocsDemo.css"></style>
