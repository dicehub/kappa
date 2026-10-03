<script setup lang="ts">
import { ArrowRight, CalendarDays, Check } from "@lucide/vue";
import { computed, ref } from "vue";
import { Badge } from "@dicehub/kappa/components/badge";
import { Button } from "@dicehub/kappa/components/button";
import { ButtonGroup } from "@dicehub/kappa/components/button-group";
import { Card } from "@dicehub/kappa/components/card";
import { Input } from "@dicehub/kappa/components/input";
import { Label } from "@dicehub/kappa/components/label";
import { Link } from "@dicehub/kappa/components/link";

type DemoVariant =
  | "preview"
  | "usage"
  | "layered"
  | "small"
  | "event"
  | "filter"
  | "linked"
  | "test-ids";
type StatusFilter = "all" | "2xx" | "4xx";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const email = ref("alex@example.com");
const signInStatus = ref("");
const activeFilter = ref<StatusFilter>("all");
const search = ref("");

const requests = [
  { origin: "api.example.com", status: "2xx", count: 42, duration: "128 ms" },
  { origin: "assets.example.com", status: "2xx", count: 19, duration: "86 ms" },
  { origin: "legacy.example.com", status: "4xx", count: 7, duration: "464 ms" },
] as const;
const filterOptions: Array<{ label: string; value: StatusFilter }> = [
  { label: "All", value: "all" },
  { label: "2xx", value: "2xx" },
  { label: "4xx", value: "4xx" },
];

const filteredRequests = computed(() => {
  const query = search.value.trim().toLowerCase();

  return requests.filter((request) => {
    if (activeFilter.value !== "all" && request.status !== activeFilter.value) return false;
    return !query || request.origin.includes(query);
  });
});

const submitSignIn = () => {
  signInStatus.value = `Sign-in requested for ${email.value}`;
};
</script>

<template>
  <div class="card-demo" :data-card-demo="props.variant">
    <div v-if="props.variant === 'preview'" class="card-demo__auth-shell">
      <Card as="form" class="card-demo__card card-demo__card--auth" @submit.prevent="submitSignIn">
        <Card.Header>
          <Card.Title>Sign in to your account</Card.Title>
          <Card.Description>Enter your details to continue.</Card.Description>
          <Card.Action>
            <Button type="button" size="xs" variant="ghost">Register</Button>
          </Card.Action>
        </Card.Header>
        <Card.Content>
          <div class="card-demo__fields">
            <div class="card-demo__field">
              <Label for="card-preview-email">Email</Label>
              <Input id="card-preview-email" v-model="email" autocomplete="email" required type="email" />
            </div>
            <div class="card-demo__field">
              <div class="card-demo__label-row">
                <Label for="card-preview-password">Password</Label>
                <Link href="#usage" variant="plain">Forgot password?</Link>
              </div>
              <Input
                id="card-preview-password"
                autocomplete="current-password"
                required
                type="password"
                value="correct-horse-battery-staple"
              />
            </div>
          </div>
        </Card.Content>
        <Card.Footer class="card-demo__auth-actions">
          <Button type="submit" variant="primary">Sign in</Button>
          <Button type="button" variant="outline">Continue with SSO</Button>
        </Card.Footer>
      </Card>
      <p class="card-demo__status" aria-live="polite">{{ signInStatus }}</p>
    </div>

    <Card v-else-if="props.variant === 'usage'" as="article" class="card-demo__card">
      <Card.Header>
        <Card.Title>Deployment window</Card.Title>
        <Card.Description>Tuesday, 18:00–19:00 UTC</Card.Description>
        <Card.Action><Badge variant="success">Ready</Badge></Card.Action>
      </Card.Header>
      <Card.Content>
        <dl class="card-demo__facts">
          <div><dt>Services</dt><dd>4</dd></div>
          <div><dt>Checks</dt><dd>12 / 12</dd></div>
        </dl>
      </Card.Content>
      <Card.Footer><Button size="sm" variant="outline">Review schedule</Button></Card.Footer>
    </Card>

    <Card v-else-if="props.variant === 'layered'" class="card-demo__card">
      <Card.Secondary as="header">Getting started</Card.Secondary>
      <Card.Primary as="article">
        <strong class="card-demo__layer-title">Project guide</strong>
        <span class="card-demo__muted">A short path from setup to first delivery.</span>
      </Card.Primary>
    </Card>

    <Card v-else-if="props.variant === 'small'" as="article" class="card-demo__card" size="sm">
      <Card.Header>
        <Card.Title>Scheduled reports</Card.Title>
        <Card.Description>Weekly snapshots without manual exports.</Card.Description>
      </Card.Header>
      <Card.Content>
        <ul class="card-demo__check-list">
          <li><Check :size="14" aria-hidden="true" />Choose daily or weekly delivery.</li>
          <li><Check :size="14" aria-hidden="true" />Send to a channel or teammate.</li>
          <li><Check :size="14" aria-hidden="true" />Include charts and key metrics.</li>
        </ul>
      </Card.Content>
      <Card.Footer>
        <Button size="xs" variant="primary">Set up reports</Button>
        <Button size="xs" variant="ghost">Learn more</Button>
      </Card.Footer>
    </Card>

    <Card v-else-if="props.variant === 'event'" as="article" class="card-demo__card card-demo__card--event">
      <div class="card-demo__cover" aria-hidden="true">
        <CalendarDays :size="28" />
        <span>18 SEP</span>
      </div>
      <Card.Header>
        <Card.Title>Design systems meetup</Card.Title>
        <Card.Description>A practical session on component APIs and accessibility.</Card.Description>
        <Card.Action><Badge>Featured</Badge></Card.Action>
      </Card.Header>
      <Card.Footer><Button size="sm" variant="primary">View event</Button></Card.Footer>
    </Card>

    <Card v-else-if="props.variant === 'filter'" class="card-demo__filter-card">
      <Card.Header>
        <Card.Title>Request origins</Card.Title>
        <Card.Description>Recent traffic grouped by host.</Card.Description>
      </Card.Header>
      <Card.Content>
        <div class="card-demo__toolbar">
          <Input
            v-model="search"
            aria-label="Filter origins"
            class="card-demo__search"
            placeholder="Filter origins..."
            size="sm"
          />
          <ButtonGroup aria-label="Status filter">
            <Button
              v-for="option in filterOptions"
              :key="option.value"
              :aria-pressed="activeFilter === option.value"
              size="xs"
              :variant="activeFilter === option.value ? 'secondary' : 'ghost'"
              @click="activeFilter = option.value"
            >
              {{ option.label }}
            </Button>
          </ButtonGroup>
        </div>
        <div class="card-demo__table" role="table" aria-label="Request origins">
          <div class="card-demo__row card-demo__row--header" role="row">
            <span role="columnheader">Origin</span>
            <span role="columnheader">Status</span>
            <span role="columnheader">Duration</span>
          </div>
          <div v-for="request in filteredRequests" :key="request.origin" class="card-demo__row" role="row">
            <span class="card-demo__origin" role="cell">{{ request.origin }}</span>
            <span role="cell">
              <Badge :variant="request.status === '2xx' ? 'success' : 'error'">
                {{ request.status }} {{ request.count }}
              </Badge>
            </span>
            <span class="card-demo__duration" role="cell">{{ request.duration }}</span>
          </div>
          <p v-if="filteredRequests.length === 0" class="card-demo__empty" role="status">
            No matching origins
          </p>
        </div>
      </Card.Content>
      <Card.Footer class="card-demo__filter-footer">
        Showing {{ filteredRequests.length }} of {{ requests.length }}
      </Card.Footer>
    </Card>

    <Card v-else-if="props.variant === 'linked'" as="article" class="card-demo__card">
      <Card.Secondary as="header">Release notes</Card.Secondary>
      <Card.Primary as="a" href="#composition" data-linked-primary>
        <strong class="card-demo__link-title">
          Read the component model
          <ArrowRight :size="16" aria-hidden="true" />
        </strong>
        <span class="card-demo__muted">One semantic anchor owns the complete primary layer.</span>
      </Card.Primary>
    </Card>

    <Card v-else class="card-demo__card" data-testid="card-root">
      <Card.Header data-testid="card-header">
        <Card.Title data-testid="card-title">Getting started</Card.Title>
        <Card.Description data-testid="card-description">Public attributes pass to every part.</Card.Description>
      </Card.Header>
      <Card.Content data-testid="card-content">A standard content region.</Card.Content>
      <Card.Footer data-testid="card-footer">Ready</Card.Footer>
    </Card>
  </div>
</template>

<style scoped src="./CardDocsDemo.css"></style>
