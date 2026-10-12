<script setup lang="ts">
import { ExpandableText } from "@dicehub/kappa/components/expandable-text";
import { Flow } from "@dicehub/kappa/components/flow";
import { Tooltip } from "@dicehub/kappa/components/tooltip";
</script>

<template>
  <main>
    <h1>Default settings consumer</h1>
    <section aria-label="Expandable note" style="width: 240px">
      <ExpandableText>
        <p>First line.<br />Second line.<br />Third line.<br />Fourth line.<br />Fifth line.</p>
      </ExpandableText>
    </section>
    <Flow.Root aria-label="Default workflow" style="width: 500px">
      <Flow.Node id="collect">Collect</Flow.Node>
      <Flow.Parallel>
        <Flow.Node id="validate">Validate</Flow.Node>
        <Flow.Node id="review">Review<br />and approve</Flow.Node>
      </Flow.Parallel>
      <Flow.Node id="publish">Publish</Flow.Node>
    </Flow.Root>
    <Tooltip.Root>
      <Tooltip.Trigger style="position: fixed; left: 1px; top: 400px">Edge help</Tooltip.Trigger>
      <Tooltip.Content :show-arrow="false">Help content stays inside the viewport.</Tooltip.Content>
    </Tooltip.Root>
  </main>
</template>
