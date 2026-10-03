export const barrelCode = `import {
  Dropdown,
  DropdownRoot,
  DropdownContent,
  DropdownItem,
  type DropdownProps,
  type DropdownItemVariant,
} from "@dicehub/kappa";`;

export const granularCode = `import {
  Dropdown,
  DropdownRoot,
  DropdownContent,
  DropdownItem,
  type DropdownProps,
  type DropdownItemVariant,
} from "@dicehub/kappa/components/dropdown";`;

export const previewCode = `<script setup>
import { Copy, Download, FolderOpen, Trash2 } from "@lucide/vue";
import { Button } from "@dicehub/kappa/components/button";
import { Dropdown } from "@dicehub/kappa/components/dropdown";
</script>

<template>
  <Dropdown.Root aria-label="Run actions">
    <Dropdown.Trigger as-child>
      <Button variant="outline">Run actions <Dropdown.Indicator /></Button>
    </Dropdown.Trigger>
    <Dropdown.Content>
      <Dropdown.Group>
        <Dropdown.Label>Run 4189</Dropdown.Label>
        <Dropdown.Item value="open" value-text="Open results" :icon="FolderOpen">Open results</Dropdown.Item>
        <Dropdown.Item value="copy" value-text="Copy run ID" :icon="Copy">
          Copy run ID
          <template #end><Dropdown.Shortcut>⌘C</Dropdown.Shortcut></template>
        </Dropdown.Item>
        <Dropdown.Item value="archive-bundle" value-text="Download archive" :icon="Download">
          Download archive
        </Dropdown.Item>
      </Dropdown.Group>
      <Dropdown.Separator />
      <Dropdown.Item value="delete" value-text="Delete run" variant="destructive" :icon="Trash2">
        Delete run
      </Dropdown.Item>
    </Dropdown.Content>
  </Dropdown.Root>
</template>`;

export const usageCode = `<script setup lang="ts">
import { Button } from "@dicehub/kappa/components/button";
import { Dropdown } from "@dicehub/kappa/components/dropdown";

const emit = defineEmits<{ action: [value: string] }>();
</script>

<template>
  <Dropdown.Root @select="emit('action', $event.value)">
    <Dropdown.Trigger as-child>
      <Button variant="outline">Actions <Dropdown.Indicator /></Button>
    </Dropdown.Trigger>
    <Dropdown.Content>
      <Dropdown.Item value="open">Open</Dropdown.Item>
      <Dropdown.Item value="duplicate">Duplicate</Dropdown.Item>
      <Dropdown.Separator />
      <Dropdown.Item value="delete" variant="destructive">Delete</Dropdown.Item>
    </Dropdown.Content>
  </Dropdown.Root>
</template>`;

export const compositionCode = `<Dropdown.Root>
  <Dropdown.Trigger />
  <Dropdown.Content>
    <Dropdown.Group>
      <Dropdown.Label />
      <Dropdown.Item />
      <Dropdown.LinkItem />
      <Dropdown.CheckboxItem />
      <Dropdown.RadioGroup>
        <Dropdown.RadioItem />
      </Dropdown.RadioGroup>
    </Dropdown.Group>
    <Dropdown.Separator />
    <Dropdown.Sub>
      <Dropdown.SubTrigger />
      <Dropdown.SubContent />
    </Dropdown.Sub>
  </Dropdown.Content>
</Dropdown.Root>`;

export const keyboardShortcuts = [
  { keys: ["Enter", "Space"], description: "Open the menu or activate the highlighted item." },
  { keys: ["↑", "↓"], description: "Open from the trigger or move between enabled items." },
  { keys: ["Home", "End"], description: "Move to the first or last enabled item." },
  { keys: ["A–Z"], description: "Move to the next item whose text matches the typed characters." },
  { keys: ["→", "←"], description: "Open or close a submenu, adjusted for reading direction." },
  { keys: ["Shift", "F10"], description: "Open a context-triggered menu from the keyboard." },
  { keys: ["Esc"], description: "Close the current menu and restore focus to its trigger." },
] as const;

export const examples = [
  {
    id: "basic",
    title: "Basic",
    description: "Use a unique value for each action. Ark UI closes the menu after a normal item is selected.",
    code: `<Dropdown.Root aria-label="Project actions">
  <Dropdown.Trigger as-child><Button>Open menu <Dropdown.Indicator /></Button></Dropdown.Trigger>
  <Dropdown.Content>
    <Dropdown.Item value="new">New simulation</Dropdown.Item>
    <Dropdown.Item value="duplicate">Duplicate project</Dropdown.Item>
    <Dropdown.Item value="archive">Archive project</Dropdown.Item>
  </Dropdown.Content>
</Dropdown.Root>`,
  },
  {
    id: "icons-inset",
    title: "Icons and Inset Alignment",
    description: "Use icon for a component icon. Use inset to align text-only rows with icon-bearing rows.",
    code: `<Dropdown.Item value="open" :icon="FolderOpen">Open</Dropdown.Item>
<Dropdown.Item value="copy" :icon="Copy">Copy path</Dropdown.Item>
<Dropdown.Separator />
<Dropdown.Group>
  <Dropdown.Label inset>Without icons</Dropdown.Label>
  <Dropdown.Item value="rename" inset>Rename</Dropdown.Item>
</Dropdown.Group>`,
  },
  {
    id: "action-callbacks",
    title: "Action Callbacks",
    description: "Listen to Root select for one action router, or listen to Item select for local behavior.",
    code: `<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@dicehub/kappa/components/button";
import { Dropdown } from "@dicehub/kappa/components/dropdown";

const lastAction = ref("No action selected");
</script>

<template>
  <Dropdown.Root @select="lastAction = $event.value">
    <Dropdown.Trigger as-child><Button>Choose action</Button></Dropdown.Trigger>
    <Dropdown.Content>
      <Dropdown.Item value="inspect">Inspect report</Dropdown.Item>
      <Dropdown.Item value="share">Share result</Dropdown.Item>
      <Dropdown.Item value="export">Export data</Dropdown.Item>
    </Dropdown.Content>
  </Dropdown.Root>
  <output aria-live="polite">{{ lastAction }}</output>
</template>`,
  },
  {
    id: "checkbox-items",
    title: "Checkbox Items",
    description: "CheckboxItem supports controlled checked and uncontrolled defaultChecked state. It stays open by default for repeated changes.",
    code: `<Dropdown.CheckboxItem v-model:checked="activityVisible" value="activity">
  Activity
</Dropdown.CheckboxItem>
<Dropdown.CheckboxItem :default-checked="false" value="compact">
  Compact rows
</Dropdown.CheckboxItem>`,
  },
  {
    id: "radio-group",
    title: "Radio Group",
    description: "Use RadioGroup for one choice. v-model is controlled; defaultValue supplies an uncontrolled initial choice.",
    code: `<Dropdown.RadioGroup v-model="density">
  <Dropdown.Label>Row density</Dropdown.Label>
  <Dropdown.RadioItem value="compact">Compact</Dropdown.RadioItem>
  <Dropdown.RadioItem value="comfortable">Comfortable</Dropdown.RadioItem>
  <Dropdown.RadioItem value="spacious">Spacious</Dropdown.RadioItem>
</Dropdown.RadioGroup>`,
  },
  {
    id: "nested-submenu",
    title: "Nested Submenu",
    description: "Sub uses right-start positioning by default. Ark UI manages pointer intent, arrow keys, focus return, and nested dismissal.",
    code: `<Dropdown.Sub aria-label="Export format">
  <Dropdown.SubTrigger :icon="FileText">Export as</Dropdown.SubTrigger>
  <Dropdown.SubContent>
    <Dropdown.Item value="csv">CSV table</Dropdown.Item>
    <Dropdown.Item value="json">JSON data</Dropdown.Item>
    <Dropdown.Item value="vtk">VTK fields</Dropdown.Item>
  </Dropdown.SubContent>
</Dropdown.Sub>
<Dropdown.Sub aria-label="Unavailable export">
  <Dropdown.SubTrigger disabled>Legacy export</Dropdown.SubTrigger>
  <Dropdown.SubContent>...</Dropdown.SubContent>
</Dropdown.Sub>`,
  },
  {
    id: "custom-trigger",
    title: "Custom Trigger",
    description: "Use as-child so a Kappa Button or another semantic button remains the only focusable trigger element.",
    code: `<Dropdown.Trigger as-child>
  <Button aria-label="Open account menu" shape="circle" variant="ghost">
    <User aria-hidden="true" />
  </Button>
</Dropdown.Trigger>`,
  },
  {
    id: "navigation-links",
    title: "Navigation Links",
    description: "LinkItem renders one semantic anchor with menu-item behavior. Disabled links remove href. New-tab links receive noopener noreferrer by default.",
    code: `<Dropdown.LinkItem href="/docs/components/button" value-text="Button">Button</Dropdown.LinkItem>
<Dropdown.LinkItem href="/docs/components/dialog" value-text="Dialog">Dialog</Dropdown.LinkItem>
<Dropdown.LinkItem href="https://ark-ui.com/docs/components/menu" value-text="Ark UI Menu" target="_blank">
  Ark UI Menu
</Dropdown.LinkItem>
<Dropdown.LinkItem href="/docs/components/missing" disabled>Unavailable guide</Dropdown.LinkItem>`,
  },
  {
    id: "controlled",
    title: "Controlled Open State",
    description: "Bind v-model:open when application state must observe or control visibility.",
    code: `<Dropdown.Root v-model:open="open">
  <Dropdown.Trigger as-child><Button>Controlled menu</Button></Dropdown.Trigger>
  <Dropdown.Content>
    <Dropdown.Item value="pause">Pause run</Dropdown.Item>
    <Dropdown.Item value="resume">Resume run</Dropdown.Item>
  </Dropdown.Content>
</Dropdown.Root>`,
  },
  {
    id: "destructive-disabled",
    title: "Destructive and Disabled Items",
    description: "Destructive changes use the Kappa danger tokens. Disabled items stay visible and are skipped by keyboard navigation.",
    code: `<Dropdown.Item value="details">View details</Dropdown.Item>
<Dropdown.Item value="restart" disabled>Restart while active</Dropdown.Item>
<Dropdown.Separator />
<Dropdown.Item value="delete" variant="destructive">Delete permanently</Dropdown.Item>`,
  },
  {
    id: "long-list",
    title: "Long List",
    description: "Content respects the available viewport height and scrolls without moving the trigger or page.",
    code: `<Dropdown.Content style="--kappa-dropdown-max-block-size: 14rem">
  <Dropdown.Group>
    <Dropdown.Label>Recent runs</Dropdown.Label>
    <Dropdown.Item v-for="run in runs" :key="run.id" :value="run.id" :value-text="run.label">
      <Dropdown.ItemText>{{ run.label }}</Dropdown.ItemText>
    </Dropdown.Item>
  </Dropdown.Group>
</Dropdown.Content>`,
  },
  {
    id: "context-menu",
    title: "Context Menu",
    description: "ContextTrigger opens from a right-click, Shift+F10, or a long press on supported touch and pen input.",
    code: `<Dropdown.Root aria-label="Canvas actions">
  <Dropdown.ContextTrigger>Right-click or press Shift+F10</Dropdown.ContextTrigger>
  <Dropdown.Content>
    <Dropdown.Item value="inspect">Inspect cell</Dropdown.Item>
    <Dropdown.Item value="copy">Copy coordinates</Dropdown.Item>
  </Dropdown.Content>
</Dropdown.Root>`,
  },
  {
    id: "right-to-left",
    title: "Right-to-left",
    description: "Set dir on Root. Logical spacing, submenu placement, the caret, and arrow keys then follow the reading direction.",
    code: `<div dir="rtl">
  <Dropdown.Root dir="rtl" aria-label="إجراءات التشغيل">
    <Dropdown.Trigger as-child><Button>إجراءات التشغيل</Button></Dropdown.Trigger>
    <Dropdown.Content>
      <Dropdown.Item value="open">فتح النتائج</Dropdown.Item>
      <Dropdown.Sub>
        <Dropdown.SubTrigger>تصدير كـ</Dropdown.SubTrigger>
        <Dropdown.SubContent>...</Dropdown.SubContent>
      </Dropdown.Sub>
    </Dropdown.Content>
  </Dropdown.Root>
</div>`,
  },
] as const;

export const rootProps = [
  { name: "ariaLabel", type: "string", defaultValue: "—", description: "Accessible menu label when visible context is not sufficient." },
  { name: "dir", type: '"ltr" | "rtl"', defaultValue: "inherited", description: "Reading direction for placement and keyboard behavior." },
  { name: "open / defaultOpen", type: "boolean", defaultValue: "false", description: "Controlled or initial open state." },
  { name: "highlightedValue / defaultHighlightedValue", type: "string", defaultValue: "—", description: "Controlled or initial highlighted item value." },
  { name: "triggerValue / defaultTriggerValue", type: "string", defaultValue: "—", description: "Controlled or initial active trigger in a multi-trigger menu." },
  { name: "positioning", type: "PositioningOptions", defaultValue: "bottom-start, 6px", description: "Ark UI floating position options." },
  { name: "anchorPoint", type: "Point", defaultValue: "—", description: "Virtual anchor point for context-positioned content." },
  { name: "closeOnSelect", type: "boolean", defaultValue: "true", description: "Default close behavior for normal items." },
  { name: "composite", type: "boolean", defaultValue: "true", description: "Use menu composite focus and keyboard behavior." },
  { name: "loopFocus", type: "boolean", defaultValue: "false", description: "Wrap arrow-key focus at the first and last item." },
  { name: "typeahead", type: "boolean", defaultValue: "true", description: "Enable printable-character item matching." },
  { name: "navigate", type: "(details) => void", defaultValue: "native link", description: "Override keyboard link navigation for an application router." },
  { name: "id / ids", type: "string / ElementIds", defaultValue: "generated", description: "Stable machine and part IDs for integration or testing." },
  { name: "lazyMount / unmountOnExit", type: "boolean", defaultValue: "false", description: "Control presence and cleanup of popup content." },
] as const;

export const contentProps = [
  { name: "teleport", type: "boolean", defaultValue: "true", description: "Teleport Positioner and Content to the target." },
  { name: "teleportTo", type: "Teleport target", defaultValue: '"body"', description: "Vue Teleport target." },
  { name: "asChild", type: "boolean", defaultValue: "false", description: "Merge Content behavior into one child element." },
] as const;

export const itemProps = [
  { name: "value", type: "string", defaultValue: "required", description: "Unique action value used by selection." },
  { name: "valueText", type: "string", defaultValue: "rendered text", description: "Explicit searchable typeahead text for Item and LinkItem." },
  { name: "variant", type: '"default" | "destructive"', defaultValue: '"default"', description: "Semantic item treatment." },
  { name: "disabled", type: "boolean", defaultValue: "false", description: "Expose but skip an unavailable item." },
  { name: "closeOnSelect", type: "boolean", defaultValue: "root value", description: "Override close behavior for this item." },
  { name: "icon / iconProps", type: "Component / object", defaultValue: "—", description: "Optional decorative leading icon and its props." },
  { name: "inset", type: "boolean", defaultValue: "false", description: "Align a text-only row with icon-bearing rows." },
  { name: "selected", type: "boolean", defaultValue: "false", description: "Show a trailing visual check. Use RadioItem for a semantic single choice." },
  { name: "asChild", type: "boolean", defaultValue: "false", description: "Merge Item behavior into one custom child. Compose custom decoration inside that child." },
  { name: "LinkItem.href", type: "string", defaultValue: "required", description: "Anchor destination. It is removed when the link is disabled." },
  { name: "LinkItem.value", type: "string", defaultValue: "href", description: "Stable selection value for the link." },
  { name: "LinkItem.target / rel", type: "string", defaultValue: "—", description: "Native anchor attributes. target=_blank defaults rel to noopener noreferrer." },
  { name: "SubTrigger.disabled", type: "boolean", defaultValue: "false", description: "Expose but skip an unavailable submenu." },
] as const;

export const selectionProps = [
  { name: "CheckboxItem / RadioItem.value", type: "string", defaultValue: "required", description: "Unique option value used by selection and as fallback typeahead text." },
  { name: "CheckboxItem.checked / defaultChecked", type: "boolean", defaultValue: "false", description: "Controlled or initial checkbox state." },
  { name: "CheckboxItem.closeOnSelect", type: "boolean", defaultValue: "false", description: "Keep the menu open for repeated option changes." },
  { name: "RadioGroup.modelValue / defaultValue", type: "string", defaultValue: "—", description: "Controlled or initial selected radio value." },
  { name: "RadioItem.closeOnSelect", type: "boolean", defaultValue: "false", description: "Keep the menu open while a radio choice changes." },
  { name: "CheckboxItem / RadioItem.valueText", type: "string", defaultValue: "value", description: "Searchable typeahead text for an option." },
  { name: "CheckboxItem / RadioItem.disabled", type: "boolean", defaultValue: "false", description: "Expose but skip an unavailable option." },
  { name: "CheckboxItem / RadioItem.inset", type: "boolean", defaultValue: "false", description: "Add logical start spacing after the option indicator." },
  { name: "CheckboxItem / RadioItem.asChild", type: "boolean", defaultValue: "false", description: "Merge option behavior into one custom child; compose its indicator manually." },
  { name: "RadioGroup.id / asChild", type: "string / boolean", defaultValue: "generated / false", description: "Group identity and custom-element composition." },
] as const;

export const parts = [
  { name: "Root", element: "none", description: "Owns open, highlight, selection, typeahead, and positioning state." },
  { name: "RootProvider", element: "none", description: "Provides an API created with useDropdown." },
  { name: "Trigger", element: "button", description: "Opens the menu and receives restored focus." },
  { name: "Indicator", element: "div", description: "Optional open-state caret for the trigger." },
  { name: "Content", element: "div", description: "Portalled positioner and scroll-safe menu surface." },
  { name: "Item", element: "div", description: "One action menu item." },
  { name: "LinkItem", element: "a", description: "Semantic navigation item." },
  { name: "CheckboxItem", element: "div", description: "Multi-choice menu item with aria-checked." },
  { name: "RadioGroup / RadioItem", element: "div", description: "Single-choice group and item with aria-checked." },
  { name: "Group / Label", element: "div", description: "Associated group and visible group label." },
  { name: "Separator", element: "div", description: "Semantic separator between action groups." },
  { name: "Shortcut", element: "span", description: "Visual keyboard hint. It does not register a shortcut." },
  { name: "Sub / SubTrigger / SubContent", element: "mixed", description: "Nested menu root, trigger item, and portalled surface." },
  { name: "ContextTrigger", element: "button", description: "Opens the menu from context-menu input." },
  { name: "Arrow", element: "div", description: "Optional positioned arrow and tip." },
  { name: "ItemIndicator / RadioItemIndicator", element: "div", description: "Composable checked-state indicator for custom option items." },
  { name: "ItemText", element: "span", description: "Composable item text with overflow handling." },
  { name: "Context / ItemContext", element: "none", description: "Scoped slots for Ark menu and item state." },
] as const;

export const events = [
  { name: "select", payload: "DropdownSelectionDetails", description: "A menu item was selected; details.value identifies it." },
  { name: "openChange", payload: "DropdownOpenChangeDetails", description: "The menu opened or closed." },
  { name: "update:open", payload: "boolean", description: "Vue controlled-state update." },
  { name: "highlightChange", payload: "DropdownHighlightChangeDetails", description: "The roving highlight changed." },
  { name: "update:highlightedValue", payload: "string | null", description: "Vue controlled highlight update." },
  { name: "triggerValueChange / update:triggerValue", payload: "details / string | null", description: "The active multi-trigger value changed." },
  { name: "escapeKeyDown", payload: "KeyboardEvent", description: "Escape was pressed while the menu was open." },
  { name: "exitComplete", payload: "void", description: "The closing presence transition completed." },
  { name: "focusOutside", payload: "DropdownFocusOutsideEvent", description: "Focus moved outside the open menu." },
  { name: "interactOutside", payload: "DropdownInteractOutsideEvent", description: "Pointer or focus interaction occurred outside." },
  { name: "pointerDownOutside", payload: "DropdownPointerDownOutsideEvent", description: "Pointer input started outside the open menu." },
  { name: "requestDismiss", payload: "DropdownRequestDismissEvent", description: "A nested dismissable layer requested dismissal." },
  { name: "checkedChange", payload: "boolean", description: "CheckboxItem changed its state." },
  { name: "update:checked", payload: "boolean", description: "Vue controlled checkbox update." },
  { name: "valueChange", payload: "string", description: "RadioGroup changed its selected value." },
  { name: "update:modelValue", payload: "string", description: "Vue controlled radio-group update." },
] as const;

export const exportsList = [
  { name: "Dropdown / DropdownRoot", description: "Compound root and named root export." },
  { name: "Dropdown*", description: "Named exports for every compound part." },
  { name: "DropdownProps / Dropdown*Props", description: "Public root and part prop contracts." },
  { name: "DROPDOWN_ITEM_VARIANTS", description: "Supported semantic item variants." },
  { name: "DROPDOWN_DEFAULT_ITEM_VARIANT", description: "Default semantic item variant." },
  { name: "DROPDOWN_DEFAULT_POSITIONING", description: "Kappa root placement defaults." },
  { name: "DROPDOWN_SUB_DEFAULT_POSITIONING", description: "Kappa submenu placement defaults." },
  { name: "isDropdownItemVariant / resolveDropdownItemVariant", description: "Runtime item-variant guards and fallback resolver." },
  { name: "useDropdown / useDropdownContext", description: "Ark UI state-machine hooks under Kappa names." },
  { name: "dropdownAnatomy", description: "Ark UI menu anatomy under a Kappa name." },
] as const;
