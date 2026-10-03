<script setup lang="ts">
import { Button } from "@dicehub/kappa/components/button";
import { Kbd, KbdGroup } from "@dicehub/kappa/components/kbd";
import { Tooltip } from "@dicehub/kappa/components/tooltip";

type DemoVariant =
  | "preview"
  | "usage"
  | "group"
  | "button"
  | "tooltip"
  | "inline"
  | "rtl";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});
</script>

<template>
  <div class="kbd-demo" :data-kbd-demo="props.variant">
    <div v-if="props.variant === 'preview'" class="kbd-demo__row">
      <Kbd><span aria-hidden="true">⌘</span><span class="docs-visually-hidden">Command</span></Kbd>
      <Kbd><span aria-hidden="true">⇧</span><span class="docs-visually-hidden">Shift</span></Kbd>
      <Kbd><span aria-hidden="true">⌥</span><span class="docs-visually-hidden">Option</span></Kbd>
      <Kbd><span aria-hidden="true">⌃</span><span class="docs-visually-hidden">Control</span></Kbd>
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <span>+</span>
        <Kbd>B</Kbd>
      </KbdGroup>
    </div>

    <Kbd v-else-if="props.variant === 'usage'">Enter</Kbd>

    <p v-else-if="props.variant === 'group'" class="kbd-demo__sentence">
      Open search with
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <span>+</span>
        <Kbd>K</Kbd>
      </KbdGroup>
    </p>

    <Button v-else-if="props.variant === 'button'" variant="outline">
      Accept
      <Kbd>Enter</Kbd>
    </Button>

    <Tooltip.Root
      v-else-if="props.variant === 'tooltip'"
      id="kbd-demo-tooltip"
      :open-delay="0"
    >
      <Tooltip.Trigger as-child>
        <Button variant="outline">Save changes</Button>
      </Tooltip.Trigger>
      <Tooltip.Content>
        <span class="kbd-demo__tooltip-content">
          Save changes
          <KbdGroup>
            <Kbd>Ctrl</Kbd>
            <span>+</span>
            <Kbd>S</Kbd>
          </KbdGroup>
        </span>
      </Tooltip.Content>
    </Tooltip.Root>

    <p v-else-if="props.variant === 'inline'" class="kbd-demo__sentence">
      Press <Kbd>Esc</Kbd> to close the panel, or use
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <span>+</span>
        <Kbd>Enter</Kbd>
      </KbdGroup>
      to open the result in a new tab.
    </p>

    <p v-else class="kbd-demo__sentence kbd-demo__rtl" dir="rtl" lang="ar">
      اضغط
      <KbdGroup dir="ltr">
        <Kbd>Ctrl</Kbd>
        <span>+</span>
        <Kbd>K</Kbd>
      </KbdGroup>
      لفتح البحث
    </p>
  </div>
</template>

<style scoped>
.kbd-demo {
  display: flex;
  inline-size: 100%;
  min-inline-size: 0;
  align-items: center;
  justify-content: center;
  color: var(--kappa-default, #17191f);
  font-family: var(--kappa-font-sans, inherit);
}

.kbd-demo__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
}

.kbd-demo__sentence {
  max-inline-size: 34rem;
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.9;
  text-align: center;
}

.kbd-demo__tooltip-content {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
}

.kbd-demo__rtl {
  text-align: start;
}
</style>
