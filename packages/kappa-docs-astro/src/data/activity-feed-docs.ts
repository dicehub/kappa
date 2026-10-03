import expandableCode from "../components/ActivityFeedExpandableDemo.vue?raw";

export const barrelCode = `import {
  ActivityFeed,
  ActivityFeedActions,
  ActivityFeedContent,
  ActivityFeedDescription,
  ActivityFeedGroup,
  ActivityFeedGroupLabel,
  ActivityFeedHeader,
  ActivityFeedItem,
  ActivityFeedList,
  ActivityFeedMarker,
  ActivityFeedRoot,
  ActivityFeedTime,
  ActivityFeedTitle,
} from "@dicehub/kappa";`;

export const granularCode = `import {
  ActivityFeed,
  ActivityFeedItem,
  ActivityFeedMarker,
  type ActivityFeedTone,
} from "@dicehub/kappa/components/activity-feed";`;

export const previewCode = `<script setup>
import { ActivityFeed } from "@dicehub/kappa/components/activity-feed";
import { Avatar } from "@dicehub/kappa/components/avatar";
</script>

<template>
  <ActivityFeed.Root>
    <ActivityFeed.Group aria-labelledby="activity-today">
      <ActivityFeed.GroupLabel id="activity-today">Today</ActivityFeed.GroupLabel>
      <ActivityFeed.List aria-label="Project activity">
        <ActivityFeed.Item>
          <ActivityFeed.Marker variant="avatar">
            <Avatar.Root>
              <Avatar.Image src="/avatars/mei-chen.webp" alt="" />
              <Avatar.Fallback aria-hidden="true">MC</Avatar.Fallback>
            </Avatar.Root>
          </ActivityFeed.Marker>
          <ActivityFeed.Content>
            <ActivityFeed.Header>
              <ActivityFeed.Title>Mei Chen</ActivityFeed.Title>
              <ActivityFeed.Time datetime="2026-09-19T14:32:00Z">14:32</ActivityFeed.Time>
            </ActivityFeed.Header>
            <ActivityFeed.Description>
              Started run <a href="/runs/184">184</a> in Wind tunnel · 32 cores
            </ActivityFeed.Description>
          </ActivityFeed.Content>
        </ActivityFeed.Item>
      </ActivityFeed.List>
    </ActivityFeed.Group>
  </ActivityFeed.Root>
</template>`;

export const usageCode = `<script setup>
import { Play } from "@lucide/vue";
import { ActivityFeed } from "@dicehub/kappa/components/activity-feed";
</script>

<template>
  <ActivityFeed.Root>
    <ActivityFeed.List aria-label="Recent activity">
      <ActivityFeed.Item tone="accent">
        <ActivityFeed.Marker variant="icon"><Play aria-hidden="true" /></ActivityFeed.Marker>
        <ActivityFeed.Content>
          <ActivityFeed.Header>
            <ActivityFeed.Title>Simulation started</ActivityFeed.Title>
            <ActivityFeed.Time datetime="2026-09-19T14:32:00Z">2 min ago</ActivityFeed.Time>
          </ActivityFeed.Header>
          <ActivityFeed.Description>Run 184 is preparing compute resources.</ActivityFeed.Description>
        </ActivityFeed.Content>
      </ActivityFeed.Item>
    </ActivityFeed.List>
  </ActivityFeed.Root>
</template>`;

export const compositionCode = `ActivityFeed.Root
└── ActivityFeed.Group (optional)
    ├── ActivityFeed.GroupLabel
    └── ActivityFeed.List
        └── ActivityFeed.Item
            ├── ActivityFeed.Marker
            └── ActivityFeed.Content
                ├── ActivityFeed.Header
                │   ├── ActivityFeed.Title
                │   └── ActivityFeed.Time
                ├── ActivityFeed.Description
                └── ActivityFeed.Actions (optional)`;

const compactCode = `<script setup>
import { ActivityFeed } from "@dicehub/kappa/components/activity-feed";

const events = [
  { title: "Boundary condition updated", time: "14:32" },
  { title: "Geometry synchronized", time: "14:29" },
];
</script>

<template>
  <ActivityFeed.Root size="compact">
    <ActivityFeed.List aria-label="Configuration history">
      <ActivityFeed.Item v-for="event in events" :key="event.time">
        <ActivityFeed.Marker />
        <ActivityFeed.Content>
          <ActivityFeed.Header>
            <ActivityFeed.Title>{{ event.title }}</ActivityFeed.Title>
            <ActivityFeed.Time>{{ event.time }}</ActivityFeed.Time>
          </ActivityFeed.Header>
        </ActivityFeed.Content>
      </ActivityFeed.Item>
    </ActivityFeed.List>
  </ActivityFeed.Root>
</template>`;

const markersCode = `<script setup>
import { Bot } from "@lucide/vue";
import { ActivityFeed } from "@dicehub/kappa/components/activity-feed";
import { Avatar } from "@dicehub/kappa/components/avatar";
</script>

<template>
  <ActivityFeed.Root>
    <ActivityFeed.List aria-label="Marker examples">
      <ActivityFeed.Item>
        <ActivityFeed.Marker />
        <ActivityFeed.Content><ActivityFeed.Title>Automatic system event</ActivityFeed.Title></ActivityFeed.Content>
      </ActivityFeed.Item>
      <ActivityFeed.Item tone="accent">
        <ActivityFeed.Marker variant="icon"><Bot aria-hidden="true" /></ActivityFeed.Marker>
        <ActivityFeed.Content><ActivityFeed.Title>Agent prepared a configuration</ActivityFeed.Title></ActivityFeed.Content>
      </ActivityFeed.Item>
      <ActivityFeed.Item>
        <ActivityFeed.Marker variant="avatar">
          <Avatar.Root><Avatar.Fallback aria-hidden="true">LH</Avatar.Fallback></Avatar.Root>
        </ActivityFeed.Marker>
        <ActivityFeed.Content><ActivityFeed.Title>Lina added a review note</ActivityFeed.Title></ActivityFeed.Content>
      </ActivityFeed.Item>
    </ActivityFeed.List>
  </ActivityFeed.Root>
</template>`;

const tonesCode = `<script setup lang="ts">
import { ActivityFeed, type ActivityFeedTone } from "@dicehub/kappa/components/activity-feed";

const tones: ActivityFeedTone[] = ["neutral", "accent", "success", "warning", "danger"];
</script>

<template>
  <ActivityFeed.Root size="compact">
    <ActivityFeed.List aria-label="Activity tones">
      <ActivityFeed.Item v-for="tone in tones" :key="tone" :tone="tone">
        <ActivityFeed.Marker />
        <ActivityFeed.Content><ActivityFeed.Title>{{ tone }} event</ActivityFeed.Title></ActivityFeed.Content>
      </ActivityFeed.Item>
    </ActivityFeed.List>
  </ActivityFeed.Root>
</template>`;

const actionsCode = `<script setup>
import { ActivityFeed } from "@dicehub/kappa/components/activity-feed";
import { Button } from "@dicehub/kappa/components/button";
</script>

<template>
  <ActivityFeed.Root>
    <ActivityFeed.List aria-label="Review activity">
      <ActivityFeed.Item tone="warning">
        <ActivityFeed.Marker />
        <ActivityFeed.Content>
          <ActivityFeed.Title>Lina requested changes</ActivityFeed.Title>
          <ActivityFeed.Description>Review the inlet setup.</ActivityFeed.Description>
          <ActivityFeed.Actions>
            <Button size="sm" variant="secondary">Open comment</Button>
            <Button size="sm" variant="ghost">Resolve</Button>
          </ActivityFeed.Actions>
        </ActivityFeed.Content>
      </ActivityFeed.Item>
    </ActivityFeed.List>
  </ActivityFeed.Root>
</template>`;

export const examples = [
  {
    id: "compact",
    title: "Compact",
    description: "Use compact density for audit trails and high-frequency configuration events.",
    variant: "compact",
    code: compactCode,
  },
  {
    id: "markers",
    title: "Markers",
    description: "Distinguish system events, typed actions, and people with dot, icon, and avatar markers.",
    variant: "markers",
    code: markersCode,
  },
  {
    id: "tones",
    title: "Tones",
    description: "Apply restrained semantic color to the marker without coloring the full event row.",
    variant: "tones",
    code: tonesCode,
  },
  {
    id: "expandable",
    title: "Long activity",
    description: "Keep a long update collapsed until it is needed. Select the arrow at the bottom center to expand the card and read the full review. The arrow stays below the content and points up when open. Collapsible supplies keyboard controls, height animation, and reduced-motion support.",
    variant: "expandable",
    code: expandableCode,
  },
  {
    id: "actions",
    title: "Actions",
    description: "Place event-specific controls after the description while keeping the title readable.",
    variant: "actions",
    code: actionsCode,
  },
] as const;

export const rootProps = [
  {
    name: "size",
    type: '"default" | "compact"',
    defaultValue: '"default"',
    description: "Controls event spacing, marker dimensions, and type scale.",
  },
] as const;

export const itemProps = [
  {
    name: "tone",
    type: '"neutral" | "accent" | "success" | "warning" | "danger"',
    defaultValue: '"neutral"',
    description: "Applies semantic color to the event marker.",
  },
] as const;

export const markerProps = [
  {
    name: "variant",
    type: '"dot" | "icon" | "avatar"',
    defaultValue: '"dot"',
    description: "Selects marker geometry for automatic, typed, or person events.",
  },
] as const;

export const semanticProps = [
  {
    part: "GroupLabel / Title",
    name: "as",
    type: '"h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div"',
    defaultValue: '"h3" / "p"',
    description: "Selects a safe native heading or text element.",
  },
  {
    part: "Time",
    name: "datetime",
    type: "string",
    defaultValue: "undefined",
    description: "Sets the machine-readable value on the native time element.",
  },
] as const;

export const parts = [
  ["ActivityFeed.Root", "div", "Root density and token scope."],
  ["ActivityFeed.Group", "section", "Optional set of events for one date or category."],
  ["ActivityFeed.GroupLabel", "h3", "Visible label for a group."],
  ["ActivityFeed.List", "ol", "Native ordered event list."],
  ["ActivityFeed.Item", "li", "One chronological event and its semantic tone."],
  ["ActivityFeed.Marker", "div", "Dot, icon, or avatar beside the event content."],
  ["ActivityFeed.Content", "div", "Flexible event content column."],
  ["ActivityFeed.Header", "div", "Title and time row."],
  ["ActivityFeed.Title", "p", "Primary event statement."],
  ["ActivityFeed.Description", "p", "Supporting event detail."],
  ["ActivityFeed.Time", "time", "Visible and machine-readable event time."],
  ["ActivityFeed.Actions", "div", "Optional event actions."],
] as const;

export const exportsList = [
  ["ActivityFeed", "Compound API exposing all Activity Feed parts."],
  ["ActivityFeedRoot", "Unaugmented root component."],
  ["ActivityFeedGroup / ActivityFeedGroupLabel", "Optional event grouping parts."],
  ["ActivityFeedList / ActivityFeedItem", "Native ordered list and list-item parts."],
  ["ActivityFeedMarker", "Dot, icon, or avatar marker."],
  ["ActivityFeedContent / ActivityFeedHeader", "Event content layout parts."],
  ["ActivityFeedTitle / ActivityFeedDescription", "Primary and supporting event copy."],
  ["ActivityFeedTime / ActivityFeedActions", "Event metadata and controls."],
  ["ActivityFeedSize / ActivityFeedTone / ActivityFeedMarkerVariant", "Public option unions."],
] as const;
