import { sidebarFeatureExamples } from "./sidebar-feature-examples";
import { sidebarSnippet } from "./sidebar-snippets";

export const barrelCode = 'import { Sidebar } from "@dicehub/kappa";';
export const granularCode = 'import { Sidebar } from "@dicehub/kappa/components/sidebar";';
export const previewCode = sidebarSnippet("preview");
export const anatomyCode = sidebarSnippet("anatomy");
export const nestedCode = sidebarSnippet("nested");

export const examples = [
  ...sidebarFeatureExamples,
  { id: "compact", title: "Compact", description: "28px desktop rows for dense navigation. Mobile rows keep 44px touch targets.", code: sidebarSnippet("compact") },
  { id: "collapsed", title: "Icon Collapse", description: "Start with an icon rail. Tooltips appear on hover and keyboard focus. Activating a nested section expands the rail.", code: sidebarSnippet("collapsed") },
  { id: "offcanvas", title: "Offcanvas", description: "Hide the entire desktop Sidebar. Keep a Trigger outside it so users can reopen it.", code: sidebarSnippet("offcanvas") },
  { id: "static", title: "Non-collapsible", description: "Keep desktop navigation expanded. Small viewports still use the accessible mobile drawer.", code: sidebarSnippet("static") },
  { id: "controlled", title: "Controlled State", description: "Control desktop and mobile state separately. Lock state to test a parent that rejects a desktop change request.", code: sidebarSnippet("controlled") },
  { id: "end", title: "End Placement", description: "Logical end placement follows the text direction. Drag the separator left to grow this Sidebar. Home grows it; End collapses it, following Ark panel order.", code: sidebarSnippet("end") },
  { id: "rtl", title: "Right-to-left", description: "Use DirectionProvider for Ark behavior and dir for text and layout. Start becomes the right edge.", code: sidebarSnippet("rtl") },
  { id: "mobile", title: "Mobile Drawer", description: "Open the drawer inside this resizable viewport. It starts at the preview's left edge, not at the edge of the documentation page. Tab stays inside the drawer. Escape, Close, and the backdrop dismiss it. Open example tests the same composition in a full browser tab.", code: sidebarSnippet("mobile") },
  { id: "full-screen-mobile", title: "Full-screen Mobile", description: "Resize the viewport, then open the full-screen navigation. The drawer fills only that viewport, so the documentation stays visible. Try namespace and profile menus, Quick search, and a nested page such as Refinement. Its breadcrumb remains visible after the drawer closes.", code: sidebarSnippet("full-screen-mobile") },
  { id: "scrollable", title: "Long Navigation", description: "Header and Footer stay visible while Content scrolls. Long labels do not change the width.", code: sidebarSnippet("scrollable") },
  { id: "loading", title: "Loading", description: "Deterministic placeholder rows with an accessible loading status. Motion stops under reduced-motion preferences.", code: sidebarSnippet("loading") },
] as const;

export const providerProps = [
  ["open / defaultOpen", "boolean", "undefined / true", "Controlled or initial desktop expanded state."],
  ["mobileOpen / defaultMobileOpen", "boolean", "undefined / false", "Independent controlled or initial mobile drawer state."],
  ["collapsible", '"icon" | "offcanvas" | "none"', '"icon"', "Desktop collapse mode. none ignores desktop collapse requests."],
  ["side", '"start" | "end"', '"start"', "Logical edge. End placement orders the desktop Sidebar after the application content."],
  ["compact", "boolean", "false", "28px instead of 32px minimum desktop rows. Mobile remains 44px."],
  ["mobileBreakpoint", "number", "768", "Viewport widths below this many pixels use a drawer. Zero disables mobile mode."],
  ["width / collapsedWidth / mobileWidth", "CSS length", '"16.25rem" / "3.25rem" / "18rem"', "Expanded desktop, icon rail, and mobile widths. Mobile width leaves at least 3rem for the backdrop."],
  ["resizable", "boolean", "false", "Enable desktop resizing through ResizeHandle. The numeric resize width replaces the fixed width prop."],
  ["collapseOnResize", "boolean", "true", "Allow the separator to collapse navigation. Set false to stop at minWidth and hide the separator during collapse. Sidebar.Trigger can still hide the sidebar."],
  ["resizeWidth / defaultWidth", "number (px)", "undefined / 260", "Controlled or initial expanded resize width. Resize emits requests; a controlled parent can reject them."],
  ["minWidth / maxWidth", "number (px)", "180 / 400", "Expanded resize bounds. A collapsed icon rail can be smaller than minWidth."],
  ["peekable", "boolean", "false", "Temporarily reveal a collapsed icon rail on hover/focus, or offcanvas navigation through a peek Trigger. Desktop only; ignored in none mode."],
  ["id", "string", "Vue useId()", "Stable ID prefix for navigation and dialog relationships. Set IDs here, not on Root."],
] as const;

export const partProps = [
  ["Root", "label", '"Main navigation"', "Accessible navigation and mobile dialog name. Give multiple Sidebars distinct names."],
  ["Root", "fullScreenOnMobile", "false", "Mobile dialog covers the viewport."],
  ["Trigger", "expandLabel / collapseLabel / openLabel / closeLabel", "English action labels", "Optional localized labels for the built-in icon. Custom content must provide its own accessible name."],
  ["Trigger", "disabled / asChild", "false", "Disable the action or compose it with a custom button."],
  ["Trigger", "peek", "false", "Hover reveals peekable offcanvas navigation. Click or Enter pins it open. aria-expanded includes temporary visibility."],
  ["Close", "label / asChild", '"Close sidebar" / false', "Mobile-only close action. Hidden on desktop."],
  ["MenuButton", "href / asChild", "undefined / false", "A native link when href is set; otherwise a button. asChild accepts a router link or native element."],
  ["MenuButton", "active / disabled", "false", "Current-page styling and aria-current; disabled controls block activation and leave the tab order."],
  ["MenuButton", "icon / tooltip", "undefined", "Vue icon component (or #icon slot), and optional collapsed-rail tooltip."],
  ["Collapsible", "open / defaultOpen / disabled / id", "undefined / false / false / generated", "Ark disclosure behavior with controlled and uncontrolled state. Sections retain their open preference during icon collapse."],
  ["CollapsibleTrigger / CollapsibleContent", "asChild", "false", "Compose Ark parts with Sidebar.MenuButton or a custom element."],
  ["Loading", "rows / label", '5 / "Loading navigation"', "1–20 placeholder rows and a localized accessible status name."],
  ["ResizeHandle", "label / disabled", '"Resize sidebar" / false', "Focus-visible desktop separator. Ark handles pointer and keyboard resizing. In offcanvas mode, reopen with an external Trigger."],
  ["SlidingViews", "activeKey / direction", 'required / "left"', "Controlled active view key and physical transition direction (left or right). Reverse direction for back navigation."],
  ["SlidingView", "value / label", "required / value", "Matching view key and accessible group name. Inactive views stay mounted but are hidden and inert."],
  ["Structural parts", "asChild", "false", "Header, Footer, Content, Group, GroupLabel, Menu, MenuItem, MenuSub, MenuSubItem, MenuLabel, MenuBadge, and Separator forward attributes to their semantic element."],
] as const;

export const routingCode = sidebarSnippet("routing");
