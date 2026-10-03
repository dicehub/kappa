<script setup lang="ts">
import { Timer } from "@dicehub/kappa/components/timer";
import { ref } from "vue";

type DemoVariant = "preview" | "elapsed" | "countdown" | "precision" | "sizes";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const countdownComplete = ref(false);
const sizes = [
  { label: "Small", size: "sm" as const },
  { label: "Base", size: "base" as const },
  { label: "Large", size: "lg" as const },
];
</script>

<template>
  <div class="timer-demo" :data-timer-demo="props.variant">
    <Timer.Root
      v-if="props.variant === 'preview'"
      auto-start
      countdown
      :start-ms="65_000"
      :target-ms="0"
    >
      <span class="timer-demo__label">Simulation slot releases in</span>
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

    <Timer.Root v-else-if="props.variant === 'elapsed'" :target-ms="3_600_000">
      <span class="timer-demo__label">Elapsed solver time</span>
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

    <Timer.Root
      v-else-if="props.variant === 'countdown'"
      countdown
      :start-ms="15_000"
      :target-ms="0"
      @complete="countdownComplete = true"
    >
      <span class="timer-demo__label">Automatic stop</span>
      <Timer.Area>
        <Timer.Item type="minutes" />
        <Timer.Separator />
        <Timer.Item type="seconds" />
      </Timer.Area>
      <Timer.Control>
        <Timer.ActionTrigger action="start" @click="countdownComplete = false">Start</Timer.ActionTrigger>
        <Timer.ActionTrigger action="pause">Pause</Timer.ActionTrigger>
        <Timer.ActionTrigger action="resume">Resume</Timer.ActionTrigger>
        <Timer.ActionTrigger action="restart" @click="countdownComplete = false">Restart</Timer.ActionTrigger>
        <Timer.ActionTrigger action="reset" @click="countdownComplete = false">Reset</Timer.ActionTrigger>
      </Timer.Control>
      <output class="timer-demo__status" aria-live="polite">
        {{ countdownComplete ? "Countdown complete" : "Ready" }}
      </output>
    </Timer.Root>

    <Timer.Root
      v-else-if="props.variant === 'precision'"
      auto-start
      :interval="100"
      :target-ms="10_000"
    >
      <span class="timer-demo__label">Short operation</span>
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

    <div v-else class="timer-demo__sizes">
      <div v-for="option in sizes" :key="option.size" class="timer-demo__size-row">
        <span class="timer-demo__label">{{ option.label }}</span>
        <Timer.Root :size="option.size" :start-ms="3_723_000">
          <Timer.Area>
            <Timer.Item type="hours" :animate="false" />
            <Timer.Separator />
            <Timer.Item type="minutes" :animate="false" />
            <Timer.Separator />
            <Timer.Item type="seconds" :animate="false" />
          </Timer.Area>
        </Timer.Root>
      </div>
    </div>
  </div>
</template>

<style scoped>
.timer-demo {
  display: grid;
  inline-size: 100%;
  min-block-size: 14rem;
  place-items: center;
  color: var(--kappa-default, #17191f);
  font-family: var(--kappa-font-sans, inherit);
}

.timer-demo :deep(.kappa-timer) {
  justify-items: start;
}

.timer-demo__label {
  color: var(--kappa-subtle, #6c7480);
  font-size: 0.6875rem;
  font-weight: 650;
  letter-spacing: 0.055em;
  line-height: 1rem;
  text-transform: uppercase;
}

.timer-demo__status {
  min-block-size: 1rem;
  color: var(--kappa-subtle, #6c7480);
  font-size: 0.75rem;
  line-height: 1rem;
}

.timer-demo__sizes {
  display: grid;
  inline-size: min(100%, 24rem);
  gap: 1rem;
}

.timer-demo__size-row {
  display: grid;
  grid-template-columns: 4rem minmax(0, 1fr);
  align-items: center;
  gap: 1rem;
}
</style>
