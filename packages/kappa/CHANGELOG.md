# @dicehub/kappa

## 0.6.0

### Minor Changes

- e96ccca: Add a language selector to CodeHighlighted with `languageOptions`, `v-model:lang`, and `labels.language`. Place language and copy controls in a compact tinted header. Keep menu labels visible on small screens and support keyboard input, reduced motion, and high contrast settings.
- c18f902: Add Navigation Menu for website and application links, with shared panels, pointer and keyboard navigation, controlled state, compact sizing, and support for vertical and right-to-left layouts.
- 92551e9: Add WorkspaceSwitcher with current workspace details, grouped actions, and a checkmark at the end of the selected row. Supports controlled selection, custom triggers, keyboard navigation, and menus inside mobile drawers.
- ab18abb: Add SettingsLayout and SettingsSection for account pages with navigation, current values, and expandable forms.

  Keep focus on the section when closing hides its focused control, including when the toggle is disabled or re-enabled during the same update.

- ecb467f: Add `contentAlignment="shell"` to SidebarLayout for pages centered within the complete application shell. The alignment follows sidebar resizing, collapse, logical placement, and mobile drawer state. The default continues to use the available space beside navigation.
- c912a54: Add hover reveal for offcanvas sidebars. Hover over a marked trigger to open a temporary panel without moving the page. Click to pin it open. Support keyboard dismissal, nested menus, reduced motion, and logical edge placement. Keep shell-centered content aligned during pinning and collapse. Keep the panel available while a popup returns focus to its trigger.

  Add an `ids` option to Command Palette Dialog so application controls can reference its content before it opens.

- c912a54: Add `collapseOnResize` to Sidebar and Sidebar Layout. Set it to false to keep the sidebar open when dragging reaches its minimum width. The separator is hidden while collapsed. Header controls can still hide and reopen it. Existing resize behavior remains the default.

  Make the separator easier to grab from the content side. The visible line stays on the sidebar border.

### Patch Changes

- ab18abb: Hide closed combobox popups and prevent their positioners from blocking nearby controls.
- e96ccca: Improve CodeHighlighted readability with a complete monospace font list, 14px code text, 20px line spacing, and 12px vertical padding.
- e96ccca: Align the copy icons in CodeHighlighted, ClipboardText, and InlineCopyText. Use rounded squares with the front square at the bottom left.
- 9e96cc8: Fix Command Palette focus return during closing animations.

  Keep closed Command Palette dialogs hidden when their content stays mounted.

  Add top-aligned and morphing search examples with rounded fields, mobile layouts, and reduced motion support.

  Add `/` search to the Minimal Workspace and Icon Rail examples. Keep the rail search field centered when the sidebar changes width.

  Open the Icon Rail profile menu above its trigger in both collapsed and expanded layouts.

  Match the documentation version menu width to its trigger. Show the selected version with a checkmark at the end of the row.

  Open the Inset Navigation workspace menu below its trigger and the profile menu above its trigger.

  Open the Workspace Pages switcher below its trigger.

- ab18abb: Use a lighter neutral button hover fill in the light theme, with a dedicated control hover token. Keep the dark theme fill and the visible pressed state on expanded buttons.

  Add a neutral hover border that stays visible on control and canvas surfaces. Keep this border on open popup triggers without changing disclosure buttons.

- c912a54: Keep closed dropdown menus and submenus inert. Queued focus actions can no longer move focus away from the trigger into closing content after selection.
- c912a54: Keep text selections during Number Input value updates, including `useNumberInput` with `RootProvider`.

## 0.5.0

### Minor Changes

- b82bfa3: Add InlineCopyText for copying short values from text and table rows. Supports custom display text, hover and focus icons, localized feedback, truncation, and disabled controls.

## 0.4.2

### Patch Changes

- Fix TypeScript declaration errors when checking Kappa imports with `skipLibCheck: false`. Keep the existing Ark UI runtime and public component API. Optional chart, map, plot, and syntax highlighting packages remain separate imports.

## 0.4.1

### Patch Changes

- 52a7f97: Clarify installation, Vue and Node.js requirements, and the Ark UI TypeScript workaround.
- 52a7f97: License Kappa source code and documentation text under MIT. Include the license and Kumo, Ark UI, and Phosphor notices in the package archive.

## 0.4.0

### Minor Changes

- Initial Kappa code snapshot with Vue 3 components and application blocks, Ark UI primitives, light and dark themes, and TypeScript declarations.
- Code and documentation text use MIT. Adapted source and fonts keep their licenses; artwork is excluded from the MIT grant.
- TypeScript projects require `skipLibCheck: true` with Ark UI 5.39.2 because of upstream declaration errors.
