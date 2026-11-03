---
"@dicehub/kappa": minor
---

Expose ToolbarButton from the Button module with standalone ghost and outline appearances, 24px and 32px sizes, theme-aware hover and pressed states, and keyboard focus feedback. Keep the existing Toolbar.Button grouped styling, inherited density, disabled state, and keyboard navigation.

Add standalone toolbar button color tokens. Existing shell button tokens remain available as aliases. The paneled workspace now uses ToolbarButton without local button style overrides.

Add a tooltip option with a 500 ms hover delay and automatic suppression while its menu is open. Add opt-in showArrow to Dropdown.Content and Dropdown.SubContent so consumers can show a menu pointer without custom scroll wrappers or styles.

Keep toolbar icons at 16px in both sizes, independent of stylesheet order.
