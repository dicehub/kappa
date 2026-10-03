<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@dicehub/kappa/components/button";
import { Presence } from "@dicehub/kappa/components/presence";

type DemoVariant = "preview" | "usage" | "lazy" | "as-child";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const visible = ref(props.variant !== "lazy");
const lifecycle = ref("Entered");
</script>

<template>
  <div class="presence-demo" :data-presence-demo="props.variant">
    <div v-if="props.variant === 'preview'" class="presence-example">
      <Button
        size="sm"
        variant="outline"
        :aria-expanded="visible"
        aria-controls="presence-preview-panel"
        @click="visible = !visible"
      >
        {{ visible ? "Hide status" : "Show status" }}
      </Button>
      <div class="presence-example__stage">
        <Presence
          id="presence-preview-panel"
          :present="visible"
          unmount-on-exit
          @enter-complete="lifecycle = 'Entered'"
          @exit-complete="lifecycle = 'Exited'"
        >
          <section class="presence-panel" aria-label="Service status">
            <span class="presence-panel__signal" aria-hidden="true" />
            <div>
              <strong>Service online</strong>
              <span>All checks completed.</span>
            </div>
          </section>
        </Presence>
      </div>
      <output class="presence-example__state" aria-live="polite">{{ lifecycle }}</output>
    </div>

    <div v-else-if="props.variant === 'usage'" class="presence-example">
      <Button size="sm" @click="visible = !visible">
        {{ visible ? "Dismiss notice" : "Show notice" }}
      </Button>
      <div class="presence-example__stage">
        <Presence :present="visible">
          <p class="presence-notice">The latest settings are active.</p>
        </Presence>
      </div>
    </div>

    <div v-else-if="props.variant === 'lazy'" class="presence-example">
      <Button size="sm" variant="outline" @click="visible = !visible">
        {{ visible ? "Unmount details" : "Mount details" }}
      </Button>
      <div class="presence-example__stage">
        <Presence :present="visible" lazy-mount unmount-on-exit>
          <section class="presence-panel" data-lazy-presence>
            <div>
              <strong>Deferred diagnostics</strong>
              <span>Mounted only after the first request.</span>
            </div>
          </section>
        </Presence>
      </div>
    </div>

    <div v-else class="presence-example">
      <Button size="sm" variant="outline" @click="visible = !visible">
        {{ visible ? "Hide aside" : "Show aside" }}
      </Button>
      <div class="presence-example__stage">
        <Presence :present="visible" as-child>
          <aside class="presence-panel" aria-label="Processing note">
            <div>
              <strong>Processing continues</strong>
              <span>You can leave this page safely.</span>
            </div>
          </aside>
        </Presence>
      </div>
    </div>
  </div>
</template>

<style scoped>
.presence-demo {
  display: grid;
  inline-size: min(100%, 30rem);
  min-inline-size: 0;
  min-block-size: 12rem;
  place-items: center;
  color: var(--kappa-default, #17191f);
  font-family: var(--kappa-font-sans, inherit);
}

.presence-example {
  display: grid;
  inline-size: min(100%, 24rem);
  justify-items: center;
  gap: 0.75rem;
}

.presence-example__stage {
  display: grid;
  inline-size: 100%;
  min-block-size: 5.25rem;
  place-items: start stretch;
}

.presence-panel,
.presence-notice {
  box-sizing: border-box;
  inline-size: 100%;
  margin: 0;
  border: 1px solid var(--kappa-line, #e3e6eb);
  border-radius: 0.625rem;
  background: var(--kappa-control, #ffffff);
  box-shadow: var(--kappa-shadow-sm, 0 1px 2px rgb(23 25 31 / 8%));
}

.presence-panel {
  display: flex;
  min-block-size: 5.25rem;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
}

.presence-panel__signal {
  inline-size: 0.625rem;
  block-size: 0.625rem;
  flex: none;
  border-radius: 999px;
  background: var(--kappa-success-solid, #16845b);
}

.presence-panel div {
  display: grid;
  gap: 0.1875rem;
}

.presence-panel strong {
  font-size: 0.8125rem;
  font-weight: 650;
}

.presence-panel span,
.presence-notice,
.presence-example__state {
  color: var(--kappa-subtle, #6c7480);
  font-size: 0.75rem;
}

.presence-notice {
  min-block-size: 3rem;
  padding: 0.875rem 1rem;
}

.presence-example__state {
  font-family: var(--kappa-font-mono, monospace);
}

@media (forced-colors: active) {
  .presence-panel,
  .presence-notice {
    border-color: CanvasText;
  }

  .presence-panel__signal {
    background: Highlight;
  }
}
</style>
