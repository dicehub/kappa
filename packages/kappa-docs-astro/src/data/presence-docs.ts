export const barrelCode = `import {
  Presence,
  usePresence,
} from "@dicehub/kappa";`;

export const granularCode = `import {
  Presence,
  usePresence,
} from "@dicehub/kappa/components/presence";`;

export const previewCode = `<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@dicehub/kappa/components/button";
import { Presence } from "@dicehub/kappa/components/presence";

const visible = ref(true);
const lifecycle = ref("Entered");
</script>

<template>
  <Button
    size="sm"
    variant="outline"
    :aria-expanded="visible"
    aria-controls="presence-preview-panel"
    @click="visible = !visible"
  >
    {{ visible ? "Hide status" : "Show status" }}
  </Button>

  <div class="presence-stage">
    <Presence
      id="presence-preview-panel"
      :present="visible"
      unmount-on-exit
      @enter-complete="lifecycle = 'Entered'"
      @exit-complete="lifecycle = 'Exited'"
    >
      <section aria-label="Service status">
        <span class="status-signal" aria-hidden="true" />
        <div>
          <strong>Service online</strong>
          <span>All checks completed.</span>
        </div>
      </section>
    </Presence>
  </div>

  <output aria-live="polite">{{ lifecycle }}</output>
</template>`;

export const usageCode = `<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@dicehub/kappa/components/button";
import { Presence } from "@dicehub/kappa/components/presence";

const visible = ref(true);
</script>

<template>
  <Button size="sm" @click="visible = !visible">
    {{ visible ? "Dismiss notice" : "Show notice" }}
  </Button>
  <div class="presence-stage">
    <Presence :present="visible">
      <p>The latest settings are active.</p>
    </Presence>
  </div>
</template>`;

export const lazyCode = `<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@dicehub/kappa/components/button";
import { Presence } from "@dicehub/kappa/components/presence";

const visible = ref(false);
</script>

<template>
  <Button size="sm" variant="outline" @click="visible = !visible">
    {{ visible ? "Unmount details" : "Mount details" }}
  </Button>
  <div class="presence-stage">
    <Presence :present="visible" lazy-mount unmount-on-exit>
      <section data-lazy-presence>
        <div>
          <strong>Deferred diagnostics</strong>
          <span>Mounted only after the first request.</span>
        </div>
      </section>
    </Presence>
  </div>
</template>`;

export const asChildCode = `<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@dicehub/kappa/components/button";
import { Presence } from "@dicehub/kappa/components/presence";

const visible = ref(true);
</script>

<template>
  <Button size="sm" variant="outline" @click="visible = !visible">
    {{ visible ? "Hide aside" : "Show aside" }}
  </Button>
  <div class="presence-stage">
    <Presence :present="visible" as-child>
      <aside aria-label="Processing note">
        <div>
          <strong>Processing continues</strong>
          <span>You can leave this page safely.</span>
        </div>
      </aside>
    </Presence>
  </div>
</template>`;

export const presenceProps = [
  { name: "present", type: "boolean", defaultValue: "false", description: "Controls whether the content is present." },
  { name: "lazyMount", type: "boolean", defaultValue: "false", description: "Defers the first mount until content becomes present." },
  { name: "unmountOnExit", type: "boolean", defaultValue: "false", description: "Removes content after its exit animation completes." },
  { name: "skipAnimationOnMount", type: "boolean", defaultValue: "false", description: "Skips the initial entrance animation." },
  { name: "immediate", type: "boolean", defaultValue: "false", description: "Synchronizes state without waiting for the next frame." },
  { name: "asChild", type: "boolean", defaultValue: "false", description: "Merges presence behavior and Kappa attributes onto one direct child." },
] as const;

export const events = [
  { name: "enterComplete", description: "Emitted after the entrance animation completes." },
  { name: "exitComplete", description: "Emitted after the exit animation completes." },
] as const;

export const exportsList = [
  { name: "Presence", description: "Ark-backed Kappa presence and transition component." },
  { name: "usePresence / usePresenceContext", description: "Ark UI presence composables." },
  { name: "PresenceProvider", description: "Provides an external presence context." },
  { name: "PresenceProps / PresenceEmits / PresenceSlots", description: "Public Vue contracts." },
] as const;
