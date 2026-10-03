<script setup lang="ts">
import {
  AlertTriangle,
  Bot,
  Check,
  GitCommitHorizontal,
  MessageSquare,
  Play,
} from "@lucide/vue";
import { ActivityFeed } from "@dicehub/kappa/components/activity-feed";
import { Avatar } from "@dicehub/kappa/components/avatar";
import { Button } from "@dicehub/kappa/components/button";
import ActivityFeedExpandableDemo from "./ActivityFeedExpandableDemo.vue";

type DemoVariant = "preview" | "usage" | "compact" | "markers" | "tones" | "actions" | "expandable";

withDefaults(defineProps<{ variant?: DemoVariant }>(), { variant: "preview" });

const portraits = {
  lina: "/avatars/lina-haddad.webp",
  mei: "/avatars/mei-chen.webp",
};

const compactEvents = [
  { title: "Boundary condition updated", detail: "inlet.velocity · 14.2 m/s", time: "14:32" },
  { title: "Geometry synchronized", detail: "vehicle-body.step · 28.4 MB", time: "14:29" },
  { title: "Run settings saved", detail: "32 cores · 48 GB memory", time: "14:25" },
] as const;

const tones = [
  { tone: "neutral", label: "Configuration saved", icon: GitCommitHorizontal },
  { tone: "accent", label: "Simulation started", icon: Play },
  { tone: "success", label: "Mesh validation passed", icon: Check },
  { tone: "warning", label: "Residual target not reached", icon: AlertTriangle },
  { tone: "danger", label: "Solver stopped unexpectedly", icon: AlertTriangle },
] as const;
</script>

<template>
  <div class="activity-feed-demo" :data-activity-feed-demo="variant">
    <ActivityFeed.Root v-if="variant === 'preview'">
      <ActivityFeed.Group aria-labelledby="activity-feed-preview-today">
        <ActivityFeed.GroupLabel id="activity-feed-preview-today">Today</ActivityFeed.GroupLabel>
        <ActivityFeed.List aria-label="Project activity">
          <ActivityFeed.Item>
            <ActivityFeed.Marker variant="avatar">
              <Avatar.Root size="sm">
                <Avatar.Image :src="portraits.mei" alt="" />
                <Avatar.Fallback aria-hidden="true">MC</Avatar.Fallback>
              </Avatar.Root>
            </ActivityFeed.Marker>
            <ActivityFeed.Content>
              <ActivityFeed.Header>
                <ActivityFeed.Title class="activity-feed-demo__actor">
                  <strong>Mei Chen</strong>
                  <span class="activity-feed-demo__username">@mei</span>
                </ActivityFeed.Title>
                <ActivityFeed.Time datetime="2026-09-19T14:32:00Z">14:32</ActivityFeed.Time>
              </ActivityFeed.Header>
              <ActivityFeed.Description>
                Started run <a href="#usage">184</a> in Wind tunnel · 32 cores
              </ActivityFeed.Description>
            </ActivityFeed.Content>
          </ActivityFeed.Item>

          <ActivityFeed.Item>
            <ActivityFeed.Marker variant="icon"><Bot aria-hidden="true" /></ActivityFeed.Marker>
            <ActivityFeed.Content>
              <ActivityFeed.Header>
                <ActivityFeed.Title class="activity-feed-demo__actor">
                  <strong>API key</strong>
                  <span class="activity-feed-demo__username">Automation</span>
                </ActivityFeed.Title>
                <ActivityFeed.Time datetime="2026-09-19T14:18:00Z">14:18</ActivityFeed.Time>
              </ActivityFeed.Header>
              <ActivityFeed.Description>
                Completed surface validation · 18 checks passed
              </ActivityFeed.Description>
            </ActivityFeed.Content>
          </ActivityFeed.Item>

          <ActivityFeed.Item>
            <ActivityFeed.Marker variant="avatar">
              <Avatar.Root size="sm">
                <Avatar.Image :src="portraits.lina" alt="" />
                <Avatar.Fallback aria-hidden="true">LH</Avatar.Fallback>
              </Avatar.Root>
            </ActivityFeed.Marker>
            <ActivityFeed.Content>
              <ActivityFeed.Header>
                <ActivityFeed.Title class="activity-feed-demo__actor">
                  <strong>Lina Haddad</strong>
                  <span class="activity-feed-demo__username">@lina</span>
                </ActivityFeed.Title>
                <ActivityFeed.Time datetime="2026-09-19T13:47:00Z">13:47</ActivityFeed.Time>
              </ActivityFeed.Header>
              <ActivityFeed.Description>
                Uploaded <a href="#markers">vehicle-body.step</a> · 28.4 MB
              </ActivityFeed.Description>
            </ActivityFeed.Content>
          </ActivityFeed.Item>
        </ActivityFeed.List>
      </ActivityFeed.Group>
    </ActivityFeed.Root>

    <ActivityFeed.Root v-else-if="variant === 'usage'">
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

    <ActivityFeed.Root v-else-if="variant === 'compact'" size="compact">
      <ActivityFeed.Group aria-labelledby="activity-feed-compact-label">
        <ActivityFeed.GroupLabel id="activity-feed-compact-label">Configuration history</ActivityFeed.GroupLabel>
        <ActivityFeed.List aria-label="Configuration history">
          <ActivityFeed.Item v-for="event in compactEvents" :key="event.time">
            <ActivityFeed.Marker />
            <ActivityFeed.Content>
              <ActivityFeed.Header>
                <ActivityFeed.Title>{{ event.title }}</ActivityFeed.Title>
                <ActivityFeed.Time :datetime="`2026-09-19T${event.time}:00Z`">{{ event.time }}</ActivityFeed.Time>
              </ActivityFeed.Header>
              <ActivityFeed.Description>{{ event.detail }}</ActivityFeed.Description>
            </ActivityFeed.Content>
          </ActivityFeed.Item>
        </ActivityFeed.List>
      </ActivityFeed.Group>
    </ActivityFeed.Root>

    <ActivityFeed.Root v-else-if="variant === 'markers'">
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
            <Avatar.Root size="sm">
              <Avatar.Image :src="portraits.lina" alt="" />
              <Avatar.Fallback aria-hidden="true">LH</Avatar.Fallback>
            </Avatar.Root>
          </ActivityFeed.Marker>
          <ActivityFeed.Content><ActivityFeed.Title>Lina added a review note</ActivityFeed.Title></ActivityFeed.Content>
        </ActivityFeed.Item>
      </ActivityFeed.List>
    </ActivityFeed.Root>

    <ActivityFeed.Root v-else-if="variant === 'tones'" size="compact">
      <ActivityFeed.List aria-label="Activity tones">
        <ActivityFeed.Item v-for="item in tones" :key="item.tone" :tone="item.tone">
          <ActivityFeed.Marker variant="icon"><component :is="item.icon" aria-hidden="true" /></ActivityFeed.Marker>
          <ActivityFeed.Content>
            <ActivityFeed.Header>
              <ActivityFeed.Title>{{ item.label }}</ActivityFeed.Title>
              <ActivityFeed.Time datetime="2026-09-19T14:32:00Z">14:32</ActivityFeed.Time>
            </ActivityFeed.Header>
          </ActivityFeed.Content>
        </ActivityFeed.Item>
      </ActivityFeed.List>
    </ActivityFeed.Root>

    <ActivityFeedExpandableDemo v-else-if="variant === 'expandable'" />

    <ActivityFeed.Root v-else>
      <ActivityFeed.List aria-label="Review activity">
        <ActivityFeed.Item tone="warning">
          <ActivityFeed.Marker variant="icon"><MessageSquare aria-hidden="true" /></ActivityFeed.Marker>
          <ActivityFeed.Content>
            <ActivityFeed.Header>
              <ActivityFeed.Title>Lina requested changes to the inlet setup</ActivityFeed.Title>
              <ActivityFeed.Time datetime="2026-09-19T13:22:00Z">13:22</ActivityFeed.Time>
            </ActivityFeed.Header>
            <ActivityFeed.Description>The turbulence intensity must match the reference case.</ActivityFeed.Description>
            <ActivityFeed.Actions>
              <Button size="sm" variant="secondary">Open comment</Button>
              <Button size="sm" variant="ghost">Resolve</Button>
            </ActivityFeed.Actions>
          </ActivityFeed.Content>
        </ActivityFeed.Item>
      </ActivityFeed.List>
    </ActivityFeed.Root>
  </div>
</template>

<style scoped>
.activity-feed-demo {
  display: block;
  width: min(100%, 36rem);
  min-width: 0;
  color: var(--docs-default);
  font-family: var(--docs-font-sans, "Geist", sans-serif);
}

.activity-feed-demo strong {
  font-weight: 650;
}

.activity-feed-demo__actor {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0 0.5rem;
}

.activity-feed-demo__username {
  color: var(--docs-subtle);
  font-weight: 400;
  white-space: nowrap;
}

.activity-feed-demo[data-activity-feed-demo="preview"] {
  width: min(100%, 40rem);
}
</style>
