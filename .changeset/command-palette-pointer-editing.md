---
"@dicehub/kappa": patch
---

Fix mouse and touch activation of command palette results with Ark UI Vue's value-change event. Restore the Ark UI results container and preserve the native input selection while filtering so caret edits and mouse-selected text replacements keep their position. Keep commands disabled by the root predicate visibly and accessibly unavailable, including pointer activation. Prevent duplicate keyboard activation when the palette stays open.
