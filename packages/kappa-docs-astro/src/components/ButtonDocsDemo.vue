<script setup>
import { ArrowLeft, ArrowRight, Plus, RefreshCw } from "@lucide/vue";
import { ref } from "vue";
import { Button, LinkButton } from "@dicehub/kappa/components/button";

defineProps({ variant: { type: String, default: "preview" } });

const actionMessage = ref("No action yet");
const actionCount = ref(0);
const blockedCount = ref(0);
const formMessage = ref("Ready");

const recordAction = (label) => {
  actionCount.value += 1;
  actionMessage.value = `${label} · ${actionCount.value}`;
};

const recordBlockedAttempt = () => {
  blockedCount.value += 1;
};

const variantButtons = {
  primary: { name: "primary", label: "Primary" },
  secondary: { name: "secondary", label: "Secondary" },
  outline: { name: "outline", label: "Outline" },
  ghost: { name: "ghost", label: "Ghost" },
  destructive: { name: "destructive", label: "Destructive" },
  "secondary-destructive": { name: "secondary-destructive", label: "Secondary Destructive" },
  "destructive-outline": { name: "destructive-outline", label: "Destructive Outline" },
  success: { name: "success", label: "Success" },
  warning: { name: "warning", label: "Warning" },
  link: { name: "link", label: "Link" },
};
</script>

<template>
  <div class="button-demo" :data-button-demo="variant">
    <div v-if="variant === 'preview'" class="button-demo__panel">
      <div class="button-demo__panel-copy">
        <span>Rotor study · Run 042</span>
        <strong>Ready to submit</strong>
      </div>
      <div class="button-demo__row">
        <Button @click="recordAction('Draft saved')">Save draft</Button>
        <Button variant="primary" @click="recordAction('Run submitted')">
          Run simulation
        </Button>
      </div>
      <output class="button-demo__status" role="status" aria-live="polite">{{ actionMessage }}</output>
    </div>

    <Button
      v-else-if="variant === 'usage'"
      variant="primary"
      data-trace="save-case"
      class="button-demo__custom"
      @click="recordAction('Case saved')"
    >
      Save case
    </Button>

    <Button v-else-if="variant === 'basic'" @click="recordAction('Draft saved')">
      Save draft
    </Button>

    <div v-else-if="variantButtons[variant]" class="button-demo__row">
      <Button :variant="variantButtons[variant].name">{{ variantButtons[variant].label }}</Button>
    </div>

    <div v-else-if="variant === 'sizes'" class="button-demo__sizes">
      <div v-for="size in ['xs', 'sm', 'base', 'lg']" :key="size" class="button-demo__size-item">
        <Button :size="size">{{ size === "base" ? "Base" : size.toUpperCase() }}</Button>
        <code>{{ size }}</code>
      </div>
    </div>

    <div v-else-if="variant === 'icons'" class="button-demo__row">
      <Button :icon="Plus">New case</Button>
      <Button :icon="ArrowRight" icon-position="inline-end" variant="outline">Export</Button>
    </div>

    <div v-else-if="variant === 'icon-only'" class="button-demo__row">
      <Button :icon="Plus" shape="square" aria-label="Add case" />
      <Button :icon="RefreshCw" shape="circle" variant="ghost" aria-label="Refresh runs" />
    </div>

    <div v-else-if="variant === 'loading'" class="button-demo__row">
      <Button loading @click="recordBlockedAttempt">Saving case</Button>
      <Button variant="primary" loading @click="recordBlockedAttempt">Submitting run</Button>
      <span class="docs-visually-hidden" data-blocked-count>{{ blockedCount }}</span>
    </div>

    <div v-else-if="variant === 'disabled'" class="button-demo__row">
      <Button disabled @click="recordBlockedAttempt">Save case</Button>
      <LinkButton href="#disabled-run" disabled @click="recordBlockedAttempt">Open run</LinkButton>
      <span class="docs-visually-hidden" data-blocked-count>{{ blockedCount }}</span>
    </div>

    <div v-else-if="variant === 'full-width'" class="button-demo__full-width">
      <Button full-width variant="primary">Create project</Button>
    </div>

    <div v-else-if="variant === 'links'" class="button-demo__row">
      <LinkButton href="#button-native-target">View runs</LinkButton>
      <LinkButton href="https://dicehub.com" external>dicehub website</LinkButton>
      <LinkButton as-child disabled @click="recordBlockedAttempt">
        <a href="#button-unavailable">Unavailable run</a>
      </LinkButton>
      <LinkButton as-child>
        <a href="#button-router-target" data-router-link="true">Open projects</a>
      </LinkButton>
      <span class="docs-visually-hidden" data-blocked-count>{{ blockedCount }}</span>
    </div>

    <form
      v-else-if="variant === 'form'"
      class="button-demo__form"
      aria-label="Case action form"
      @submit.prevent="formMessage = 'Submitted'"
      @reset="formMessage = 'Reset'"
    >
      <label for="button-demo-case">Case name</label>
      <input id="button-demo-case" name="case" value="Rotor study" />
      <div class="button-demo__row">
        <Button type="submit">Submit</Button>
        <Button type="reset" variant="ghost">Reset</Button>
      </div>
      <output role="status" aria-live="polite">{{ formMessage }}</output>
    </form>

    <div v-else dir="rtl" class="button-demo__row button-demo__rtl">
      <Button :icon="Plus">حالة جديدة</Button>
      <Button :icon="ArrowLeft" icon-position="inline-end" variant="outline">تصدير</Button>
    </div>
  </div>
</template>

<style scoped>
.button-demo {
  display: grid;
  width: min(100%, 38rem);
  min-width: 0;
  min-height: 9rem;
  place-items: center;
  color: var(--docs-default);
  font-family: var(--docs-font-sans, "Geist", sans-serif);
}

.button-demo__row {
  display: flex;
  min-width: 0;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
}

.button-demo__panel {
  display: grid;
  width: min(100%, 31rem);
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.75rem 1.25rem;
  border: 1px solid var(--docs-line);
  border-radius: 0.75rem;
  background: var(--docs-base);
  padding: 1.125rem;
}

.button-demo__panel-copy { display: grid; min-width: 0; gap: 0.2rem; }
.button-demo__panel-copy span,
.button-demo__status { color: var(--docs-subtle); font-size: 0.75rem; }
.button-demo__status { grid-column: 1 / -1; }

.button-demo__sizes {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  justify-content: center;
  gap: 1rem;
}

.button-demo__size-item { display: grid; place-items: center; gap: 0.5rem; }
.button-demo__size-item code { color: var(--docs-subtle); font-size: 0.6875rem; }
.button-demo__full-width { width: min(100%, 26rem); }

.button-demo__form {
  display: grid;
  width: min(100%, 24rem);
  gap: 0.625rem;
}

.button-demo__form label { font-size: 0.75rem; font-weight: 650; }
.button-demo__form input {
  min-width: 0;
  border: 1px solid var(--docs-line);
  border-radius: 0.45rem;
  background: var(--docs-base);
  color: inherit;
  font: inherit;
  padding: 0.5rem 0.625rem;
}
.button-demo__form output { min-height: 1.25rem; color: var(--docs-subtle); font-size: 0.75rem; }
.button-demo__rtl { width: 100%; }

@media (max-width: 560px) {
  .button-demo { min-height: 11rem; }
  .button-demo__panel { grid-template-columns: 1fr; }
  .button-demo__panel .button-demo__row { justify-content: start; }
  .button-demo__status { grid-column: auto; }
}
</style>
