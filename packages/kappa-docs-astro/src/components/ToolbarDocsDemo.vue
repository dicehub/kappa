<script setup lang="ts">
import {
  BookOpen,
  Download,
  ListFilter,
  Search,
  Settings2,
  Upload,
} from "@lucide/vue";
import { Combobox } from "@dicehub/kappa/components/combobox";
import { InputGroup } from "@dicehub/kappa/components/input-group";
import { Select } from "@dicehub/kappa/components/select";
import { Toolbar, type ToolbarSize } from "@dicehub/kappa/components/toolbar";

type DemoVariant =
  | "preview"
  | "select"
  | "combobox"
  | "input-shorthand"
  | "input-group"
  | "sizes"
  | "button-actions"
  | "links"
  | "accessible-labels";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const sizes: ToolbarSize[] = ["xs", "sm", "base", "lg"];
const sortItems = ["Name", "Created date", "Status"];
const statusItems = ["All records", "Active", "Paused", "Failed"];
</script>

<template>
  <div class="toolbar-demo" :data-toolbar-demo="props.variant">
    <Toolbar
      v-if="props.variant === 'preview'"
      aria-label="Record tools"
      class="toolbar-demo__wide"
    >
      <Toolbar.InputGroup aria-label="Search records" class="toolbar-demo__grow">
        <InputGroup.Addon><Search aria-hidden="true" /></InputGroup.Addon>
        <InputGroup.Input placeholder="Search records" />
      </Toolbar.InputGroup>
      <Toolbar.Button :icon="ListFilter" aria-label="Filter" />
      <Toolbar.Button :icon="Settings2" aria-label="Settings" />
    </Toolbar>

    <Toolbar v-else-if="props.variant === 'select'" aria-label="Filter and sort records">
      <Toolbar.Button :icon="ListFilter">Filter</Toolbar.Button>
      <Select
        id="toolbar-sort-records"
        aria-label="Sort records"
        :default-value="['Name']"
        :items="sortItems"
        :positioning="{ sameWidth: false }"
      >
        <Select.Trigger as-child>
          <Toolbar.Button><Select.ValueText /></Toolbar.Button>
        </Select.Trigger>
        <Select.Positioner>
          <Select.Content class="toolbar-demo__select-content">
            <Select.List>
              <template #default="{ item }">
                <Select.Item :item="item">{{ item }}</Select.Item>
              </template>
            </Select.List>
          </Select.Content>
        </Select.Positioner>
      </Select>
      <Toolbar.Button :icon="Settings2" aria-label="View settings" />
    </Toolbar>

    <Toolbar
      v-else-if="props.variant === 'combobox'"
      aria-label="Filter record status"
      class="toolbar-demo__wide"
    >
      <Toolbar.Button :icon="ListFilter">Status</Toolbar.Button>
      <Combobox
        id="toolbar-filter-status"
        :default-value="['All records']"
        :items="statusItems"
      >
        <Combobox.TriggerInput as-child>
          <Toolbar.Input
            aria-label="Filter status"
            class="toolbar-demo__grow"
            placeholder="Filter status…"
          />
        </Combobox.TriggerInput>
        <Combobox.Content>
          <Combobox.Empty>No matching status.</Combobox.Empty>
          <Combobox.List>
            <template #default="{ item }">
              <Combobox.Item :item="item">{{ item }}</Combobox.Item>
            </template>
          </Combobox.List>
        </Combobox.Content>
      </Combobox>
      <Toolbar.Button :icon="Settings2" aria-label="Status settings" />
    </Toolbar>

    <Toolbar
      v-else-if="props.variant === 'input-shorthand'"
      aria-label="Search records"
      class="toolbar-demo__wide"
    >
      <Toolbar.Input
        aria-label="Search records"
        class="toolbar-demo__grow"
        placeholder="Search records"
      />
      <Toolbar.Button :icon="ListFilter" aria-label="Filter" />
      <Toolbar.Button :icon="Settings2" aria-label="Settings" />
    </Toolbar>

    <Toolbar
      v-else-if="props.variant === 'input-group'"
      aria-label="Open a site"
      class="toolbar-demo__wide toolbar-demo__wide--lg"
    >
      <Toolbar.InputGroup aria-label="Site address" class="toolbar-demo__grow">
        <InputGroup.Input aria-label="Site subdomain" placeholder="docs" />
        <InputGroup.Addon align="inline-end">
          <InputGroup.Text>.example.com</InputGroup.Text>
        </InputGroup.Addon>
      </Toolbar.InputGroup>
      <Toolbar.Button>Open</Toolbar.Button>
    </Toolbar>

    <div v-else-if="props.variant === 'sizes'" class="toolbar-demo__sizes">
      <div v-for="size in sizes" :key="size" class="toolbar-demo__size-row">
        <span class="toolbar-demo__size-label">{{ size }}</span>
        <Toolbar :aria-label="`${size} toolbar`" :size="size">
          <Toolbar.Input :aria-label="`${size} search`" placeholder="Search…" />
          <Toolbar.Button>Apply</Toolbar.Button>
        </Toolbar>
      </div>
    </div>

    <Toolbar v-else-if="props.variant === 'button-actions'" aria-label="File actions">
      <Toolbar.Button :icon="Upload">Upload</Toolbar.Button>
      <Toolbar.Button :icon="Download">Download</Toolbar.Button>
    </Toolbar>

    <Toolbar v-else-if="props.variant === 'links'" aria-label="Documentation actions">
      <Toolbar.Link href="/docs/components/button" :icon="BookOpen">Button docs</Toolbar.Link>
      <Toolbar.Button :icon="Download">Download</Toolbar.Button>
    </Toolbar>

    <Toolbar v-else aria-label="Search records" class="toolbar-demo__wide toolbar-demo__wide--lg">
      <Toolbar.Input aria-label="Search records" class="toolbar-demo__grow" placeholder="Search" />
      <Toolbar.Button :icon="Search" aria-label="Search" />
    </Toolbar>
  </div>
</template>

<style scoped>
.toolbar-demo {
  display: grid;
  inline-size: 100%;
  min-inline-size: 0;
  place-items: center;
  color: var(--kappa-default, #17191f);
  font-family: var(--kappa-font-sans, inherit);
}

.toolbar-demo__wide {
  inline-size: min(100%, 28rem);
}

.toolbar-demo__wide--lg {
  inline-size: min(100%, 32rem);
}

.toolbar-demo__grow {
  flex: 1 1 auto;
}

.toolbar-demo__select-content {
  min-inline-size: 10rem;
}

.toolbar-demo__sizes {
  display: grid;
  gap: 0.75rem;
}

.toolbar-demo__size-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.toolbar-demo__size-label {
  inline-size: 2.5rem;
  color: var(--kappa-subtle, #6c7480);
  font-size: 0.8125rem;
  line-height: 1.25rem;
}

@media (max-width: 34rem) {
  .toolbar-demo__wide {
    inline-size: 100%;
  }

  .toolbar-demo__size-row {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.375rem;
  }
}
</style>
