<script setup lang="ts">
import { computed, ref, useId } from "vue";
import { Sidebar, type SidebarContextValue } from "@dicehub/kappa/components/sidebar";
import { Avatar } from "@dicehub/kappa/components/avatar";
import { Button } from "@dicehub/kappa/components/button";
import { Dropdown } from "@dicehub/kappa/components/dropdown";
import { Input } from "@dicehub/kappa/components/input";
import { Switch } from "@dicehub/kappa/components/switch";
import { Tooltip } from "@dicehub/kappa/components/tooltip";
import { ArchiveX, BadgeCheck, Bell, CreditCard, File, Inbox, LogOut, Mail, Search, Send, Settings, Sparkles, Trash2 } from "@lucide/vue";

const props = withDefaults(defineProps<{ standalone?: boolean }>(), { standalone: false });
const headingId = useId();
const listId = useId();
const folder = ref("Inbox");
const query = ref("");
const unreadOnly = ref(false);
const selectedId = ref("mesh-review");
const accountPage = ref("");
const folders = [{ name: "Inbox", icon: Inbox }, { name: "Drafts", icon: File }, { name: "Sent", icon: Send }, { name: "Junk", icon: ArchiveX }, { name: "Trash", icon: Trash2 }];
const messages = [
  { id: "mesh-review", folder: "Inbox", sender: "Jordan Lee", email: "jordan@example.com", subject: "Mesh review is ready", date: "10:42", unread: true, body: "The updated mesh for the rotor study is ready for review.\n\nI reduced the cell size near the blade tips and checked the boundary layers. The quality report is attached to the project.\n\nCould you review the refinement settings before we start the next run?\n\nThanks,\nJordan" },
  { id: "geometry", folder: "Inbox", sender: "Alex Morgan", email: "alex@example.com", subject: "Geometry files uploaded", date: "09:18", unread: true, body: "The new geometry files are in the shared workspace.\n\nThe inlet and outlet surfaces now have separate names. Please use revision 04 for the next simulation.\n\nAlex" },
  { id: "results", folder: "Inbox", sender: "Sam Chen", email: "sam@example.com", subject: "Channel flow results", date: "Yesterday", unread: false, body: "The channel flow simulation has finished.\n\nThe pressure drop is within the expected range. I added comparison plots to the results page.\n\nSam" },
  { id: "meeting", folder: "Inbox", sender: "Taylor Kim", email: "taylor@example.com", subject: "Thursday project review", date: "Yesterday", unread: false, body: "Let’s review the current project on Thursday at 10:00.\n\nWe will cover geometry changes, mesh quality, and the next simulation plan.\n\nTaylor" },
  { id: "boundary", folder: "Inbox", sender: "Jordan Lee", email: "jordan@example.com", subject: "Boundary condition notes", date: "Mon", unread: true, body: "I added the boundary condition notes to the project.\n\nPlease check the inlet velocity and reference pressure before you start the solver.\n\nJordan" },
  { id: "report", folder: "Inbox", sender: "Alex Morgan", email: "alex@example.com", subject: "Weekly progress report", date: "Mon", unread: false, body: "This week we completed the geometry cleanup and the first mesh review.\n\nThe next milestone is a stable baseline simulation.\n\nAlex" },
  { id: "access", folder: "Inbox", sender: "Sam Chen", email: "sam@example.com", subject: "Workspace access confirmed", date: "Fri", unread: false, body: "Your team now has access to the shared project workspace.\n\nAll project files and review notes are available in the same location.\n\nSam" },
  { id: "draft", folder: "Drafts", sender: "Ros.Space", email: "ros@example.com", subject: "Next simulation plan", date: "11:05", unread: false, body: "Draft — outline the next simulation plan.\n\n1. Confirm the geometry revision.\n2. Review the mesh settings.\n3. Run the baseline case.\n\nThis is a read-only local preview." },
  { id: "sent", folder: "Sent", sender: "Ros.Space", email: "ros@example.com", subject: "Review notes shared", date: "08:30", unread: false, body: "Hi Jordan,\n\nI shared the review notes in the project workspace. The mesh settings look good.\n\nRos" },
  { id: "trash", folder: "Trash", sender: "Taylor Kim", email: "taylor@example.com", subject: "Old meeting time", date: "Tue", unread: false, body: "This meeting time has been replaced by the Thursday project review." },
];
const filtered = computed(() => messages.filter(message => message.folder === folder.value && (!unreadOnly.value || message.unread) && `${message.sender} ${message.subject} ${message.body}`.toLowerCase().includes(query.value.trim().toLowerCase())));
const selected = computed(() => filtered.value.find(message => message.id === selectedId.value) ?? filtered.value[0]);
const accountActions = [{ name: "Account", icon: BadgeCheck }, { name: "Billing", icon: CreditCard }, { name: "Notifications", icon: Bell }, { name: "Preferences", icon: Settings }];
function openFolder(name: string, context: SidebarContextValue) {
  folder.value = name;
  query.value = "";
  unreadOnly.value = false;
  accountPage.value = "";
  context.setOpen(true);
}
function openMessage(id: string, context: SidebarContextValue) {
  selectedId.value = id;
  accountPage.value = "";
  context.setMobileOpen(false);
}
function openAccount(name: string, context: SidebarContextValue) {
  accountPage.value = name;
  context.setMobileOpen(false);
}
</script>

<template>
  <div class="sidebar-inbox-demo" data-sidebar-block="inbox-navigation" :data-standalone="props.standalone || undefined">
    <Sidebar.Provider width="23rem" collapsed-width="4rem" class="sidebar-inbox-demo__layout">
      <Sidebar.Context v-slot="context">
        <Sidebar.Root label="Inbox navigation" full-screen-on-mobile class="sidebar-inbox-demo__navigation">
          <div class="sidebar-inbox-demo__rail">
            <Sidebar.Header class="sidebar-inbox-demo__rail-header"><span class="sidebar-inbox-demo__brand" aria-label="Mail"><Mail aria-hidden="true" /></span></Sidebar.Header>
            <Sidebar.Content aria-label="Mail folders">
              <Sidebar.Menu><Sidebar.MenuItem v-for="item in folders" :key="item.name">
                <Tooltip.Root :disabled="context.isMobile" :positioning="{ placement: 'right', gutter: 8 }">
                  <Tooltip.Trigger as-child><Button variant="ghost" size="sm" shape="square" :aria-label="item.name" :aria-pressed="folder === item.name" class="sidebar-inbox-demo__folder" @click="openFolder(item.name, context)"><component :is="item.icon" aria-hidden="true" /></Button></Tooltip.Trigger>
                  <Tooltip.Content :show-arrow="false">{{ item.name }}</Tooltip.Content>
                </Tooltip.Root>
              </Sidebar.MenuItem></Sidebar.Menu>
            </Sidebar.Content>
            <Sidebar.Footer>
              <Dropdown.Root aria-label="Profile" :positioning="{ placement: context.isMobile ? 'top-start' : 'right-end', strategy: 'fixed', gutter: 8, fitViewport: true, overflowPadding: 8 }">
                <Dropdown.Trigger as-child><Button variant="ghost" size="sm" shape="square" aria-label="Profile: Ros.Space" class="sidebar-inbox-demo__profile-trigger"><Avatar.Root class="sidebar-inbox-demo__avatar" aria-hidden="true"><Avatar.Image src="/avatars/ros-space-astronaut.webp" alt="" /><Avatar.Fallback>RS</Avatar.Fallback></Avatar.Root></Button></Dropdown.Trigger>
                <Dropdown.Context v-slot="menu"><Dropdown.Content :teleport="!context.isMobile" :inert="!menu.open || undefined" class="sidebar-inbox-demo__profile-menu">
                  <div class="sidebar-inbox-demo__identity"><Avatar.Root class="sidebar-inbox-demo__avatar" aria-hidden="true"><Avatar.Image src="/avatars/ros-space-astronaut.webp" alt="" /><Avatar.Fallback>RS</Avatar.Fallback></Avatar.Root><span><strong>Ros.Space</strong><small>ros@example.com</small></span></div>
                  <Dropdown.Separator />
                  <Dropdown.Item value="upgrade" :icon="Sparkles" @select="openAccount('Upgrade to Pro', context)">Upgrade to Pro</Dropdown.Item>
                  <Dropdown.Separator />
                  <Dropdown.Group><Dropdown.Item v-for="item in accountActions" :key="item.name" :value="item.name" :icon="item.icon" @select="openAccount(item.name, context)">{{ item.name }}</Dropdown.Item></Dropdown.Group>
                  <Dropdown.Separator />
                  <Dropdown.Item value="logout" :icon="LogOut" @select="openAccount('Log out', context)">Log out</Dropdown.Item>
                </Dropdown.Content></Dropdown.Context>
              </Dropdown.Root>
            </Sidebar.Footer>
          </div>
          <section :id="listId" class="sidebar-inbox-demo__list-panel" :hidden="context.iconCollapsed && !context.isMobile" :inert="context.iconCollapsed && !context.isMobile || undefined" :aria-label="`${folder} messages`">
            <header class="sidebar-inbox-demo__list-header"><h2>{{ folder }}</h2><Switch.Root v-model:checked="unreadOnly" size="sm"><Switch.Label>Unread</Switch.Label><Switch.Control /></Switch.Root><Sidebar.Close label="Close navigation" /></header>
            <div class="sidebar-inbox-demo__search"><Search aria-hidden="true" /><Input v-model="query" size="sm" type="search" placeholder="Search messages…" aria-label="Search messages" @update:model-value="accountPage = ''" @keydown.esc.stop="query = ''" /></div>
            <div class="sidebar-inbox-demo__messages">
              <ul aria-label="Messages"><li v-for="message in filtered" :key="message.id"><button type="button" class="sidebar-inbox-demo__message" :aria-current="!accountPage && selected?.id === message.id ? 'true' : undefined" @click="openMessage(message.id, context)">
                <span class="sidebar-inbox-demo__message-top"><strong>{{ message.sender }}</strong><time>{{ message.date }}</time></span>
                <span class="sidebar-inbox-demo__subject"><span v-if="message.unread" class="sidebar-inbox-demo__unread" aria-label="Unread"></span>{{ message.subject }}</span>
                <span class="sidebar-inbox-demo__teaser">{{ message.body.split('\n')[0] }}</span>
              </button></li></ul>
              <p v-if="!filtered.length" class="sidebar-inbox-demo__empty" role="status">No messages found.</p>
            </div>
            <p class="sidebar-inbox-demo__count" aria-live="polite">{{ filtered.length }} {{ filtered.length === 1 ? 'message' : 'messages' }}</p>
          </section>
        </Sidebar.Root>
        <div class="sidebar-inbox-demo__main">
          <header class="sidebar-inbox-demo__toolbar"><Sidebar.Trigger /><span aria-hidden="true" class="sidebar-inbox-demo__divider"></span><nav aria-label="Breadcrumb"><span>Mail</span><span aria-hidden="true">/</span><span aria-current="page">{{ accountPage || folder }}</span></nav></header>
          <div class="sidebar-inbox-demo__reader">
            <section v-if="accountPage" class="sidebar-inbox-demo__account" :aria-labelledby="headingId"><h2 :id="headingId">{{ accountPage }}</h2><p>Local preview only. No account, payment, notification, or session is changed.</p><Button variant="secondary" size="sm" @click="accountPage = ''">Back to messages</Button></section>
            <article v-else-if="selected" :aria-labelledby="headingId">
              <header class="sidebar-inbox-demo__message-header"><span class="sidebar-inbox-demo__sender-initials" aria-hidden="true">{{ selected.sender.split(/[. ]/).map(part => part[0]).join('').slice(0, 2) }}</span><div><strong>{{ selected.sender }}</strong><span>{{ selected.email }}</span><small>{{ folder === 'Sent' || folder === 'Drafts' ? 'From: ros@example.com' : 'To: ros@example.com' }}</small></div><time>{{ selected.date }}</time></header>
              <div class="sidebar-inbox-demo__body"><h2 :id="headingId">{{ selected.subject }}</h2><p>{{ selected.body }}</p></div>
              <footer class="sidebar-inbox-demo__reader-note">Example messages. Selection and filters stay in this preview; opening a message does not mark it as read.</footer>
            </article>
            <div v-else class="sidebar-inbox-demo__reader-empty"><Inbox aria-hidden="true" /><h2>No message selected</h2><p>Choose another folder or change the filters.</p></div>
          </div>
        </div>
      </Sidebar.Context>
    </Sidebar.Provider>
  </div>
</template>

<style src="./sidebar-inbox-demo.css"></style>
