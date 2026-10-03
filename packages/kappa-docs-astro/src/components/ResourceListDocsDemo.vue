<script setup lang="ts">
import { computed, ref } from "vue";
import { ResourceListLayout } from "@dicehub/kappa/blocks/resource-list-layout";
import { Button } from "@dicehub/kappa/components/button";
import { ButtonGroup } from "@dicehub/kappa/components/button-group";
import { Card } from "@dicehub/kappa/components/card";
import { Dropdown } from "@dicehub/kappa/components/dropdown";
import { Input } from "@dicehub/kappa/components/input";
import { Item } from "@dicehub/kappa/components/item";
import { Meter } from "@dicehub/kappa/components/meter";

type DemoVariant = "complete" | "compact" | "minimal";

interface Resource {
  name: string;
  namespace: string;
  description: string;
  kind: "Project" | "Group";
  activity: string;
  members: number;
  visibility: "Public" | "Private" | "Internal";
  updatedOrder: number;
  createdOrder: number;
}

const props = withDefaults(
  defineProps<{ standalone?: boolean; variant?: DemoVariant }>(),
  {
    standalone: false,
    variant: "complete",
  },
);

const resources: Resource[] = [
  {
    name: "Turbine cooling study",
    namespace: "engineering / thermal",
    description: "Conjugate heat-transfer model for the first-stage blade.",
    kind: "Project",
    activity: "8 min ago",
    members: 6,
    visibility: "Private",
    updatedOrder: 4,
    createdOrder: 1,
  },
  {
    name: "Mach 2 inlet",
    namespace: "engineering / aerodynamics",
    description: "Transient pressure sweep with adaptive refinement.",
    kind: "Project",
    activity: "Yesterday",
    members: 4,
    visibility: "Internal",
    updatedOrder: 3,
    createdOrder: 3,
  },
  {
    name: "Propulsion",
    namespace: "engineering",
    description: "Shared models, materials, and validation cases.",
    kind: "Group",
    activity: "4 days ago",
    members: 12,
    visibility: "Public",
    updatedOrder: 2,
    createdOrder: 4,
  },
  {
    name: "Cryogenic transfer line",
    namespace: "engineering / fluids",
    description: "Two-phase flow model for the ground system.",
    kind: "Project",
    activity: "12 Sep",
    members: 3,
    visibility: "Private",
    updatedOrder: 1,
    createdOrder: 2,
  },
];

const query = ref("");
const sortField = ref("updated");
const sortDescending = ref(true);
const viewMode = ref<"grid" | "list">("list");
const sortLabel = computed(() =>
  ({
    created: "Created date",
    name: "Name",
    updated: "Updated date",
  })[sortField.value] ?? "Updated date",
);
const gridView = computed(() => viewMode.value === "grid");

const displayedResources = computed(() => {
  const normalizedQuery = query.value.trim().toLocaleLowerCase();
  const filtered = resources.filter(resource =>
    (
      normalizedQuery.length === 0 ||
      `${resource.name} ${resource.namespace} ${resource.description}`
        .toLocaleLowerCase()
        .includes(normalizedQuery)
    ),
  );

  filtered.sort((first, second) => {
    const comparison = sortField.value === "name"
      ? first.name.localeCompare(second.name)
      : sortField.value === "created"
        ? first.createdOrder - second.createdOrder
        : first.updatedOrder - second.updatedOrder;

    return sortDescending.value ? -comparison : comparison;
  });

  return props.variant === "compact" ? filtered.slice(0, 3) : filtered;
});

const itemSize = computed(() => (props.variant === "compact" ? "xs" : "sm"));
const layoutDensity = computed(() =>
  props.variant === "compact" ? "compact" : "default",
);
const showsChrome = computed(() => props.variant !== "minimal");
</script>

<template>
  <div
    class="resource-list-demo"
    :data-resource-list-demo="props.variant"
    :data-standalone="props.standalone ? '' : undefined"
  >
    <ResourceListLayout
      :density="layoutDensity"
      :title="showsChrome ? 'Resources' : undefined"
      :description="
        showsChrome
          ? 'Projects and groups available in the Engineering namespace.'
          : undefined
      "
    >
      <template v-if="showsChrome" #icon>
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 7.5h6l2-2h8v13H4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />
          <path d="M4 10h16" stroke="currentColor" stroke-width="1.6" />
        </svg>
      </template>

      <template v-if="showsChrome && props.variant !== 'complete'" #actions>
        <Button variant="primary" size="sm" data-resource-action>
          New resource
        </Button>
      </template>

      <template v-if="props.variant === 'complete'" #toolbar>
        <form class="resource-list-demo__toolbar" role="search" @submit.prevent>
          <div class="resource-list-demo__search">
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="7" cy="7" r="4" stroke="currentColor" stroke-width="1.4" />
              <path d="m10 10 3 3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
            </svg>
            <Input
              v-model="query"
              type="search"
              size="sm"
              aria-label="Search resources"
              placeholder="Filter by name..."
            />
          </div>
          <Dropdown.Root
            aria-label="Sort resources"
            :positioning="{ placement: 'bottom-start' }"
          >
            <Dropdown.Trigger as-child>
              <Button
                variant="outline"
                size="sm"
                class="resource-list-demo__sort-filter"
                :aria-label="`Sort resources: ${sortLabel}`"
              >
                {{ sortLabel }}
                <Dropdown.Indicator />
              </Button>
            </Dropdown.Trigger>
            <Dropdown.Content class="resource-list-demo__sort-menu">
              <Dropdown.RadioGroup v-model="sortField">
                <Dropdown.Label>Sort by</Dropdown.Label>
                <Dropdown.RadioItem value="updated" close-on-select>Updated date</Dropdown.RadioItem>
                <Dropdown.RadioItem value="created" close-on-select>Created date</Dropdown.RadioItem>
                <Dropdown.RadioItem value="name" close-on-select>Name</Dropdown.RadioItem>
              </Dropdown.RadioGroup>
            </Dropdown.Content>
          </Dropdown.Root>
          <Button
            class="resource-list-demo__sort-direction"
            variant="outline"
            size="sm"
            shape="square"
            :aria-label="sortDescending ? 'Sort ascending' : 'Sort descending'"
            :title="sortDescending ? 'Sort ascending' : 'Sort descending'"
            @click="sortDescending = !sortDescending"
          >
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2.5 4.25h8M2.5 8h5.5M2.5 11.75h3" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" />
              <path v-if="sortDescending" d="M12 3v9m0 0-2-2m2 2 2-2" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" />
              <path v-else d="M12 13V4m0 0-2 2m2-2 2 2" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </Button>
          <div class="resource-list-demo__toolbar-actions">
            <ButtonGroup.Root
              class="resource-list-demo__view-switcher"
              aria-label="Resource view"
            >
              <Button
                aria-label="List view"
                :aria-pressed="viewMode === 'list'"
                shape="square"
                size="sm"
                variant="outline"
                @click="viewMode = 'list'"
              >
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M5.5 4h8M5.5 8h8M5.5 12h8" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" />
                  <circle cx="2.5" cy="4" r="0.75" fill="currentColor" /><circle cx="2.5" cy="8" r="0.75" fill="currentColor" /><circle cx="2.5" cy="12" r="0.75" fill="currentColor" />
                </svg>
              </Button>
              <Button
                aria-label="Grid view"
                :aria-pressed="viewMode === 'grid'"
                shape="square"
                size="sm"
                variant="outline"
                @click="viewMode = 'grid'"
              >
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <rect x="2.5" y="2.5" width="4" height="4" rx="0.5" stroke="currentColor" /><rect x="9.5" y="2.5" width="4" height="4" rx="0.5" stroke="currentColor" /><rect x="2.5" y="9.5" width="4" height="4" rx="0.5" stroke="currentColor" /><rect x="9.5" y="9.5" width="4" height="4" rx="0.5" stroke="currentColor" />
                </svg>
              </Button>
            </ButtonGroup.Root>
            <Button variant="primary" size="sm" data-resource-action>New resource</Button>
          </div>
        </form>
      </template>

      <div
        v-if="displayedResources.length"
        class="resource-list-demo__list-surface"
        :data-view="gridView ? 'grid' : 'list'"
      >
        <Item.Group class="resource-list-demo__list" :data-view="gridView ? 'grid' : 'list'">
          <Item.Root
            v-for="resource in displayedResources"
            :key="resource.name"
            as="article"
            :size="itemSize"
            class="resource-list-demo__item"
          >
            <Item.Media variant="icon" :data-kind="resource.kind.toLowerCase()">
              <span aria-hidden="true">{{ resource.name.charAt(0) }}</span>
            </Item.Media>
            <Item.Content>
              <Item.Title>
                <a href="#" @click.prevent>{{ resource.name }}</a>
              </Item.Title>
              <Item.Description>{{ resource.namespace }}</Item.Description>
            </Item.Content>
            <Item.Actions>
              <div class="resource-list-demo__meta">
                <span>{{ resource.activity }}</span>
                <span class="resource-list-demo__members" :aria-label="`${resource.members} members`">
                  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <circle cx="8" cy="5" r="2.25" stroke="currentColor" stroke-width="1.25" />
                    <path d="M3.75 13c.35-2.2 1.8-3.5 4.25-3.5s3.9 1.3 4.25 3.5" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" />
                  </svg>
                  {{ resource.members }}
                </span>
                <span class="resource-list-demo__visibility" :aria-label="resource.visibility">
                  <svg v-if="resource.visibility === 'Public'" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <circle cx="8" cy="8" r="5.5" stroke="currentColor" stroke-width="1.25" /><path d="M2.75 8h10.5M8 2.5c1.45 1.45 2.2 3.28 2.2 5.5S9.45 12.05 8 13.5C6.55 12.05 5.8 10.22 5.8 8S6.55 3.95 8 2.5Z" stroke="currentColor" stroke-width="1.1" />
                  </svg>
                  <svg v-else viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <rect x="3.5" y="7" width="9" height="6.5" rx="1.25" stroke="currentColor" stroke-width="1.25" /><path d="M5.5 7V5.25a2.5 2.5 0 0 1 5 0V7" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" />
                  </svg>
                </span>
              </div>
            </Item.Actions>
          </Item.Root>
        </Item.Group>
      </div>

      <div v-else class="resource-list-demo__empty" role="status">
        <strong>No resources found</strong>
        <span>Change the search text and try again.</span>
      </div>

      <template v-if="props.variant === 'complete'" #aside>
        <Card size="sm" as="section">
          <Card.Header>
            <Card.Title as="h2">Workspace usage</Card.Title>
            <Card.Description>Current billing period</Card.Description>
          </Card.Header>
          <Card.Content class="resource-list-demo__usage">
            <Meter label="Compute" :value="64" size="sm" value-text="128 of 200 hours" />
            <Meter label="Storage" :value="38" size="sm" value-text="76 of 200 GB" tone="neutral" />
          </Card.Content>
        </Card>
        <Card size="sm" as="section">
          <Card.Header>
            <Card.Title as="h2">Need a clean start?</Card.Title>
            <Card.Description>Import a case or create a project from a template.</Card.Description>
          </Card.Header>
          <Card.Footer>
            <Button variant="outline" size="sm">View templates</Button>
          </Card.Footer>
        </Card>
      </template>
    </ResourceListLayout>
  </div>
</template>

<style src="./resource-list-docs-demo.css"></style>
