export const barrelCode = `import {
  ContextMenu,
  type ContextMenuSelectionDetails,
} from "@dicehub/kappa";`;

export const granularCode = `import {
  ContextMenu,
  type ContextMenuSelectionDetails,
} from "@dicehub/kappa/components/context-menu";`;

export const usageCode = `<script setup lang="ts">
import {
  ContextMenu,
  type ContextMenuSelectionDetails,
} from "@dicehub/kappa/components/context-menu";

const handleAction = (details: ContextMenuSelectionDetails) => {
  console.log(details.value);
};
</script>

<template>
  <ContextMenu.Root aria-label="Run actions" @select="handleAction">
    <ContextMenu.Trigger class="run-row">
      Run 4189
    </ContextMenu.Trigger>
    <ContextMenu.Content>
      <ContextMenu.Item value="open">Open results</ContextMenu.Item>
      <ContextMenu.Item value="copy">Copy run ID</ContextMenu.Item>
      <ContextMenu.Separator />
      <ContextMenu.Item value="delete" variant="destructive">
        Delete run
      </ContextMenu.Item>
    </ContextMenu.Content>
  </ContextMenu.Root>
</template>`;

export const resourceListCode = `<ContextMenu.Root
  v-for="resource in resources"
  :key="resource.id"
  :aria-label="\`\${resource.name} actions\`"
  @select="handleResourceAction(resource, $event.value)"
>
  <ContextMenu.Trigger as-child>
    <button type="button" class="resource-row">
      {{ resource.name }}
    </button>
  </ContextMenu.Trigger>
  <ContextMenu.Content>
    <ContextMenu.Item value="open">Open</ContextMenu.Item>
    <ContextMenu.Item value="rename">Rename</ContextMenu.Item>
    <ContextMenu.Item value="copy-path">Copy path</ContextMenu.Item>
  </ContextMenu.Content>
</ContextMenu.Root>`;

export const treeViewCode = `<TreeView.Root
  :collection="collection"
  :default-expanded-value="['case']"
>
  <TreeView.Tree>
    <TreeView.NodeProvider
      v-for="(node, index) in files"
      :key="node.value"
      :node="node"
      :index-path="[index]"
    >
      <ContextMenu.Root :aria-label="\`\${node.label} actions\`">
        <ContextMenu.Trigger as-child>
          <TreeView.Item>
            <TreeView.ItemText>{{ node.label }}</TreeView.ItemText>
          </TreeView.Item>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item value="open">Open</ContextMenu.Item>
          <ContextMenu.Item value="rename">Rename</ContextMenu.Item>
          <ContextMenu.Item value="copy-path">Copy path</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>
    </TreeView.NodeProvider>
  </TreeView.Tree>
</TreeView.Root>`;

export const submenuCode = `<ContextMenu.Root aria-label="Mesh file actions">
  <ContextMenu.Trigger class="file-target">mesh.foam</ContextMenu.Trigger>
  <ContextMenu.Content>
    <ContextMenu.Item value="open">Open</ContextMenu.Item>
    <ContextMenu.Sub aria-label="Move destination">
      <ContextMenu.SubTrigger>Move to</ContextMenu.SubTrigger>
      <ContextMenu.SubContent>
        <ContextMenu.Item value="geometry">Geometry</ContextMenu.Item>
        <ContextMenu.Item value="results">Results</ContextMenu.Item>
      </ContextMenu.SubContent>
    </ContextMenu.Sub>
  </ContextMenu.Content>
</ContextMenu.Root>`;

export const optionsCode = `<ContextMenu.Root aria-label="Tree view options">
  <ContextMenu.Trigger class="tree-target">Project files</ContextMenu.Trigger>
  <ContextMenu.Content>
    <ContextMenu.Group>
      <ContextMenu.Label>View</ContextMenu.Label>
      <ContextMenu.CheckboxItem v-model:checked="showHidden" value="hidden">
        Show hidden files
      </ContextMenu.CheckboxItem>
    </ContextMenu.Group>
    <ContextMenu.RadioGroup v-model="density">
      <ContextMenu.Label>Density</ContextMenu.Label>
      <ContextMenu.RadioItem value="compact">Compact</ContextMenu.RadioItem>
      <ContextMenu.RadioItem value="comfortable">Comfortable</ContextMenu.RadioItem>
    </ContextMenu.RadioGroup>
  </ContextMenu.Content>
</ContextMenu.Root>`;

export const rootProps = [
  { name: "ariaLabel", type: "string", defaultValue: "—", description: "Accessible name mirrored to the menu surface." },
  { name: "open / defaultOpen", type: "boolean", defaultValue: "false", description: "Controlled or initial open state." },
  { name: "highlightedValue / defaultHighlightedValue", type: "string", defaultValue: "—", description: "Controlled or initial highlighted item." },
  { name: "closeOnSelect", type: "boolean", defaultValue: "true", description: "Closes the menu after a normal item is selected." },
  { name: "dir", type: '"ltr" | "rtl"', defaultValue: "inherited", description: "Reading direction for placement and keyboard behavior." },
  { name: "positioning", type: "PositioningOptions", defaultValue: "fixed cursor anchor", description: "Collision and viewport positioning options." },
] as const;

export const parts = [
  { name: "Root / RootProvider", element: "none", description: "Owns open, highlight, selection, and positioning state." },
  { name: "Trigger", element: "button", description: "Opens at the pointer, or near the target with Shift+F10 or the Context Menu key." },
  { name: "Content", element: "div", description: "Portalled menu surface positioned at the interaction point." },
  { name: "Item / LinkItem", element: "div / a", description: "Action and navigation menu items." },
  { name: "CheckboxItem", element: "div", description: "Boolean option that stays open by default." },
  { name: "RadioGroup / RadioItem", element: "div", description: "Single-choice option group." },
  { name: "Group / Label / Separator", element: "div", description: "Menu structure and visible grouping." },
  { name: "Sub / SubTrigger / SubContent", element: "mixed", description: "Nested context actions with pointer-intent handling." },
  { name: "Shortcut", element: "span", description: "Visual keyboard hint. It does not register a shortcut." },
] as const;

export const events = [
  { name: "select", payload: "ContextMenuSelectionDetails", description: "An item was selected; details.value identifies it." },
  { name: "openChange / update:open", payload: "details / boolean", description: "The menu opened or closed." },
  { name: "highlightChange", payload: "ContextMenuHighlightChangeDetails", description: "The roving highlight changed." },
  { name: "escapeKeyDown", payload: "KeyboardEvent", description: "Escape was pressed while the menu was open." },
  { name: "interactOutside", payload: "ContextMenuInteractOutsideEvent", description: "Pointer or focus input occurred outside the menu." },
] as const;

export const exportsList = [
  { name: "ContextMenu / ContextMenuRoot", description: "Compound root and named root export." },
  { name: "ContextMenuTrigger / Content / Item / Sub*", description: "Named exports for compound parts." },
  { name: "ContextMenuProps / ContextMenu*Props", description: "Public root and part contracts." },
  { name: "CONTEXT_MENU_ITEM_VARIANTS", description: "Default and destructive item variants." },
  { name: "CONTEXT_MENU_DEFAULT_POSITIONING", description: "Fixed viewport positioning defaults for pointer-anchored menus." },
  { name: "useContextMenu / useContextMenuContext", description: "Ark UI menu hooks under Context Menu names." },
  { name: "contextMenuAnatomy", description: "Ark UI menu anatomy under the Context Menu name." },
] as const;
