<script setup>
import {
  ArrowLeft,
  ArrowRight,
  Copy,
  Gauge,
  Minus,
  Plus,
  Redo2,
  Undo2,
} from "@lucide/vue";
import { ref } from "vue";
import { Button, LinkButton } from "@dicehub/kappa/components/button";
import { ButtonGroup } from "@dicehub/kappa/components/button-group";

defineProps({ variant: { type: String, default: "preview" } });

const lastAction = ref("Ready");
const recordAction = (action) => {
  lastAction.value = action;
};
</script>

<template>
  <div class="button-group-demo" :data-button-group-demo="variant">
    <div v-if="variant === 'preview'" class="button-group-demo__preview">
      <div class="button-group-demo__preview-copy">
        <span>Rotor study · Run 042</span>
        <strong>Review actions</strong>
      </div>
      <ButtonGroup aria-label="Run actions" data-preview-group>
        <ButtonGroup.Root aria-label="Run navigation">
          <Button
            :icon="ArrowLeft"
            shape="square"
            variant="outline"
            aria-label="Back to runs"
            @click="recordAction('Back selected')"
          />
        </ButtonGroup.Root>
        <ButtonGroup.Root aria-label="Run preparation">
          <Button variant="outline" @click="recordAction('Saved')">Save</Button>
          <Button variant="outline" @click="recordAction('Validated')">Validate</Button>
        </ButtonGroup.Root>
        <ButtonGroup.Root aria-label="Run output">
          <Button variant="outline" @click="recordAction('Run started')">Run</Button>
          <Button variant="outline" @click="recordAction('Export prepared')">Export</Button>
        </ButtonGroup.Root>
      </ButtonGroup>
      <output role="status" aria-live="polite">{{ lastAction }}</output>
    </div>

    <ButtonGroup v-else-if="variant === 'usage'" aria-label="Case actions" data-usage-group>
      <Button variant="outline">Save</Button>
      <Button variant="outline">Duplicate</Button>
      <Button variant="outline">Archive</Button>
    </ButtonGroup>

    <ButtonGroup v-else-if="variant === 'basic'" aria-label="Result actions" data-basic-group>
      <Button variant="outline">Open</Button>
      <Button variant="outline">Compare</Button>
      <Button variant="outline">Export</Button>
    </ButtonGroup>

    <div v-else-if="variant === 'orientation'" class="button-group-demo__row">
      <ButtonGroup aria-label="Horizontal zoom controls" data-horizontal-group>
        <Button :icon="Minus" shape="square" variant="outline" aria-label="Zoom out" />
        <Button :icon="Plus" shape="square" variant="outline" aria-label="Zoom in" />
      </ButtonGroup>
      <ButtonGroup
        orientation="vertical"
        aria-label="Vertical zoom controls"
        data-vertical-group
      >
        <Button :icon="Plus" shape="square" variant="outline" aria-label="Increase scale" />
        <Button :icon="Minus" shape="square" variant="outline" aria-label="Decrease scale" />
      </ButtonGroup>
    </div>

    <div v-else-if="variant === 'sizes'" class="button-group-demo__sizes">
      <div v-for="size in ['xs', 'sm', 'base', 'lg']" :key="size" class="button-group-demo__size">
        <code>{{ size }}</code>
        <ButtonGroup :aria-label="`${size} actions`" :data-size-group="size">
          <Button :size="size" variant="outline">Mesh</Button>
          <Button :size="size" variant="outline">Solve</Button>
          <Button :size="size" variant="outline">Review</Button>
        </ButtonGroup>
      </div>
    </div>

    <ButtonGroup
      v-else-if="variant === 'nested'"
      aria-label="Editor actions"
      data-nested-group
    >
      <ButtonGroup.Root aria-label="History actions">
        <Button :icon="Undo2" shape="square" variant="outline" aria-label="Undo" />
        <Button :icon="Redo2" shape="square" variant="outline" aria-label="Redo" />
      </ButtonGroup.Root>
      <ButtonGroup.Root aria-label="Editor state actions">
        <Button variant="outline">Apply</Button>
        <Button variant="outline">Reset</Button>
      </ButtonGroup.Root>
    </ButtonGroup>

    <div v-else-if="variant === 'separator'" class="button-group-demo__row">
      <ButtonGroup aria-label="Clipboard actions" data-separator-horizontal-group>
        <Button variant="ghost">Copy</Button>
        <ButtonGroup.Separator />
        <Button variant="ghost">Paste</Button>
      </ButtonGroup>
      <ButtonGroup
        orientation="vertical"
        aria-label="Case lifecycle"
        data-separator-vertical-group
      >
        <Button variant="ghost">Prepare</Button>
        <ButtonGroup.Separator orientation="horizontal" />
        <Button variant="ghost">Run</Button>
      </ButtonGroup>
    </div>

    <ButtonGroup v-else-if="variant === 'split'" aria-label="Run case" data-split-group>
      <Button variant="primary">Run case</Button>
      <ButtonGroup.Separator />
      <Button
        :icon="Copy"
        shape="square"
        variant="primary"
        aria-label="Duplicate case and run"
      />
    </ButtonGroup>

    <div v-else-if="variant === 'text'" class="button-group-demo__stack">
      <ButtonGroup aria-label="Time step limit">
        <ButtonGroup.Text data-text-default>Delta t</ButtonGroup.Text>
        <Button variant="outline">0.002 s</Button>
      </ButtonGroup>
      <ButtonGroup aria-label="Courant limit">
        <ButtonGroup.Text as-child>
          <strong data-text-as-child><Gauge aria-hidden="true" /> Courant</strong>
        </ButtonGroup.Text>
        <Button variant="outline">0.8</Button>
      </ButtonGroup>
    </div>

    <ButtonGroup v-else-if="variant === 'links'" aria-label="Run navigation" data-links-group>
      <LinkButton href="#usage" variant="outline">Summary</LinkButton>
      <LinkButton href="#examples" variant="outline">Fields</LinkButton>
      <Button variant="outline">Refresh</Button>
    </ButtonGroup>

    <div v-else dir="rtl" class="button-group-demo__rtl">
      <ButtonGroup aria-label="إجراءات الحالة" data-rtl-group>
        <Button
          :icon="ArrowRight"
          shape="square"
          variant="outline"
          aria-label="العودة"
        />
        <Button :icon="Plus" variant="outline">حالة جديدة</Button>
        <Button variant="outline">تصدير</Button>
      </ButtonGroup>
    </div>
  </div>
</template>

<style scoped>
.button-group-demo {
  display: grid;
  width: min(100%, 42rem);
  min-width: 0;
  min-height: 10rem;
  place-items: center;
  color: var(--docs-default);
  font-family: var(--docs-font-sans, "Geist", sans-serif);
}

.button-group-demo__preview {
  display: grid;
  max-width: 100%;
  justify-items: center;
  gap: 0.875rem;
}

.button-group-demo__preview-copy {
  display: grid;
  justify-items: center;
  gap: 0.125rem;
}

.button-group-demo__preview-copy span,
.button-group-demo__preview output {
  color: var(--docs-subtle);
  font-size: 0.75rem;
}

.button-group-demo__row {
  display: flex;
  max-width: 100%;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 2rem;
}

.button-group-demo__stack,
.button-group-demo__sizes {
  display: grid;
  max-width: 100%;
  gap: 0.875rem;
}

.button-group-demo__size {
  display: grid;
  grid-template-columns: 2.75rem minmax(0, 1fr);
  align-items: center;
  gap: 0.75rem;
}

.button-group-demo__size code {
  color: var(--docs-subtle);
  font-size: 0.6875rem;
  text-align: end;
}

.button-group-demo__rtl {
  max-width: 100%;
}

@media (max-width: 520px) {
  .button-group-demo {
    min-height: 11rem;
  }

  .button-group-demo__preview [aria-label="Run navigation"] {
    display: none;
  }

  .button-group-demo__row {
    gap: 1.25rem;
  }
}
</style>
