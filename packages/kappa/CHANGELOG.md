# @dicehub/kappa

## 1.0.0

### Major Changes

- 13d5783: Center SidebarLayout content within the full shell by default when space permits. The opposite sidebar reservation now shrinks before the page, following the dicehub client. Set `contentMaxWidth` to the page width (default `72rem`, including padding).

  SidebarLayout and Sidebar.Provider retain viewport-based responsive navigation. Desktop gallery previews keep their navigation visible. Set `mobileBreakpointReference="container"` explicitly when a layout needs to follow its own width.

  To keep the previous SidebarLayout alignment, set `contentAlignment="available"`. Available alignment continues to fill the area beside navigation and ignores `contentMaxWidth`.

### Minor Changes

- 1365f13: Add an optional `avatarShape` to workspace switcher items. Set it to `circle` for a personal identity, including its image or initials in the trigger, menu header, and menu option. Existing items retain square badges with rounded corners.
- 6b5c53c: Add AppShell blocks with compact and paneled layouts, responsive detail and side panels, and styled page and search parts. Include the paneled bloom artwork and a small semantic panel shadow. Existing SidebarLayout applications remain supported.

  Align paneled navigation and footer insets, keep the project row in the scrolling navigation, and use the 992px tools-rail breakpoint with responsive panel gutters.

  Keep the tools rail in the AppShell.Root rail slot, independent of the panel container, with a configurable accessible label. Support adding and removing conditional content slots after the shell mounts.

  Keep the panel frame's outer shadow visible without clipping it at the content wrapper.

  Style paneled project rows with a square project image or first-letter avatar and a bold project name. The project row opens its overview directly.

  Place selected navigation indicators at the sidebar edge, with 4px vertical insets, and keep them visible inside expanded categories.

  Add a 24px corner brand glyph with separate dice-face hover colours, keyboard focus feedback, and reduced-motion support. Use continuous face hover areas to prevent flicker over letter cutouts and gaps, with a 250ms colour change and 800ms return. Preserve the original logo paths and default logo appearance outside shell brand links.

  Use 14px search text and theme-aware search borders with stronger hover contrast, plus a 12px shortcut hint.

  Use consistent 14px paneled navigation text, 600-weight selection, and semantic light/dark hover and pressed colors. Support selected category triggers through data-active-descendant, without marking the category as the current page, and retain trigger emphasis with data-flyout-open.

  Animate paneled submenu height over 200ms on expansion and collapse, including the row gap so following categories move continuously. Keep Ark UI in control of visibility and remove the motion when reduced motion is requested.

  Complete submenu closure if the reduced-motion preference changes during collapse.

  Add semantic surface and shadow-color tokens for compact paneled navigation flyouts, with a white light-mode surface and a raised dark-mode surface.

  Add toolbar-start and toolbar-trigger slots to keep the brand before the mobile navigation toggle in DOM and keyboard order. Align paneled mobile header insets, use a menu icon, and keep 12px inner page padding. Give the mobile drawer a semantic overlay and 200ms entrance and exit motion with reduced-motion support.

  Limit the paneled mobile drawer to 320px while retaining its 80vw width on smaller phones.

  Add light and dark semantic colors for shell account controls, avatar edges, and account menu text and dividers.

  Add light and dark toolbar action colors, filled-button surface and border states, and a toolbar divider token.

  Give ghost ToolbarButton controls in the tools rail transparent, borderless defaults, neutral hover and open-panel states, separate pressed colors, and inset keyboard focus. Show a responsive edge marker while aria-expanded is true, using light and dark rail tokens.

- 9736cf9: Align sidebar resizing with AppShell side panels. Add double-click reset to defaultWidth, use 24px arrow-key steps, and remove width easing while the separator has focus. Use a quiet 4px hover and drag indicator while retaining the larger pointer target and visible keyboard focus.

  Keep the indicator centered on the resting border in start, end, and RTL layouts.

- 6b5c53c: Add a thin, keyboard-accessible separator to docked AppShell side panels. Dragging changes width without animation; the chosen pixel width survives close, maximize, and mobile layout changes. Double-click resets the responsive width. Add asideWidth and asideResizeLabel for controlled sizing and accessible labels.
- 09be2ce: Use the official horizontal dicehub artwork with its outlined Nunito Bold wordmark. Add the vertical logo variant and matching SVG exports. The default logo ink switches from #333333 in light mode to white in dark mode; explicit black and white variants stay fixed. PoweredByDicehub keeps its text layout and uses bundled Nunito ExtraBold for a heavier dicehub name.
- b141095: Expose ToolbarButton from the Button module with standalone ghost and outline appearances, 24px and 32px sizes, theme-aware hover and pressed states, and keyboard focus feedback. Keep the existing Toolbar.Button grouped styling, inherited density, disabled state, and keyboard navigation.

  Add standalone toolbar button color tokens. Existing shell button tokens remain available as aliases. The paneled workspace now uses ToolbarButton without local button style overrides.

  Add a tooltip option with a 500 ms hover delay and automatic suppression while its menu is open. Add opt-in showArrow to Dropdown.Content and Dropdown.SubContent so consumers can show a menu pointer without custom scroll wrappers or styles.

  Keep toolbar icons at 16px in both sizes and ghost hover borders transparent, independent of stylesheet order.

- b141095: Add tooltipPlacement to ToolbarButton so edge toolbars can place tooltips toward the content. Use fixed positioning to keep tooltips aligned with their controls.

### Patch Changes

- b141095: Keep Combobox and Autocomplete selection checks at the logical end of each option, including options with leading content. Reserve indicator space in unselected rows so labels stay aligned.
- bcf6fb5: Fix mouse and touch activation of command palette results with Ark UI Vue's value-change event. Restore the Ark UI results container and preserve the native input selection while filtering so caret edits and mouse-selected text replacements keep their position. Keep commands disabled by the root predicate visibly and accessibly unavailable, including pointer activation. Prevent duplicate keyboard activation when the palette stays open.
- b141095: Align Dropdown menus and nested menus with the compact create-menu surface.
  Add light and dark tokens for item states, group labels, dividers, and focus.
  Keep dropdown trigger arrows fixed when menus open and close.
  Use one three-layer drop shadow around the menu and pointer instead of separate box shadows, matching the reference edge and preserving inline submenu positioning.
- 6b5c53c: Remove the inner divider when a maximized AppShell side panel fills the frame, fixing the extra 1px line along its edge. Keep the divider in docked and wide-screen split layouts.
- 6b5c53c: Add a small bottom shadow to overflowing paneled navigation. The shadow clears at the end of the list and remains hidden when no scrolling is needed. Light and dark themes use the shared `--kappa-shell-nav-scroll-shadow` token.
- ecb6ddf: Prevent closed HoverCard positioners from intercepting pointer movement and clicks over other menus or page content.
- ecb6ddf: Use the strong text token for Popover titles so they remain readable in dark mode.
- 6b5c53c: Increase AppShell body and Page text from 13px to 14px, with a 1.5 base line height.
- 10335bb: Align the Resource List layout title with the content edge when the header has no icon. The empty icon column and its gap no longer indent the title and description.
- 6b5c53c: Render AppShell search shortcuts such as "Ctrl + K" with separate Kbd elements and a plus separator. Use subtle, regular-weight text without keycap borders, backgrounds, or shadows. Keep the shortcut visible as the search label truncates.
- c397235: Use slash separators and consistent breadcrumb spacing, with 12px small text and 14px base text. Underline links on hover, show an outline on press and keyboard focus, and emphasize links marked aria-current="page". Keep Page and Current available for noninteractive current locations.
- 6b5c53c: Keep paneled AppShell sidebar resizing in sync with the pointer. Show its resize edge on hover, keyboard focus, and drag, matching the compact shell.
- 6b5c53c: Keep the AppShell side panel anchored to the outer edge during maximize and restore. Let the primary panel shrink with the animated side panel width so its controls no longer jump sideways.
- 6b5c53c: Reduce AppShell.SearchTrigger corner radius from 12px to 10px.
- b141095: Show selected dropdown radio and checkbox options with a trailing check mark.
  Keep space for the indicator in unselected rows and preserve Ark UI selection semantics.
  Apply the shared default to ContextMenu, MenuBar, sorting, column visibility, and workspace menus; remove duplicate checks and positioning overrides from workspace and sidebar examples.
- be35da5: Add a separator between workspace choices and workspace actions, such as Create Group.

## 0.7.0

### Minor Changes

- 78886fd: Add CodeBlock as the preferred code display API at `@dicehub/kappa/components/code-block`. Existing CodeHighlighted imports remain supported. Add line wrapping, title and header actions slots, and keyboard access to scrollable code. Keep line numbers aligned when lines wrap. Add optional collapsed previews with accessible expand and collapse controls; copying always includes the full source. Display plain code and logs without ShikiProvider or highlighting dependencies; the default language is text.

### Patch Changes

- 015e802: Align segmented tab borders with equal inner spacing and nested corner curves. Keep the selected border visible in dark themes and when shadows are disabled.
- 9823695: Show login and signup content immediately by removing the LoginLayout frame entrance fade and slide.

## 0.6.2

### Patch Changes

- Move "Forgot password?" beside the Password label in the sign-in documentation examples. No component API or runtime changes.

## 0.6.1

### Patch Changes

- Keep Banner action text readable on hover in both themes.
- 1c3595b: Restore the native checked and mixed states when an application rejects a checkbox update. Keep accessible state and submitted form values aligned with controlled roots, providers, and groups.
- 1c3595b: Return `null` for unsupported code languages such as `__proto__` and `constructor`.
- 1c3595b: Keep Dialog and DialogLayout parts independent when both are imported. Preserve Dialog's header and custom close slot.
- 1c3595b: Restore progressAnatomy, useProgress, and useProgressContext imports from the package root.
- 1c3595b: Return undefined for unknown registry names, including inherited object keys.

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
