<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Activity, ArrowUpRight, Check, CircleCheck, ClipboardCheck, MessageSquare, Plane, Radar, Wind } from "@lucide/vue";
import { Avatar } from "@dicehub/kappa/components/avatar";
import { Badge } from "@dicehub/kappa/components/badge";
import { Button } from "@dicehub/kappa/components/button";
import PaneledWorkspaceCatalog from "./PaneledWorkspaceCatalog.vue";
import PaneledWorkspaceProjectSettings from "./PaneledWorkspaceProjectSettings.vue";
import { ActivityFeed } from "@dicehub/kappa/components/activity-feed";
import { Table } from "@dicehub/kappa/components/table";
import { Tabs } from "@dicehub/kappa/components/tabs";

const props = defineProps<{ page: string; project: string }>();
const emit = defineEmits<{ navigate: [page: string]; rename: [name: string] }>();
const activityFilter = ref("All activity");
const visibleCount = ref(6);
const activityFilters = ["All activity", "Engineering", "Reviews", "Flight tests"];
const updates = [
  { id: 1, day: "Today", date: "2026-10-31T10:42:00", time: "10:42", author: "Maya Chen", initials: "MC", category: "Engineering", icon: Wind, action: "completed a simulation", title: "Hover efficiency · rotor configuration B", detail: "Run SIM-204 converged. Results are ready for the design review.", page: "Simulation runs" },
  { id: 2, day: "Today", date: "2026-10-31T10:16:00", time: "10:16", author: "Alex Morgan", initials: "AM", category: "Reviews", icon: ClipboardCheck, action: "requested a review", title: "Wing-to-fuselage interface · revision 03", detail: "Check the load assumptions and updated attachment geometry.", page: "Design reviews" },
  { id: 3, day: "Today", date: "2026-10-31T09:30:00", time: "09:30", author: "Sam Rivera", initials: "SR", category: "Flight tests", icon: Radar, action: "updated the test plan", title: "FT-014 · Low-speed handling", detail: "Added the instrumentation check and revised the test sequence.", page: "Flight test plan" },
  { id: 4, day: "Today", date: "2026-10-31T08:55:00", time: "08:55", author: "Maya Chen", initials: "MC", category: "Engineering", icon: Plane, action: "published a configuration", title: "Airframe baseline · AF-07", detail: "The current baseline includes the revised tail and battery enclosure.", page: "Airframe" },
  { id: 5, day: "Yesterday", date: "2026-10-30T16:24:00", time: "16:24", author: "Alex Morgan", initials: "AM", category: "Reviews", icon: MessageSquare, action: "added review notes", title: "Rotor mesh quality · validation checks", detail: "Two comments remain before the mesh can be released for the next run.", page: "Simulation runs" },
  { id: 6, day: "Yesterday", date: "2026-10-30T14:10:00", time: "14:10", author: "Sam Rivera", initials: "SR", category: "Flight tests", icon: CircleCheck, action: "completed a ground test", title: "GT-008 · Telemetry and instrumentation", detail: "All recorded channels passed the pre-flight signal checks.", page: "Telemetry" },
  { id: 7, day: "Yesterday", date: "2026-10-30T11:05:00", time: "11:05", author: "Maya Chen", initials: "MC", category: "Engineering", icon: Wind, action: "shared new results", title: "Cooling duct · pressure-loss comparison", detail: "Three inlet options are available for the thermal review.", page: "Thermal analysis" },
  { id: 8, day: "Earlier this week", date: "2026-10-29T15:40:00", time: "15:40", author: "Alex Morgan", initials: "AM", category: "Reviews", icon: Check, action: "completed a design review", title: "Preliminary design review", detail: "The team accepted the baseline and recorded the follow-up work.", page: "Design reviews" },
];
function matchingUpdates(category: string) { return updates.filter(update => category === "All activity" || update.category === category); }
function activityGroups(category: string) {
  const visible = matchingUpdates(category).slice(0, visibleCount.value);
  return [...new Set(visible.map(update => update.day))].map(day => ({ day, updates: visible.filter(update => update.day === day) }));
}
function follow(page: string, event: MouseEvent) {
  if (event.button || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
  event.preventDefault();
  emit("navigate", page);
}
const testFilter = ref("All tests");
const testFilters = ["All tests", "Ready", "In review", "Complete"];
const testCases = [
  { id: "FT-014", title: "Low-speed handling", owner: "Sam Rivera", date: "4 Nov 2026", status: "In review", detail: "Confirm the test sequence, instrumentation, and operating limits before release." },
  { id: "FT-015", title: "Hover endurance", owner: "Maya Chen", date: "5 Nov 2026", status: "Ready", detail: "Record power, temperatures, and vibration through the planned hover sequence." },
  { id: "FT-016", title: "Transition envelope", owner: "Alex Morgan", date: "6 Nov 2026", status: "In review", detail: "Review the transition points against the current simulation results." },
  { id: "GT-008", title: "Telemetry and instrumentation", owner: "Sam Rivera", date: "30 Oct 2026", status: "Complete", detail: "Recorded channels and time synchronization passed the ground checks." },
];
const selectedTest = ref("FT-014");
const selectedCase = computed(() => testCases.find(test => test.id === selectedTest.value)!);
watch(testFilter, filter => {
  const matching = testCases.filter(test => filter === "All tests" || test.status === filter);
  if (!matching.some(test => test.id === selectedTest.value) && matching[0]) {
    selectedTest.value = matching[0].id;
  }
});
</script>

<template>
  <div class="paneled-project-pages">
    <template v-if="props.page === 'Project activity'">
      <p class="paneled-project-pages__intro">Engineering updates, reviews, and test results across {{ props.project }}.</p>
      <Tabs.Root v-model="activityFilter" lazy-mount unmount-on-exit @value-change="visibleCount = 6">
        <Tabs.List variant="line" size="sm" aria-label="Activity type">
          <Tabs.Trigger v-for="category in activityFilters" :key="category" :value="category">{{ category }}</Tabs.Trigger>
          <Tabs.Indicator />
        </Tabs.List>
        <Tabs.Content v-for="category in activityFilters" :key="category" :value="category">
          <ActivityFeed.Root>
            <ActivityFeed.Group v-for="group in activityGroups(category)" :key="group.day" :aria-label="group.day">
              <ActivityFeed.GroupLabel>{{ group.day }}</ActivityFeed.GroupLabel>
              <ActivityFeed.List :aria-label="`${group.day} updates`">
                <ActivityFeed.Item v-for="update in group.updates" :key="update.id">
                  <ActivityFeed.Marker variant="avatar"><Avatar.Root size="sm"><Avatar.Fallback>{{ update.initials }}</Avatar.Fallback></Avatar.Root></ActivityFeed.Marker>
                  <ActivityFeed.Content>
                    <ActivityFeed.Header><ActivityFeed.Title>{{ update.author }} {{ update.action }}</ActivityFeed.Title><ActivityFeed.Time :datetime="update.date">{{ update.time }}</ActivityFeed.Time></ActivityFeed.Header>
                    <ActivityFeed.Description><a :href="`?view=${encodeURIComponent(update.page)}`" @click="follow(update.page, $event)">{{ update.title }}</a></ActivityFeed.Description>
                    <ActivityFeed.Description>{{ update.detail }}</ActivityFeed.Description>
                    <ActivityFeed.Actions><Badge variant="outline">{{ update.category }}</Badge></ActivityFeed.Actions>
                  </ActivityFeed.Content>
                </ActivityFeed.Item>
              </ActivityFeed.List>
            </ActivityFeed.Group>
          </ActivityFeed.Root>
          <Button v-if="matchingUpdates(category).length > visibleCount" variant="outline" size="sm" class="paneled-project-pages__more" @click="visibleCount += 6">Show earlier activity</Button>
        </Tabs.Content>
      </Tabs.Root>
    </template>

    <template v-else-if="props.page === 'Overview'">
      <p class="paneled-project-pages__eyebrow">Electric flight demonstrator · AV-01</p>
      <p class="paneled-project-pages__lead">Validate an efficient transition from vertical lift to wing-borne flight.</p>
      <p class="paneled-project-pages__intro">{{ props.project }} brings airframe design, rotor analysis, and flight-test evidence into one project. The current phase prepares the demonstrator for its first transition campaign.</p>
      <dl class="paneled-project-pages__facts">
        <div><dt>Phase</dt><dd>Flight-test preparation</dd></div>
        <div><dt>Project lead</dt><dd>Alex Morgan</dd></div>
        <div><dt>Next review</dt><dd>3 November 2026</dd></div>
        <div><dt>Configuration</dt><dd>AF-07 / Rotor B</dd></div>
      </dl>
      <section class="paneled-project-pages__section">
        <h3>Mission objectives</h3>
        <ul class="paneled-project-pages__objectives">
          <li><span>01</span><div><h4>Establish the aerodynamic baseline</h4><p>Correlate hover and forward-flight predictions with the accepted reference cases.</p></div><a href="?view=Simulation+runs" @click="follow('Simulation runs', $event)">Simulation runs <ArrowUpRight aria-hidden="true" /></a></li>
          <li><span>02</span><div><h4>Close the design review</h4><p>Resolve the remaining airframe interfaces and record the approved configuration.</p></div><a href="?view=Design+reviews" @click="follow('Design reviews', $event)">Design reviews <ArrowUpRight aria-hidden="true" /></a></li>
          <li><span>03</span><div><h4>Prepare the flight campaign</h4><p>Connect each test objective to its instrumentation, acceptance criteria, and review owner.</p></div><a href="?view=Flight+test+plan" @click="follow('Flight test plan', $event)">Flight test plan <ArrowUpRight aria-hidden="true" /></a></li>
        </ul>
      </section>
      <section class="paneled-project-pages__section">
        <h3>Next project checkpoint</h3>
        <div class="paneled-project-pages__checkpoint"><Radar aria-hidden="true" /><div><h4>Flight readiness review</h4><p>3 November · 09:00 UTC · Engineering and flight operations</p><p>Review the test sequence, pending simulation runs, and the latest simulation evidence.</p></div><Badge variant="warning">In preparation</Badge></div>
      </section>
      <a class="paneled-project-pages__footer-link" href="?view=Project+activity" @click="follow('Project activity', $event)"><Activity aria-hidden="true" />View project activity <ArrowUpRight aria-hidden="true" /></a>
    </template>

    <template v-else-if="props.page === 'Flight test plan'">
      <p class="paneled-project-pages__intro">Campaign 04 · {{ props.project }} · Ground verification and first transition flights.</p>
      <dl class="paneled-project-pages__facts">
        <div><dt>Test window</dt><dd>4–6 November 2026</dd></div><div><dt>Aircraft</dt><dd>AV-01 · AF-07</dd></div><div><dt>Test lead</dt><dd>Sam Rivera</dd></div><div><dt>Readiness review</dt><dd>3 November 2026</dd></div>
      </dl>
      <Tabs.Root v-model="testFilter" lazy-mount unmount-on-exit>
        <Tabs.List variant="line" size="sm" aria-label="Test status"><Tabs.Trigger v-for="filter in testFilters" :key="filter" :value="filter">{{ filter }}</Tabs.Trigger><Tabs.Indicator /></Tabs.List>
        <Tabs.Content v-for="filter in testFilters" :key="filter" :value="filter">
          <div class="paneled-project-pages__table-scroll">
            <Table compact aria-label="Flight and ground test schedule">
              <Table.Header><Table.Row><Table.Head scope="col">Test</Table.Head><Table.Head scope="col">Owner</Table.Head><Table.Head scope="col">Planned date</Table.Head><Table.Head scope="col">Status</Table.Head></Table.Row></Table.Header>
              <Table.Body>
                <Table.Row v-for="test in testCases.filter(test => filter === 'All tests' || test.status === filter)" :key="test.id" :variant="selectedTest === test.id ? 'selected' : 'default'">
                  <Table.Cell><Button variant="link" size="sm" :aria-pressed="selectedTest === test.id" @click="selectedTest = test.id">{{ test.id }} · {{ test.title }}</Button></Table.Cell>
                  <Table.Cell>{{ test.owner }}</Table.Cell><Table.Cell>{{ test.date }}</Table.Cell>
                  <Table.Cell><Badge :variant="test.status === 'Complete' ? 'success' : test.status === 'Ready' ? 'info' : 'warning'">{{ test.status }}</Badge></Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </div>
        </Tabs.Content>
      </Tabs.Root>
      <section class="paneled-project-pages__section paneled-project-pages__test-detail" aria-live="polite">
        <div class="paneled-project-pages__detail-heading"><Radar aria-hidden="true" /><h3>{{ selectedCase.id }} · {{ selectedCase.title }}</h3></div>
        <p>{{ selectedCase.detail }}</p>
        <dl><div><dt>Review owner</dt><dd>{{ selectedCase.owner }}</dd></div><div><dt>Evidence</dt><dd>Test card, recorded channels, and post-test review</dd></div></dl>
        <a href="?view=Simulation+runs" @click="follow('Simulation runs', $event)">Open simulation runs <ArrowUpRight aria-hidden="true" /></a>
      </section>
    </template>
    <PaneledWorkspaceProjectSettings v-else-if="props.page === 'Project Settings'" :project="props.project" @rename="emit('rename', $event)" />
    <PaneledWorkspaceCatalog v-else :key="props.page" :page="props.page" @navigate="emit('navigate', $event)" />
  </div>
</template>

<style src="./paneled-workspace-project-pages.css"></style>
