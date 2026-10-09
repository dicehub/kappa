<script setup lang="ts">
import { computed, ref } from "vue";
import { Sidebar, type SidebarOpenChangeDetails } from "@dicehub/kappa/components/sidebar";
import { DirectionProvider } from "@dicehub/kappa/components/direction-provider";
import { Button } from "@dicehub/kappa/components/button";
import { Breadcrumbs } from "@dicehub/kappa/components/breadcrumbs";
import { ArrowLeftRight, Box } from "@lucide/vue";
import SidebarDemoNavigation from "./SidebarDemoNavigation.vue";
import SidebarDemoNamespace from "./SidebarDemoNamespace.vue";
import { namespaceActionDescriptions } from "../data/workspace-switcher-demo";
import SidebarDemoProfile from "./SidebarDemoProfile.vue";
import SidebarDemoSearch from "./SidebarDemoSearch.vue";
import SidebarDemoSlidingNavigation from "./SidebarDemoSlidingNavigation.vue";

const props = withDefaults(defineProps<{ variant?: string; standalone?: boolean }>(), { variant: "preview", standalone: false });
const open = ref(true);
const mobileOpen = ref(false);
const locked = ref(false);
const requests = ref(0);
const loading = ref(true);
const selected = ref("Overview");
const namespace = ref("Engineering");
const profile = ref("casey");
const surface = ref("workspace");
const resizeWidth = ref(240);
const resizeLocked = ref(false);
const controlled = computed(() => props.variant === "controlled");
const mobile = computed(() => ["mobile", "full-screen-mobile"].includes(props.variant));
const resizable = computed(() => ["resizable", "resizable-controlled", "end", "rtl"].includes(props.variant));
const rtl = computed(() => ["rtl", "resizable-rtl"].includes(props.variant));
const withNamespace = computed(() => ["preview", "namespace-selector", "peeking", "sliding-views", "full-screen-mobile"].includes(props.variant));
const withProfile = computed(() => ["preview", "namespace-selector", "profile-selector", "peeking", "full-screen-mobile", "scrollable"].includes(props.variant));
const withSearch = computed(() => ["preview", "quick-search", "peeking", "full-screen-mobile", "resizable"].includes(props.variant));
const navLabel = computed(() => `${props.variant} navigation`);
function updateOpen(value: boolean) { if (!locked.value) open.value = value; }
function trackRequest(_details: SidebarOpenChangeDetails) { requests.value += 1; }
</script>

<template>
  <div class="sidebar-demo" :data-sidebar-demo="props.variant" :data-standalone="props.standalone || undefined">
    <component :is="rtl ? DirectionProvider : 'div'" :locale="rtl ? 'ar' : undefined">
      <Sidebar.Provider
        :open="controlled ? open : undefined"
        :mobile-open="controlled ? mobileOpen : undefined"
        :default-open="!['collapsed', 'peeking'].includes(props.variant)"
        :compact="props.variant === 'compact'"
        :collapsible="props.variant === 'offcanvas' ? 'offcanvas' : props.variant === 'static' ? 'none' : 'icon'"
        :side="['end', 'resizable-end'].includes(props.variant) ? 'end' : 'start'"
        :mobile-breakpoint="mobile ? 10000 : 768"
        :dir="rtl ? 'rtl' : 'ltr'"
        :resizable="resizable"
        :default-width="240"
        :min-width="180"
        :max-width="400"
        :resize-width="props.variant === 'resizable-controlled' ? resizeWidth : undefined"
        :peekable="props.variant === 'peeking'"
        class="sidebar-demo__layout"
        @update:open="updateOpen"
        @update:mobile-open="mobileOpen = $event"
        @open-change="trackRequest"
        @update:resize-width="value => { if (!resizeLocked) resizeWidth = value; }"
      >
        <Sidebar.Root :label="navLabel" :full-screen-on-mobile="props.variant === 'full-screen-mobile'">
          <Sidebar.Header class="sidebar-demo__header">
            <Sidebar.MenuButton v-if="props.variant === 'sliding-views'" :icon="ArrowLeftRight"
              :tooltip="surface === 'workspace' ? 'Open project view' : 'Show workspace view'"
              :aria-label="surface === 'workspace' ? 'Open project view' : 'Show workspace view'"
              @click="surface = surface === 'workspace' ? 'project' : 'workspace'">
              <strong>{{ surface === 'workspace' ? 'Workspace view' : 'Rotor study view' }}</strong>
            </Sidebar.MenuButton>
            <SidebarDemoNamespace v-else-if="withNamespace" v-model="namespace" @add="selected = 'Add namespace'" @action="selected = $event" />
            <template v-else>
              <Box class="sidebar-demo__brand-icon" aria-hidden="true" />
              <Sidebar.MenuLabel><strong>Workspace</strong></Sidebar.MenuLabel>
            </template>
            <Sidebar.Close />
          </Sidebar.Header>
          <Sidebar.Loading v-if="props.variant === 'loading' && loading" />
          <SidebarDemoSlidingNavigation v-else-if="props.variant === 'sliding-views'" v-model="surface" :selected="selected" @select="selected = $event" />
          <SidebarDemoNavigation v-else :selected="selected" :long="props.variant === 'scrollable'" @select="selected = $event">
            <Sidebar.Context v-if="withSearch" v-slot="{ setMobileOpen }"><SidebarDemoSearch @select="selected = $event; setMobileOpen(false)" /></Sidebar.Context>
          </SidebarDemoNavigation>
          <Sidebar.Footer v-if="withProfile" class="sidebar-demo__footer">
            <SidebarDemoProfile v-model="profile" @select="selected = $event" />
          </Sidebar.Footer>
          <Sidebar.ResizeHandle v-if="resizable" />
        </Sidebar.Root>
        <div class="sidebar-demo__main">
          <div class="sidebar-demo__topbar">
            <Sidebar.Trigger :aria-label="mobile ? 'Open navigation' : undefined" />
            <Breadcrumbs.Root v-if="props.variant === 'full-screen-mobile'" size="sm" aria-label="Current page" class="sidebar-demo__breadcrumb">
              <Breadcrumbs.List>
                <Breadcrumbs.Item><Breadcrumbs.Link href="?section=overview" @click.prevent="selected = 'Overview'">{{ namespace }}</Breadcrumbs.Link></Breadcrumbs.Item>
                <Breadcrumbs.Separator />
                <template v-if="['Geometry', 'Refinement'].includes(selected)"><Breadcrumbs.Item>Mesh</Breadcrumbs.Item><Breadcrumbs.Separator /></template>
                <Breadcrumbs.Item><Breadcrumbs.Current>{{ selected }}</Breadcrumbs.Current></Breadcrumbs.Item>
              </Breadcrumbs.List>
            </Breadcrumbs.Root>
            <span v-else>{{ selected }}</span>
          </div>
          <div class="sidebar-demo__body">
            <span class="sidebar-demo__eyebrow">{{ withNamespace ? namespace : 'Project workspace' }}</span>
            <p class="sidebar-demo__title">{{ selected }}</p>
            <p v-if="selected === 'Add namespace'" class="sidebar-demo__hint">Connect this action to your namespace creation flow. This example does not create an account or namespace.</p>
            <p v-else-if="namespaceActionDescriptions[selected]" class="sidebar-demo__hint">{{ namespaceActionDescriptions[selected] }}</p>
            <p v-else class="sidebar-demo__hint">{{ mobile ? 'Open the navigation drawer and select a page.' : resizable ? 'Drag the separator. Or focus it and use the arrow keys.' : props.variant === 'peeking' ? 'Hover or focus the icon rail to peek. The page stays in place.' : props.variant === 'sliding-views' ? 'Use the header button to switch views, or open Rotor study in the navigation.' : 'Select a link or collapse the sidebar.' }}</p>
            <Sidebar.Context v-if="props.variant === 'peeking'" v-slot="{ open, isPeeking, isMobile, toggle }">
              <div class="sidebar-demo__interaction" data-sidebar-peek-controls>
                <output aria-live="polite">{{ isPeeking ? 'Peeking — temporary' : open ? 'Expanded — pinned' : 'Collapsed — ready to peek' }}</output>
                <Button v-if="!isMobile" size="sm" variant="secondary" @click="toggle">{{ open ? 'Collapse to try peeking' : 'Pin sidebar open' }}</Button>
              </div>
            </Sidebar.Context>
            <div v-if="props.variant === 'sliding-views'" class="sidebar-demo__interaction" data-sidebar-view-controls>
              <output aria-live="polite">Active view: {{ surface === 'workspace' ? 'Workspace' : 'Rotor study' }}</output>
              <Button size="sm" variant="secondary" @click="surface = surface === 'workspace' ? 'project' : 'workspace'">{{ surface === 'workspace' ? 'Open project view' : 'Show workspace view' }}</Button>
            </div>
            <div v-if="props.standalone" class="sidebar-demo__mobile-summary">
              <span>Project</span><strong>Rotor study</strong><span>Current page</span><strong>{{ selected }}</strong><span>Namespace</span><strong>{{ namespace }}</strong>
            </div>
            <Button v-if="props.variant === 'loading'" size="sm" variant="secondary" @click="loading = !loading">{{ loading ? 'Show navigation' : 'Show loading' }}</Button>
            <Button v-if="props.variant === 'resizable-controlled'" size="sm" variant="secondary" @click="resizeLocked = !resizeLocked">{{ resizeLocked ? 'Unlock width' : 'Lock width' }}</Button>
            <template v-if="controlled">
              <div class="sidebar-demo__controls">
                <Button size="sm" variant="secondary" @click="locked = !locked">{{ locked ? 'Unlock state' : 'Lock state' }}</Button>
                <Button size="sm" variant="secondary" @click="open = !open">Set {{ open ? 'collapsed' : 'expanded' }}</Button>
                <Button size="sm" variant="secondary" @click="mobileOpen = !mobileOpen">{{ mobileOpen ? 'Close' : 'Open' }} mobile</Button>
              </div>
              <output aria-live="polite">Desktop {{ open ? 'expanded' : 'collapsed' }} · Mobile {{ mobileOpen ? 'open' : 'closed' }} · {{ requests }} requests</output>
            </template>
            <Sidebar.Context v-slot="{ state, isMobile, width }"><span class="sidebar-demo__state">{{ isMobile ? 'Mobile' : 'Desktop' }} · {{ state }}<template v-if="resizable"> · {{ Math.round(width) }}px</template></span></Sidebar.Context>
          </div>
        </div>
      </Sidebar.Provider>
    </component>
  </div>
</template>

<style src="./sidebar-docs-demo.css"></style>
