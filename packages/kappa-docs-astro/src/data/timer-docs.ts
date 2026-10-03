export const barrelCode = `import {
  Timer,
  TimerActionTrigger,
  TimerArea,
  TimerItem,
  TimerRoot,
} from "@dicehub/kappa";`;

export const granularCode = `import {
  Timer,
  TimerActionTrigger,
  TimerArea,
  TimerItem,
  TimerRoot,
} from "@dicehub/kappa/components/timer";`;

export const previewCode = `<script setup>
import { Timer } from "@dicehub/kappa/components/timer";
</script>

<template>
  <Timer.Root auto-start countdown :start-ms="65_000" :target-ms="0">
    <Timer.Area>
      <Timer.Item type="minutes" />
      <Timer.Separator />
      <Timer.Item type="seconds" />
    </Timer.Area>
    <Timer.Control>
      <Timer.ActionTrigger action="pause">Pause</Timer.ActionTrigger>
      <Timer.ActionTrigger action="resume">Resume</Timer.ActionTrigger>
      <Timer.ActionTrigger action="restart">Restart</Timer.ActionTrigger>
    </Timer.Control>
  </Timer.Root>
</template>`;

export const elapsedCode = `<script setup>
import { Timer } from "@dicehub/kappa/components/timer";
</script>

<template>
  <Timer.Root :target-ms="3_600_000">
    <Timer.Area>
      <Timer.Item type="hours" />
      <Timer.Separator />
      <Timer.Item type="minutes" />
      <Timer.Separator />
      <Timer.Item type="seconds" />
    </Timer.Area>
    <Timer.Control>
      <Timer.ActionTrigger action="start">Start</Timer.ActionTrigger>
      <Timer.ActionTrigger action="pause">Pause</Timer.ActionTrigger>
      <Timer.ActionTrigger action="resume">Resume</Timer.ActionTrigger>
      <Timer.ActionTrigger action="reset">Reset</Timer.ActionTrigger>
    </Timer.Control>
  </Timer.Root>
</template>`;

export const countdownCode = `<script setup>
import { Timer } from "@dicehub/kappa/components/timer";
import { ref } from "vue";

const complete = ref(false);
</script>

<template>
  <Timer.Root
    countdown
    :start-ms="15_000"
    :target-ms="0"
    @complete="complete = true"
  >
    <Timer.Area>
      <Timer.Item type="minutes" />
      <Timer.Separator />
      <Timer.Item type="seconds" />
    </Timer.Area>
    <Timer.Control>
      <Timer.ActionTrigger action="start">Start</Timer.ActionTrigger>
      <Timer.ActionTrigger action="pause">Pause</Timer.ActionTrigger>
      <Timer.ActionTrigger action="resume">Resume</Timer.ActionTrigger>
      <Timer.ActionTrigger action="restart">Restart</Timer.ActionTrigger>
      <Timer.ActionTrigger action="reset">Reset</Timer.ActionTrigger>
    </Timer.Control>
    <output aria-live="polite">{{ complete ? "Countdown complete" : "Ready" }}</output>
  </Timer.Root>
</template>`;

export const precisionCode = `<script setup>
import { Timer } from "@dicehub/kappa/components/timer";
</script>

<template>
  <Timer.Root auto-start :interval="100" :target-ms="10_000">
    <Timer.Area>
      <Timer.Item type="seconds" />
      <Timer.Separator>.</Timer.Separator>
      <Timer.Item type="milliseconds" :animate="false" />
    </Timer.Area>
    <Timer.Control>
      <Timer.ActionTrigger action="start">Start</Timer.ActionTrigger>
      <Timer.ActionTrigger action="pause">Pause</Timer.ActionTrigger>
      <Timer.ActionTrigger action="resume">Resume</Timer.ActionTrigger>
      <Timer.ActionTrigger action="reset">Reset</Timer.ActionTrigger>
    </Timer.Control>
  </Timer.Root>
</template>`;

export const sizesCode = `<template>
  <Timer.Root size="sm" :start-ms="3_723_000">…</Timer.Root>
  <Timer.Root size="base" :start-ms="3_723_000">…</Timer.Root>
  <Timer.Root size="lg" :start-ms="3_723_000">…</Timer.Root>
</template>`;

export const rootProps = [
  { name: "autoStart", type: "boolean", defaultValue: "false", description: "Starts the timer when it mounts." },
  { name: "countdown", type: "boolean", defaultValue: "false", description: "Decrements time instead of increasing it." },
  { name: "startMs", type: "number", defaultValue: "0", description: "Initial time in milliseconds." },
  { name: "targetMs", type: "number", defaultValue: "—", description: "Completion boundary in milliseconds." },
  { name: "interval", type: "number", defaultValue: "1000", description: "Update interval in milliseconds." },
  { name: "size", type: '"sm" | "base" | "lg"', defaultValue: '"base"', description: "Visual size of the display and controls." },
  { name: "translations", type: "IntlTranslations", defaultValue: "Ark defaults", description: "Customizes the accessible timer label." },
  { name: "id / ids", type: "string / partial ID map", defaultValue: "generated", description: "Overrides machine and part identifiers." },
  { name: "asChild", type: "boolean", defaultValue: "false", description: "Merges root behavior into the direct child." },
] as const;

export const itemProps = [
  { name: "type", type: '"days" | "hours" | "minutes" | "seconds" | "milliseconds"', defaultValue: "—", description: "Time unit rendered by the item." },
  { name: "animate", type: "boolean", defaultValue: "true", description: "Runs the Kappa number-pop transition when the formatted value changes." },
  { name: "asChild", type: "boolean", defaultValue: "false", description: "Merges item behavior into the direct child." },
] as const;

export const events = [
  { name: "tick", payload: "TickDetails", description: "Reports the current milliseconds and formatted time at each interval." },
  { name: "complete", payload: "void", description: "Fires when the timer reaches its target." },
] as const;

export const parts = [
  { name: "Area", element: "div", description: "Atomic timer region and formatted value container." },
  { name: "Item", element: "div", description: "One formatted time unit with optional number-pop motion." },
  { name: "Separator", element: "div", description: "Hidden-from-assistive-technology separator; defaults to a colon." },
  { name: "Control", element: "div", description: "Groups timer action triggers." },
  { name: "ActionTrigger", element: "button", description: "Starts, pauses, resumes, resets, or restarts the timer." },
  { name: "Context", element: "renderless", description: "Exposes timer state and imperative actions to a slot." },
] as const;

export const exportsList = [
  { name: "Timer", description: "Styled compound Timer component." },
  { name: "TimerRoot / TimerRootProvider", description: "Direct root and external-machine provider components." },
  { name: "TimerArea / TimerItem / TimerSeparator", description: "Granular formatted-time parts." },
  { name: "TimerControl / TimerActionTrigger", description: "Granular timer controls." },
  { name: "TimerContext", description: "Renderless access to current state and actions." },
  { name: "useTimer / useTimerContext", description: "Ark UI composition functions." },
  { name: "Timer*Props / Timer*Slots / TickDetails", description: "Public TypeScript contracts." },
] as const;
