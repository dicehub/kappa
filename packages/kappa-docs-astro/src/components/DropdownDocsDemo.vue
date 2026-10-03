<script setup lang="ts">
import {
  Copy,
  Download,
  ExternalLink,
  FileText,
  FolderOpen,
  Settings,
  Share2,
  Trash2,
  User,
} from "@lucide/vue";
import { Button } from "@dicehub/kappa/components/button";
import { Dropdown } from "@dicehub/kappa/components/dropdown";
import { ref } from "vue";

type DemoVariant =
  | "preview"
  | "basic"
  | "icons-inset"
  | "action-callbacks"
  | "checkbox-items"
  | "radio-group"
  | "nested-submenu"
  | "custom-trigger"
  | "navigation-links"
  | "controlled"
  | "destructive-disabled"
  | "long-list"
  | "context-menu"
  | "right-to-left";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const activityVisible = ref(true);
const compactRows = ref(false);
const controlledOpen = ref(false);
const density = ref("comfortable");
const lastAction = ref("No action selected");
const longListItems = Array.from({ length: 36 }, (_, index) => ({
  label: `Run ${String(index + 1).padStart(2, "0")} · rotor sweep`,
  value: `run-${index + 1}`,
}));

const setAction = (action: string) => {
  lastAction.value = action;
};
</script>

<template>
  <div class="dropdown-demo" :data-dropdown-demo="props.variant">
    <Dropdown.Root v-if="props.variant === 'preview'" aria-label="Run actions">
      <Dropdown.Trigger as-child>
        <Button variant="outline">
          Run actions
          <Dropdown.Indicator />
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Content data-dropdown-surface="preview">
        <Dropdown.Group>
          <Dropdown.Label>Run 4189</Dropdown.Label>
          <Dropdown.Item value="open" value-text="Open results" :icon="FolderOpen">Open results</Dropdown.Item>
          <Dropdown.Item value="copy" value-text="Copy run ID" :icon="Copy">
            Copy run ID
            <template #end><Dropdown.Shortcut>⌘C</Dropdown.Shortcut></template>
          </Dropdown.Item>
          <Dropdown.Item value="archive-bundle" value-text="Download archive" :icon="Download">
            Download archive
          </Dropdown.Item>
        </Dropdown.Group>
        <Dropdown.Separator />
        <Dropdown.Item value="delete" value-text="Delete run" variant="destructive" :icon="Trash2">
          Delete run
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>

    <Dropdown.Root v-else-if="props.variant === 'basic'" aria-label="Project actions">
      <Dropdown.Trigger as-child>
        <Button variant="outline">Open menu <Dropdown.Indicator /></Button>
      </Dropdown.Trigger>
      <Dropdown.Content data-dropdown-surface="basic">
        <Dropdown.Item value="new">New simulation</Dropdown.Item>
        <Dropdown.Item value="duplicate">Duplicate project</Dropdown.Item>
        <Dropdown.Item value="archive">Archive project</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>

    <Dropdown.Root v-else-if="props.variant === 'icons-inset'" aria-label="File actions">
      <Dropdown.Trigger as-child>
        <Button variant="outline">File actions <Dropdown.Indicator /></Button>
      </Dropdown.Trigger>
      <Dropdown.Content data-dropdown-surface="icons-inset">
        <Dropdown.Item value="open" :icon="FolderOpen">Open</Dropdown.Item>
        <Dropdown.Item value="copy" :icon="Copy">Copy path</Dropdown.Item>
        <Dropdown.Separator />
        <Dropdown.Group>
          <Dropdown.Label inset>Without icons</Dropdown.Label>
          <Dropdown.Item value="rename" inset>Rename</Dropdown.Item>
          <Dropdown.Item value="move" inset>Move</Dropdown.Item>
        </Dropdown.Group>
      </Dropdown.Content>
    </Dropdown.Root>

    <div v-else-if="props.variant === 'action-callbacks'" class="dropdown-demo__stack">
      <Dropdown.Root aria-label="Callback actions" @select="setAction($event.value)">
        <Dropdown.Trigger as-child>
          <Button variant="outline">Choose action <Dropdown.Indicator /></Button>
        </Dropdown.Trigger>
        <Dropdown.Content data-dropdown-surface="action-callbacks">
          <Dropdown.Item value="inspect" :icon="FileText">Inspect report</Dropdown.Item>
          <Dropdown.Item value="share" :icon="Share2">Share result</Dropdown.Item>
          <Dropdown.Item value="export" :icon="Download">Export data</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>
      <output aria-live="polite">{{ lastAction }}</output>
    </div>

    <div v-else-if="props.variant === 'checkbox-items'" class="dropdown-demo__stack">
      <Dropdown.Root aria-label="Visible columns">
        <Dropdown.Trigger as-child>
          <Button variant="outline">Visible columns <Dropdown.Indicator /></Button>
        </Dropdown.Trigger>
        <Dropdown.Content data-dropdown-surface="checkbox-items">
          <Dropdown.Group>
            <Dropdown.Label>Result table</Dropdown.Label>
            <Dropdown.CheckboxItem v-model:checked="activityVisible" value="activity">
              Activity
            </Dropdown.CheckboxItem>
            <Dropdown.CheckboxItem v-model:checked="compactRows" value="compact">
              Compact rows
            </Dropdown.CheckboxItem>
            <Dropdown.CheckboxItem value="locked" disabled>Owner details</Dropdown.CheckboxItem>
          </Dropdown.Group>
        </Dropdown.Content>
      </Dropdown.Root>
      <output aria-live="polite">
        Activity {{ activityVisible ? "shown" : "hidden" }} · Rows {{ compactRows ? "compact" : "normal" }}
      </output>
    </div>

    <div v-else-if="props.variant === 'radio-group'" class="dropdown-demo__stack">
      <Dropdown.Root aria-label="Row density">
        <Dropdown.Trigger as-child>
          <Button variant="outline">Density: {{ density }} <Dropdown.Indicator /></Button>
        </Dropdown.Trigger>
        <Dropdown.Content data-dropdown-surface="radio-group">
          <Dropdown.RadioGroup v-model="density">
            <Dropdown.Label>Row density</Dropdown.Label>
            <Dropdown.RadioItem value="compact">Compact</Dropdown.RadioItem>
            <Dropdown.RadioItem value="comfortable">Comfortable</Dropdown.RadioItem>
            <Dropdown.RadioItem value="spacious">Spacious</Dropdown.RadioItem>
          </Dropdown.RadioGroup>
        </Dropdown.Content>
      </Dropdown.Root>
      <output aria-live="polite">Selected: {{ density }}</output>
    </div>

    <Dropdown.Root v-else-if="props.variant === 'nested-submenu'" aria-label="Export actions">
      <Dropdown.Trigger as-child>
        <Button variant="outline">Export <Dropdown.Indicator /></Button>
      </Dropdown.Trigger>
      <Dropdown.Content data-dropdown-surface="nested-submenu">
        <Dropdown.Item value="quick" :icon="Download">Quick export</Dropdown.Item>
        <Dropdown.Sub aria-label="Export format">
          <Dropdown.SubTrigger :icon="FileText">Export as</Dropdown.SubTrigger>
          <Dropdown.SubContent data-dropdown-surface="nested-submenu-child">
            <Dropdown.Item value="csv">CSV table</Dropdown.Item>
            <Dropdown.Item value="json">JSON data</Dropdown.Item>
            <Dropdown.Item value="vtk">VTK fields</Dropdown.Item>
          </Dropdown.SubContent>
        </Dropdown.Sub>
        <Dropdown.Sub aria-label="Destination">
          <Dropdown.SubTrigger :icon="Share2">Send to</Dropdown.SubTrigger>
          <Dropdown.SubContent data-dropdown-surface="nested-destination">
            <Dropdown.Item value="workspace">Workspace</Dropdown.Item>
            <Dropdown.Item value="review">Review queue</Dropdown.Item>
          </Dropdown.SubContent>
        </Dropdown.Sub>
        <Dropdown.Sub aria-label="Unavailable export">
          <Dropdown.SubTrigger disabled>Legacy export</Dropdown.SubTrigger>
          <Dropdown.SubContent data-dropdown-surface="nested-disabled-child">
            <Dropdown.Item value="legacy">Legacy archive</Dropdown.Item>
          </Dropdown.SubContent>
        </Dropdown.Sub>
      </Dropdown.Content>
    </Dropdown.Root>

    <Dropdown.Root v-else-if="props.variant === 'custom-trigger'" aria-label="Account actions">
      <Dropdown.Trigger as-child>
        <Button aria-label="Open account menu" shape="circle" variant="ghost">
          <User aria-hidden="true" />
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Content data-dropdown-surface="custom-trigger">
        <Dropdown.Group>
          <Dropdown.Label>Ros</Dropdown.Label>
          <Dropdown.Item value="profile" :icon="User">Profile</Dropdown.Item>
          <Dropdown.Item value="settings" :icon="Settings">Settings</Dropdown.Item>
        </Dropdown.Group>
      </Dropdown.Content>
    </Dropdown.Root>

    <Dropdown.Root v-else-if="props.variant === 'navigation-links'" aria-label="Documentation links">
      <Dropdown.Trigger as-child>
        <Button variant="outline">Documentation <Dropdown.Indicator /></Button>
      </Dropdown.Trigger>
      <Dropdown.Content data-dropdown-surface="navigation-links">
        <Dropdown.LinkItem href="/docs/components/button" value-text="Button" :icon="ExternalLink">
          Button
        </Dropdown.LinkItem>
        <Dropdown.LinkItem href="/docs/components/dialog" value-text="Dialog" :icon="ExternalLink">
          Dialog
        </Dropdown.LinkItem>
        <Dropdown.LinkItem
          href="https://ark-ui.com/docs/components/menu"
          value-text="Ark UI Menu"
          target="_blank"
          :icon="ExternalLink"
        >
          Ark UI Menu
        </Dropdown.LinkItem>
        <Dropdown.LinkItem href="/docs/components/missing" value-text="Unavailable guide" disabled>
          Unavailable guide
        </Dropdown.LinkItem>
      </Dropdown.Content>
    </Dropdown.Root>

    <div v-else-if="props.variant === 'controlled'" class="dropdown-demo__stack">
      <Dropdown.Root v-model:open="controlledOpen" aria-label="Controlled actions">
        <Dropdown.Trigger as-child>
          <Button variant="outline">Controlled menu <Dropdown.Indicator /></Button>
        </Dropdown.Trigger>
        <Dropdown.Content data-dropdown-surface="controlled">
          <Dropdown.Item value="pause">Pause run</Dropdown.Item>
          <Dropdown.Item value="resume">Resume run</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>
      <output aria-live="polite">State: {{ controlledOpen ? "open" : "closed" }}</output>
    </div>

    <Dropdown.Root v-else-if="props.variant === 'destructive-disabled'" aria-label="Status actions">
      <Dropdown.Trigger as-child>
        <Button variant="outline">More actions <Dropdown.Indicator /></Button>
      </Dropdown.Trigger>
      <Dropdown.Content data-dropdown-surface="destructive-disabled">
        <Dropdown.Item value="details">View details</Dropdown.Item>
        <Dropdown.Item value="restart" disabled>Restart while active</Dropdown.Item>
        <Dropdown.Separator />
        <Dropdown.Item value="delete" variant="destructive" :icon="Trash2">Delete permanently</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>

    <Dropdown.Root v-else-if="props.variant === 'long-list'" aria-label="Recent runs">
      <Dropdown.Trigger as-child>
        <Button variant="outline">Recent runs <Dropdown.Indicator /></Button>
      </Dropdown.Trigger>
      <Dropdown.Content
        data-dropdown-surface="long-list"
        style="--kappa-dropdown-max-block-size: 14rem; --kappa-dropdown-min-inline-size: 16rem"
      >
        <Dropdown.Group>
          <Dropdown.Label>Recent runs</Dropdown.Label>
          <Dropdown.Item
            v-for="item in longListItems"
            :key="item.value"
            :value="item.value"
            :value-text="item.label"
          >
            <Dropdown.ItemText>{{ item.label }}</Dropdown.ItemText>
          </Dropdown.Item>
        </Dropdown.Group>
      </Dropdown.Content>
    </Dropdown.Root>

    <Dropdown.Root v-else-if="props.variant === 'context-menu'" aria-label="Canvas actions">
      <Dropdown.ContextTrigger class="dropdown-demo__context-zone">
        Right-click or press Shift+F10
      </Dropdown.ContextTrigger>
      <Dropdown.Content data-dropdown-surface="context-menu">
        <Dropdown.Item value="inspect" :icon="FileText">Inspect cell</Dropdown.Item>
        <Dropdown.Item value="copy" :icon="Copy">Copy coordinates</Dropdown.Item>
        <Dropdown.Item value="settings" :icon="Settings">Cell settings</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>

    <div v-else dir="rtl">
      <Dropdown.Root dir="rtl" aria-label="إجراءات التشغيل">
        <Dropdown.Trigger as-child>
          <Button variant="outline">إجراءات التشغيل <Dropdown.Indicator /></Button>
        </Dropdown.Trigger>
        <Dropdown.Content data-dropdown-surface="right-to-left">
          <Dropdown.Item value="open">فتح النتائج</Dropdown.Item>
          <Dropdown.Sub aria-label="خيارات التصدير">
            <Dropdown.SubTrigger>تصدير كـ</Dropdown.SubTrigger>
            <Dropdown.SubContent data-dropdown-surface="right-to-left-child">
              <Dropdown.Item value="csv">جدول CSV</Dropdown.Item>
              <Dropdown.Item value="json">بيانات JSON</Dropdown.Item>
            </Dropdown.SubContent>
          </Dropdown.Sub>
          <Dropdown.Separator />
          <Dropdown.Item value="delete" variant="destructive">حذف التشغيل</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>
    </div>
  </div>
</template>

<style scoped src="./dropdown-docs-demo.css"></style>
