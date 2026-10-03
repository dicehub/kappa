<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@dicehub/kappa/components/button";
import { DialogLayout } from "@dicehub/kappa/components/dialog-layout";
import { Input } from "@dicehub/kappa/components/input";

type DemoVariant =
  | "preview"
  | "informational"
  | "confirmation"
  | "long-content"
  | "loading"
  | "top-aligned";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const loadingOpen = ref(false);
const saving = ref(false);

const saveDeployment = () => {
  if (saving.value) return;
  saving.value = true;
  window.setTimeout(() => {
    saving.value = false;
    loadingOpen.value = false;
  }, 900);
};

const auditEntries = Array.from({ length: 16 }, (_, index) => ({
  id: `EV-${String(4816 - index).padStart(4, "0")}`,
  label: index % 3 === 0 ? "Mesh settings updated" : index % 3 === 1 ? "Solver started" : "Result archived",
  time: `${String(14 - Math.floor(index / 4)).padStart(2, "0")}:${String((index * 7) % 60).padStart(2, "0")}`,
}));
</script>

<template>
  <div class="dialog-layout-demo" :data-dialog-layout-demo="props.variant">
    <DialogLayout.Root v-if="props.variant === 'preview'">
      <DialogLayout.Trigger as-child>
        <Button variant="primary">Configure deployment</Button>
      </DialogLayout.Trigger>
      <DialogLayout.Content :show-close-button="false" data-dialog-layout-surface="preview">
        <DialogLayout.Header>
          <DialogLayout.Title>Configure deployment</DialogLayout.Title>
          <DialogLayout.Description>
            Review the release target before the worker starts.
          </DialogLayout.Description>
        </DialogLayout.Header>
        <DialogLayout.Body>
          <div class="dialog-layout-demo__fields">
            <label for="dialog-layout-release">Release name</label>
            <Input id="dialog-layout-release" value="thermal-solver-2026.09" />
            <dl class="dialog-layout-demo__facts">
              <div><dt>Target</dt><dd>Production</dd></div>
              <div><dt>Workers</dt><dd>12</dd></div>
              <div><dt>Strategy</dt><dd>Rolling update</dd></div>
            </dl>
          </div>
        </DialogLayout.Body>
        <DialogLayout.Actions dismiss-label="Cancel">
          <DialogLayout.Close as-child>
            <DialogLayout.Actions.Primary>Deploy</DialogLayout.Actions.Primary>
          </DialogLayout.Close>
        </DialogLayout.Actions>
      </DialogLayout.Content>
    </DialogLayout.Root>

    <DialogLayout.Root v-else-if="props.variant === 'informational'">
      <DialogLayout.Trigger as-child>
        <Button>View result status</Button>
      </DialogLayout.Trigger>
      <DialogLayout.Content size="sm" data-dialog-layout-surface="informational">
        <DialogLayout.Header>
          <DialogLayout.Title>Result archive ready</DialogLayout.Title>
          <DialogLayout.Description>
            The archive is available for 30 days.
          </DialogLayout.Description>
        </DialogLayout.Header>
        <DialogLayout.Body>
          <p class="dialog-layout-demo__copy">
            The 184 MB package contains the mesh, solver log, and field data.
          </p>
        </DialogLayout.Body>
      </DialogLayout.Content>
    </DialogLayout.Root>

    <DialogLayout.Alert v-else-if="props.variant === 'confirmation'">
      <DialogLayout.Trigger as-child>
        <Button variant="destructive-outline">Delete result</Button>
      </DialogLayout.Trigger>
      <DialogLayout.Content :show-close-button="false" size="sm" data-dialog-layout-surface="confirmation">
        <DialogLayout.Header>
          <DialogLayout.Title>Delete result?</DialogLayout.Title>
          <DialogLayout.Description>
            This action cannot be undone.
          </DialogLayout.Description>
        </DialogLayout.Header>
        <DialogLayout.Body>
          <p class="dialog-layout-demo__copy">
            Run 4816 and its 14 archived fields will be removed permanently.
          </p>
        </DialogLayout.Body>
        <DialogLayout.Actions dismiss-label="Cancel">
          <DialogLayout.Close as-child>
            <DialogLayout.Actions.Primary variant="destructive">
              Delete result
            </DialogLayout.Actions.Primary>
          </DialogLayout.Close>
        </DialogLayout.Actions>
      </DialogLayout.Content>
    </DialogLayout.Alert>

    <DialogLayout.Root v-else-if="props.variant === 'long-content'">
      <DialogLayout.Trigger as-child>
        <Button>Open audit log</Button>
      </DialogLayout.Trigger>
      <DialogLayout.Content :show-close-button="false" data-dialog-layout-surface="long-content">
        <DialogLayout.Header>
          <DialogLayout.Title>Run audit log</DialogLayout.Title>
          <DialogLayout.Description>Events for run 4816.</DialogLayout.Description>
        </DialogLayout.Header>
        <DialogLayout.Body tabindex="0">
          <ol class="dialog-layout-demo__events">
            <li v-for="entry in auditEntries" :key="entry.id">
              <span>{{ entry.id }}</span>
              <strong>{{ entry.label }}</strong>
              <time>{{ entry.time }}</time>
            </li>
          </ol>
        </DialogLayout.Body>
        <DialogLayout.Actions dismiss-label="Done">
          <span class="dialog-layout-demo__count">16 events</span>
        </DialogLayout.Actions>
      </DialogLayout.Content>
    </DialogLayout.Root>

    <DialogLayout.Root
      v-else-if="props.variant === 'loading'"
      v-model:open="loadingOpen"
      :close-on-escape="!saving"
      :disable-pointer-dismissal="saving"
    >
      <DialogLayout.Trigger as-child>
        <Button>Start deployment</Button>
      </DialogLayout.Trigger>
      <DialogLayout.Content :show-close-button="false" data-dialog-layout-surface="loading">
        <DialogLayout.Header>
          <DialogLayout.Title>Deploy solver image</DialogLayout.Title>
          <DialogLayout.Description>
            The current release stays active until validation passes.
          </DialogLayout.Description>
        </DialogLayout.Header>
        <DialogLayout.Body>
          <p class="dialog-layout-demo__copy">
            Deploy <strong>solver:2026.09</strong> to twelve production workers?
          </p>
        </DialogLayout.Body>
        <DialogLayout.Actions dismiss-label="Cancel" :dismiss-disabled="saving">
          <DialogLayout.Actions.Primary :loading="saving" @click="saveDeployment">
            {{ saving ? "Deploying" : "Deploy" }}
          </DialogLayout.Actions.Primary>
        </DialogLayout.Actions>
      </DialogLayout.Content>
    </DialogLayout.Root>

    <DialogLayout.Root v-else>
      <DialogLayout.Trigger as-child>
        <Button>Review warnings</Button>
      </DialogLayout.Trigger>
      <DialogLayout.Content vertical-align="top" data-dialog-layout-surface="top-aligned">
        <DialogLayout.Header>
          <DialogLayout.Title>Validation warnings</DialogLayout.Title>
          <DialogLayout.Description>Three checks need review.</DialogLayout.Description>
        </DialogLayout.Header>
        <DialogLayout.Body>
          <p class="dialog-layout-demo__copy">
            Top alignment keeps tall technical forms near their source context on desktop.
          </p>
        </DialogLayout.Body>
      </DialogLayout.Content>
    </DialogLayout.Root>
  </div>
</template>

<style src="./DialogLayoutDocsDemo.css"></style>
