<script setup lang="ts">
import { computed, ref } from "vue";
import { Button } from "@dicehub/kappa/components/button";
import {
  Drawer,
  type DrawerSnapPoint,
  type DrawerSwipeDirection,
} from "@dicehub/kappa/components/drawer";
import DrawerNestedDemo from "./DrawerNestedDemo.vue";
import DrawerResponsiveDemo from "./DrawerResponsiveDemo.vue";

type DemoVariant =
  | "preview"
  | "basic"
  | "positions"
  | "custom-size"
  | "swipe-handle"
  | "snap-points"
  | "scrollable"
  | "non-draggable"
  | "non-modal"
  | "controlled"
  | "multiple-triggers"
  | "nested"
  | "responsive"
  | "right-to-left";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), { variant: "preview" });

const directions: {
  description: string;
  label: string;
  metric: string;
  title: string;
  value: DrawerSwipeDirection;
}[] = [
  {
    label: "Up",
    value: "up",
    title: "Move Goal",
    description: "Set your daily activity goal.",
    metric: "350 Calories/day",
  },
  {
    label: "Right",
    value: "end",
    title: "Move Goal",
    description: "Set your daily activity goal.",
    metric: "350 Calories/day",
  },
  {
    label: "Down",
    value: "down",
    title: "Move Goal",
    description: "Set your daily activity goal.",
    metric: "350 Calories/day",
  },
  {
    label: "Left",
    value: "start",
    title: "Move Goal",
    description: "Set your daily activity goal.",
    metric: "350 Calories/day",
  },
];
const paragraphs = [
  "Your changes are saved automatically as you type.",
  "Delivery usually takes three to five business days, depending on your location.",
  "You can change notification preferences at any time from your profile settings.",
  "Two-factor authentication adds an extra layer of security to your account.",
  "You can export or delete your account data from the privacy settings page.",
  "Refunds are processed after the returned item has been received and inspected.",
  "Contact support if you need help with an order or account setting.",
];
const timeline = [
  { label: "Account created", meta: "Monday", state: "complete" },
  { label: "Email verified", meta: "Tuesday", state: "complete" },
  { label: "Profile completed", meta: "Yesterday", state: "complete" },
  { label: "Preferences ready", meta: "Today", state: "active" },
];
const activityBars = [42, 58, 46, 70, 55, 82, 66, 88, 72, 94];
const triggerDetails: Record<string, { description: string; metric: string; title: string }> = {
  profile: {
    title: "Profile settings",
    description: "Name, photo, and contact details",
    metric: "4 fields complete",
  },
  security: {
    title: "Security settings",
    description: "Password and sign-in methods",
    metric: "Two-factor authentication off",
  },
};

const goal = ref(350);
const controlledOpen = ref(false);
const backgroundActions = ref(0);
const snapPoint = ref<DrawerSnapPoint | null>(0.35);
const triggerValue = ref<string | null>("profile");
const activeTrigger = computed(() => triggerDetails[triggerValue.value ?? "profile"]);

const adjustGoal = (amount: number) => {
  goal.value = Math.min(600, Math.max(200, goal.value + amount));
};
</script>

<template>
  <div class="drawer-demo" :data-drawer-demo="props.variant">
    <Drawer.Root v-if="props.variant === 'preview'" swipe-direction="end">
      <Drawer.Trigger as-child><Button variant="outline">Open Drawer</Button></Drawer.Trigger>
      <Drawer.Content show-close-button data-drawer-demo-surface="preview">
        <Drawer.Header class="drawer-demo__centered-header">
          <Drawer.Title>Move Goal</Drawer.Title>
          <Drawer.Description>Set your daily activity goal.</Drawer.Description>
        </Drawer.Header>
        <div class="drawer-demo__goal" data-no-drag>
          <div class="drawer-demo__stepper">
            <Button
              aria-label="Decrease goal"
              shape="square"
              variant="outline"
              @click="adjustGoal(-10)"
            >−</Button>
            <output aria-live="polite">
              <strong>{{ goal }}</strong>
              <span>Calories/day</span>
            </output>
            <Button
              aria-label="Increase goal"
              shape="square"
              variant="outline"
              @click="adjustGoal(10)"
            >+</Button>
          </div>
          <div
            class="drawer-demo__chart"
            role="img"
            aria-label="Activity during the last ten days"
          >
            <i v-for="(height, index) in activityBars" :key="index" :style="{ blockSize: `${height}%` }"></i>
          </div>
          <p class="drawer-demo__hint">You moved an average of 12% more this week.</p>
        </div>
        <Drawer.Footer>
          <Drawer.Close as-child><Button variant="primary">Submit</Button></Drawer.Close>
          <Drawer.Close as-child><Button variant="secondary">Cancel</Button></Drawer.Close>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer.Root>

    <Drawer.Root v-else-if="props.variant === 'basic'">
      <Drawer.Trigger as-child><Button>Open drawer</Button></Drawer.Trigger>
      <Drawer.Content data-drawer-demo-surface="basic">
        <Drawer.Header class="drawer-demo__centered-header">
          <Drawer.Title>Edit profile</Drawer.Title>
          <Drawer.Description>Make changes to your profile here. Save when you are done.</Drawer.Description>
        </Drawer.Header>
        <form class="drawer-demo__form" data-no-drag @submit.prevent>
          <label>Name <input value="Alex Morgan" /></label>
          <label>Email <input type="email" value="alex@example.com" /></label>
        </form>
        <Drawer.Footer>
          <Drawer.Close as-child><Button variant="primary">Save changes</Button></Drawer.Close>
          <Drawer.Close as-child><Button variant="secondary">Cancel</Button></Drawer.Close>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer.Root>

    <div v-else-if="props.variant === 'positions'" class="drawer-demo__buttons">
      <Drawer.Root v-for="direction in directions" :key="direction.value" :swipe-direction="direction.value">
        <Drawer.Trigger as-child><Button size="sm" variant="outline">{{ direction.label }}</Button></Drawer.Trigger>
        <Drawer.Content :data-drawer-demo-surface="`position-${direction.value}`">
          <Drawer.Header>
            <Drawer.Title>{{ direction.title }}</Drawer.Title>
            <Drawer.Description>{{ direction.description }}</Drawer.Description>
          </Drawer.Header>
          <div class="drawer-demo__feature-panel">
            <span>Daily target</span>
            <strong>{{ direction.metric }}</strong>
            <div aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
          </div>
          <Drawer.Footer>
            <Drawer.Close as-child><Button variant="primary">Submit</Button></Drawer.Close>
            <Drawer.Close as-child><Button variant="secondary">Cancel</Button></Drawer.Close>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Root>
    </div>

    <div v-else-if="props.variant === 'custom-size'" class="drawer-demo__buttons">
      <Drawer.Root>
        <Drawer.Trigger as-child><Button variant="outline">Half-height</Button></Drawer.Trigger>
        <Drawer.Content style="block-size: 50dvb" data-drawer-demo-surface="size-vertical">
          <Drawer.Header>
            <Drawer.Title>Account preferences</Drawer.Title>
            <Drawer.Description>This drawer uses half of the viewport height.</Drawer.Description>
          </Drawer.Header>
          <div class="drawer-demo__copy" data-no-drag>
            <p v-for="paragraph in paragraphs.slice(0, 4)" :key="paragraph">{{ paragraph }}</p>
          </div>
          <Drawer.Footer><Drawer.Close as-child><Button>Close</Button></Drawer.Close></Drawer.Footer>
        </Drawer.Content>
      </Drawer.Root>
      <Drawer.Root swipe-direction="end">
        <Drawer.Trigger as-child><Button variant="outline">Wide side panel</Button></Drawer.Trigger>
        <Drawer.Content style="--kappa-drawer-inline-size: 30rem" data-drawer-demo-surface="size-side">
          <Drawer.Header>
            <Drawer.Title>Order details</Drawer.Title>
            <Drawer.Description>A wider side drawer gives structured details more room.</Drawer.Description>
          </Drawer.Header>
          <dl class="drawer-demo__manifest">
            <div><dt>Order</dt><dd>#1048</dd></div>
            <div><dt>Status</dt><dd>Preparing</dd></div>
            <div><dt>Delivery</dt><dd>Friday</dd></div>
            <div><dt>Total</dt><dd>$84.00</dd></div>
          </dl>
          <Drawer.Footer><Drawer.Close as-child><Button>Close</Button></Drawer.Close></Drawer.Footer>
        </Drawer.Content>
      </Drawer.Root>
    </div>

    <div v-else-if="props.variant === 'swipe-handle'" class="drawer-demo__buttons">
      <Drawer.Root
        v-for="direction in directions"
        :key="direction.value"
        :swipe-direction="direction.value"
      >
        <Drawer.Trigger as-child>
          <Button size="sm" variant="outline">{{ direction.label }}</Button>
        </Drawer.Trigger>
        <Drawer.Content show-grabber :data-drawer-demo-surface="`grabber-${direction.value}`">
          <Drawer.Header>
            <Drawer.Title>Drawer</Drawer.Title>
            <Drawer.Description>Drawer with a swipe handle.</Drawer.Description>
          </Drawer.Header>
          <div class="drawer-demo__handle-preview" aria-hidden="true">
            <span></span><span></span><span></span>
          </div>
          <Drawer.Footer><Drawer.Close as-child><Button>Close</Button></Drawer.Close></Drawer.Footer>
        </Drawer.Content>
      </Drawer.Root>
    </div>

    <div v-else-if="props.variant === 'snap-points'" class="drawer-demo__state">
      <Drawer.Root v-model:snap-point="snapPoint" :snap-points="[0.35, 0.65, 1]" snap-to-sequential-points>
        <Drawer.Trigger as-child><Button variant="outline">Open snap drawer</Button></Drawer.Trigger>
        <Drawer.Content class="drawer-demo__snap-surface" data-drawer-demo-surface="snap-points">
          <Drawer.Header>
            <Drawer.Title>Snap points</Drawer.Title>
            <Drawer.Description>Drag between a compact peek and a near full-height view.</Drawer.Description>
          </Drawer.Header>
          <ol class="drawer-demo__timeline" data-no-drag>
            <li v-for="event in timeline" :key="event.label" :data-state="event.state">
              <i aria-hidden="true"></i>
              <span><strong>{{ event.label }}</strong><small>{{ event.meta }}</small></span>
            </li>
          </ol>
          <Drawer.Footer>
            <Drawer.Close as-child><Button variant="secondary">Close</Button></Drawer.Close>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Root>
      <output aria-live="polite">Snap point: {{ snapPoint }}</output>
    </div>

    <Drawer.Root v-else-if="props.variant === 'scrollable'">
      <Drawer.Trigger as-child><Button variant="outline">Open scrollable drawer</Button></Drawer.Trigger>
      <Drawer.Content class="drawer-demo__tall" data-drawer-demo-surface="scrollable">
        <Drawer.Header>
          <Drawer.Title>Privacy policy</Drawer.Title>
          <Drawer.Description>The header and actions stay fixed while the content scrolls.</Drawer.Description>
        </Drawer.Header>
        <div class="drawer-demo__copy" data-no-drag tabindex="0">
          <p v-for="(paragraph, index) in [...paragraphs, ...paragraphs, ...paragraphs]" :key="index">{{ paragraph }}</p>
        </div>
        <Drawer.Footer>
          <Drawer.Close as-child><Button variant="secondary">Close</Button></Drawer.Close>
          <Drawer.Close as-child><Button variant="primary">Accept</Button></Drawer.Close>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer.Root>

    <Drawer.Root v-else-if="props.variant === 'non-draggable'">
      <Drawer.Trigger as-child><Button variant="outline">Open handle-only drawer</Button></Drawer.Trigger>
      <Drawer.Content :draggable="false" data-drawer-demo-surface="non-draggable">
        <Drawer.Header>
          <Drawer.Title>Copy confirmation code</Drawer.Title>
          <Drawer.Description>The content accepts text selection. Only the handle moves the drawer.</Drawer.Description>
        </Drawer.Header>
        <pre class="drawer-demo__selection" tabindex="0">J7KP-29QM
This code expires in 10 minutes.</pre>
        <Drawer.Footer><Drawer.Close as-child><Button variant="primary">Done</Button></Drawer.Close></Drawer.Footer>
      </Drawer.Content>
    </Drawer.Root>

    <div v-else-if="props.variant === 'non-modal'" class="drawer-demo__state">
      <Drawer.Root :close-on-interact-outside="false" :modal="false" :prevent-scroll="false" :trap-focus="false" swipe-direction="end">
        <Drawer.Trigger as-child><Button variant="outline">Open non-modal drawer</Button></Drawer.Trigger>
        <Drawer.Content :show-backdrop="false" data-drawer-demo-surface="non-modal">
          <Drawer.Header>
            <Drawer.Title>Notifications</Drawer.Title>
            <Drawer.Description>Keep this panel open while you continue to use the page.</Drawer.Description>
          </Drawer.Header>
          <ol class="drawer-demo__timeline">
            <li v-for="event in timeline.slice(1)" :key="event.label" :data-state="event.state">
              <i aria-hidden="true"></i>
              <span><strong>{{ event.label }}</strong><small>{{ event.meta }}</small></span>
            </li>
          </ol>
          <Drawer.Footer><Drawer.Close as-child><Button variant="primary">Close</Button></Drawer.Close></Drawer.Footer>
        </Drawer.Content>
      </Drawer.Root>
      <Button size="sm" variant="ghost" @click="backgroundActions++">Update page</Button>
      <output aria-live="polite">Page updates: {{ backgroundActions }}</output>
    </div>

    <div v-else-if="props.variant === 'controlled'" class="drawer-demo__state">
      <Button variant="outline" @click="controlledOpen = true">Open controlled drawer</Button>
      <output aria-live="polite">State: {{ controlledOpen ? 'open' : 'closed' }}</output>
      <Drawer.Root v-model:open="controlledOpen">
        <Drawer.Content data-drawer-demo-surface="controlled">
          <Drawer.Header>
            <Drawer.Title>Export account data</Drawer.Title>
            <Drawer.Description>The parent closes this controlled drawer after the export starts.</Drawer.Description>
          </Drawer.Header>
          <div class="drawer-demo__formats" role="list" aria-label="Export formats">
            <span role="listitem">JSON</span><span role="listitem">CSV</span><span role="listitem">PDF</span>
          </div>
          <Drawer.Footer>
            <Button variant="secondary" @click="controlledOpen = false">Cancel</Button>
            <Button variant="primary" @click="controlledOpen = false">Export</Button>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Root>
    </div>

    <div v-else-if="props.variant === 'multiple-triggers'" class="drawer-demo__buttons">
      <Drawer.Root v-model:trigger-value="triggerValue">
        <Drawer.Trigger as-child value="profile"><Button variant="outline">Profile</Button></Drawer.Trigger>
        <Drawer.Trigger as-child value="security"><Button variant="outline">Security</Button></Drawer.Trigger>
        <Drawer.Content data-drawer-demo-surface="multiple-triggers">
          <Drawer.Header>
            <span class="drawer-demo__eyebrow">SELECTED SETTING</span>
            <Drawer.Title>{{ activeTrigger.title }}</Drawer.Title>
            <Drawer.Description>{{ activeTrigger.description }}</Drawer.Description>
          </Drawer.Header>
          <div class="drawer-demo__feature-panel">
            <span>Current state</span><strong>{{ activeTrigger.metric }}</strong>
            <div aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
          </div>
          <Drawer.Footer><Drawer.Close as-child><Button variant="primary">Done</Button></Drawer.Close></Drawer.Footer>
        </Drawer.Content>
      </Drawer.Root>
    </div>

    <DrawerNestedDemo v-else-if="props.variant === 'nested'" />
    <DrawerResponsiveDemo v-else-if="props.variant === 'responsive'" />

    <Drawer.Root v-else locale="ar" swipe-direction="start">
      <Drawer.Trigger as-child><Button variant="outline">فتح اللوحة</Button></Drawer.Trigger>
      <Drawer.Content dir="rtl" data-drawer-demo-surface="right-to-left">
        <Drawer.Header>
          <Drawer.Title>ملخص الحساب</Drawer.Title>
          <Drawer.Description>تفتح اللوحة من البداية المنطقية، وهي اليمين هنا.</Drawer.Description>
        </Drawer.Header>
        <dl class="drawer-demo__manifest">
          <div><dt>الاسم</dt><dd>ليلى أحمد</dd></div>
          <div><dt>الخطة</dt><dd>شخصية</dd></div>
          <div><dt>الإشعارات</dt><dd>مفعلة</dd></div>
        </dl>
        <Drawer.Footer><Drawer.Close as-child><Button variant="primary">تم</Button></Drawer.Close></Drawer.Footer>
      </Drawer.Content>
    </Drawer.Root>
  </div>
</template>

<style scoped>
.drawer-demo { display: flex; inline-size: 100%; min-inline-size: 0; min-block-size: 7rem; align-items: center; justify-content: center; color: var(--docs-default); font-family: var(--docs-font-sans); }
.drawer-demo__buttons { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.5rem; }
.drawer-demo__state { display: grid; justify-items: center; gap: 0.625rem; }
.drawer-demo__state output { color: var(--docs-subtle); font-family: var(--docs-font-mono); font-size: 0.75rem; }
.drawer-demo__centered-header { align-items: center; text-align: center; }
.drawer-demo__eyebrow { color: var(--kappa-accent, var(--docs-brand)); font-family: var(--docs-font-mono); font-size: 0.625rem; font-weight: 700; letter-spacing: 0.08em; }
.drawer-demo__goal { display: grid; align-content: center; justify-items: center; flex: 1 1 auto; gap: 1rem; padding-block: 0.25rem; }
.drawer-demo__stepper { display: grid; grid-template-columns: 2rem minmax(7rem, 1fr) 2rem; align-items: center; gap: 0.75rem; }
.drawer-demo__stepper output { display: grid; justify-items: center; line-height: 1; }
.drawer-demo__stepper strong { font-family: var(--docs-font-mono); font-size: 2.5rem; font-weight: 560; letter-spacing: -0.06em; }
.drawer-demo__stepper span { margin-block-start: 0.35rem; color: var(--docs-subtle); font-size: 0.6875rem; }
.drawer-demo__chart { box-sizing: border-box; display: flex; inline-size: min(100%, 22rem); block-size: 7rem; align-items: end; gap: 0.35rem; padding: 0.75rem 0.75rem 0; border-block-end: 1px solid var(--docs-border); background: var(--docs-tint); }
.drawer-demo__chart i { min-block-size: 0.25rem; flex: 1; background: var(--kappa-accent, var(--docs-brand)); opacity: 0.8; }
.drawer-demo__hint { margin: 0; color: var(--docs-subtle); font-size: 0.6875rem; }
.drawer-demo__form { display: grid; gap: 0.75rem; }
.drawer-demo__form label { display: grid; gap: 0.375rem; color: var(--docs-default); font-size: 0.75rem; font-weight: 600; }
.drawer-demo__form input { min-block-size: 2rem; inline-size: 100%; box-sizing: border-box; padding-inline: 0.625rem; border: 1px solid var(--docs-border); border-radius: 0.4375rem; background: var(--docs-control); color: var(--docs-default); font: inherit; font-size: 0.8125rem; }
.drawer-demo__form input:focus-visible { border-color: var(--docs-brand); outline: 2px solid var(--docs-brand-soft); outline-offset: 1px; }
.drawer-demo__feature-panel { display: grid; gap: 0.375rem; min-block-size: 8rem; align-content: center; flex: 1 1 auto; padding: 1rem; border: 1px solid var(--docs-border); border-radius: 0.5rem; background: var(--docs-tint); }
.drawer-demo__feature-panel > span { color: var(--docs-subtle); font-size: 0.6875rem; }
.drawer-demo__feature-panel > strong { font-family: var(--docs-font-mono); font-size: 0.875rem; }
.drawer-demo__feature-panel > div { display: flex; block-size: 2.75rem; align-items: end; gap: 0.25rem; margin-block-start: 0.5rem; }
.drawer-demo__feature-panel i { inline-size: 0.45rem; border-radius: 0.125rem 0.125rem 0 0; background: var(--kappa-accent, var(--docs-brand)); }
.drawer-demo__feature-panel i:nth-child(1) { block-size: 30%; }
.drawer-demo__feature-panel i:nth-child(2) { block-size: 58%; }
.drawer-demo__feature-panel i:nth-child(3) { block-size: 42%; }
.drawer-demo__feature-panel i:nth-child(4) { block-size: 82%; }
.drawer-demo__feature-panel i:nth-child(5) { block-size: 68%; }
:global(.drawer-demo__snap-surface) { block-size: min(42rem, calc(100dvb - 3rem)); }
:global(.drawer-demo__tall) { block-size: min(34rem, calc(100dvb - 3rem)); }
.drawer-demo__copy { min-block-size: 0; flex: 1 1 auto; overflow-y: auto; overscroll-behavior: contain; padding: 0.75rem; border: 1px solid var(--docs-border); border-radius: 0.5rem; background: var(--docs-tint); font-size: 0.8125rem; line-height: 1.35rem; scrollbar-color: var(--docs-border) transparent; }
.drawer-demo__copy p { margin: 0; }
.drawer-demo__copy p + p { margin-block-start: 0.75rem; padding-block-start: 0.75rem; border-block-start: 1px solid var(--docs-border); }
.drawer-demo__manifest { display: grid; margin: 0; border-block-start: 1px solid var(--docs-border); }
.drawer-demo__manifest div { display: flex; justify-content: space-between; gap: 1rem; padding-block: 0.625rem; border-block-end: 1px solid var(--docs-border); }
.drawer-demo__manifest dt { color: var(--docs-subtle); font-size: 0.75rem; }
.drawer-demo__manifest dd { margin: 0; font-family: var(--docs-font-mono); font-size: 0.75rem; text-align: end; }
.drawer-demo__handle-preview { display: grid; min-block-size: 7rem; align-content: center; flex: 1 1 auto; gap: 0.5rem; padding: 1rem; border-radius: 0.5rem; background: var(--docs-tint); }
.drawer-demo__handle-preview span { display: block; block-size: 0.375rem; border-radius: 999px; background: var(--docs-border); }
.drawer-demo__handle-preview span:nth-child(2) { inline-size: 72%; background: var(--docs-brand-soft); }
.drawer-demo__handle-preview span:nth-child(3) { inline-size: 48%; }
.drawer-demo__timeline { display: grid; gap: 0; min-block-size: 0; overflow-y: auto; margin: 0; padding: 0; list-style: none; }
.drawer-demo__timeline li { position: relative; display: grid; grid-template-columns: 1rem minmax(0, 1fr); gap: 0.625rem; padding-block-end: 1rem; }
.drawer-demo__timeline li:not(:last-child)::after { position: absolute; inset-block-start: 0.75rem; inset-block-end: 0; inset-inline-start: 0.3125rem; inline-size: 1px; background: var(--docs-border); content: ""; }
.drawer-demo__timeline li > i { z-index: 1; inline-size: 0.6875rem; block-size: 0.6875rem; margin-block-start: 0.1875rem; border: 2px solid var(--docs-control); border-radius: 50%; background: var(--docs-success); box-shadow: 0 0 0 1px var(--docs-success); }
.drawer-demo__timeline li[data-state="active"] > i { background: var(--docs-brand); box-shadow: 0 0 0 1px var(--docs-brand); }
.drawer-demo__timeline span { display: flex; justify-content: space-between; gap: 1rem; }
.drawer-demo__timeline strong { font-size: 0.75rem; }
.drawer-demo__timeline small { color: var(--docs-subtle); font-family: var(--docs-font-mono); font-size: 0.6875rem; }
.drawer-demo__selection { margin: 0; padding: 0.75rem; border: 1px solid var(--docs-border); border-radius: 0.5rem; background: var(--docs-tint); color: var(--docs-default); font-family: var(--docs-font-mono); font-size: 0.75rem; line-height: 1.35rem; white-space: pre-wrap; user-select: text; }
.drawer-demo__formats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.5rem; }
.drawer-demo__formats span { display: grid; min-block-size: 4rem; place-items: center; border: 1px solid var(--docs-border); border-radius: 0.5rem; background: var(--docs-tint); font-family: var(--docs-font-mono); font-size: 0.75rem; font-weight: 700; }
@media (max-width: 480px) { .drawer-demo__timeline span { flex-direction: column; gap: 0.125rem; } }
</style>
