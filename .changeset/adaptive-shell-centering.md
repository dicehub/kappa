---
"@dicehub/kappa": major
---

Center SidebarLayout content within the full shell by default when space permits. The opposite sidebar reservation now shrinks before the page, following the dicehub client. Set `contentMaxWidth` to the page width (default `72rem`, including padding).

SidebarLayout and Sidebar.Provider retain viewport-based responsive navigation. Desktop gallery previews keep their navigation visible. Set `mobileBreakpointReference="container"` explicitly when a layout needs to follow its own width.

To keep the previous SidebarLayout alignment, set `contentAlignment="available"`. Available alignment continues to fill the area beside navigation and ignores `contentMaxWidth`.
