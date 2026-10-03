export const barrelCode = `import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardPrimary,
  CardSecondary,
  CardTitle,
} from "@dicehub/kappa";`;

export const granularCode = `import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardPrimary,
  CardSecondary,
  CardTitle,
} from "@dicehub/kappa/components/card";`;

export const previewCode = `<script setup>
import { ref } from "vue";
import { Button } from "@dicehub/kappa/components/button";
import { Card } from "@dicehub/kappa/components/card";
import { Input } from "@dicehub/kappa/components/input";
import { Label } from "@dicehub/kappa/components/label";

const email = ref("alex@example.com");
const status = ref("");
</script>

<template>
  <Card
    as="form"
    style="max-width: 23rem;"
    @submit.prevent="status = \`Sign-in requested for \${email}\`"
  >
    <Card.Header>
      <Card.Title>Sign in to your account</Card.Title>
      <Card.Description>Enter your details to continue.</Card.Description>
      <Card.Action><Button type="button" size="xs" variant="ghost">Register</Button></Card.Action>
    </Card.Header>
    <Card.Content>
      <Label for="email">Email</Label>
      <Input id="email" v-model="email" type="email" />
      <Label for="password">Password</Label>
      <Input id="password" type="password" />
    </Card.Content>
    <Card.Footer>
      <Button type="submit" variant="primary">Sign in</Button>
      <Button type="button" variant="outline">Continue with SSO</Button>
    </Card.Footer>
  </Card>
  <p aria-live="polite">{{ status }}</p>
</template>`;

export const usageCode = `<script setup>
import { Badge } from "@dicehub/kappa/components/badge";
import { Button } from "@dicehub/kappa/components/button";
import { Card } from "@dicehub/kappa/components/card";
</script>

<template>
  <Card as="article" style="width: 23rem;">
    <Card.Header>
      <Card.Title>Deployment window</Card.Title>
      <Card.Description>Tuesday, 18:00–19:00 UTC</Card.Description>
      <Card.Action><Badge variant="success">Ready</Badge></Card.Action>
    </Card.Header>
    <Card.Content>All 12 checks passed across four services.</Card.Content>
    <Card.Footer><Button size="sm" variant="outline">Review schedule</Button></Card.Footer>
  </Card>
</template>`;

const layeredCode = `<script setup>
import { Card } from "@dicehub/kappa/components/card";
</script>

<template>
  <Card style="width: 23rem;">
    <Card.Secondary as="header">Getting started</Card.Secondary>
    <Card.Primary as="article">
      <strong>Project guide</strong>
      <span>A short path from setup to first delivery.</span>
    </Card.Primary>
  </Card>
</template>`;

const smallCode = `<script setup>
import { Check } from "@lucide/vue";
import { Button } from "@dicehub/kappa/components/button";
import { Card } from "@dicehub/kappa/components/card";
</script>

<template>
  <Card as="article" size="sm" style="width: 23rem;">
    <Card.Header>
      <Card.Title>Scheduled reports</Card.Title>
      <Card.Description>Weekly snapshots without manual exports.</Card.Description>
    </Card.Header>
    <Card.Content>
      <ul>
        <li><Check aria-hidden="true" />Choose daily or weekly delivery.</li>
        <li><Check aria-hidden="true" />Send to a channel or teammate.</li>
        <li><Check aria-hidden="true" />Include charts and key metrics.</li>
      </ul>
    </Card.Content>
    <Card.Footer><Button size="xs">Set up reports</Button></Card.Footer>
  </Card>
</template>`;

const eventCode = `<script setup>
import { Badge } from "@dicehub/kappa/components/badge";
import { Button } from "@dicehub/kappa/components/button";
import { Card } from "@dicehub/kappa/components/card";
</script>

<template>
  <Card as="article" style="width: 23rem;">
    <img src="/event-cover.jpg" alt="People discussing a design system" />
    <Card.Header>
      <Card.Title>Design systems meetup</Card.Title>
      <Card.Description>A practical session on component APIs and accessibility.</Card.Description>
      <Card.Action><Badge>Featured</Badge></Card.Action>
    </Card.Header>
    <Card.Footer><Button size="sm">View event</Button></Card.Footer>
  </Card>
</template>`;

const filterCode = `<script setup>
import { computed, ref } from "vue";
import { Badge } from "@dicehub/kappa/components/badge";
import { Button } from "@dicehub/kappa/components/button";
import { ButtonGroup } from "@dicehub/kappa/components/button-group";
import { Card } from "@dicehub/kappa/components/card";
import { Input } from "@dicehub/kappa/components/input";

const requests = [
  { origin: "api.example.com", status: "2xx" },
  { origin: "legacy.example.com", status: "4xx" },
];
const filter = ref("all");
const query = ref("");
const filtered = computed(() => requests.filter((request) =>
  (filter.value === "all" || request.status === filter.value) &&
  request.origin.includes(query.value.trim().toLowerCase()),
));
</script>

<template>
  <Card style="max-width: 36rem;">
    <Card.Header>
      <Card.Title>Request origins</Card.Title>
      <Card.Description>Recent traffic grouped by host.</Card.Description>
    </Card.Header>
    <Card.Content>
      <div class="toolbar">
        <Input v-model="query" aria-label="Filter origins" size="sm" />
        <ButtonGroup aria-label="Status filter">
          <Button v-for="status in ['all', '2xx', '4xx']" :key="status" @click="filter = status">
            {{ status }}
          </Button>
        </ButtonGroup>
      </div>
      <div v-for="request in filtered" :key="request.origin">
        <span>{{ request.origin }}</span>
        <Badge>{{ request.status }}</Badge>
      </div>
    </Card.Content>
    <Card.Footer>Showing {{ filtered.length }} of {{ requests.length }}</Card.Footer>
  </Card>
</template>`;

const linkedCode = `<script setup>
import { ArrowRight } from "@lucide/vue";
import { Card } from "@dicehub/kappa/components/card";
</script>

<template>
  <Card as="article" style="width: 23rem;">
    <Card.Secondary as="header">Release notes</Card.Secondary>
    <Card.Primary as="a" href="/release-notes">
      <strong>Read the component model <ArrowRight aria-hidden="true" /></strong>
      <span>One semantic anchor owns the complete primary layer.</span>
    </Card.Primary>
  </Card>
</template>`;

const testIdsCode = `<script setup>
import { Card } from "@dicehub/kappa/components/card";
</script>

<template>
  <Card data-testid="card-root" style="width: 23rem;">
    <Card.Header data-testid="card-header">
      <Card.Title data-testid="card-title">Getting started</Card.Title>
      <Card.Description data-testid="card-description">
        Public attributes pass to every part.
      </Card.Description>
    </Card.Header>
    <Card.Content data-testid="card-content">A standard content region.</Card.Content>
    <Card.Footer data-testid="card-footer">Ready</Card.Footer>
  </Card>
</template>`;

export const examples = [
  {
    id: "layered-card",
    title: "Layered Card",
    description: "Put supporting context behind a raised primary surface.",
    variant: "layered",
    code: layeredCode,
  },
  {
    id: "small-card",
    title: "Small Card",
    description: "Use the small size for compact supporting content and short actions.",
    variant: "small",
    code: smallCode,
  },
  {
    id: "image-card",
    title: "Image Card",
    description: "Place media before the header for an edge-to-edge visual introduction.",
    variant: "event",
    code: eventCode,
  },
  {
    id: "filter-toolbar",
    title: "Filter Toolbar",
    description: "Compose compact controls and structured data inside a standard Card.",
    variant: "filter",
    code: filterCode,
  },
  {
    id: "linked-primary",
    title: "Linked Primary Layer",
    description: "Render Primary as an anchor when the complete surface has one target.",
    variant: "linked",
    code: linkedCode,
  },
  {
    id: "attribute-forwarding",
    title: "Attribute Forwarding",
    description: "All Card parts accept standard HTML, ARIA, and data attributes.",
    variant: "test-ids",
    code: testIdsCode,
  },
] as const;

export const rootProps = [
  {
    name: "as",
    type: '"div" | "article" | "section" | "aside" | "a" | "form"',
    defaultValue: '"div"',
    description: "Native element rendered by the outer surface.",
  },
  {
    name: "size",
    type: '"sm" | "base"',
    defaultValue: '"base"',
    description: "Controls spacing and the type scale.",
  },
  {
    name: "default slot",
    type: "slot",
    defaultValue: "—",
    description: "Standard Card parts, layered parts, or direct surface content.",
  },
] as const;

export const standardParts = [
  {
    name: "Card.Header",
    element: '"div" | "header"',
    defaultValue: '"div"',
    description: "Title, description, and optional action layout.",
  },
  {
    name: "Card.Title",
    element: '"h2"–"h6" | "p" | "div"',
    defaultValue: '"h3"',
    description: "Card heading.",
  },
  {
    name: "Card.Description",
    element: '"p" | "div"',
    defaultValue: '"p"',
    description: "Supporting text below the title.",
  },
  {
    name: "Card.Action",
    element: '"div"',
    defaultValue: '"div"',
    description: "Header action aligned to the inline end.",
  },
  {
    name: "Card.Content",
    element: '"div" | "section"',
    defaultValue: '"div"',
    description: "Main content region.",
  },
  {
    name: "Card.Footer",
    element: '"div" | "footer"',
    defaultValue: '"div"',
    description: "Actions or supporting content at the bottom.",
  },
] as const;

export const layeredParts = [
  {
    name: "Card.Secondary",
    element: '"div" | "header" | "p"',
    defaultValue: '"div"',
    description: "Supporting layer behind the main surface.",
  },
  {
    name: "Card.Primary",
    element: '"div" | "article" | "section" | "a"',
    defaultValue: '"div"',
    description: "Raised main-content surface.",
  },
] as const;

export const dataSlots = [
  ["card", "Outer surface"],
  ["card-header", "Header layout"],
  ["card-title", "Title"],
  ["card-description", "Description"],
  ["card-action", "Header action"],
  ["card-content", "Main content"],
  ["card-footer", "Footer"],
  ["card-secondary", "Supporting layer"],
  ["card-primary", "Raised primary layer"],
] as const;

export const exportsList = [
  { name: "Card", description: "Compound root with all standard and layered parts." },
  { name: "CardRoot", description: "Named outer surface export." },
  {
    name: "CardHeader / CardTitle / CardDescription / CardAction",
    description: "Named header composition exports.",
  },
  { name: "CardContent / CardFooter", description: "Named body and footer exports." },
  { name: "CardPrimary / CardSecondary", description: "Named layered-surface exports." },
  { name: "Card*Props / Card*Slots / CardSize", description: "Public prop, slot, and size contracts." },
  { name: "resolveCard*", description: "Safe runtime resolvers for sizes and semantic elements." },
] as const;
