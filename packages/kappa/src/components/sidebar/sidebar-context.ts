import { inject, type ComputedRef, type InjectionKey, type UnwrapRef } from "vue";
import type { SidebarCollapsibleMode, SidebarSide, SidebarState } from "./sidebar";

export interface SidebarContext {
  open: ComputedRef<boolean>;
  mobileOpen: ComputedRef<boolean>;
  isMobile: ComputedRef<boolean>;
  state: ComputedRef<SidebarState>;
  iconCollapsed: ComputedRef<boolean>;
  peekable: ComputedRef<boolean>;
  isPeeking: ComputedRef<boolean>;
  resizable: ComputedRef<boolean>;
  isResizing: ComputedRef<boolean>;
  width: ComputedRef<number>;
  collapsible: ComputedRef<SidebarCollapsibleMode>;
  side: ComputedRef<SidebarSide>;
  compact: ComputedRef<boolean>;
  navId: ComputedRef<string>;
  contentId: ComputedRef<string>;
  dimensions: ComputedRef<Record<string, string>>;
  setOpen: (open: boolean) => void;
  setMobileOpen: (open: boolean) => void;
  toggle: () => void;
  rememberTrigger: (id: string) => void;
  focusTrigger: () => void;
  setPeekInteraction: (active: boolean) => void;
  setWidth: (width: number) => void;
}

export type SidebarContextValue = UnwrapRef<SidebarContext>;
export const sidebarContextKey: InjectionKey<SidebarContext> = Symbol("KappaSidebar");

export function useSidebarContext(): SidebarContext {
  const context = inject(sidebarContextKey);
  if (!context) throw new Error("[Kappa Sidebar] Parts must be inside Sidebar.Provider.");
  return context;
}
