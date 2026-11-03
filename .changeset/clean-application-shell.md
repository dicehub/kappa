---
"@dicehub/kappa": minor
---

Add AppShell blocks with compact and paneled layouts, responsive detail and side panels, and styled page and search parts. Include the paneled bloom artwork and a small semantic panel shadow. Existing SidebarLayout applications remain supported.

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
