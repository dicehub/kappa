---
"@dicehub/kappa": major
---

Center SidebarLayout content within the full shell by default when space permits. The opposite sidebar reservation now shrinks before the page, following the dicehub client. Set `contentMaxWidth` to the page width (default `72rem`, including padding).

SidebarLayout now measures its container for responsive navigation, so embedded layouts use a drawer when their own space is narrow. Sidebar.Provider adds `mobileBreakpointReference="container"` while retaining its viewport default.

To keep the previous SidebarLayout defaults, set `contentAlignment="available"` and `mobileBreakpointReference="viewport"`. Available alignment continues to fill the area beside navigation and ignores `contentMaxWidth`.
