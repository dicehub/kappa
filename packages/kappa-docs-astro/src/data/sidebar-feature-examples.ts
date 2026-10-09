// read_when: Add or change Sidebar compositions and interactive examples.
import { sidebarSnippet } from "./sidebar-snippets";

export const sidebarFeatureExamples = [
  {
    id: "namespace-selector", title: "Namespace Selector",
    description: "Current workspace details, account actions, and a workspace list with the selected checkmark on the right. Ctrl/⌘ + 1–3 works only while the menu is open. Mobile menus stay inside the drawer.",
    code: sidebarSnippet("namespace-selector"),
  },
  {
    id: "profile-selector", title: "Profile Selector",
    description: "A footer menu with initials, name, email, profile switching, and account actions. All data is synthetic. Actions update this example only.",
    code: sidebarSnippet("profile-selector"),
  },
  {
    id: "quick-search", title: "Quick Search",
    description: "Quick search opens a real CommandPalette. Type a page name, use the arrow keys, then press Enter to navigate. Escape returns focus to the search button. No global shortcut is registered.",
    code: sidebarSnippet("quick-search"),
  },
  {
    id: "resizable", title: "Resizable",
    description: "Drag the separator to change the width. Drag toward the rail to collapse; drag outward to expand. Arrow keys resize, Shift increases the step, Home/End move to the edge limits, and Enter toggles collapse. Ark owns the drag threshold between the minimum width and the rail. The handle is desktop-only.",
    code: sidebarSnippet("resizable"),
  },
  {
    id: "resizable-controlled", title: "Controlled Width",
    description: "Keep the expanded width in application state. Lock width to reject resize requests. Collapse and mobile state remain separate.",
    code: sidebarSnippet("resizable-controlled"),
  },
  {
    id: "peeking", title: "Peeking",
    description: "Hover or focus the collapsed rail to peek. The live state distinguishes a temporary peek from a pinned sidebar. Pin it open, then collapse it to try again. Namespace and profile menus keep the peek visible. Escape or leaving both the Sidebar and its popup closes it without moving the page.",
    code: sidebarSnippet("peeking"),
  },
  {
    id: "hover-reveal", title: "Hover Reveal",
    description: "Collapse the sidebar, then hover over the header toggle. Click to pin it open. Drag the pinned divider to resize within the width limits. Use Home, AI Chat, Projects, or Inbox to change the navigation below. Every context label appears as soon as the full row fits. Otherwise, only the selected label is shown. Context changes keep the current page and group state. Hover over the workspace name to show its menu icon. Its background stays highlighted while the menu is open. Use the search icon or press / to find a page across contexts. The shortcut works in the full example, or while focus is inside this preview. Escape closes menus and search before dismissing the panel. On mobile, the toggle opens a drawer.",
    code: sidebarSnippet("hover-reveal"),
  },
  {
    id: "scroll-to-item", title: "Scroll to Item",
    description: "Jump to an item in a long navigation list without moving the documentation page or keyboard focus. Keep Settings visible does nothing when that row is already fully visible. This composition uses native Content scrolling; reduced motion disables smooth scrolling.",
    code: sidebarSnippet("scroll-to-item"),
  },
  {
    id: "sliding-views", title: "Sliding Views",
    description: "Use the navigation header or the page button to switch between workspace and project views. You can also open Rotor study from the list and go back. The active view is shown beside the navigation. Inactive views stay mounted, hidden, and inert. Motion respects reduced-motion settings.",
    code: sidebarSnippet("sliding-views"),
  },
] as const;
