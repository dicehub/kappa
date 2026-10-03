<script setup lang="ts">
import { computed, ref } from "vue";
import { Fieldset } from "@dicehub/kappa/components/fieldset";

type DemoVariant = "preview" | "basic" | "orientation" | "states";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const previewChannels = ref(["email"]);
const basicChannels = ref(["email"]);
const requiredChannels = ref<string[]>([]);

const requiredInvalid = computed(() => requiredChannels.value.length === 0);

const toggle = (channels: string[], value: string) => {
  const index = channels.indexOf(value);
  if (index >= 0) {
    channels.splice(index, 1);
  } else {
    channels.push(value);
  }
};
</script>

<template>
  <div class="fieldset-demo" :data-fieldset-demo="props.variant">
    <Fieldset.Root v-if="props.variant === 'preview'" id="delivery-channels">
      <Fieldset.Legend>Delivery channels</Fieldset.Legend>
      <label class="fieldset-demo__option">
        <input
          type="checkbox"
          :checked="previewChannels.includes('email')"
          @change="toggle(previewChannels, 'email')"
        />
        <span>Email digest</span>
      </label>
      <label class="fieldset-demo__option">
        <input
          type="checkbox"
          :checked="previewChannels.includes('slack')"
          @change="toggle(previewChannels, 'slack')"
        />
        <span>Slack activity</span>
      </label>
      <Fieldset.HelperText>Choose the updates that should reach your team.</Fieldset.HelperText>
    </Fieldset.Root>

    <Fieldset.Root v-else-if="props.variant === 'basic'" id="contact-preferences">
      <Fieldset.Legend>Contact preferences</Fieldset.Legend>
      <label class="fieldset-demo__option">
        <input
          type="checkbox"
          :checked="basicChannels.includes('email')"
          @change="toggle(basicChannels, 'email')"
        />
        <span>Email</span>
      </label>
      <label class="fieldset-demo__option">
        <input
          type="checkbox"
          :checked="basicChannels.includes('phone')"
          @change="toggle(basicChannels, 'phone')"
        />
        <span>Phone</span>
      </label>
      <Fieldset.HelperText>Select every channel that works for you.</Fieldset.HelperText>
    </Fieldset.Root>

    <div v-else-if="props.variant === 'orientation'" class="fieldset-demo__stack">
      <Fieldset.Root id="vertical-output" orientation="vertical">
        <Fieldset.Legend>Vertical layout</Fieldset.Legend>
        <label class="fieldset-demo__option"><input type="radio" name="vertical" checked /> <span>Steady state</span></label>
        <label class="fieldset-demo__option"><input type="radio" name="vertical" /> <span>Transient</span></label>
      </Fieldset.Root>
      <Fieldset.Root id="horizontal-output" orientation="horizontal">
        <Fieldset.Legend>Horizontal layout</Fieldset.Legend>
        <label class="fieldset-demo__option"><input type="radio" name="horizontal" checked /> <span>Local</span></label>
        <label class="fieldset-demo__option"><input type="radio" name="horizontal" /> <span>Cluster</span></label>
      </Fieldset.Root>
    </div>

    <div v-else class="fieldset-demo__stack">
      <Fieldset.Root id="required-channels" :invalid="requiredInvalid">
        <Fieldset.Legend>Required channels</Fieldset.Legend>
        <label class="fieldset-demo__option">
          <input
            type="checkbox"
            :checked="requiredChannels.includes('audit')"
            @change="toggle(requiredChannels, 'audit')"
          />
          <span>Audit log</span>
        </label>
        <Fieldset.ErrorText>Choose at least one channel.</Fieldset.ErrorText>
      </Fieldset.Root>

      <Fieldset.Root id="locked-channels" disabled>
        <Fieldset.Legend>Locked channels</Fieldset.Legend>
        <label class="fieldset-demo__option"><input type="checkbox" checked /> <span>System alerts</span></label>
        <Fieldset.HelperText>Available to workspace administrators.</Fieldset.HelperText>
      </Fieldset.Root>
    </div>
  </div>
</template>

<style scoped>
.fieldset-demo {
  display: flex;
  inline-size: 100%;
  min-inline-size: 0;
  align-items: center;
  justify-content: center;
  color: var(--kappa-default, #17191f);
  font-family: var(--kappa-font-sans, inherit);
}

.fieldset-demo > .kappa-fieldset,
.fieldset-demo__stack {
  inline-size: min(100%, 30rem);
}

.fieldset-demo__stack {
  display: grid;
  gap: 0.75rem;
}

.fieldset-demo__option {
  display: flex;
  min-inline-size: 0;
  align-items: center;
  gap: 0.625rem;
  color: var(--kappa-default, #17191f);
  font-size: 0.8125rem;
  line-height: 1.35;
}

.fieldset-demo__option input {
  inline-size: 1rem;
  block-size: 1rem;
  margin: 0;
  accent-color: var(--kappa-accent-solid, #4356e8);
}

@media (max-width: 30rem) {
  .fieldset-demo .kappa-fieldset {
    padding-inline: 0.75rem;
  }
}
</style>
